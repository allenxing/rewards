import { StateCreator } from 'zustand'
import { Platform } from 'react-native'

const isWeb = Platform.OS === 'web'
const pointService = isWeb
  ? require('../../services/db/webService').pointService
  : require('../../services/db/pointService').default

export interface PointSlice {
  totalPoints: number
  pointsLoading: boolean
  loadTotalPoints: (childId: number) => Promise<void>
  addPoints: (childId: number, points: number, reason: string) => Promise<boolean>
  deductPoints: (childId: number, points: number, reason: string) => Promise<boolean>
}

export const createPointSlice: StateCreator<PointSlice> = (set, get) => ({
  totalPoints: 0,
  pointsLoading: false,

  loadTotalPoints: async (childId: number) => {
    try {
      set({ pointsLoading: true })
      const total = await pointService.getTotalPoints(childId)
      set({ totalPoints: total, pointsLoading: false })
    } catch (error) {
      console.error('加载积分失败:', error)
      set({ pointsLoading: false })
    }
  },

  addPoints: async (childId: number, points: number, reason: string) => {
    try {
      const success = await pointService.addPoints(childId, points, reason)
      if (success) {
        // 重新加载积分
        await get().loadTotalPoints(childId)
        // 播放奖励音效（后续实现）
        return true
      }
      return false
    } catch (error) {
      console.error('奖励积分失败:', error)
      return false
    }
  },

  deductPoints: async (childId: number, points: number, reason: string) => {
    try {
      const success = await pointService.deductPoints(childId, points, reason)
      if (success) {
        // 重新加载积分
        await get().loadTotalPoints(childId)
        // 播放扣分音效（后续实现）
        return true
      }
      return false
    } catch (error) {
      console.error('扣除积分失败:', error)
      return false
    }
  },
})
