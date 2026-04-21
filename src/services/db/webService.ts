import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import type { Child , Task , Wish } from '../../types'

const isWeb = Platform.OS === 'web'

const KEYS = {
  children: 'fr_children',
  tasks: 'fr_tasks',
  wishes: 'fr_wishes',
  badges: 'fr_badges',
  points_log: 'fr_points_log',
  user_badges: 'fr_user_badges',
  settings: 'fr_settings',
}

let autoIncrement = {
  children: 1,
  tasks: 1,
  wishes: 1,
  badges: 1,
  points_log: 1,
  user_badges: 1,
}

async function loadCounter(key: string): Promise<number> {
  const counter = await AsyncStorage.getItem('fr_' + key + '_id_counter')
  return counter ? parseInt(counter) : 1
}

async function saveCounter(key: string, value: number): Promise<void> {
  await AsyncStorage.setItem('fr_' + key + '_id_counter', String(value))
}

async function getAllData<T>(key: string): Promise<T[]> {
  const data = await AsyncStorage.getItem(KEYS[key])
  return data ? JSON.parse(data) : []
}

async function saveData<T>(key: string, data: T[]): Promise<void> {
  await AsyncStorage.setItem(KEYS[key], JSON.stringify(data))
}

export const initWebDB = async () => {
  if (!isWeb) return
  
  console.log('Initializing web database...')
  
  autoIncrement.children = await loadCounter('children')
  autoIncrement.tasks = await loadCounter('tasks')
  autoIncrement.wishes = await loadCounter('wishes')
  autoIncrement.badges = await loadCounter('badges')
  autoIncrement.points_log = await loadCounter('points_log')
  autoIncrement.user_badges = await loadCounter('user_badges')

  const tasks = await getAllData<any>('tasks')
  if (tasks.length === 0) {
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
    defaultTasks.forEach((t, i) => {
      t.id = i + 1
      t.created_at = new Date().toISOString()
      t.updated_at = new Date().toISOString()
    })
    await saveData('tasks', defaultTasks)
  }

  const badges = await getAllData<any>('badges')
  if (badges.length === 0) {
    const defaultBadges = [
      { id: 1, name: '第一桶金', icon: 'coin', description: '第一次获得100积分', condition_type: 'point_count', condition_value: 100, is_custom: 0 },
      { id: 2, name: '家务小能手', icon: 'broom', description: '累计完成20次家务任务', condition_type: 'task_count', condition_value: 20, is_custom: 0 },
      { id: 3, name: '习惯小达人', icon: 'star', description: '连续30天完成每日任务', condition_type: 'continuous', condition_value: 30, is_custom: 0 },
      { id: 4, name: '愿望达成', icon: 'gift', description: '第一次兑换愿望', condition_type: 'wish_complete', condition_value: 1, is_custom: 0 },
      { id: 5, name: '爱心小天使', icon: 'heart', description: '累计获得5次助人为乐奖励', condition_type: 'behavior', condition_value: 5, is_custom: 0 },
    ]
    defaultBadges.forEach(b => {
      b.created_at = new Date().toISOString()
    })
    await saveData('badges', defaultBadges)
  }

  console.log('Web database initialized')
}

export const childrenService = {
  getAll: async (): Promise<Child[]> => {
    return getAllData<Child>('children')
  },

  getById: async (id: number): Promise<Child | null> => {
    const list = await getAllData<Child>('children')
    return list.find(c => c.id === id) || null
  },

  create: async (child: Omit<Child, 'id' | 'created_at'>): Promise<number> => {
    const list = await getAllData<Child>('children')
    const id = autoIncrement.children++
    await saveCounter('children', autoIncrement.children)
    const newChild = {
      ...child,
      id,
      created_at: new Date().toISOString(),
    }
    list.push(newChild as Child)
    await saveData('children', list)
    return id
  },

  update: async (id: number, data: Partial<Child>): Promise<void> => {
    const list = await getAllData<Child>('children')
    const index = list.findIndex(c => c.id === id)
    if (index >= 0) {
      list[index] = { ...list[index], ...data }
      await saveData('children', list)
    }
  },

  delete: async (id: number): Promise<void> => {
    const list = await getAllData<Child>('children')
    const filtered = list.filter(c => c.id !== id)
    await saveData('children', filtered)
  },
}

