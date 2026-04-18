import { Input, InputProps } from 'tamagui'
import React from 'react'

interface ThemedInputProps extends InputProps {
  variant?: 'default' | 'filled'
}

export const ThemedInput = React.forwardRef<React.ElementRef<typeof Input>, ThemedInputProps>(
  ({ variant = 'default', style, ...props }, ref) => {
    const filledStyle = {
      bg: 'rgba(124, 58, 237, 0.2)',
      bc: 'transparent',
      bw: 1,
      br: '$4',
      p: '$3',
      color: 'white' as const,
      placeholderTextColor: '#94A3B8',
    }

    const defaultStyle = {
      bg: 'transparent',
      bc: 'rgba(139, 92, 246, 0.5)',
      bw: 1,
      br: '$4',
      p: '$3',
      color: 'white' as const,
      placeholderTextColor: '#94A3B8',
    }

    const inputStyle = variant === 'filled' ? filledStyle : defaultStyle

    return (
      <Input
        ref={ref}
        {...inputStyle}
        {...props}
      />
    )
  }
)