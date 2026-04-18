import { createTamagui } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v5'

const config = createTamagui({
  ...defaultConfig,
  themes: {
    parent: {
      ...defaultConfig.themes.dark,
      background: '#1E1B4B',
      backgroundStrong: '#312E81',
      backgroundInverse: '#4338CA',
      color: '#FFFFFF',
      colorInverse: '#A5B4FC',
      colorHover: '#A78BFA',
      colorPress: '#7C3AED',
      colorFocus: '#8B5CF6',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      shadowColor: '#8B5CF6',
    },
    child: {
      ...defaultConfig.themes.dark,
      background: '#8B5CF6',
      backgroundStrong: '#EC4899',
      backgroundInverse: '#EC4899',
      color: '#FFFFFF',
      colorInverse: '#FBBF24',
      colorHover: '#FDE047',
      colorPress: '#D97706',
      colorFocus: '#FBBF24',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#FBBF24',
    },
  },
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}