// 家长模式主题：深色紫色系，玻璃态风格
// Tamagui 要求扁平结构
export const parentTheme = {
  // 基础背景
  background: '#1E1B4B',
  backgroundGradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',

  // 背景色
  bgCard: 'rgba(30, 41, 59, 0.6)',
  bgCardHover: 'rgba(30, 41, 59, 0.8)',
  bgModal: 'rgba(30, 41, 59, 0.95)',
  bgOverlay: 'rgba(15, 23, 42, 0.7)',
  bgLight: 'rgba(255, 255, 255, 0.05)',
  bgLighter: 'rgba(255, 255, 255, 0.1)',
  bgNav: 'rgba(255, 255, 255, 0.1)',

  // 文字颜色
  textPrimary: '#FFFFFF',
  textSecondary: '#A5B4FC',
  textTertiary: '#C4B5FD',
  textMuted: '#94A3B8',

  // 品牌色 - 紫色
  brandPrimary: '#8B5CF6',
  brandGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
  brandLight: 'rgba(139, 92, 246, 0.2)',

  // 功能色
  success: '#10B981',
  successGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warning: '#F59E0B',
  warningGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  danger: '#EF4444',
  dangerGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',

  // 边框
  borderPrimary: 'rgba(139, 92, 246, 0.3)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderLighter: 'rgba(255, 255, 255, 0.2)',

  // 阴影
  shadowPrimary: '#8B5CF6',
  shadowDark: '#000000',

  // 组件样式
  cardBg: 'rgba(30, 41, 59, 0.6)',
  cardRadius: '$6',
  cardBorderWidth: 1,
  cardBorderColor: 'rgba(139, 92, 246, 0.3)',
  
  buttonPrimaryBg: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
  buttonSecondaryBg: 'rgba(255, 255, 255, 0.05)',
  buttonSuccessBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  buttonWarningBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  buttonDangerBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
}

export type ParentTheme = typeof parentTheme