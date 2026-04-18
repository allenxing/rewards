export type UserMode = 'parent' | 'child'

export interface Child {
  id: number
  name: string
  avatar?: string
  theme_color: string
  created_at: string
}

export interface Task {
  id: number
  name: string
  icon: string
  point: number
  type: 'daily' | 'weekly' | 'one_time'
  category: 'life' | 'study' | 'housework' | 'character'
  age_group?: '3-6' | '7-12' | 'all'
  require_photo: boolean
  auto_approve: boolean
  is_active: boolean
  child_id: number
  created_at: string
}

export interface TaskSubmission {
  id: number
  task_id: number
  child_id: number
  status: 'pending' | 'approved' | 'rejected'
  photo?: string
  submit_time: string
  review_time?: string
  review_note?: string
}

export interface PointsLog {
  id: number
  child_id: number
  change: number
  reason: string
  type: 'task_reward' | 'reward' | 'punish' | 'exchange'
  relation_id?: number
  created_at: string
}

export interface Wish {
  id: number
  name: string
  image?: string
  target_point: number
  type: 'personal' | 'family'
  child_id: number
  status: 'active' | 'locked' | 'achieved' | 'exchanged'
  is_main_goal: boolean
  created_at: string
}

export interface Badge {
  id: number
  name: string
  icon: string
  description: string
  condition_type: 'task_count' | 'point_count' | 'behavior' | 'continuous'
  condition_value: number
  is_custom: boolean
  created_at: string
}

export interface UserBadge {
  id: number
  child_id: number
  badge_id: number
  obtained_at: string
}
