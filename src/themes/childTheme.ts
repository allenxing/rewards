// 孩子模式主题：活泼、鲜艳、游戏化
export const childTheme = {
  // 基础背景
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  backgroundGradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',

  // 背景色
  bgCard: 'rgba(30, 41, 59, 0.6)',
  bgCardHover: 'rgba(30, 41, 59, 0.8)',
  bgModal: 'rgba(30, 41, 59, 0.95)',
  bgOverlay: 'rgba(15, 23, 42, 0.7)',
  bgLight: 'rgba(255, 255, 255, 0.1)',
  bgLighter: 'rgba(255, 255, 255, 0.15)',
  bgNav: 'rgba(255, 255, 255, 0.15)',

  // 文字颜色
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.9)',
  textTertiary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.6)',

  // 品牌色 - 金色（适合孩子）
  brandPrimary: '#FBBF24',
  brandGradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
  brandLight: 'rgba(251, 191, 36, 0.3)',

  // 功能色
  success: '#34D399',
  successGradient: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
  warning: '#F97316',
  warningGradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
  danger: '#EF4444',
  dangerGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',

  // 边框
  borderPrimary: 'rgba(255, 255, 255, 0.3)',
  borderLight: 'rgba(255, 255, 255, 0.15)',
  borderLighter: 'rgba(255, 255, 255, 0.25)',

  // 阴影
  shadowPrimary: '#FBBF24',
  shadowDark: 'rgba(0, 0, 0, 0.25)',

  // 组件样式
  cardBg: 'rgba(30, 41, 59, 0.6)',
  cardRadius: '$6',
  cardBorderWidth: 1,
  cardBorderColor: 'rgba(255, 255, 255, 0.2)',
  
  buttonPrimaryBg: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
  buttonSecondaryBg: 'rgba(255, 255, 255, 0.15)',
  buttonSuccessBg: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
  buttonWarningBg: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
  buttonDangerBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
}

export type ChildTheme = typeof childTheme