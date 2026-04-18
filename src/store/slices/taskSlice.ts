import { StateCreator } from 'zustand'
import type { Task, TaskSubmission } from '../../types'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'
const taskService = isWeb 
  ? require('../../services/db/webService').taskService
  : require('../../services/db/taskService').default
const pointService = isWeb
  ? require('../../services/db/webService').pointService
  : require('../../services/db/pointService').default

export interface TaskSlice {
  tasks: Task[]
  pendingSubmissions: (TaskSubmission & { task_name: string; point: number; icon: string })[]
  submissionsLoading: boolean
  loadTasks: (childId?: number) => Promise<void>
  loadPendingSubmissions: (childId: number) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<number>
  updateTask: (id: number, data: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  reviewSubmission: (submissionId: number, approved: boolean, reviewNote?: string) => Promise<void>
  addPoints: (childId: number, points: number, reason: string, type: string, relationId?: number) => Promise<void>
}

export const createTaskSlice: StateCreator<TaskSlice> = (set, get) => ({
  tasks: [],
  pendingSubmissions: [],
  submissionsLoading: false,

  loadTasks: async (childId) => {
    try {
      const tasks = await taskService.getAll(childId)
      set({ tasks })
    } catch (error) {
      console.error('loadTasks error:', error)
    }
  },

  loadPendingSubmissions: async (childId) => {
    set({ submissionsLoading: true })
    try {
      const subs = await taskService.getPendingSubmissions(childId)
      set({ pendingSubmissions: subs, submissionsLoading: false })
    } catch (error) {
      console.error('loadPendingSubmissions error:', error)
      set({ submissionsLoading: false })
    }
  },

  createTask: async (task) => {
    try {
      const id = await taskService.create(task)
      await get().loadTasks()
      return id
    } catch (error) {
      console.error('createTask error:', error)
      throw error
    }
  },

  updateTask: async (id, data) => {
    try {
      await taskService.update(id, data)
      await get().loadTasks()
    } catch (error) {
      console.error('updateTask error:', error)
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      await taskService.delete(id)
      await get().loadTasks()
    } catch (error) {
      console.error('deleteTask error:', error)
      throw error
    }
  },

  reviewSubmission: async (submissionId, approved, reviewNote) => {
    try {
      await taskService.reviewSubmission(submissionId, approved, reviewNote)
    } catch (error) {
      console.error('reviewSubmission error:', error)
      throw error
    }
  },

  addPoints: async (childId, points, reason, type, relationId) => {
    try {
      await pointService.addPoints(childId, points, reason, type, relationId)
    } catch (error) {
      console.error('addPoints error:', error)
      throw error
    }
  },
})