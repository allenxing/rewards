import { create } from 'zustand'
import { AuthSlice, createAuthSlice } from './slices/authSlice'
import { UserSlice, createUserSlice } from './slices/userSlice'
import { PointSlice, createPointSlice } from './slices/pointSlice'
import { TaskSlice, createTaskSlice } from './slices/taskSlice'
import { WishSlice, createWishSlice } from './slices/wishSlice'
import { SettingSlice, createSettingSlice } from './slices/settingSlice'

type StoreState = AuthSlice & UserSlice & PointSlice & TaskSlice & WishSlice & SettingSlice

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUserSlice(...a),
  ...createPointSlice(...a),
  ...createTaskSlice(...a),
  ...createWishSlice(...a),
  ...createSettingSlice(...a),
}))
