import { Button, type ButtonProps, Card, type CardProps } from 'tamagui'
import React from 'react'
import { getColors, type ThemeMode } from '../../src/utils/theme'

const buttonGradientMap: Record<string, Record<string, string>> = {
  parent: {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  },
  child: {
    primary: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    secondary: 'rgba(255, 255, 255, 0.15)',
    success: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
    warning: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  },
}

type ThemedButtonProps = ButtonProps & {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  theme?: ThemeMode
}

export const ThemedButton = React.forwardRef<React.ElementRef<typeof Button>, ThemedButtonProps>(
  ({ children, variant = 'primary', theme = 'parent', style, ...props }, ref) => {
    const bg = buttonGradientMap[theme]?.[variant] || buttonGradientMap.parent.primary

    return (
      <Button
        ref={ref}
        bg={bg}
        br="$6"
        pressStyle={{ scale: 0.97 }}
        {...props}
        style={[style, (props as any).style]}
      >
        {children}
      </Button>
    )
  }
)

ThemedButton.displayName = 'ThemedButton'

type ThemedCardProps = CardProps & {
  variant?: 'default' | 'active'
  theme?: ThemeMode
}

export const ThemedCard = React.forwardRef<React.ElementRef<typeof Card>, ThemedCardProps>(
  ({ children, variant = 'default', theme = 'parent', style, ...props }, ref) => {
    const colors = getColors(theme)

    return (
      <Card
        ref={ref}
        bg={colors.bgCard}
        br="$6"
        bw={1}
        bc={colors.borderPrimary}
        shadowColor={colors.shadowPrimary}
        shadowOffset={{ width: 0, height: 8 }}
        shadowOpacity={0.15}
        shadowRadius={20}
        {...props}
        style={[style, (props as any).style]}
      >
        {children}
      </Card>
    )
  }
)

ThemedCard.displayName = 'ThemedCard'

export { getColors }