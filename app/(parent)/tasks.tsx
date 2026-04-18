// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Card, Switch, Input } from 'tamagui'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useStore } from '../../src/store'
import taskService from '../../src/services/db/taskService'
import type { Task } from '../../src/types'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

export default function TaskManagement() {
  const router = useRouter()
  const currentChild = useStore(state => state.currentChild)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const loadTasks = async () => {
    if (!currentChild) return
    try {
      setLoading(true)
      const taskList = await taskService.getActiveTasks(currentChild.id)
      setTasks(taskList)
    } catch (error) {
      console.error('加载任务失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [currentChild])

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.delete(taskId)
      await loadTasks()
    } catch (error) {
      console.error('删除任务失败:', error)
    }
  }

  const toggleTaskStatus = async (taskId: number, currentStatus: boolean) => {
    try {
      await taskService.update(taskId, { is_active: !currentStatus })
      await loadTasks()
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

  return (
    <View flex={1} bg={t.background}>
      <ScrollView flex={1} px="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$5">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color="white">共 {tasks.length} 个任务</Text>
            <Button
              size="$3"
              bg={t.bg.card}
              br="$10"
              bw={1}
              bc="rgba(139, 92, 246, 0.3)"
              shadowColor="#000000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
              shadowRadius={12}
              pressStyle={{ scale: 0.97, bg: 'rgba(255, 255, 255, 0.15)' }}
            >
              <XStack ai="center" gap="$2" px="$2">
                <IconSymbol size={16} name="line.3.horizontal.decrease.circle" color="#A5B4FC" />
                <Text fontSize="$3" fontWeight="600" color="#A5B4FC">筛选</Text>
              </XStack>
            </Button>
          </XStack>

          {tasks.length === 0 ? (
            <Card
              padding="$8"
              bg={t.bg.card}
              br="$6"
              bw={1}
              bc="rgba(139, 92, 246, 0.3)"
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
              <Text fontSize="$5" fontWeight="700" color="white">还没有任务</Text>
              <Text fontSize="$3" color="#A5B4FC" marginTop="$2">点击右上角添加任务</Text>
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
                  bc="rgba(139, 92, 246, 0.3)"
                  opacity={task.is_active ? 1 : 0.6}
                  shadowColor="#000000"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.2}
                  shadowRadius={12}
                  backdropFilter="blur(10px)"
                  pressStyle={{ scale: 0.98, bg: 'rgba(255, 255, 255, 0.08)' }}
                >
                  <XStack gap="$4" alignItems="center">
                    <View
                      width={52}
                      height={52}
                      borderRadius={26}
                      bg={`linear-gradient(135deg, ${getTypeColor(task.type)} 0%, ${getTypeColor(task.type)}DD 100%)`}
                      alignItems="center"
                      justifyContent="center"
                      shadowColor={getTypeColor(task.type)}
                      shadowOffset={{width:0, height:4}}
                      shadowOpacity={0.4}
                      shadowRadius={12}
                    >
                      <Text color="white" fontSize="$6">📋</Text>
                    </View>

                    <YStack flex={1} gap="$2">
                      <Text fontSize="$5" fontWeight="700" color={task.is_active ? 'white' : '#94A3B8'}>
                        {task.name}
                      </Text>
                      <XStack gap="$2">
                        <View bg={`${getTypeColor(task.type)}20`} px="$2" py="$0.5" br="$1">
                          <Text fontSize="$2" fontWeight="600" color={getTypeColor(task.type)}>
                            {getTypeLabel(task.type)}
                          </Text>
                        </View>
                        <View bg="rgba(139, 92, 246, 0.2)" px="$2" py="$0.5" br="$1">
                          <Text fontSize="$2" fontWeight="600" color="#C4B5FD">{task.point}分</Text>
                        </View>
                      </XStack>
                    </YStack>

                    <XStack gap="$2" alignItems="center">
                      <Switch
                        checked={task.is_active}
                        onCheckedChange={() => toggleTaskStatus(task.id, task.is_active)}
                        size="$4"
                        backgroundColor={task.is_active ? "#10B981" : "rgba(148, 163, 184, 0.3)"}
                        thumbColor="white"
                      />
                      <Button
                        size="$2"
                        bg="rgba(239, 68, 68, 0.2)"
                        br="$4"
                        px="$2"
                        pressStyle={{ scale: 0.9 }}
                        onPress={() => handleDeleteTask(task.id)}
                      >
                        <IconSymbol size={14} name="trash" color="#EF4444" />
                      </Button>
                    </XStack>
                  </XStack>
                </Card>
              ))}
            </YStack>
          )}

          <Button
            marginTop="$2"
            bg="rgba(255, 255, 255, 0.05)"
            br="$6"
            bw={1}
            bc="rgba(255, 255, 255, 0.1)"
            shadowColor="#000000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={12}
            backdropFilter="blur(10px)"
            pressStyle={{ scale: 0.98, bg: 'rgba(255, 255, 255, 0.08)' }}
            onPress={() => router.push('/task-templates')}
          >
            <XStack alignItems="center" gap="$3" py="$2">
              <View w={32} h={32} br={16} bg={t.brand.gradient} ai="center" jc="center" shadowColor="#8B5CF6" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                <IconSymbol size={16} name="plus" color="white" />
              </View>
              <Text color="#C4B5FD" fontSize="$4" fontWeight="600">从模板库添加任务</Text>
            </XStack>
          </Button>
        </YStack>
      </ScrollView>
    </View>
  )
}