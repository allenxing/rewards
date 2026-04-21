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
    try {
      await SecureStore.setItemAsync('biometrics_enabled', enabled ? 'true' : 'false')
    } catch (e) {
      console.warn('SecureStore error:', e)
    }
    set({ biometricsEnabled: enabled })
  },

  setSoundEnabled: (enabled) => {
    try {
      SecureStore.setItemAsync('sound_enabled', enabled ? 'true' : 'false').catch(console.warn)
    } catch (e) {
      console.warn('SecureStore error:', e)
    }
    set({ soundEnabled: enabled })
  },

  setVibrationEnabled: (enabled) => {
    try {
      SecureStore.setItemAsync('vibration_enabled', enabled ? 'true' : 'false').catch(console.warn)
    } catch (e) {
      console.warn('SecureStore error:', e)
    }
    set({ vibrationEnabled: enabled })
  },

  setDarkMode: (enabled) => {
    try {
      SecureStore.setItemAsync('dark_mode', enabled ? 'true' : 'false').catch(console.warn)
    } catch (e) {
      console.warn('SecureStore error:', e)
    }
    set({ darkMode: enabled })
  },

  setLanguage: (language) => {
    try {
      SecureStore.setItemAsync('language', language).catch(console.warn)
    } catch (e) {
      console.warn('SecureStore error:', e)
    }
    set({ language })
  },

  loadSettings: async () => {
    try {
      let biometrics = false, sound = true, vibration = true, darkMode = false, language = 'zh-CN'
      try {
        biometrics = (await SecureStore.getItemAsync('biometrics_enabled')) === 'true'
        sound = (await SecureStore.getItemAsync('sound_enabled')) !== 'false'
        vibration = (await SecureStore.getItemAsync('vibration_enabled')) !== 'false'
        darkMode = (await SecureStore.getItemAsync('dark_mode')) === 'true'
        language = (await SecureStore.getItemAsync('language')) || 'zh-CN'
      } catch (e) {
        console.warn('SecureStore read error:', e)
      }

      set({
        biometricsEnabled: biometrics,
        soundEnabled: sound,
        vibrationEnabled: vibration,
        darkMode: darkMode,
        language: language,
      })
    } catch (e) {
      console.warn('loadSettings error:', e)
    }
  },
})
