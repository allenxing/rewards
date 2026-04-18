// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Input } from 'tamagui'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useStore } from '../../../src/store'
import wishService from '../../../src/services/db/wishService'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../../src/utils/theme'

const t = themeStyles.parent

export default function AddWish() {
  const currentChild = useStore(state => state.currentChild)
  const [loading, setLoading] = useState(false)

  const [newWishName, setNewWishName] = useState('')
  const [newWishPoint, setNewWishPoint] = useState('')
  const [newWishImage, setNewWishImage] = useState<string | null>(null)
  const [wishType, setWishType] = useState<'personal' | 'family'>('personal')

  const saveWishImage = async (uri: string): Promise<string> => {
    if (!uri) return ''
    
    const fileName = `wish_${Date.now()}.jpg`
    const destPath = `${FileSystem.documentDirectory}${fileName}`
    
    try {
      await FileSystem.copyAsync({ from: uri, to: destPath })
      return fileName
    } catch (error) {
      console.error('保存图片失败:', error)
      return ''
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      setNewWishImage(result.assets[0].uri)
    }
  }

  const handleCreateWish = async () => {
    if (!newWishName.trim() || !newWishPoint || !currentChild) return
    
    try {
      setLoading(true)
      
      let imageFileName = ''
      if (newWishImage) {
        imageFileName = await saveWishImage(newWishImage)
      }
      
      await wishService.create({
        name: newWishName.trim(),
        image: imageFileName || undefined,
        target_point: Number(newWishPoint),
        type: wishType,
        child_id: currentChild.id,
        status: 'active',
        is_main_goal: false
      })
      
      router.back()
    } catch (error) {
      console.error('创建愿望失败:', error)
      alert('创建愿望失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View flex={1} bg={t.background}>
      <ScrollView flex={1} px="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$6">
          <Text fontSize="$6" fontWeight="700" color="white">新建愿望</Text>

          <YStack alignItems="center" gap="$4">
            <View
              width={140}
              height={140}
              br="$6"
              bg={t.bg.card}
              bw={1}
              bc="rgba(139, 92, 246, 0.3)"
              overflow="hidden"
              onPress={pickImage}
              shadowColor="#000000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
              shadowRadius={12}
              backdropFilter="blur(10px)"
              pressStyle={{ scale: 0.97 }}
            >
              {newWishImage ? (
                <Image
                  source={{ uri: newWishImage }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
                  <View w={56} h={56} br={28} bg="rgba(139, 92, 246, 0.2)" ai="center" jc="center">
                    <IconSymbol size={28} name="camera" color="#C4B5FD" />
                  </View>
                  <Text fontSize="$3" fontWeight="500" color="#A5B4FC">点击上传</Text>
                </YStack>
              )}
            </View>
            <Text fontSize="$3" color="#A5B4FC" fontWeight="500">点击上传愿望图片</Text>
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="white">愿望名称</Text>
            <Input
              placeholder="如：迪士尼乐园一日游"
              value={newWishName}
              onChangeText={setNewWishName}
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
            <Text fontSize="$4" fontWeight="600" color="white">需要积分</Text>
            <Input
              placeholder="如：500"
              value={newWishPoint}
              onChangeText={setNewWishPoint}
              keyboardType="numeric"
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
            <Text fontSize="$4" fontWeight="600" color="white">愿望类型</Text>
            <XStack gap="$4">
              <Button
                flex={1}
                bg={wishType === 'personal' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : 'rgba(255, 255, 255, 0.05)'}
                bw={wishType === 'personal' ? 0 : 1}
                bc={wishType === 'personal' ? 'transparent' : 'rgba(255, 255, 255, 0.1)'}
                br="$6"
                py="$4"
                shadowColor={wishType === 'personal' ? "#8B5CF6" : "transparent"}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={wishType === 'personal' ? 0.3 : 0}
                shadowRadius={wishType === 'personal' ? 12 : 0}
                pressStyle={{ scale: 0.97 }}
                onPress={() => setWishType('personal')}
              >
                <YStack alignItems="center" gap="$2">
                  <View w={40} h={40} br={20} bg={wishType === 'personal' ? "rgba(255,255,255,0.2)" : "rgba(139, 92, 246, 0.1)"} ai="center" jc="center">
                    <IconSymbol size={20} name="person.fill" color={wishType === 'personal' ? 'white' : '#C4B5FD'} />
                  </View>
                  <Text
                    fontSize="$4"
                    fontWeight={wishType === 'personal' ? '700' : '600'}
                    color={wishType === 'personal' ? 'white' : '#C4B5FD'}
                  >
                    个人愿望
                  </Text>
                </YStack>
              </Button>
              <Button
                flex={1}
                bg={wishType === 'family' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(255, 255, 255, 0.05)'}
                bw={wishType === 'family' ? 0 : 1}
                bc={wishType === 'family' ? 'transparent' : 'rgba(255, 255, 255, 0.1)'}
                br="$6"
                py="$4"
                shadowColor={wishType === 'family' ? "#F59E0B" : "transparent"}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={wishType === 'family' ? 0.3 : 0}
                shadowRadius={wishType === 'family' ? 12 : 0}
                pressStyle={{ scale: 0.97 }}
                onPress={() => setWishType('family')}
              >
                <YStack alignItems="center" gap="$2">
                  <View w={40} h={40} br={20} bg={wishType === 'family' ? "rgba(255,255,255,0.2)" : "rgba(245, 158, 11, 0.1)"} ai="center" jc="center">
                    <IconSymbol size={20} name="house.fill" color={wishType === 'family' ? 'white' : '#FBBF24'} />
                  </View>
                  <Text
                    fontSize="$4"
                    fontWeight={wishType === 'family' ? '700' : '600'}
                    color={wishType === 'family' ? 'white' : '#FBBF24'}
                  >
                    家庭愿望
                  </Text>
                </YStack>
              </Button>
            </XStack>
          </YStack>

          <Button
            bg="linear-gradient(135deg, #10B981 0%, #059669 100%)"
            marginTop="$4"
            br="$6"
            py="$4"
            shadowColor="#10B981"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.4}
            shadowRadius={20}
            pressStyle={{ scale: 0.97 }}
            onPress={handleCreateWish}
            disabled={!newWishName.trim() || !newWishPoint || loading}
          >
            <Text color="white" fontWeight="700" fontSize="$5">{loading ? '保存中...' : '保存愿望'}</Text>
          </Button>
        </YStack>
      </ScrollView>
    </View>
  )
}