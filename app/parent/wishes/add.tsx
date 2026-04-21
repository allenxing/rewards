// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Input } from 'tamagui'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useStore } from '../../../src/store'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, Switch } from 'react-native'

const BACKGROUND_COLOR = '#0F172A'
const CARD_COLOR = '#1E293B'
const BORDER_COLOR = '#334155'
const TEXT_COLOR = '#FFFFFF'
const PLACEHOLDER_COLOR = '#94A3B8'
const PRIMARY_COLOR = '#8B5CF6'

export default function AddWish() {
  const currentChild = useStore(state => state.currentChild)
  const addWish = useStore(state => state.addWish)
  const [loading, setLoading] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const [newWishName, setNewWishName] = useState('')
  const [newWishPoint, setNewWishPoint] = useState('')
  const [newWishImage, setNewWishImage] = useState<string | null>(null)
  const [wishType, setWishType] = useState<'personal' | 'family'>('personal')
  const [isMainGoal, setIsMainGoal] = useState(false)

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true)
    })
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

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
    if (!currentChild) {
      alert('请先选择一个孩子')
      return
    }
    
    if (!newWishName.trim()) {
      alert('请输入愿望名称')
      return
    }
    
    const points = Number(newWishPoint)
    if (!newWishPoint || isNaN(points) || points <= 0) {
      alert('请输入有效的积分数量（大于0）')
      return
    }
    
    if (points > 99999) {
      alert('积分数量不能超过99999')
      return
    }
    
    try {
      setLoading(true)
      
      let imageFileName = ''
      if (newWishImage) {
        imageFileName = await saveWishImage(newWishImage)
      }
      
      const wishData = {
        name: newWishName.trim(),
        image: imageFileName || undefined,
        target_point: points,
        type: wishType,
        child_id: currentChild.id,
        status: 'active',
        is_main_goal: isMainGoal
      }
      
      await addWish(wishData)
      
      alert('愿望创建成功！')
      router.back()
    } catch (error) {
      console.error('创建愿望失败:', error)
      alert('创建愿望失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handlePointChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '')
    const num = parseInt(numericText, 10)
    if (num <= 99999 || text === '') {
      setNewWishPoint(numericText)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: keyboardOpen ? 200 : 60,
            flexGrow: 1 
          }}
        >
          <YStack style={{ gap: 24, flex: 1 }}>
            <YStack style={{ alignItems: 'center', gap: 16 }}>
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 24,
                  backgroundColor: CARD_COLOR,
                  borderWidth: 1,
                  borderColor: BORDER_COLOR,
                  overflow: 'hidden',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                }}
                onPress={pickImage}
              >
                {newWishImage ? (
                  <Image
                    source={{ uri: newWishImage }}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <YStack style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(139, 92, 246, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                      <IconSymbol size={28} name="camera" color="#C4B5FD" />
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#A5B4FC' }}>点击上传</Text>
                  </YStack>
                )}
              </View>
              <Text style={{ fontSize: 14, color: '#A5B4FC', fontWeight: '500' }}>点击上传愿望图片（可选）</Text>
            </YStack>

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>愿望名称</Text>
              <Input
                placeholder="如：迪士尼乐园一日游"
                value={newWishName}
                onChangeText={setNewWishName}
                style={{
                  backgroundColor: CARD_COLOR,
                  borderColor: BORDER_COLOR,
                  borderWidth: 1,
                  borderRadius: 16,
                  height: 56,
                  fontSize: 18,
                  color: TEXT_COLOR,
                }}
                placeholderTextColor={PLACEHOLDER_COLOR}
                maxLength={50}
                returnKeyType="next"
                autoCapitalize="sentences"
                selectionColor={PRIMARY_COLOR}
                caretColor={TEXT_COLOR}
              />
            </YStack>

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>需要积分</Text>
              <Input
                placeholder="如：500"
                value={newWishPoint}
                onChangeText={handlePointChange}
                keyboardType="numeric"
                style={{
                  backgroundColor: CARD_COLOR,
                  borderColor: BORDER_COLOR,
                  borderWidth: 1,
                  borderRadius: 16,
                  height: 56,
                  fontSize: 18,
                  color: TEXT_COLOR,
                }}
                placeholderTextColor={PLACEHOLDER_COLOR}
                maxLength={5}
                returnKeyType="done"
                selectionColor={PRIMARY_COLOR}
                caretColor={TEXT_COLOR}
              />
            </YStack>

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>愿望类型</Text>
              <XStack style={{ gap: 16 }}>
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: wishType === 'personal' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderRadius: 24,
                  }}
                  onPress={() => setWishType('personal')}
                >
                   <Text style={{ fontSize: 16, fontWeight: wishType === 'personal' ? '700' : '600', color: wishType === 'personal' ? TEXT_COLOR : '#FBBF24' }}>
                      个人愿望
                    </Text>
                </Button>
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: wishType === 'family' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : CARD_COLOR,
                    borderRadius: 24,
                  }}
                  onPress={() => setWishType('family')}
                >
                    <Text style={{ fontSize: 16, fontWeight: wishType === 'family' ? '700' : '600', color: wishType === 'family' ? TEXT_COLOR : '#FBBF24' }}>
                      家庭愿望
                    </Text>
                </Button>
              </XStack>
            </YStack>

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>设为主目标</Text>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Switch 
                  value={isMainGoal}
                  onValueChange={setIsMainGoal}
                  trackColor={{ false: '#4B5563', true: '#8B5CF6' }}
                  thumbColor={isMainGoal ? TEXT_COLOR : '#94A3B8'}
                />
                <Text style={{ fontSize: 18, fontWeight: '500', color: TEXT_COLOR }}>
                  {isMainGoal ? '已设为主目标' : '设为主目标'}
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: '#A5B4FC' }}>设置为主目标后，将成为孩子的主要挑战目标</Text>
            </YStack>

            <View style={{ marginBottom: keyboardOpen ? 100 : 20 }}>
              <Button
                style={{
                  backgroundColor: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: 24,
                  height: 56,
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                }}
                onPress={handleCreateWish}
                disabled={!newWishName.trim() || !newWishPoint || loading}
              >
                <Text style={{ color: TEXT_COLOR, fontWeight: '700', fontSize: 18 }}>{loading ? '保存中...' : '保存愿望'}</Text>
              </Button>
            </View>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}