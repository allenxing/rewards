// @ts-nocheck
import { Platform } from 'react-native'
import * as SQLite from 'expo-sqlite'

const isWeb = Platform.OS === 'web'

export let db: any = null

if (!isWeb) {
  db = SQLite.openDatabaseSync('family_rewards.db')
}

export const initDB = async () => {
  if (isWeb) {
    const webDb = require('./webService')
    await webDb.initWebDB()
    return true
  }

  if (!db) return false

  try {
    await db.execAsync('PRAGMA foreign_keys = ON')

    await db.execAsync(`CREATE TABLE IF NOT EXISTS children (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, avatar TEXT, theme_color TEXT NOT NULL DEFAULT '#165DFF', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, icon TEXT NOT NULL, point INTEGER NOT NULL, type TEXT NOT NULL, category TEXT NOT NULL, age_group TEXT, require_photo INTEGER DEFAULT 0, auto_approve INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, child_id INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS task_submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER NOT NULL, child_id INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', photo TEXT, submit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, review_time TIMESTAMP, review_note TEXT, FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE, FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE)`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS points_log (id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL, change INTEGER NOT NULL, reason TEXT NOT NULL, type TEXT NOT NULL, relation_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE)`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS wishes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, image TEXT, target_point INTEGER NOT NULL, type TEXT NOT NULL, child_id INTEGER DEFAULT 0, status TEXT NOT NULL DEFAULT 'active', is_main_goal INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE)`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS badges (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, icon TEXT NOT NULL, description TEXT NOT NULL, condition_type TEXT NOT NULL, condition_value INTEGER NOT NULL, is_custom INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS user_badges (id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL, badge_id INTEGER NOT NULL, obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE, FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE, UNIQUE(child_id, badge_id))`)

    await db.execAsync(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)

    const taskCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM tasks')
    if (taskCount && taskCount.count === 0) {
      const defaultTasks = [
        {name: '整理床铺', icon: 'bed', point: 2, type: 'daily', category: 'life', age_group: '3-6'},
        {name: '刷牙洗脸', icon: 'tooth', point: 2, type: 'daily', category: 'life', age_group: '3-6'},
        {name: '按时吃饭', icon: 'food', point: 2, type: 'daily', category: 'life', age_group: '3-6'},
        {name: '自己穿衣服', icon: 'clothes', point: 3, type: 'daily', category: 'life', age_group: '3-6'},
        {name: '收拾玩具', icon: 'toy', point: 3, type: 'daily', category: 'housework', age_group: '3-6'},
        {name: '完成作业', icon: 'book', point: 5, type: 'daily', category: 'study', age_group: '7-12'},
        {name: '帮忙洗碗', icon: 'dish', point: 10, type: 'weekly', category: 'housework', age_group: '7-12'},
        {name: '锻炼身体', icon: 'sport', point: 5, type: 'daily', category: 'life', age_group: 'all'},
        {name: '主动打招呼', icon: 'hello', point: 3, type: 'one_time', category: 'character', age_group: 'all'},
      ]
      for (const task of defaultTasks) {
        await db.runAsync(`INSERT INTO tasks (name, icon, point, type, category, age_group, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`, [task.name, task.icon, task.point, task.type, task.category, task.age_group])
      }
    }

    const badgeCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM badges')
    if (badgeCount && badgeCount.count === 0) {
      const defaultBadges = [
        {name: '第一桶金', icon: 'coin', description: '第一次获得100积分', condition_type: 'point_count', condition_value: 100},
        {name: '家务小能手', icon: 'broom', description: '累计完成20次家务任务', condition_type: 'task_count', condition_value: 20},
        {name: '习惯小达人', icon: 'star', description: '连续30天完成每日任务', condition_type: 'continuous', condition_value: 30},
        {name: '愿望达成', icon: 'gift', description: '第一次兑换愿望', condition_type: 'wish_complete', condition_value: 1},
        {name: '爱心小天使', icon: 'heart', description: '累计获得5次助人为乐奖励', condition_type: 'behavior', condition_value: 5},
      ]
      for (const badge of defaultBadges) {
        await db.runAsync(`INSERT INTO badges (name, icon, description, condition_type, condition_value, is_custom) VALUES (?, ?, ?, ?, ?, 0)`, [badge.name, badge.icon, badge.description, badge.condition_type, badge.condition_value])
      }
    }

    console.log('SQLite initialized')
    return true
  } catch (error) {
    console.error('SQLite init failed:', error)
    throw error
  }
}

export const userService = isWeb ? require('./webService').childrenService : require('./userService').default
export const taskService = isWeb ? require('./webService').taskService : require('./taskService').default
export const wishService = isWeb ? require('./webService').wishService : require('./wishService').default
export const pointService = isWeb ? require('./webService').pointService : require('./pointService').default
export const badgeService = isWeb ? require('./webService').badgeService : require('./badgeService').default