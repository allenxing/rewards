// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Input } from 'tamagui'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { useStore } from '../../../src/store'
import { KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, Switch } from 'react-native'

const BACKGROUND_COLOR = '#0F172A'
const CARD_COLOR = '#1E293B'
const BORDER_COLOR = '#334155'
const TEXT_COLOR = '#FFFFFF'
const PLACEHOLDER_COLOR = '#94A3B8'
const PRIMARY_COLOR = '#8B5CF6'

export default function AddTask() {
  const currentChild = useStore(state => state.currentChild)
  const createTask = useStore(state => state.createTask)
  const [loading, setLoading] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const [taskName, setTaskName] = useState('')
  const [taskPoint, setTaskPoint] = useState('')
  const [taskType, setTaskType] = useState<'daily' | 'weekly' | 'one_time'>('daily')
  const [taskCategory, setTaskCategory] = useState<'life' | 'study' | 'housework' | 'character'>('life')
  const [requirePhoto, setRequirePhoto] = useState(false)
  const [autoApprove, setAutoApprove] = useState(false)

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

  const handleCreateTask = async () => {
    if (!currentChild) {
      alert('请先选择一个孩子')
      return
    }
    
    if (!taskName.trim()) {
      alert('请输入任务名称')
      return
    }
    
    const points = Number(taskPoint)
    if (!taskPoint || isNaN(points) || points <= 0 || points > 100) {
      alert('请输入有效的分值（1-100）')
      return
    }
    
    try {
      setLoading(true)
      await createTask({
        name: taskName.trim(),
        icon: 'star.fill',
        point: points,
        type: taskType,
        category: taskCategory,
        age_group: 'all',
        require_photo: requirePhoto,
        auto_approve: autoApprove,
        is_active: true,
        child_id: currentChild.id
      })
      
      alert('任务创建成功！')
      router.back()
    } catch (error) {
      console.error('创建任务失败:', error)
      alert('创建任务失败')
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (text: string) => {
    setTaskName(text)
  }

  const handlePointChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '')
    const num = parseInt(numericText, 10)
    if (num <= 100 || text === '') {
      setTaskPoint(numericText)
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

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>任务名称</Text>
              <Input
                placeholder="如：整理床铺"
                value={taskName}
                onChangeText={handleNameChange}
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
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>任务分值 (1-100分)</Text>
              <Input
                placeholder="输入分值"
                value={taskPoint}
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
                maxLength={3}
                returnKeyType="done"
                selectionColor={PRIMARY_COLOR}
                caretColor={TEXT_COLOR}
              />
            </YStack>

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>任务类型</Text>
              <XStack style={{ gap: 12 }}>
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: taskType === 'daily' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderRadius: 16,
                  }}
                  onPress={() => setTaskType('daily')}
                >
                  <Text style={{ color: taskType === 'daily' ? TEXT_COLOR : PLACEHOLDER_COLOR, fontWeight: '600', fontSize: 16 }}>每日</Text>
                </Button>
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: taskType === 'weekly' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderColor: BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 16,
                  }}
                  onPress={() => setTaskType('weekly')}
                >
                  <Text style={{ color: taskType === 'weekly' ? TEXT_COLOR : PLACEHOLDER_COLOR, fontWeight: '600', fontSize: 16 }}>每周</Text>
                </Button>
                <Button
                  style={{
                    flex: 1,
                    backgroundColor: taskType === 'one_time' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderColor: BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 16,
                  }}
                  onPress={() => setTaskType('one_time')}
                >
                  <Text style={{ color: taskType === 'one_time' ? TEXT_COLOR : PLACEHOLDER_COLOR, fontWeight: '600', fontSize: 16 }}>一次性</Text>
                </Button>
              </XStack>
            </YStack>

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>任务分类</Text>
              <XStack style={{ gap: 12, flexWrap: 'wrap' }}>
                <Button
                  style={{
                    backgroundColor: taskCategory === 'life' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderRadius: 16,
                    paddingHorizontal: 20,
                  }}
                  onPress={() => setTaskCategory('life')}
                >
                  <Text style={{ color: taskCategory === 'life' ? TEXT_COLOR : PLACEHOLDER_COLOR, fontWeight: '600', fontSize: 16 }}>生活自理</Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: taskCategory === 'study' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderColor: BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 16,
                    paddingHorizontal: 20,
                  }}
                  onPress={() => setTaskCategory('study')}
                >
                  <Text style={{ color: taskCategory === 'study' ? TEXT_COLOR : PLACEHOLDER_COLOR, fontWeight: '600', fontSize: 16 }}>学习成长</Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: taskCategory === 'housework' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderColor: BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 16,
                    paddingHorizontal: 20,
                  }}
                  onPress={() => setTaskCategory('housework')}
                >
                  <Text style={{ color: taskCategory === 'housework' ? TEXT_COLOR : PLACEHOLDER_COLOR, fontWeight: '600', fontSize: 16 }}>家务劳动</Text>
                </Button>
                <Button
                  style={{
                    backgroundColor: taskCategory === 'character' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : CARD_COLOR,
                    borderColor: BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 16,
                    paddingHorizontal: 20,
                  }}
                  onPress={() => setTaskCategory('character')}
                >
                  <Text style={{ color: taskCategory === 'character' ? TEXT_COLOR : PLACEHOLDER_COLOR, fontWeight: '600', fontSize: 16 }}>品格培养</Text>
                </Button>
              </XStack>
            </YStack>

            <YStack style={{ gap: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_COLOR }}>高级选项</Text>
              <XStack style={{ gap: 24, flexWrap: 'wrap' }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Switch 
                    value={requirePhoto}
                    onValueChange={setRequirePhoto}
                    trackColor={{ false: '#4B5563', true: '#10B981' }}
                    thumbColor={requirePhoto ? '#FFFFFF' : '#94A3B8'}
                  />
                  <Text style={{ fontSize: 18, fontWeight: '500', color: TEXT_COLOR }}>需拍照证明</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Switch 
                    value={autoApprove}
                    onValueChange={setAutoApprove}
                    trackColor={{ false: '#4B5563', true: '#8B5CF6' }}
                    thumbColor={autoApprove ? '#FFFFFF' : '#94A3B8'}
                  />
                  <Text style={{ fontSize: 18, fontWeight: '500', color: TEXT_COLOR }}>自动通过</Text>
                </View>
              </XStack>
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
                onPress={handleCreateTask}
                disabled={!taskName.trim() || !taskPoint || loading}
              >
                <Text style={{ color: TEXT_COLOR, fontWeight: '700', fontSize: 18 }}>{loading ? '保存中...' : '保存任务'}</Text>
              </Button>
            </View>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}