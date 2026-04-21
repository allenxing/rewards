import { db } from './index'
import type { Task, TaskSubmission } from '../../types'

export const taskService = {
  // 获取所有任务（不分状态）
  getAll: async (childId?: number) => {
    if (!db) return []
    let query = 'SELECT * FROM tasks'
    const params: any[] = []

    if (childId) {
      query += ' WHERE (child_id = 0 OR child_id = ?)'
      params.push(childId)
    }

    const result = await db.getAllAsync<Task>(query, params)
    return result
  },

  // 获取所有激活的任务
  getActiveTasks: async (childId?: number) => {
    if (!db) return []
    let query = 'SELECT * FROM tasks WHERE is_active = 1'
    const params: any[] = []

    if (childId) {
      query += ' AND (child_id = 0 OR child_id = ?)'
      params.push(childId)
    }

    const result = await db.getAllAsync<Task>(query, params)
    return result
  },

  // 根据ID获取任务
  getById: async (id: number) => {
    if (!db) return null
    const result = await db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', [id])
    return result
  },

  // 创建任务
  create: async (task: Omit<Task, 'id' | 'created_at'>) => {
    if (!db) return 0
    const result = await db.runAsync(
      `INSERT INTO tasks (name, icon, point, type, category, age_group, require_photo, auto_approve, is_active, child_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.name,
        task.icon,
        task.point,
        task.type,
        task.category,
        task.age_group || null,
        task.require_photo ? 1 : 0,
        task.auto_approve ? 1 : 0,
        task.is_active ? 1 : 0,
        task.child_id
      ]
    )
    return result.lastInsertRowId
  },

  // 更新任务
  update: async (id: number, data: Partial<Omit<Task, 'id' | 'created_at'>>) => {
    if (!db) return

    const setClauses = []
    const values = []

    const fields = ['name', 'icon', 'point', 'type', 'category', 'age_group', 'require_photo', 'auto_approve', 'is_active', 'child_id'] as const
    for (const field of fields) {
      if (data[field] !== undefined) {
        setClauses.push(`${field} = ?`)
        values.push(typeof data[field] === 'boolean' ? (data[field] ? 1 : 0) : data[field])
      }
    }

    if (setClauses.length === 0) return

    values.push(id)
    const query = `UPDATE tasks SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    await db.runAsync(query, values)
  },

  // 删除任务
  delete: async (id: number) => {
    if (!db) return
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id])
  },

  // 提交任务
  submitTask: async (taskId: number, childId: number, photo?: string) => {
    if (!db) return 0
    const result = await db.runAsync(
      'INSERT INTO task_submissions (task_id, child_id, photo) VALUES (?, ?, ?)',
      [taskId, childId, photo || null]
    )
    return result.lastInsertRowId
  },

  // 获取待审核任务
  getPendingSubmissions: async (childId?: number) => {
    if (!db) return []
    let query = `
      SELECT ts.*, t.name as task_name, t.point, t.icon
      FROM task_submissions ts
      JOIN tasks t ON ts.task_id = t.id
      WHERE ts.status = 'pending'
    `
    const params: any[] = []

    if (childId) {
      query += ' AND ts.child_id = ?'
      params.push(childId)
    }

    query += ' ORDER BY ts.submit_time DESC'
    const result = await db.getAllAsync<TaskSubmission & { task_name: string; point: number; icon: string }>(query, params)
    return result
  },

  // 审核任务
  reviewSubmission: async (submissionId: number, status: 'approved' | 'rejected', reviewNote?: string) => {
    if (!db) return
    await db.runAsync(
      'UPDATE task_submissions SET status = ?, review_time = CURRENT_TIMESTAMP, review_note = ? WHERE id = ?',
      [status, reviewNote || null, submissionId]
    )
  },

  // 获取孩子的任务提交记录
  getSubmissionsByChildId: async (childId: number, limit = 20) => {
    if (!db) return []
    const result = await db.getAllAsync<TaskSubmission & { task_name: string; point: number }>(
      `SELECT ts.*, t.name as task_name, t.point
       FROM task_submissions ts
       JOIN tasks t ON ts.task_id = t.id
       WHERE ts.child_id = ?
       ORDER BY ts.submit_time DESC
       LIMIT ?`,
      [childId, limit]
    )
    return result
  }
}

export default taskService
