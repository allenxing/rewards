// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Tabs, Card, Dialog, Button } from 'tamagui'
import { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import type { Task } from '../../../src/types'
import { useStore } from '../../../src/store'
import taskService from '../../../src/services/db/taskService'
import { IconSymbol } from '@/components/ui/icon-symbol'

export default function TaskHall() {
  const currentChild = useStore(state => state.currentChild)
  const loadTotalPoints = useStore(state => state.loadTotalPoints)
  
  const [activeTab, setActiveTab] = useState('daily')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [submitPhoto, setSubmitPhoto] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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

  const dailyTasks = tasks.filter(t => t.type === 'daily')
  const challengeTasks = tasks.filter(t => t.type === 'weekly' || t.type === 'one_time')
  const currentTasks = activeTab === 'daily' ? dailyTasks : challengeTasks

  const saveSubmitPhoto = async (uri: string): Promise<string> => {
    if (!uri) return ''
    
    const fileName = `task_${Date.now()}.jpg`
    const destPath = `${FileSystem.documentDirectory}${fileName}`
    
    try {
      await FileSystem.copyAsync({ from: uri, to: destPath })
      return fileName
    } catch (error) {
      console.error('保存照片失败:', error)
      return ''
    }
  }

  const pickPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setSubmitPhoto(result.assets[0].uri)
    }
  }

  const handleSubmitTask = async () => {
    if (!selectedTask || !currentChild) return
    
    try {
      setSubmitting(true)
      
      let photoFileName = ''
      if (submitPhoto) {
        photoFileName = await saveSubmitPhoto(submitPhoto)
      }
      
      // Submit task
      await taskService.submitTask(selectedTask.id, currentChild.id, photoFileName)
      
      // If auto_approve, add points immediately
      if (selectedTask.auto_approve) {
        const addPoints = useStore.getState().addPoints
        await addPoints(currentChild.id, selectedTask.point, `完成任务: ${selectedTask.name}`)
        await loadTotalPoints(currentChild.id)
      }
      
      setShowSubmitDialog(false)
      setSelectedTask(null)
      setSubmitPhoto(null)
      
      alert(selectedTask.auto_approve ? `任务完成！+${selectedTask.point}积分已到账！` : '已提交，等待家长审核！')
      
      // Reload tasks
      await loadTasks()
    } catch (error) {
      console.error('提交任务失败:', error)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View flex={1} backgroundColor="#FFF1F2">
      <YStack padding="$4" paddingTop="$6">
        <Text fontSize="$6" fontWeight="700" color="#881337">任务大厅</Text>
        <Text fontSize="$3" color="#881337" opacity={0.6} marginTop="$1">完成的任务越多，积分越高！</Text>
      </YStack>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        paddingHorizontal="$4"
        paddingTop="$3"
      >
        <Tabs.List backgroundColor="#FECDD3" borderRadius="$borderRadiusLg" padding="$1">
          <Tabs.Tab
            value="daily"
            flex={1}
            backgroundColor={activeTab === 'daily' ? '#E11D48' : 'transparent'}
            borderRadius="$borderRadiusMd"
          >
            <Text
              fontSize="$3"
              fontWeight={activeTab === 'daily' ? '600' : '500'}
              color={activeTab === 'daily' ? 'white' : '#881337'}
            >
              每日必做
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            value="challenge"
            flex={1}
            backgroundColor={activeTab === 'challenge' ? '#E11D48' : 'transparent'}
            borderRadius="$borderRadiusMd"
          >
            <Text
              fontSize="$3"
              fontWeight={activeTab === 'challenge' ? '600' : '500'}
              color={activeTab === 'challenge' ? 'white' : '#881337'}
            >
              额外挑战
            </Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <ScrollView flex={1} padding="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        {currentTasks.length === 0 ? (
          <Card
            padding="$8"
            backgroundColor="white"
            borderRadius="$borderRadiusLg"
            alignItems="center"
            marginTop="$4"
          >
            <View width={64} height={64} borderRadius={32} backgroundColor="#ECFDF5" alignItems="center" justifyContent="center" marginBottom="$3">
              <IconSymbol size={32} name="checkmark.circle.fill" color="#059669" />
            </View>
            <Text fontSize="$5" fontWeight="600" color="#881337">今天的任务都消灭啦！</Text>
            <Text fontSize="$3" color="#881337" opacity={0.6} marginTop="$2" textAlign="center">
              你太棒了！去看看有没有新的挑战任务吧~
            </Text>
          </Card>
        ) : (
          <View flexDirection="row" flexWrap="wrap" gap="$3">
            {currentTasks.map(task => (
              <Card
                key={task.id}
                width="47%"
                padding="$4"
                backgroundColor="white"
                borderRadius="$borderRadiusLg"
                borderWidth={task.type === 'weekly' ? 2 : 1}
                borderColor={task.type === 'weekly' ? '#E11D48' : '#FECDD3'}
                shadowColor="#881337"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.06}
                shadowRadius={8}
                onPress={() => {
                  setSelectedTask(task)
                  setShowSubmitDialog(true)
                }}
              >
                <YStack alignItems="center" gap="$2">
                  <View
                    width={56}
                    height={56}
                    borderRadius={28}
                    backgroundColor={task.type === 'weekly' ? '#FEE2E2' : '#FFF1F2'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconSymbol size={28} name="checklist" color="#E11D48" />
                  </View>
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color="#881337"
                    textAlign="center"
                  >
                    {task.name}
                  </Text>
                  <View backgroundColor="#FEF3C7" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$1">
                    <Text fontSize="$3" fontWeight="700" color="#D97706">
                      +{task.point}
                    </Text>
                  </View>
                  {task.require_photo && (
                    <View flexDirection="row" alignItems="center" gap="$1">
                      <IconSymbol size={12} name="camera" color="#881337" />
                      <Text fontSize="$2" color="#881337" opacity={0.6}>需拍照</Text>
                    </View>
                  )}
                  {task.auto_approve && (
                    <View backgroundColor="#ECFDF5" paddingHorizontal="$2" paddingVertical="$0.5" borderRadius="$1">
                      <Text fontSize="$1.5" color="#059669">自动通过</Text>
                    </View>
                  )}
                </YStack>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <Dialog.Portal>
          <Dialog.Overlay backgroundColor="rgba(136, 19, 55, 0.5)" />
          <Dialog.Content
            backgroundColor="white"
            borderRadius="$borderRadiusXL"
            padding="$5"
            borderWidth={2}
            borderColor="#E11D48"
          >
            {selectedTask && (
              <YStack gap="$4">
                <XStack alignItems="center" gap="$3">
                  <View
                    width={56}
                    height={56}
                    borderRadius={28}
                    backgroundColor="#FFF1F2"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconSymbol size={28} name="checklist" color="#E11D48" />
                  </View>
                  <YStack>
                    <Text fontSize="$5" fontWeight="600" color="#881337">
                      {selectedTask.name}
                    </Text>
                    <View backgroundColor="#FEF3C7" paddingHorizontal="$2" paddingVertical="$0.5" borderRadius="$1" alignSelf="flex-start">
                      <Text fontSize="$3" fontWeight="600" color="#D97706">
                        +{selectedTask.point} 分
                      </Text>
                    </View>
                  </YStack>
                </XStack>

                <Text fontSize="$4" color="#881337" fontWeight="500" textAlign="center">
                  你已经完成这个任务了吗？
                </Text>

                {selectedTask.require_photo && (
                  <YStack gap="$2">
                    <Text fontSize="$3" color="#881337" opacity={0.7}>
                      请上传完成照片：
                    </Text>
                    <View
                      width="100%"
                      height={180}
                      borderRadius="$borderRadiusLg"
                      backgroundColor="#FFF1F2"
                      overflow="hidden"
                      onPress={pickPhoto}
                    >
                      {submitPhoto ? (
                        <Image
                          source={{ uri: submitPhoto }}
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        <YStack flex={1} justifyContent="center" alignItems="center" gap="$2">
                          <IconSymbol size={36} name="camera" color="#E11D48" />
                          <Text fontSize="$3" color="#E11D48">点击拍照</Text>
                        </YStack>
                      )}
                    </View>
                  </YStack>
                )}

                <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
                  <Button
                    backgroundColor="#FECDD3"
                    borderRadius="$borderRadiusLg"
                    onPress={() => setShowSubmitDialog(false)}
                  >
                    <Text color="#881337" fontWeight="600">还没</Text>
                  </Button>
                  <Button
                    backgroundColor="#059669"
                    borderRadius="$borderRadiusLg"
                    onPress={handleSubmitTask}
                    disabled={selectedTask.require_photo && !submitPhoto || submitting}
                  >
                    <Text color="white" fontWeight="600">{submitting ? '提交中...' : '确定提交'}</Text>
                  </Button>
                </XStack>
              </YStack>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
}