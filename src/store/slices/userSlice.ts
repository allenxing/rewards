import { StateCreator } from 'zustand'
import type { Child } from '../../types'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'
const userService = isWeb 
  ? require('../../services/db/webService').childrenService
  : require('../../services/db/userService').default

export interface UserSlice {
  currentChild: Child | null
  children: Child[]
  loading: boolean
  error: string | null
  loadChildren: () => Promise<void>
  setCurrentChild: (child: Child) => void
  addChild: (child: Omit<Child, 'id' | 'created_at'>) => Promise<void>
  updateChild: (id: number, data: Partial<Child>) => Promise<void>
  deleteChild: (id: number) => Promise<void>
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  currentChild: null,
  children: [],
  loading: false,
  error: null,

  loadChildren: async () => {
    try {
      set({ loading: true, error: null })
      const children = await userService.getAll()
      set({
        children,
        currentChild: children[0] || null,
        loading: false
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  setCurrentChild: (child) => set({ currentChild: child }),

  addChild: async (child) => {
    try {
      set({ loading: true, error: null })
      const id = await userService.create(child)
      const newChild = {
        ...child,
        id: Number(id),
        created_at: new Date().toISOString()
      } as Child

      set(state => ({
        children: [...state.children, newChild],
        currentChild: state.currentChild || newChild,
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateChild: async (id, data) => {
    try {
      set({ loading: true, error: null })
      await userService.update(id, data)

      set(state => ({
        children: state.children.map(c => c.id === id ? { ...c, ...data } : c),
        currentChild: state.currentChild?.id === id ? { ...state.currentChild, ...data } : state.currentChild,
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteChild: async (id) => {
    try {
      set({ loading: true, error: null })
      await userService.delete(id)

      set(state => {
        const newChildren = state.children.filter(c => c.id !== id)
        return {
          children: newChildren,
          currentChild: state.currentChild?.id === id ? newChildren[0] || null : state.currentChild,
          loading: false
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },
})
