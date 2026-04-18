import { db } from './index'
import type { PointsLog } from '../../types'

export const pointService = {
  // 获取孩子的总积分
  getTotalPoints: async (childId: number) => {
    if (!db) return 0
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(change), 0) as total FROM points_log WHERE child_id = ?',
      [childId]
    )
    return result?.total || 0
  },

  // 增加积分
  addPoints: async (childId: number, points: number, reason: string, type: PointsLog['type'] = 'reward', relationId?: number) => {
    if (!db || points <= 0) return false

    try {
      await db.runAsync(
        `INSERT INTO points_log (child_id, change, reason, type, relation_id)
         VALUES (?, ?, ?, ?, ?)`,
        [childId, points, reason, type, relationId || null]
      )
      return true
    } catch (error) {
      console.error('增加积分失败:', error)
      return false
    }
  },

  // 扣除积分（最低到0分）
  deductPoints: async (childId: number, points: number, reason: string, type: PointsLog['type'] = 'punish', relationId?: number) => {
    if (!db || points <= 0) return false

    try {
      // 先获取当前积分，确保不会扣到负数
      const currentPoints = await pointService.getTotalPoints(childId)
      const actualDeduct = Math.min(points, currentPoints)

      if (actualDeduct <= 0) return false

      await db.runAsync(
        `INSERT INTO points_log (child_id, change, reason, type, relation_id)
         VALUES (?, ?, ?, ?, ?)`,
        [childId, -actualDeduct, reason, type, relationId || null]
      )
      return true
    } catch (error) {
      console.error('扣除积分失败:', error)
      return false
    }
  },

  // 获取积分流水记录
  getPointsLog: async (childId: number, limit: number = 20) => {
    if (!db) return []
    const result = await db.getAllAsync<PointsLog>(
      `SELECT * FROM points_log
       WHERE child_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [childId, limit]
    )
    return result
  }
}

export default pointService
