// @ts-nocheck
import { View, Text, YStack, XStack, Button, Input } from 'tamagui'
import { useState } from 'react'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { useStore } from '../../../src/store'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../../src/utils/theme'

const t = themeStyles.parent

export default function AddChild() {
  const addChild = useStore(state => state.addChild)
  const [loading, setLoading] = useState(false)

  const [newChildName, setNewChildName] = useState('')
  const [newChildAvatar, setNewChildAvatar] = useState<string | null>(null)
  const [newChildThemeColor, setNewChildThemeColor] = useState('#2563EB')

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setNewChildAvatar(result.assets[0].uri)
    }
  }

  const handleAddChild = async () => {
    if (!newChildName.trim()) return

    try {
      setLoading(true)
      await addChild({
        name: newChildName.trim(),
        avatar: newChildAvatar ?? undefined,
        theme_color: newChildThemeColor,
      })
      router.back()
    } catch (error) {
      console.error('添加孩子失败:', error)
      alert('添加孩子失败')
    } finally {
      setLoading(false)
    }
  }

  const themeColors = [
    { color: '#2563EB', name: '天空蓝' },
    { color: '#DC2626', name: '珊瑚红' },
    { color: '#D97706', name: '琥珀橙' },
    { color: '#059669', name: '森林绿' },
    { color: '#7C3AED', name: '紫罗兰' },
  ]

  return (
    <View flex={1} bg={t.background}>
      <YStack flex={1} px="$4" py="$6" gap="$6">
        <YStack alignItems="center" gap="$4">
          <View
            width={96}
            height={96}
            borderRadius={48}
            backgroundColor={newChildThemeColor}
            overflow="hidden"
            onPress={pickAvatar}
            bw={4}
            bc={t.border.lighter}
            shadowColor={newChildThemeColor}
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.4}
            shadowRadius={20}
            pressStyle={{ scale: 0.95 }}
          >
            {newChildAvatar ? (
              <Image
                source={{ uri: newChildAvatar }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <YStack flex={1} justifyContent="center" alignItems="center">
                <IconSymbol size={36} name="camera" color="white" />
              </YStack>
            )}
          </View>
          <Text fontSize="$3" color="#A5B4FC" fontWeight="500">点击选择头像</Text>
        </YStack>

        <YStack gap="$4">
          <Text fontSize="$4" fontWeight="600" color="white">孩子昵称</Text>
          <Input
            placeholder="请输入孩子昵称"
            value={newChildName}
            onChangeText={setNewChildName}
            bg={t.bg.card}
            bc="rgba(139, 92, 246, 0.3)"
            bw={1}
            br="$4"
            p="$4"
            fontSize="$4"
            color="white"
            placeholderTextColor="#94A3B8"
          />
        </YStack>

        <YStack gap="$4">
          <Text fontSize="$4" fontWeight="600" color="white">主题颜色</Text>
          <XStack gap="$4" justifyContent="center">
            {themeColors.map(item => (
              <View
                key={item.color}
                width={44}
                height={44}
                borderRadius={22}
                backgroundColor={item.color}
                borderWidth={newChildThemeColor === item.color ? 4 : 0}
                borderColor="white"
                shadowColor={newChildThemeColor === item.color ? item.color : 'transparent'}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.4}
                shadowRadius={12}
                onPress={() => setNewChildThemeColor(item.color)}
                pressStyle={{ scale: 0.9 }}
              />
            ))}
          </XStack>
        </YStack>

        <Button
          bg="linear-gradient(135deg, #10B981 0%, #059669 100%)"
          marginTop="auto"
          br="$6"
          py="$4"
          shadowColor="#10B981"
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={0.4}
          shadowRadius={20}
          pressStyle={{ scale: 0.97 }}
          onPress={handleAddChild}
          disabled={!newChildName.trim() || loading}
        >
          <Text color="white" fontWeight="700" fontSize="$5">{loading ? '保存中...' : '保存'}</Text>
        </Button>
      </YStack>
    </View>
  )
}