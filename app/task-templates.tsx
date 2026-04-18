// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Tabs, Card, Checkbox } from 'tamagui'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useStore } from '../src/store'
import taskService from '../src/services/db/taskService'
import { TASK_TEMPLATES, AGE_GROUP_LABELS, CATEGORY_LABELS } from '../src/utils/constants'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../src/utils/theme'

const t = themeStyles.parent

interface TemplateTask {
  name: string
  icon: string
  point: number
  type: string
  category: string
}

export default function TaskTemplates() {
  const currentChild = useStore(state => state.currentChild)
  const router = useRouter()
  
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('3-6')
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const templates = TASK_TEMPLATES[selectedAgeGroup as keyof typeof TASK_TEMPLATES] || []

  const toggleTemplate = (index: number) => {
    setSelectedTemplates(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleAddTemplates = async () => {
    if (!currentChild || selectedTemplates.length === 0) return
    
    try {
      setLoading(true)
      
      for (const index of selectedTemplates) {
        const template = templates[index]
        await taskService.create({
          name: template.name,
          icon: template.icon,
          point: template.point,
          type: template.type,
          category: template.category,
          age_group: selectedAgeGroup,
          require_photo: false,
          auto_approve: false,
          is_active: true,
          child_id: currentChild.id
        })
      }
      
      alert(`成功添加 ${selectedTemplates.length} 个任务！`)
      router.back()
    } catch (error) {
      console.error('添加任务失败:', error)
      alert('添加失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'life': '#2563EB',
      'study': '#059669',
      'housework': '#D97706',
      'character': '#8B5CF6'
    }
    return colors[category] || '#64748B'
  }

  return (
    <View flex={1} bg={t.background}>
      <View bg={t.backgroundGradient} padding="$4">
        <YStack gap="$3" mb="$4">
          <Text fontSize="$6" fontWeight="700" color="white">任务模板库</Text>
          <Text fontSize="$3" color="#A5B4FC">选择年龄段，一键添加预设任务</Text>
        </YStack>

        <XStack gap="$3">
          {Object.entries(AGE_GROUP_LABELS).map(([key, label]) => (
            <Button
              key={key}
              flex={1}
              bg={selectedAgeGroup === key ? t.brand.gradient : t.bg.card}
              borderWidth={1}
              borderColor={selectedAgeGroup === key ? 'transparent' : 'rgba(139, 92, 246, 0.3)'}
              borderRadius="$4"
              paddingVertical="$3"
              pressStyle={{ scale: 0.95 }}
              onPress={() => {
                setSelectedAgeGroup(key)
                setSelectedTemplates([])
              }}
            >
              <Text 
                fontSize="$3" 
                fontWeight={selectedAgeGroup === key ? '600' : '400'}
                color={selectedAgeGroup === key ? 'white' : '#A5B4FC'}
              >
                {label}
              </Text>
            </Button>
          ))}
        </XStack>
      </View>

      <ScrollView flex={1} px="$4" py="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color="white">
              可添加任务 ({selectedTemplates.length}个)
            </Text>
            {selectedTemplates.length > 0 && (
              <Button
                bg="#10B981"
                borderRadius="$4"
                paddingHorizontal="$4"
                paddingVertical="$2"
                onPress={handleAddTemplates}
                disabled={loading}
              >
                <Text color="white" fontWeight="600" fontSize="$3">
                  {loading ? '添加中...' : `一键添加`}
                </Text>
              </Button>
            )}
          </XStack>

          <YStack gap="$3">
            {templates.map((template, index) => (
              <Card
                key={index}
                padding="$4"
                bg={t.bg.card}
                borderRadius="$4"
                borderWidth={selectedTemplates.includes(index) ? 2 : 1}
                borderColor={selectedTemplates.includes(index) ? '#8B5CF6' : 'rgba(139, 92, 246, 0.3)'}
                pressStyle={{ scale: 0.98 }}
                onPress={() => toggleTemplate(index)}
              >
                <XStack alignItems="center" gap="$3">
                  <Checkbox 
                    checked={selectedTemplates.includes(index)} 
                    onChange={() => toggleTemplate(index)}
                    backgroundColor={selectedTemplates.includes(index) ? '#8B5CF6' : 'transparent'}
                    borderColor={selectedTemplates.includes(index) ? '#8B5CF6' : '#94A3B8'}
                  >
                    <Checkbox.Indicator>
                      <IconSymbol size={14} name="checkmark" color="white" />
                    </Checkbox.Indicator>
                  </Checkbox>
                  
                  <View 
                    width={44} 
                    height={44} 
                    borderRadius={22} 
                    bg={getCategoryColor(template.category) + '20'}
                    justifyContent="center" 
                    alignItems="center"
                  >
                    <Text fontSize="$5">{template.icon}</Text>
                  </View>
                  
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$4" fontWeight="600" color="white">{template.name}</Text>
                    <XStack gap="$2">
                      <View bg={getCategoryColor(template.category) + '20'} px="$2" py="$0.5" borderRadius="$1">
                        <Text fontSize="$2" color={getCategoryColor(template.category)}>
                          {CATEGORY_LABELS[template.category as keyof typeof CATEGORY_LABELS]}
                        </Text>
                      </View>
                      <View bg="rgba(16, 185, 129, 0.2)" px="$2" py="$0.5" borderRadius="$1">
                        <Text fontSize="$2" color="#34D399" fontWeight="600">+{template.point}</Text>
                      </View>
                    </XStack>
                  </YStack>
                </XStack>
              </Card>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  )
}
