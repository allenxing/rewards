import { db } from './index'
import type { Badge, UserBadge } from '../../types'

export const badgeService = {
  // 获取所有勋章
  getAllBadges: async () => {
    if (!db) return []
    const result = await db.getAllAsync<Badge>('SELECT * FROM badges ORDER BY id ASC')
    return result
  },

  // 获取单个勋章
  getBadgeById: async (id: number) => {
    if (!db) return null
    const result = await db.getFirstAsync<Badge>('SELECT * FROM badges WHERE id = ?', [id])
    return result
  },

  // 创建自定义勋章
  createBadge: async (badge: Omit<Badge, 'id' | 'created_at'>) => {
    if (!db) return 0
    const result = await db.runAsync(
      `INSERT INTO badges (name, icon, description, condition_type, condition_value, is_custom)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [badge.name, badge.icon, badge.description, badge.condition_type, badge.condition_value]
    )
    return result.lastInsertRowId
  },

  // 更新勋章
  updateBadge: async (id: number, data: Partial<Omit<Badge, 'id' | 'created_at'>>) => {
    if (!db) return

    const setClauses = []
    const values = []

    const fields = ['name', 'icon', 'description', 'condition_type', 'condition_value'] as const
    for (const field of fields) {
      if (data[field] !== undefined) {
        setClauses.push(`${field} = ?`)
        values.push(data[field])
      }
    }

    if (setClauses.length === 0) return

    values.push(id)
    const query = `UPDATE badges SET ${setClauses.join(', ')} WHERE id = ?`
    await db.runAsync(query, values)
  },

  // 删除勋章（仅自定义勋章）
  deleteBadge: async (id: number) => {
    if (!db) return
    await db.runAsync('DELETE FROM badges WHERE id = ? AND is_custom = 1', [id])
  },

  // 获取孩子的勋章
  getUserBadges: async (childId: number) => {
    if (!db) return []
    const result = await db.getAllAsync<UserBadge & { name: string; icon: string; description: string }>(
      `SELECT ub.*, b.name, b.icon, b.description
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.child_id = ?
       ORDER BY ub.obtained_at DESC`,
      [childId]
    )
    return result
  },

  // 颁发勋章给孩子
  awardBadge: async (childId: number, badgeId: number) => {
    if (!db) return false

    try {
      await db.runAsync(
        `INSERT OR IGNORE INTO user_badges (child_id, badge_id) VALUES (?, ?)`,
        [childId, badgeId]
      )
      return true
    } catch (error) {
      console.error('颁发勋章失败:', error)
      return false
    }
  },

  // 检查并颁发勋章
  checkAndAwardBadges: async (childId: number) => {
    if (!db) return []

    const awardedBadges: Badge[] = []

    // 获取所有勋章
    const badges = await badgeService.getAllBadges()
    
    // 获取孩子已拥有的勋章ID
    const userBadges = await db.getAllAsync<{ badge_id: number }>(
      'SELECT badge_id FROM user_badges WHERE child_id = ?',
      [childId]
    )
    const ownedBadgeIds = new Set(userBadges.map(ub => ub.badge_id))

    // 获取孩子总积分
    const totalPoints = await db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(change), 0) as total FROM points_log WHERE child_id = ? AND change > 0',
      [childId]
    )

    // 获取完成任务数
    const taskCount = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM task_submissions WHERE child_id = ? AND status = 'approved'`,
      [childId]
    )

    for (const badge of badges) {
      if (ownedBadgeIds.has(badge.id)) continue

      let shouldAward = false

      switch (badge.condition_type) {
        case 'point_count':
          shouldAward = (totalPoints?.total || 0) >= badge.condition_value
          break
        case 'task_count':
          shouldAward = (taskCount?.count || 0) >= badge.condition_value
          break
        case 'continuous':
          // TODO: 连续任务检查需要额外逻辑
          break
        case 'behavior':
          // TODO: 行为检查需要额外逻辑
          break
      }

      if (shouldAward) {
        await badgeService.awardBadge(childId, badge.id)
        awardedBadges.push(badge)
      }
    }

    return awardedBadges
  },

  // 获取未解锁的勋章及解锁条件
  getUnlockedBadges: async (childId: number) => {
    if (!db) return []
    
    const result = await db.getAllAsync<Badge & { obtained: boolean }>(
      `SELECT b.*, 
        CASE WHEN ub.id IS NOT NULL THEN 1 ELSE 0 END as obtained
       FROM badges b
       LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.child_id = ?
       ORDER BY b.id ASC`,
      [childId]
    )
    return result
  }
}

export default badgeService
