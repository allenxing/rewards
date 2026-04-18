// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Switch, Input } from 'tamagui'
import { useState } from 'react'
import { router } from 'expo-router'
import { useStore } from '../../../src/store'
import taskService from '../../../src/services/db/taskService'
import { themeStyles } from '../../../src/utils/theme'

const t = themeStyles.parent

export default function AddTask() {
  const currentChild = useStore(state => state.currentChild)
  const [loading, setLoading] = useState(false)

  const [taskName, setTaskName] = useState('')
  const [taskPoint, setTaskPoint] = useState('')
  const [taskType, setTaskType] = useState<'daily' | 'weekly' | 'one_time'>('daily')
  const [taskCategory, setTaskCategory] = useState<'life' | 'study' | 'housework' | 'character'>('life')
  const [requirePhoto, setRequirePhoto] = useState(false)
  const [autoApprove, setAutoApprove] = useState(false)

  const handleCreateTask = async () => {
    if (!taskName.trim() || !taskPoint || !currentChild) return
    
    try {
      setLoading(true)
      await taskService.create({
        name: taskName.trim(),
        icon: 'star.fill',
        point: Number(taskPoint),
        type: taskType,
        category: taskCategory,
        age_group: 'all',
        require_photo: requirePhoto,
        auto_approve: autoApprove,
        is_active: true,
        child_id: currentChild.id
      })
      
      router.back()
    } catch (error) {
      console.error('创建任务失败:', error)
      alert('创建任务失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View flex={1} bg={t.background}>
      <ScrollView flex={1} px="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$6">
          <Text fontSize="$6" fontWeight="700" color="white">新建任务</Text>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="white">任务名称</Text>
            <Input
              placeholder="如：整理床铺"
              value={taskName}
              onChangeText={setTaskName}
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
            <Text fontSize="$4" fontWeight="600" color="white">任务分值 (1-100分)</Text>
            <Input
              placeholder="输入分值"
              value={taskPoint}
              onChangeText={setTaskPoint}
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
            <Text fontSize="$4" fontWeight="600" color="white">任务类型</Text>
            <XStack gap="$3">
              <Button
                size="$4"
                flex={1}
                bg={taskType === 'daily' ? t.brand.gradient : t.bg.card}
                br="$4"
                shadowColor={taskType === 'daily' ? "#8B5CF6" : "transparent"}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={12}
                pressStyle={{ scale: 0.97 }}
                onPress={() => setTaskType('daily')}
              >
                <Text color="white" fontWeight="600" fontSize="$4">每日</Text>
              </Button>
              <Button
                size="$4"
                flex={1}
                bg={taskType === 'weekly' ? t.brand.gradient : t.bg.card}
                bw={1}
                bc="rgba(139, 92, 246, 0.3)"
                br="$4"
                pressStyle={{ scale: 0.97 }}
                onPress={() => setTaskType('weekly')}
              >
                <Text color="#CBD5E1" fontWeight="600" fontSize="$4">每周</Text>
              </Button>
              <Button
                size="$4"
                flex={1}
                bg={taskType === 'one_time' ? t.brand.gradient : t.bg.card}
                bw={1}
                bc="rgba(139, 92, 246, 0.3)"
                br="$4"
                pressStyle={{ scale: 0.97 }}
                onPress={() => setTaskType('one_time')}
              >
                <Text color="#CBD5E1" fontWeight="600" fontSize="$4">一次性</Text>
              </Button>
            </XStack>
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="white">任务分类</Text>
            <XStack gap="$3" flexWrap="wrap">
              <Button
                size="$3"
                bg={taskCategory === 'life' ? t.brand.gradient : t.bg.card}
                br="$4"
                shadowColor={taskCategory === 'life' ? "#8B5CF6" : "transparent"}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={12}
                pressStyle={{ scale: 0.97 }}
                onPress={() => setTaskCategory('life')}
              >
                <Text color="white" fontSize="$3" fontWeight="600">生活自理</Text>
              </Button>
              <Button
                size="$3"
                bg={taskCategory === 'study' ? t.brand.gradient : t.bg.card}
                bw={1}
                bc="rgba(139, 92, 246, 0.3)"
                br="$4"
                pressStyle={{ scale: 0.97 }}
                onPress={() => setTaskCategory('study')}
              >
                <Text color="#CBD5E1" fontSize="$3" fontWeight="600">学习成长</Text>
              </Button>
              <Button
                size="$3"
                bg={taskCategory === 'housework' ? t.brand.gradient : t.bg.card}
                bw={1}
                bc="rgba(139, 92, 246, 0.3)"
                br="$4"
                pressStyle={{ scale: 0.97 }}
                onPress={() => setTaskCategory('housework')}
              >
                <Text color="#CBD5E1" fontSize="$3" fontWeight="600">家务劳动</Text>
              </Button>
              <Button
                size="$3"
                bg={taskCategory === 'character' ? t.brand.gradient : t.bg.card}
                bw={1}
                bc="rgba(139, 92, 246, 0.3)"
                br="$4"
                pressStyle={{ scale: 0.97 }}
                onPress={() => setTaskCategory('character')}
              >
                <Text color="#CBD5E1" fontSize="$3" fontWeight="600">品格培养</Text>
              </Button>
            </XStack>
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="white">高级选项</Text>
            <XStack gap="$6">
              <XStack gap="$3" alignItems="center">
                <Switch 
                  checked={requirePhoto} 
                  onCheckedChange={setRequirePhoto}
                  size="$4" 
                  backgroundColor={requirePhoto ? "rgba(16, 185, 129, 0.8)" : "rgba(148, 163, 184, 0.3)"} 
                  thumbColor="white" 
                />
                <Text fontSize="$4" fontWeight="500" color="white">需拍照证明</Text>
              </XStack>
              <XStack gap="$3" alignItems="center">
                <Switch 
                  checked={autoApprove} 
                  onCheckedChange={setAutoApprove}
                  size="$4" 
                  backgroundColor={autoApprove ? "rgba(139, 92, 246, 0.8)" : "rgba(148, 163, 184, 0.3)"} 
                  thumbColor="white" 
                />
                <Text fontSize="$4" fontWeight="500" color="white">自动通过</Text>
              </XStack>
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
            onPress={handleCreateTask}
            disabled={!taskName.trim() || !taskPoint || loading}
          >
            <Text color="white" fontWeight="700" fontSize="$5">{loading ? '保存中...' : '保存任务'}</Text>
          </Button>
        </YStack>
      </ScrollView>
    </View>
  )
}