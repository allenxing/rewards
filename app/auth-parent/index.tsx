// @ts-nocheck
import { View, Text, YStack, XStack, Button } from 'tamagui'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useStore } from '../../src/store'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

export default function AuthPage() {
  const setMode = useStore(state => state.setMode)
  const router = useRouter()

  useEffect(() => {
    setMode('parent')
    router.replace('/(parent)')
  }, [])

  return (
    <View flex={1} bg={t.background} justifyContent="center" alignItems="center">
      <View width={80} height={80} borderRadius={40} bg={t.brand.gradient} alignItems="center" justifyContent="center">
        <IconSymbol size={40} name="lock.fill" color="white" />
      </View>
      <Text color="white" fontSize="$5" fontWeight="600" marginTop="$6">正在进入���长模式...</Text>
    </View>
  )
}