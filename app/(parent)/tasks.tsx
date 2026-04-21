// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Card, Switch } from 'tamagui'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useStore } from '../../src/store'
import type { Task } from '../../src/types'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

export default function TaskManagement() {
  const router = useRouter()
  const currentChild = useStore(state => state.currentChild)
  const tasks = useStore(state => state.tasks)
  const loadTasks = useStore(state => state.loadTasks)
  const updateTask = useStore(state => state.updateTask)
  const deleteTask = useStore(state => state.deleteTask)

  useEffect(() => {
    if (currentChild) {
      loadTasks(currentChild.id)
    }
  }, [currentChild, loadTasks])

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('删除任务失败:', error)
    }
  }

  const toggleTaskStatus = async (taskId: number, currentStatus: boolean) => {
    try {
      await updateTask(taskId, { is_active: !currentStatus })
    } catch (error) {
      console.error('更新任务状态失败:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return '#2563EB'
      case 'weekly': return '#059669'
      default: return '#D97706'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return '每日'
      case 'weekly': return '每周'
      default: return '一次性'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'life': return '生活自理'
      case 'study': return '学习成长'
      case 'housework': return '家务劳动'
      case 'character': return '品格培养'
      default: return category
    }
  }

  return (
    <View flex={1} bg={t.background}>
      <View bg={t.backgroundGradient} padding="$4">
        <Text fontSize="$5" fontWeight="700" color={t.text.primary}>任务管理</Text>
      </View>

      <ScrollView flex={1} px="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$5">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color={t.text.primary}>共 {tasks.length} 个任务</Text>
            <Button
              size="$4"
              bg={t.bg.card}
              br="$10"
              bw={1}
              bc={t.border.primary}
              shadowColor="#000000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
              shadowRadius={12}
              pressStyle={{ scale: 0.97, bg: 'rgba(139, 92, 246, 0.1)' }}
            >
              <XStack ai="center" gap="$2" px="$4">
                <IconSymbol size={18} name="line.3.horizontal.decrease.circle" color={t.text.secondary} />
                <Text fontSize="$4" fontWeight="600" color={t.text.primary}>筛选</Text>
              </XStack>
            </Button>
          </XStack>

          {tasks.length === 0 ? (
            <Card
              padding="$8"
              bg={t.bg.card}
              br="$6"
              bw={1}
              bc={t.border.primary}
              shadowColor="#000000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
              shadowRadius={12}
              backdropFilter="blur(10px)"
              alignItems="center"
            >
              <View width={72} height={72} borderRadius={36} bg={t.brand.gradient} alignItems="center" justifyContent="center" marginBottom="$4" shadowColor="#8B5CF6" shadowOffset={{width:0, height:4}} shadowOpacity={0.4} shadowRadius={12}>
                <IconSymbol size={32} name="doc.text" color="white" />
              </View>
              <Text fontSize="$5" fontWeight="700" color={t.text.primary}>还没有任务</Text>
              <Text fontSize="$3" color={t.text.secondary} marginTop="$2">点击右上角"+"创建任务</Text>
            </Card>
          ) : (
            <YStack gap="$3">
              {tasks.map(task => (
                <Card
                  key={task.id}
                  padding="$5"
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc={t.border.primary}
                  opacity={task.is_active ? 1 : 0.6}
                  shadowColor="#000000"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.2}
                  shadowRadius={12}
                  backdropFilter="blur(10px)"
                  pressStyle={{ scale: 0.98, bg: 'rgba(139, 92, 246, 0.1)' }}
                >
                  <XStack gap="$4" alignItems="center">
                    <View
                      width={56}
                      height={56}
                      borderRadius={28}
                      bg={`linear-gradient(135deg, ${getTypeColor(task.type)} 0%, ${getTypeColor(task.type)}DD 100%)`}
                      alignItems="center"
                      justifyContent="center"
                      shadowColor={getTypeColor(task.type)}
                      shadowOffset={{width:0, height:4}}
                      shadowOpacity={0.4}
                      shadowRadius={12}
                    >
                      <Text color="white" fontSize="$7">📋</Text>
                    </View>

                    <YStack flex={1} gap="$2">
                      <Text fontSize="$5" fontWeight="700" color={task.is_active ? t.text.primary : t.text.muted}>
                        {task.name}
                      </Text>
                      <XStack gap="$2" flexWrap="wrap">
                        <View bg={`${getTypeColor(task.type)}20`} px="$3" py="$1" br="$2">
                          <Text fontSize="$3" fontWeight="600" color={getTypeColor(task.type)}>
                            {getTypeLabel(task.type)}
                          </Text>
                        </View>
                        <View bg="rgba(139, 92, 246, 0.2)" px="$3" py="$1" br="$2">
                          <Text fontSize="$3" fontWeight="600" color="#C4B5FD">{task.point}分</Text>
                        </View>
                        <View bg="rgba(16, 185, 129, 0.2)" px="$3" py="$1" br="$2">
                          <Text fontSize="$3" fontWeight="600" color="#34D399">{getCategoryLabel(task.category)}</Text>
                        </View>
                      </XStack>
                    </YStack>

                    <XStack gap="$3" alignItems="center">
                      <Switch
                        value={task.is_active}
                        onValueChange={() => toggleTaskStatus(task.id, task.is_active)}
                        size="$5"
                        bg={task.is_active ? "#10B981" : "#4B5563"}
                        borderColor={task.is_active ? "#10B981" : "#6B7280"}
                        borderRadius={20}
                        p={1}
                        style={{
                          minWidth: 52,
                          height: 28,
                        }}
                      >
                        <View
                          bg="white"
                          br={12}
                          w={24}
                          h={24}
                          shadowColor="#000"
                          shadowOffset={{ width: 0, height: 2 }}
                          shadowOpacity={0.2}
                          shadowRadius={2}
                        />
                      </Switch>
                      <Button
                        size="$3"
                        bg="rgba(239, 68, 68, 0.2)"
                        br="$6"
                        px="$3"
                        py="$2"
                        pressStyle={{ scale: 0.9 }}
                        onPress={() => handleDeleteTask(task.id)}
                      >
                        <IconSymbol size={18} name="trash" color="#EF4444" />
                      </Button>
                    </XStack>
                  </XStack>
                </Card>
              ))}
            </YStack>
          )}

          <Button
            size="$4"
            marginTop="$2"
            bg={t.bg.card}
            br="$6"
            bw={1}
            bc={t.border.primary}
            shadowColor="#000000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={12}
            backdropFilter="blur(10px)"
            pressStyle={{ scale: 0.98, bg: 'rgba(139, 92, 246, 0.1)' }}
            onPress={() => router.push('/task-templates')}
          >
            <XStack alignItems="center" gap="$3">
              <View w={36} h={36} br={18} bg={t.brand.gradient} ai="center" jc="center" shadowColor="#8B5CF6" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                <IconSymbol size={18} name="plus" color="white" />
              </View>
              <Text color={t.text.primary} fontSize="$4" fontWeight="600">从模板库添加任务</Text>
            </XStack>
          </Button>
        </YStack>
      </ScrollView>
    </View>
  )
}