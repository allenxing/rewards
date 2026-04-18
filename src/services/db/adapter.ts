import { Platform } from 'react-native'
import * as SQLite from 'expo-sqlite'
import { initWebDB, childrenService as webChildren, taskService as webTasks, wishService as webWishes, pointService as webPoints, badgeService as webBadges } from './webService'

const isWeb = Platform.OS === 'web'

let db: any = null
let dbInitialized = false

export const getDB = () => {
  if (!isWeb && !db) {
    db = SQLite.openDatabaseSync('family_rewards.db')
  }
  return db
}

export const isWebPlatform = () => isWeb

export const initDB = async () => {
  if (isWeb) {
    await initWebDB()
    return true
  }

  const database = getDB()
  if (!database) return false

  try {
    await database.execAsync('PRAGMA foreign_keys = ON')
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS children (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        avatar TEXT,
        theme_color TEXT NOT NULL DEFAULT '#165DFF',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        point INTEGER NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        age_group TEXT,
        require_photo INTEGER DEFAULT 0,
        auto_approve INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        child_id INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS task_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        child_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        photo TEXT,
        submit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        review_time TIMESTAMP,
        review_note TEXT,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS points_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER NOT NULL,
        change INTEGER NOT NULL,
        reason TEXT NOT NULL,
        type TEXT NOT NULL,
        relation_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS wishes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT,
        target_point INTEGER NOT NULL,
        type TEXT NOT NULL,
        child_id INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        is_main_goal INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        condition_type TEXT NOT NULL,
        condition_value INTEGER NOT NULL,
        is_custom INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER NOT NULL,
        badge_id INTEGER NOT NULL,
        obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
        FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
        UNIQUE(child_id, badge_id)
      )
    `)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const taskCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM tasks')
    if (taskCount?.count === 0) {
      const defaultTasks = [
        { name: '整理床铺', icon: 'bed', point: 2, type: 'daily', category: 'life', age_group: '3-6', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '刷牙洗脸', icon: 'tooth', point: 2, type: 'daily', category: 'life', age_group: '3-6', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '按时吃饭', icon: 'food', point: 2, type: 'daily', category: 'life', age_group: '3-6', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '自己穿衣服', icon: 'clothes', point: 3, type: 'daily', category: 'life', age_group: '3-6', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '收拾玩具', icon: 'toy', point: 3, type: 'daily', category: 'housework', age_group: '3-6', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '完成作业', icon: 'book', point: 5, type: 'daily', category: 'study', age_group: '7-12', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '帮忙洗碗', icon: 'dish', point: 10, type: 'weekly', category: 'housework', age_group: '7-12', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '锻炼身体', icon: 'sport', point: 5, type: 'daily', category: 'life', age_group: 'all', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
        { name: '主动打招呼', icon: 'hello', point: 3, type: 'one_time', category: 'character', age_group: 'all', require_photo: 0, auto_approve: 0, is_active: 1, child_id: 0 },
      ]
      for (const task of defaultTasks) {
        await database.runAsync(
          `INSERT INTO tasks (name, icon, point, type, category, age_group, require_photo, auto_approve, is_active, child_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [task.name, task.icon, task.point, task.type, task.category, task.age_group, task.require_photo, task.auto_approve, task.is_active, task.child_id]
        )
      }
    }

    const badgeCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM badges')
    if (badgeCount?.count === 0) {
      const defaultBadges = [
        { name: '第一桶金', icon: 'coin', description: '第一次获得100积分', condition_type: 'point_count', condition_value: 100, is_custom: 0 },
        { name: '家务小能手', icon: 'broom', description: '累计完成20次家务任务', condition_type: 'task_count', condition_value: 20, is_custom: 0 },
        { name: '习惯小达人', icon: 'star', description: '连续30天完成每日任务', condition_type: 'continuous', condition_value: 30, is_custom: 0 },
        { name: '愿望达成', icon: 'gift', description: '第一次兑换愿望', condition_type: 'wish_complete', condition_value: 1, is_custom: 0 },
        { name: '爱心小天使', icon: 'heart', description: '累计获得5次助人为乐奖励', condition_type: 'behavior', condition_value: 5, is_custom: 0 },
      ]
      for (const badge of defaultBadges) {
        await database.runAsync(
          `INSERT INTO badges (name, icon, description, condition_type, condition_value, is_custom) VALUES (?, ?, ?, ?, ?, ?)`,
          [badge.name, badge.icon, badge.description, badge.condition_type, badge.condition_value, badge.is_custom]
        )
      }
    }

    dbInitialized = true
    console.log('SQLite database initialized')
    return true
  } catch (error) {
    console.error('Database init failed:', error)
    throw error
  }
}

const userService = isWeb ? webChildren : require('./userService').default
const taskService = isWeb ? webTasks : require('./taskService').default
const wishService = isWeb ? webWishes : require('./wishService').default
const pointService = isWeb ? webPoints : require('./pointService').default
const badgeService = isWeb ? webBadges : require('./badgeService').default

export { userService, taskService, wishService, pointService, badgeService }