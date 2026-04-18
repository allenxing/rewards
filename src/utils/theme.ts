import { parentTheme, ParentTheme } from '../themes/parentTheme'
import { childTheme, ChildTheme } from '../themes/childTheme'

export type ThemeMode = 'parent' | 'child'
export type AppTheme = ParentTheme | ChildTheme

const themes: Record<ThemeMode, AppTheme> = {
  parent: parentTheme,
  child: childTheme,
}

// 预设主题样式对象 - 直接可在JSX中使用
export const themeStyles = {
  parent: {
    background: parentTheme.background,
    backgroundGradient: parentTheme.backgroundGradient,
    
    bg: {
      card: parentTheme.bgCard,
      cardHover: parentTheme.bgCardHover,
      modal: parentTheme.bgModal,
      overlay: parentTheme.bgOverlay,
      light: parentTheme.bgLight,
      nav: parentTheme.bgNav,
    },
    
    text: {
      primary: parentTheme.textPrimary,
      secondary: parentTheme.textSecondary,
      tertiary: parentTheme.textTertiary,
      muted: parentTheme.textMuted,
    },
    
    brand: {
      primary: parentTheme.brandPrimary,
      gradient: parentTheme.brandGradient,
      light: parentTheme.brandLight,
    },
    
    success: {
      primary: parentTheme.success,
      gradient: parentTheme.successGradient,
    },
    warning: {
      primary: parentTheme.warning,
      gradient: parentTheme.warningGradient,
    },
    danger: {
      primary: parentTheme.danger,
      gradient: parentTheme.dangerGradient,
    },
    
    border: {
      primary: parentTheme.borderPrimary,
      light: parentTheme.borderLight,
      lighter: parentTheme.borderLighter,
    },
    
    shadow: {
      primary: parentTheme.shadowPrimary,
      dark: parentTheme.shadowDark,
    },
  },
  
  child: {
    background: childTheme.background,
    backgroundGradient: childTheme.backgroundGradient,
    
    bg: {
      card: childTheme.bgCard,
      cardHover: childTheme.bgCardHover,
      modal: childTheme.bgModal,
      overlay: childTheme.bgOverlay,
      light: childTheme.bgLight,
      nav: childTheme.bgNav,
    },
    
    text: {
      primary: childTheme.textPrimary,
      secondary: childTheme.textSecondary,
      tertiary: childTheme.textTertiary,
      muted: childTheme.textMuted,
    },
    
    brand: {
      primary: childTheme.brandPrimary,
      gradient: childTheme.brandGradient,
      light: childTheme.brandLight,
    },
    
    success: {
      primary: childTheme.success,
      gradient: childTheme.successGradient,
    },
    warning: {
      primary: childTheme.warning,
      gradient: childTheme.warningGradient,
    },
    danger: {
      primary: childTheme.danger,
      gradient: childTheme.dangerGradient,
    },
    
    border: {
      primary: childTheme.borderPrimary,
      light: childTheme.borderLight,
      lighter: childTheme.borderLighter,
    },
    
    shadow: {
      primary: childTheme.shadowPrimary,
      dark: childTheme.shadowDark,
    },
  },
}

export function getTheme(mode: ThemeMode = 'parent'): AppTheme {
  return themes[mode]
}

export function getColors(mode: ThemeMode = 'parent') {
  return themes[mode]
}

export function getStyles(mode: ThemeMode = 'parent') {
  return themeStyles[mode]
}

export function getBackground(mode: ThemeMode = 'parent'): string {
  return themes[mode].background
}

export function getBackgroundGradient(mode: ThemeMode = 'parent'): string {
  return themes[mode].backgroundGradient
}

export { parentTheme, childTheme }
export type { ParentTheme, ChildTheme }