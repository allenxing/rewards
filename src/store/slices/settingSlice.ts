import { StateCreator } from 'zustand'
import * as SecureStore from 'expo-secure-store'

export interface SettingSlice {
  biometricsEnabled: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  darkMode: boolean
  language: string
  setBiometricsEnabled: (enabled: boolean) => Promise<void>
  setSoundEnabled: (enabled: boolean) => void
  setVibrationEnabled: (enabled: boolean) => void
  setDarkMode: (enabled: boolean) => void
  setLanguage: (language: string) => void
  loadSettings: () => Promise<void>
}

export const createSettingSlice: StateCreator<SettingSlice> = (set, get) => ({
  biometricsEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
  darkMode: false,
  language: 'zh-CN',

  setBiometricsEnabled: async (enabled) => {
    await SecureStore.setItemAsync('biometrics_enabled', enabled ? 'true' : 'false')
    set({ biometricsEnabled: enabled })
  },

  setSoundEnabled: (enabled) => {
    SecureStore.setItemAsync('sound_enabled', enabled ? 'true' : 'false')
    set({ soundEnabled: enabled })
  },

  setVibrationEnabled: (enabled) => {
    SecureStore.setItemAsync('vibration_enabled', enabled ? 'true' : 'false')
    set({ vibrationEnabled: enabled })
  },

  setDarkMode: (enabled) => {
    SecureStore.setItemAsync('dark_mode', enabled ? 'true' : 'false')
    set({ darkMode: enabled })
  },

  setLanguage: (language) => {
    SecureStore.setItemAsync('language', language)
    set({ language })
  },

  loadSettings: async () => {
    try {
      const biometrics = await SecureStore.getItemAsync('biometrics_enabled')
      const sound = await SecureStore.getItemAsync('sound_enabled')
      const vibration = await SecureStore.getItemAsync('vibration_enabled')
      const darkMode = await SecureStore.getItemAsync('dark_mode')
      const language = await SecureStore.getItemAsync('language')

      set({
        biometricsEnabled: biometrics === 'true',
        soundEnabled: sound !== 'false',
        vibrationEnabled: vibration !== 'false',
        darkMode: darkMode === 'true',
        language: language || 'zh-CN'
      })
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
})
