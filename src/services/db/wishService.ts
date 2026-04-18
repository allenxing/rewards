import { db } from './index'
import type { Wish } from '../../types'

export const wishService = {
  // 获取孩子的愿望列表
  getWishes: async (childId?: number, status?: Wish['status']) => {
    if (!db) return []
    let query = 'SELECT * FROM wishes'
    const params: any[] = []

    if (childId || status) {
      query += ' WHERE'
      if (childId) {
        query += ' child_id = ?'
        params.push(childId)
      }
      if (childId && status) {
        query += ' AND'
      }
      if (status) {
        query += ' status = ?'
        params.push(status)
      }
    }

    query += ' ORDER BY is_main_goal DESC, created_at DESC'
    const result = await db.getAllAsync<Wish>(query, params)
    return result
  },

  // 获取单个愿望
  getById: async (id: number) => {
    if (!db) return null
    const result = await db.getFirstAsync<Wish>('SELECT * FROM wishes WHERE id = ?', [id])
    return result
  },

  // 创建愿望
  create: async (wish: Omit<Wish, 'id' | 'created_at'>) => {
    if (!db) return 0
    const result = await db.runAsync(
      `INSERT INTO wishes (name, image, target_point, type, child_id, status, is_main_goal)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        wish.name,
        wish.image || null,
        wish.target_point,
        wish.type,
        wish.child_id,
        wish.status || 'active',
        wish.is_main_goal ? 1 : 0
      ]
    )
    return result.lastInsertRowId
  },

  // 更新愿望
  update: async (id: number, data: Partial<Omit<Wish, 'id' | 'created_at'>>) => {
    const setClauses = []
    const values = []

    const fields = ['name', 'image', 'target_point', 'type', 'child_id', 'status', 'is_main_goal'] as const
    for (const field of fields) {
      if (data[field] !== undefined) {
        setClauses.push(`${field} = ?`)
        if (field === 'is_main_goal') {
          values.push(data[field] ? 1 : 0)
        } else {
          values.push(data[field])
        }
      }
    }

    if (setClauses.length === 0) return
    if (!db) return

    values.push(id)
    const query = `UPDATE wishes SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    await db.runAsync(query, values)
  },

  // 删除愿望
  delete: async (id: number) => {
    if (!db) return
    await db.runAsync('DELETE FROM wishes WHERE id = ?', [id])
  },

  // 兑换愿望（扣积分）
  exchange: async (id: number, childId: number) => {
    if (!db) return false
    
    const wish = await wishService.getById(id)
    if (!wish) return false

    if (wish.status !== 'active') return false

    const currentPoints = await db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(change), 0) as total FROM points_log WHERE child_id = ?',
      [childId]
    )

    if ((currentPoints?.total || 0) < wish.target_point) {
      return false
    }

    try {
      await db.runAsync(
        `INSERT INTO points_log (child_id, change, reason, type, relation_id)
         VALUES (?, ?, ?, 'exchange', ?)`,
        [childId, -wish.target_point, `兑换愿望: ${wish.name}`, id]
      )

      await db.runAsync(
        `UPDATE wishes SET status = 'exchanged', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      )

      return true
    } catch (error) {
      console.error('兑换愿望失败:', error)
      return false
    }
  },

  // 设置为主目标
  setMainGoal: async (id: number) => {
    if (!db) return
    await db.runAsync('UPDATE wishes SET is_main_goal = 0 WHERE is_main_goal = 1')
    await db.runAsync('UPDATE wishes SET is_main_goal = 1 WHERE id = ?', [id])
  }
}

export default wishService