export const taskService = {
  getAll: async (childId?: number): Promise<Task[]> => {
    const list = await getAllData<any>('tasks')
    if (childId) {
      return list.filter((t: any) => t.child_id === 0 || t.child_id === childId)
    }
    return list
  },

  getActiveTasks: async (childId?: number): Promise<Task[]> => {
    const list = await getAllData<any>('tasks')
    let filtered = list.filter((t: any) => t.is_active === 1)
    if (childId) {
      filtered = filtered.filter((t: any) => t.child_id === 0 || t.child_id === childId)
    }
    return filtered
  },

  getById: async (id: number): Promise<Task | null> => {
    const list = await getAllData<any>('tasks')
    return list.find(t => t.id === id) || null
  },

  create: async (task: Omit<Task, 'id' | 'created_at'>): Promise<number> => {
    const list = await getAllData<any>('tasks')
    const id = autoIncrement.tasks++
    await saveCounter('tasks', autoIncrement.tasks)
    const newTask = {
      ...task,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    list.push(newTask)
    await saveData('tasks', list)
    return id
  },

  update: async (id: number, data: Partial<Task>): Promise<void> => {
    const list = await getAllData<any>('tasks')
    const index = list.findIndex(t => t.id === id)
    if (index >= 0) {
      list[index] = { ...list[index], ...data, updated_at: new Date().toISOString() }
      await saveData('tasks', list)
    }
  },

  delete: async (id: number): Promise<void> => {
    const list = await getAllData<any>('tasks')
    const filtered = list.filter(t => t.id !== id)
    await saveData('tasks', filtered)
  },

  submitTask: async (taskId: number, childId: number, photo?: string): Promise<number> => {
    const list = await getAllData<any>('task_submissions')
    const id = autoIncrement.points_log++
    await saveCounter('points_log', autoIncrement.points_log)
    const submission = {
      id,
      task_id: taskId,
      child_id: childId,
      photo: photo || null,
      status: 'pending',
      submit_time: new Date().toISOString(),
      review_time: null,
      review_note: null,
    }
    list.push(submission)
    await saveData('task_submissions', list)
    return id
  },

  getPendingSubmissions: async (childId?: number): Promise<any[]> => {
    const submissions = await getAllData<any>('task_submissions')
    const tasks = await getAllData<any>('tasks')
    let filtered = submissions.filter(s => s.status === 'pending')
    
    if (childId) {
      filtered = filtered.filter(s => s.child_id === childId)
    }
    
    return filtered.map(s => {
      const task = tasks.find(t => t.id === s.task_id)
      return {
        ...s,
        task_name: task?.name || '',
        point: task?.point || 0,
        icon: task?.icon || '',
      }
    }).sort((a, b) => new Date(b.submit_time).getTime() - new Date(a.submit_time).getTime())
  },

  reviewSubmission: async (submissionId: number, status: 'approved' | 'rejected', reviewNote?: string): Promise<void> => {
    const list = await getAllData<any>('task_submissions')
    const index = list.findIndex(s => s.id === submissionId)
    if (index >= 0) {
      list[index] = {
        ...list[index],
        status,
        review_time: new Date().toISOString(),
        review_note: reviewNote || null,
      }
      await saveData('task_submissions', list)
    }
  },

  getSubmissionsByChildId: async (childId: number, limit = 20): Promise<any[]> => {
    const submissions = await getAllData<any>('task_submissions')
    const tasks = await getAllData<any>('tasks')
    
    return submissions
      .filter(s => s.child_id === childId)
      .map(s => {
        const task = tasks.find(t => t.id === s.task_id)
        return {
          ...s,
          task_name: task?.name || '',
          point: task?.point || 0,
        }
      })
      .sort((a, b) => new Date(b.submit_time).getTime() - new Date(a.submit_time).getTime())
      .slice(0, limit)
  },
}

export const wishService = {
  getAll: async (childId?: number): Promise<Wish[]> => {
    let list = await getAllData<Wish>('wishes')
    if (childId) {
      list = list.filter(w => w.child_id === 0 || w.child_id === childId)
    }
    return list.sort((a, b) => {
      if (a.is_main_goal !== b.is_main_goal) {
        return a.is_main_goal ? -1 : 1
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  },

  getWishes: async (childId?: number, status?: Wish['status']): Promise<Wish[]> => {
    let list = await getAllData<Wish>('wishes')
    if (childId) {
      list = list.filter(w => w.child_id === 0 || w.child_id === childId)
    }
    if (status) {
      list = list.filter(w => w.status === status)
    }
    return list.sort((a, b) => {
      if (a.is_main_goal !== b.is_main_goal) {
        return a.is_main_goal ? -1 : 1
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  },

  getById: async (id: number): Promise<Wish | null> => {
    const list = await getAllData<Wish>('wishes')
    return list.find(w => w.id === id) || null
  },

  create: async (wish: Omit<Wish, 'id' | 'created_at'>): Promise<number> => {
    const list = await getAllData<any>('wishes')
    const id = autoIncrement.wishes++
    await saveCounter('wishes', autoIncrement.wishes)
    const newWish = {
      ...wish,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    list.push(newWish)
    await saveData('wishes', list)
    return id
  },

  update: async (id: number, data: Partial<Wish>): Promise<void> => {
    const list = await getAllData<any>('wishes')
    const index = list.findIndex(w => w.id === id)
    if (index >= 0) {
      list[index] = { ...list[index], ...data, updated_at: new Date().toISOString() }
      await saveData('wishes', list)
    }
  },

  delete: async (id: number): Promise<void> => {
    const list = await getAllData<any>('wishes')
    const filtered = list.filter(w => w.id !== id)
    await saveData('wishes', filtered)
  },

  exchange: async (id: number, childId: number): Promise<boolean> => {
    const list = await getAllData<any>('wishes')
    const wishIndex = list.findIndex(w => w.id === id)
    
    if (wishIndex === -1) return false
    
    const wish = list[wishIndex]
    if (wish.status !== 'active') return false
    
    const totalPoints = await pointService.getTotal(childId)
    if (totalPoints < wish.target_point) return false
    
    try {
      await pointService.addPoints(childId, -wish.target_point, `兑换愿望: ${wish.name}`, 'exchange', id)
      
      list[wishIndex] = { ...wish, status: 'exchanged' as Wish['status'], updated_at: new Date().toISOString() }
      await saveData('wishes', list)
      
      return true
    } catch (error) {
      console.error('兑换愿望失败:', error)
      return false
    }
  },

  setMainGoal: async (id: number): Promise<void> => {
    const list = await getAllData<any>('wishes')
    for (let i = 0; i < list.length; i++) {
      list[i] = {
        ...list[i],
        is_main_goal: list[i].id === id ? 1 : 0,
        updated_at: new Date().toISOString(),
      }
    }
    await saveData('wishes', list)
  },
}

export const pointService = {
  addPoints: async (childId: number, change: number, reason: string, type: string, relationId?: number): Promise<void> => {
    const list = await getAllData<any>('points_log')
    const id = autoIncrement.points_log++
    await saveCounter('points_log', autoIncrement.points_log)
    list.push({
      id,
      child_id: childId,
      change,
      reason,
      type,
      relation_id: relationId || null,
      created_at: new Date().toISOString(),
    })
    await saveData('points_log', list)
  },

  getTotal: async (childId: number): Promise<number> => {
    const list = await getAllData<any>('points_log')
    const childLogs = list.filter(l => l.child_id === childId)
    return childLogs.reduce((sum, log) => sum + log.change, 0)
  },

  getLogs: async (childId: number): Promise<any[]> => {
    const list = await getAllData<any>('points_log')
    return list.filter(l => l.child_id === childId).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },
}

export const badgeService = {
  getAll: async (): Promise<any[]> => {
    return getAllData('badges')
  },

  getById: async (id: number): Promise<any | null> => {
    const list = await getAllData('badges')
    return list.find(b => b.id === id) || null
  },

  obtainBadge: async (childId: number, badgeId: number): Promise<void> => {
    const list = await getAllData<any>('user_badges')
    const exists = list.some(ub => ub.child_id === childId && ub.badge_id === badgeId)
    if (!exists) {
      const id = autoIncrement.user_badges++
      await saveCounter('user_badges', autoIncrement.user_badges)
      list.push({
        id,
        child_id: childId,
        badge_id: badgeId,
        obtained_at: new Date().toISOString(),
      })
      await saveData('user_badges', list)
    }
  },

  getChildBadges: async (childId: number): Promise<any[]> => {
    const userBadges = await getAllData<any>('user_badges')
    const allBadges = await getAllData<any>('badges')
    const childBadgeIds = userBadges.filter(ub => ub.child_id === childId).map(ub => ub.badge_id)
    return allBadges.filter(b => childBadgeIds.includes(b.id))
  },
}