// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Card } from 'tamagui'
import { useState, useEffect } from 'react'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useStore } from '../../../src/store'
import badgeService from '../../../src/services/db/badgeService'
import type { Badge } from '../../../src/types'

interface UserBadge extends Badge {
  obtained: boolean
}

export default function HallOfFame() {
  const currentChild = useStore(state => state.currentChild)
  
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(false)

  const loadBadges = async () => {
    if (!currentChild) return
    try {
      setLoading(true)
      const badgeList = await badgeService.getUnlockedBadges(currentChild.id)
      setBadges(badgeList)
    } catch (error) {
      console.error('加载勋章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBadges()
  }, [currentChild])

  const obtainedBadges = badges.filter(b => b.obtained)
  const unobtainedBadges = badges.filter(b => !b.obtained)
  const obtainedCount = obtainedBadges.length
  const totalCount = badges.length

  const getBadgeEmoji = (icon: string) => {
    const iconMap: Record<string, string> = {
      'coin': '💰',
      'broom': '🧹',
      'star': '⭐',
      'gift': '🎁',
      'heart': '❤️',
      'book': '📚',
      'sport': '⚽',
      'hello': '😊',
      'cake': '🎂'
    }
    return iconMap[icon] || '🏅'
  }

  const getConditionHint = (badge: UserBadge) => {
    switch (badge.condition_type) {
      case 'point_count':
        return `还需 ${Math.max(0, badge.condition_value)} 积分`
      case 'task_count':
        return `还需完成 ${Math.max(0, badge.condition_value)} 次`
      case 'continuous':
        return `连续 ${badge.condition_value} 天`
      case 'behavior':
        return `还需 ${badge.condition_value} 次`
      default:
        return badge.description
    }
  }

  return (
    <View flex={1} backgroundColor="#FFF1F2">
      <YStack padding="$4" paddingTop="$6" gap="$2">
        <Text fontSize="$7" fontWeight="700" color="#881337">荣誉墙</Text>
        <Text fontSize="$3" color="#881337" opacity={0.6}>
          已获得 {obtainedCount} / {totalCount} 枚勋章
        </Text>
      </YStack>

      <ScrollView flex={1} padding="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$6">
          <View flexDirection="row" flexWrap="wrap" gap="$3">
            {badges.length === 0 ? (
              <Card flex={1} padding="$8" backgroundColor="white" borderRadius={16} alignItems="center">
                <IconSymbol size={40} name="star" color="#E11D48" />
                <Text fontSize="$4" color="#881337" mt="$3">还没有勋章数据</Text>
                <Text fontSize="$3" color="#881337" opacity={0.6} mt="$1">快去完成任务获取勋章吧！</Text>
              </Card>
            ) : badges.map(badge => (
              <Card
                key={badge.id}
                width="31%"
                padding="$3"
                backgroundColor={badge.obtained ? 'white' : '#FECDD3'}
                borderRadius={16}
                borderWidth={badge.obtained ? 1 : 0}
                borderColor={badge.obtained ? '#FECDD3' : 'transparent'}
                alignItems="center"
                opacity={badge.obtained ? 1 : 0.6}
                shadowColor="#881337"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={badge.obtained ? 0.06 : 0}
                shadowRadius={badge.obtained ? 8 : 0}
              >
                <View
                  width={48}
                  height={48}
                  borderRadius={24}
                  backgroundColor={badge.obtained ? '#FEE2E2' : '#FECDD3'}
                  alignItems="center"
                  justifyContent="center"
                  marginBottom="$2"
                >
                  <Text fontSize="$6">{getBadgeEmoji(badge.icon)}</Text>
                </View>
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color="#881337"
                  textAlign="center"
                >
                  {badge.name}
                </Text>
                {badge.obtained ? (
                  <View backgroundColor="#ECFDF5" paddingHorizontal="$1" paddingVertical={2} borderRadius="$1" marginTop="$1">
                    <Text fontSize={10} color="#059669" fontWeight="600">已获得</Text>
                  </View>
                ) : (
                  <Text fontSize={10} color="#881337" opacity={0.6} textAlign="center" marginTop="$1">
                    {getConditionHint(badge)}
                  </Text>
                )}
              </Card>
            ))}
          </View>

          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol size={20} name="person.2.fill" color="#D97706" />
              <Text fontSize="$4" fontWeight="600" color="#881337">家庭共同目标</Text>
            </XStack>
            <Card
              padding="$4"
              backgroundColor="white"
              borderRadius={16}
              borderWidth={1}
              borderColor="#FECDD3"
              shadowColor="#881337"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.06}
              shadowRadius={8}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <Text fontSize="$4" fontWeight="600" color="#881337">全家旅游</Text>
                <View backgroundColor="#FEF3C7" paddingHorizontal="$2" paddingVertical={2} borderRadius="$1">
                  <Text fontSize="$2" color="#D97706" fontWeight="600">30%</Text>
                </View>
              </XStack>
              <View
                width="100%"
                height={10}
                borderRadius={5}
                backgroundColor="#FFF1F2"
                overflow="hidden"
              >
                <View
                  height="100%"
                  width="30%"
                  backgroundColor="#D97706"
                  borderRadius={5}
                />
              </View>
              <XStack justifyContent="space-between" marginTop="$2">
                <Text fontSize="$2" color="#881337" opacity={0.6}>
                  家庭总积分：3000 / 10000
                </Text>
              </XStack>
            </Card>
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  )
}
