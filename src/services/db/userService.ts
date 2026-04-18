import { db } from './index'
import type { Child } from '../../types'

export const userService = {
  // 获取所有孩子
  getAll: async () => {
    if (!db) return []
    const result = await db.getAllAsync<Child>('SELECT * FROM children ORDER BY created_at ASC')
    return result
  },

  // 根据ID获取孩子
  getById: async (id: number) => {
    if (!db) return null
    const result = await db.getFirstAsync<Child>('SELECT * FROM children WHERE id = ?', [id])
    return result
  },

  // 创建孩子
  create: async (child: Omit<Child, 'id' | 'created_at'>) => {
    if (!db) return 0
    const result = await db.runAsync(
      'INSERT INTO children (name, avatar, theme_color) VALUES (?, ?, ?)',
      [child.name, child.avatar || null, child.theme_color]
    )
    return result.lastInsertRowId
  },

  // 更新孩子信息
  update: async (id: number, data: Partial<Omit<Child, 'id' | 'created_at'>>) => {
    if (!db) return

    const setClauses = []
    const values = []

    if (data.name !== undefined) {
      setClauses.push('name = ?')
      values.push(data.name)
    }
    if (data.avatar !== undefined) {
      setClauses.push('avatar = ?')
      values.push(data.avatar)
    }
    if (data.theme_color !== undefined) {
      setClauses.push('theme_color = ?')
      values.push(data.theme_color)
    }

    if (setClauses.length === 0) return

    values.push(id)
    const query = `UPDATE children SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    await db.runAsync(query, values)
  },

  // 删除孩子
  delete: async (id: number) => {
    if (!db) return
    await db.runAsync('DELETE FROM children WHERE id = ?', [id])
  }
}

export default userService
