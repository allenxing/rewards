// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Tabs, Card, Button } from 'tamagui'
import { useState, useEffect } from 'react'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'
import { useStore } from '../../src/store'
import pointService from '../../src/services/db/pointService'
import badgeService from '../../src/services/db/badgeService'
import type { PointsLog, Badge } from '../../src/types'

const t = themeStyles.parent

interface UserBadge extends Badge {
  obtained: boolean
}

export default function Statistics() {
  const currentChild = useStore(state => state.currentChild)
  const totalPoints = useStore(state => state.totalPoints)
  
  const [activeTab, setActiveTab] = useState('badges')
  const [pointsLogs, setPointsLogs] = useState<PointsLog[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(false)

  const loadStats = async () => {
    if (!currentChild) return
    try {
      setLoading(true)
      
      // Load points log
      const logs = await pointService.getPointsLog(currentChild.id, 50)
      setPointsLogs(logs)
      
      // Load badges
      const badgeList = await badgeService.getUnlockedBadges(currentChild.id)
      setBadges(badgeList)
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [currentChild])

  const completedTasks = pointsLogs.filter(l => l.type === 'task_reward').length
  const thisWeekPoints = pointsLogs
    .filter(l => {
      const logDate = new Date(l.created_at)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return logDate >= weekAgo && l.change > 0
    })
    .reduce((sum, l) => sum + l.change, 0)

  const getBadgeIcon = (icon: string) => {
    const iconMap: Record<string, string> = {
      'coin': '💰',
      'broom': '🧹',
      'star': '⭐',
      'gift': '🎁',
      'heart': '❤️'
    }
    return iconMap[icon] || '🏅'
  }

  return (
    <View flex={1} bg={t.background}>
      <View bg={t.backgroundGradient} padding="$4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          paddingHorizontal="$4"
          gap={0}
        >
        <Tabs.List
          bg={t.bg.nav}
          br="$10"
          padding="$2"
          bw={1}
          bc={t.border.lighter}
          shadowColor="#000000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={12}
          backdropFilter="blur(10px)"
        >
          <Tabs.Tab
            value="badges"
            flex={1}
            bg={activeTab === 'badges' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : 'transparent'}
            br="$8"
            shadowColor={activeTab === 'badges' ? "#8B5CF6" : "transparent"}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={activeTab === 'badges' ? 0.3 : 0}
            shadowRadius={activeTab === 'badges' ? 12 : 0}
          >
            <Text
              fontSize="$4"
              fontWeight={activeTab === 'badges' ? '700' : '500'}
              color={activeTab === 'badges' ? 'white' : '#A5B4FC'}
            >
              勋章管理
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            value="stats"
            flex={1}
            bg={activeTab === 'stats' ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' : 'transparent'}
            br="$8"
            shadowColor={activeTab === 'stats' ? "#8B5CF6" : "transparent"}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={activeTab === 'stats' ? 0.3 : 0}
            shadowRadius={activeTab === 'stats' ? 12 : 0}
          >
            <Text
              fontSize="$4"
              fontWeight={activeTab === 'stats' ? '700' : '500'}
              color={activeTab === 'stats' ? 'white' : '#A5B4FC'}
            >
              积分统计
            </Text>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      </View>

      {activeTab === 'badges' ? (
        <ScrollView flex={1} px="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
          <YStack gap="$6">
            <YStack gap="$2">
              <Text fontSize="$6" fontWeight="700" color="white">勋章库</Text>
              <Text fontSize="$4" color="#A5B4FC" fontWeight="500">收集勋章，见证成长</Text>
            </YStack>

            <View flexDirection="row" flexWrap="wrap" gap="$4">
              {badges.length === 0 ? (
                <Card flex={1} padding="$8" bg={t.bg.card} br="$6" bw={1} bc="rgba(139, 92, 246, 0.3)" ai="center">
                  <IconSymbol size={40} name="star" color="#C4B5FD" />
                  <Text color="#A5B4FC" mt="$3">暂无勋章数据</Text>
                </Card>
              ) : badges.map(badge => (
                <Card
                  key={badge.id}
                  width="47%"
                  padding="$5"
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(139, 92, 246, 0.3)"
                  opacity={badge.obtained ? 1 : 0.6}
                  alignItems="center"
                  shadowColor={badge.obtained ? "#8B5CF6" : "#6366F1"}
                  shadowOffset={{ width: 0, height: 8 }}
                  shadowOpacity={badge.obtained ? 0.3 : 0.1}
                  shadowRadius={20}
                  pressStyle={{ scale: 0.97 }}
                >
                  <View
                    width={64}
                    height={64}
                    borderRadius={32}
                    bg={badge.obtained ? "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" : "rgba(139, 92, 246, 0.1)"}
                    alignItems="center"
                    justifyContent="center"
                    marginBottom="$3"
                    shadowColor={badge.obtained ? "#8B5CF6" : "transparent"}
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowOpacity={badge.obtained ? 0.4 : 0}
                    shadowRadius={badge.obtained ? 12 : 0}
                  >
                    <Text fontSize="$8">{getBadgeIcon(badge.icon)}</Text>
                  </View>
                  <Text fontSize="$4" fontWeight="700" color="white" textAlign="center">
                    {badge.name}
                  </Text>
                  <Text fontSize="$3" color="#A5B4FC" textAlign="center" marginTop="$2" fontWeight="500">
                    {badge.obtained ? '已获得' : badge.description}
                  </Text>
                </Card>
              ))}
            </View>

            <Button
              marginTop="$2"
              bg={t.bg.card}
              br="$6"
              bw={1}
              bc="rgba(139, 92, 246, 0.3)"
              shadowColor="#8B5CF6"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.2}
              shadowRadius={20}
              pressStyle={{ scale: 0.98 }}
            >
              <XStack alignItems="center" gap="$3" py="$2">
                <View w={32} h={32} br={16} bg="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)" ai="center" jc="center" shadowColor="#8B5CF6" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                  <IconSymbol size={16} name="plus" color="white" />
                </View>
                <Text color="#C4B5FD" fontSize="$4" fontWeight="600">添加自定义勋章</Text>
              </XStack>
            </Button>
          </YStack>
        </ScrollView>
      ) : (
        <ScrollView flex={1} px="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
          <YStack gap="$6">
            <XStack gap="$4">
              <Card
                flex={1}
                padding="$5"
                bg={t.bg.card}
                br="$6"
                bw={1}
                bc="rgba(139, 92, 246, 0.3)"
                alignItems="center"
                shadowColor="#8B5CF6"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.2}
                shadowRadius={20}
              >
                <View width={48} height={48} borderRadius={24} bg={t.brand.gradient} alignItems="center" justifyContent="center" marginBottom="$3" shadowColor="#8B5CF6" shadowOffset={{width:0, height:4}} shadowOpacity={0.4} shadowRadius={12}>
                  <IconSymbol size={24} name="star.fill" color="white" />
                </View>
                <Text fontSize="$9" fontWeight="800" color="#C4B5FD">{totalPoints}</Text>
                <Text fontSize="$3" color="#A5B4FC" marginTop="$2" fontWeight="500">总积分</Text>
              </Card>
              <Card
                flex={1}
                padding="$5"
                bg={t.bg.card}
                br="$6"
                bw={1}
                bc="rgba(16, 185, 129, 0.3)"
                alignItems="center"
                shadowColor="#10B981"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.2}
                shadowRadius={20}
              >
                <View width={48} height={48} borderRadius={24} bg="linear-gradient(135deg, #10B981 0%, #059669 100%)" alignItems="center" justifyContent="center" marginBottom="$3" shadowColor="#10B981" shadowOffset={{width:0, height:4}} shadowOpacity={0.4} shadowRadius={12}>
                  <IconSymbol size={24} name="checkmark.circle.fill" color="white" />
                </View>
                <Text fontSize="$9" fontWeight="800" color="#34D399">{completedTasks}</Text>
                <Text fontSize="$3" color="#A5B4FC" marginTop="$2" fontWeight="500">完成任务</Text>
              </Card>
              <Card
                flex={1}
                padding="$5"
                bg={t.bg.card}
                br="$6"
                bw={1}
                bc="rgba(245, 158, 11, 0.3)"
                alignItems="center"
                shadowColor="#F59E0B"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.2}
                shadowRadius={20}
              >
                <View width={48} height={48} borderRadius={24} bg="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" alignItems="center" justifyContent="center" marginBottom="$3" shadowColor="#F59E0B" shadowOffset={{width:0, height:4}} shadowOpacity={0.4} shadowRadius={12}>
                  <IconSymbol size={24} name="calendar" color="white" />
                </View>
                <Text fontSize="$9" fontWeight="800" color="#FBBF24">{thisWeekPoints}</Text>
                <Text fontSize="$3" color="#A5B4FC" marginTop="$2" fontWeight="500">本周获得</Text>
              </Card>
            </XStack>

            <YStack gap="$4">
              <Text fontSize="$5" fontWeight="700" color="white">积分流水</Text>
              {pointsLogs.length === 0 ? (
                <Card
                  padding="$8"
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(139, 92, 246, 0.3)"
                  shadowColor="#8B5CF6"
                  shadowOffset={{ width: 0, height: 8 }}
                  shadowOpacity={0.2}
                  shadowRadius={20}
                  alignItems="center"
                >
                  <View width={72} height={72} borderRadius={36} bg="rgba(139, 92, 246, 0.1)" alignItems="center" justifyContent="center" marginBottom="$4">
                    <IconSymbol size={36} name="doc.text" color="#C4B5FD" />
                  </View>
                  <Text fontSize="$5" fontWeight="700" color="white">暂无积分记录</Text>
                  <Text fontSize="$3" color="#A5B4FC" marginTop="$2" fontWeight="500">完成任务即可获得积分哦</Text>
                </Card>
              ) : (
                <YStack gap="$3">
                  {pointsLogs.slice(0, 20).map(log => (
                    <Card key={log.id} padding="$4" bg={t.bg.card} br="$4" bw={1} bc="rgba(139, 92, 246, 0.2)">
                      <XStack jc="space-between" ai="center">
                        <YStack gap="$1">
                          <Text fontSize="$3" color="white" fontWeight="500">{log.reason}</Text>
                          <Text fontSize="$2" color="#94A3B8">
                            {new Date(log.created_at).toLocaleString('zh-CN')}
                          </Text>
                        </YStack>
                        <Text 
                          fontSize="$4" 
                          fontWeight="700" 
                          color={log.change > 0 ? '#34D399' : '#F87171'}
                        >
                          {log.change > 0 ? '+' : ''}{log.change}
                        </Text>
                      </XStack>
                    </Card>
                  ))}
                </YStack>
              )}
            </YStack>
          </YStack>
        </ScrollView>
      )}
    </View>
  )
}