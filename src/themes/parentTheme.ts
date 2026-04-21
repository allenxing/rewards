// 家长模式主题：浅色系，简约专业风格
// Tamagui 要求扁平结构
export const parentTheme = {
  // 基础背景
  background: '#F8FAFC',
  backgroundGradient: 'transparent',

  // 背景色
  bgCard: '#FFFFFF',
  bgCardHover: '#F8FAFC',
  bgModal: '#FFFFFF',
  bgOverlay: 'rgba(0, 0, 0, 0.5)',
  bgLight: '#F1F5F9',
  bgLighter: '#E2E8F0',
  bgNav: '#FFFFFF',

  // 文字颜色
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#8B5CF6',
  textMuted: '#94A3B8',

  // 品牌色 - 紫色
  brandPrimary: '#8B5CF6',
  brandGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
  brandLight: 'rgba(139, 92, 246, 0.1)',

  // 功能色
  success: '#10B981',
  successGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warning: '#F59E0B',
  warningGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  danger: '#EF4444',
  dangerGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',

  // 边框
  borderPrimary: 'rgba(139, 92, 246, 0.3)',
  borderLight: '#E2E8F0',
  borderLighter: '#F1F5F9',

  // 阴影
  shadowPrimary: '#8B5CF6',
  shadowDark: '#000000',

  // 组件样式
  cardBg: '#FFFFFF',
  cardRadius: '$4',
  cardBorderWidth: 0,
  cardBorderColor: '#E2E8F0',
  
  buttonPrimaryBg: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
  buttonSecondaryBg: '#8B5CF6',
  buttonSuccessBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  buttonWarningBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  buttonDangerBg: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
}

export type ParentTheme = typeof parentTheme