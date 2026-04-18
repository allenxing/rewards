import { StateCreator } from 'zustand'
import type { Wish } from '../../types'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'
const wishService = isWeb 
  ? require('../../services/db/webService').wishService
  : require('../../services/db/wishService').default

export interface WishSlice {
  wishes: Wish[]
  loading: boolean
  error: string | null
  loadWishes: (childId?: number) => Promise<void>
  addWish: (wish: Omit<Wish, 'id' | 'created_at'>) => Promise<void>
  updateWish: (id: number, data: Partial<Wish>) => Promise<void>
  deleteWish: (id: number) => Promise<void>
  exchangeWish: (id: number, childId: number) => Promise<boolean>
  setMainGoal: (id: number) => Promise<void>
}

export const createWishSlice: StateCreator<WishSlice> = (set, get) => ({
  wishes: [],
  loading: false,
  error: null,

  loadWishes: async (childId?: number) => {
    try {
      set({ loading: true, error: null })
      const wishes = await wishService.getWishes(childId)
      set({ wishes, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  addWish: async (wish) => {
    try {
      set({ loading: true, error: null })
      const id = await wishService.create(wish)
      const newWish = {
        ...wish,
        id: Number(id),
        created_at: new Date().toISOString()
      } as Wish

      set(state => ({
        wishes: [...state.wishes, newWish],
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateWish: async (id, data) => {
    try {
      set({ loading: true, error: null })
      await wishService.update(id, data)

      set(state => ({
        wishes: state.wishes.map(w => w.id === id ? { ...w, ...data } : w),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteWish: async (id) => {
    try {
      set({ loading: true, error: null })
      await wishService.delete(id)

      set(state => ({
        wishes: state.wishes.filter(w => w.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  exchangeWish: async (id, childId) => {
    try {
      set({ loading: true, error: null })
      const success = await wishService.exchange(id, childId)

      if (success) {
        set(state => ({
          wishes: state.wishes.map(w => w.id === id ? { ...w, status: 'exchanged' } : w),
          loading: false
        }))
      } else {
        set({ loading: false })
      }

      return success
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      return false
    }
  },

  setMainGoal: async (id) => {
    try {
      set({ loading: true, error: null })
      await wishService.setMainGoal(id)

      set(state => ({
        wishes: state.wishes.map(w => ({
          ...w,
          is_main_goal: w.id === id
        })),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  }
})
