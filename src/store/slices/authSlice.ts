import { StateCreator } from 'zustand'
import type { UserMode } from '../../types'
import * as SecureStore from 'expo-secure-store'
import * as LocalAuthentication from 'expo-local-authentication'

export interface AuthSlice {
  mode: UserMode
  isAuthenticated: boolean
  biometricsEnabled: boolean
  passwordAttempts: number
  lockedUntil: number | null
  setMode: (mode: UserMode) => void
  authenticate: (password: string) => Promise<boolean>
  authenticateWithBiometrics: () => Promise<boolean>
  setPassword: (password: string) => Promise<void>
  setSecurityQuestion: (question: string, answer: string) => Promise<void>
  verifySecurityAnswer: (answer: string) => Promise<boolean>
  toggleBiometrics: (enabled: boolean) => void
  resetPasswordAttempts: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  mode: 'parent',
  isAuthenticated: false,
  biometricsEnabled: false,
  passwordAttempts: 0,
  lockedUntil: null,

  setMode: (mode) => set({ mode }),

  authenticate: async (password) => {
    const state = get()

    if (state.lockedUntil && Date.now() < state.lockedUntil) {
      return false
    }

    let storedHash = null
    try {
      storedHash = await SecureStore.getItemAsync('parent_password')
    } catch (e) {
      console.warn('SecureStore error:', e)
    }

    if (!storedHash) {
      try {
        await SecureStore.setItemAsync('parent_password', password)
      } catch (e) {
        console.warn('SecureStore error:', e)
      }
      set({ isAuthenticated: true, passwordAttempts: 0, lockedUntil: null })
      return true
    }

    const isValid = password === storedHash

    if (isValid) {
      set({ isAuthenticated: true, passwordAttempts: 0, lockedUntil: null })
      return true
    } else {
      const newAttempts = state.passwordAttempts + 1
      let lockedUntil = null

      if (newAttempts >= 3) {
        lockedUntil = Date.now() + 60 * 1000
      }

      set({ passwordAttempts: newAttempts, lockedUntil })
      return false
    }
  },

  authenticateWithBiometrics: async () => {
    const state = get()

    if (state.lockedUntil && Date.now() < state.lockedUntil) {
      return false
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()

      if (!hasHardware || !isEnrolled) {
        return false
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '验证身份以进入家长模式',
        fallbackLabel: '使用密码',
      })

      if (result.success) {
        set({ isAuthenticated: true, passwordAttempts: 0, lockedUntil: null })
        return true
      }
    } catch (e) {
      console.warn('Biometrics error:', e)
    }

    return false
  },

  setPassword: async (password) => {
    try {
      await SecureStore.setItemAsync('parent_password', password)
    } catch (e) {
      console.warn('SecureStore error:', e)
    }
  },

  setSecurityQuestion: async (question, answer) => {
    try {
      await SecureStore.setItemAsync('security_question', question)
      await SecureStore.setItemAsync('security_answer', answer)
    } catch (e) {
      console.warn('SecureStore error:', e)
    }
  },

  verifySecurityAnswer: async (answer) => {
    try {
      const storedAnswer = await SecureStore.getItemAsync('security_answer')
      return storedAnswer === answer
    } catch (e) {
      console.warn('SecureStore error:', e)
      return false
    }
  },

  toggleBiometrics: (enabled) => set({ biometricsEnabled: enabled }),

  resetPasswordAttempts: () => set({ passwordAttempts: 0, lockedUntil: null }),
})
