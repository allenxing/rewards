// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Card } from 'tamagui'
import { useStore } from '../../src/store'
import { Image } from 'expo-image'
import { TouchableOpacity } from 'react-native'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'
import { useRouter } from 'expo-router'

const t = themeStyles.child

interface MainGoal {
  id: number
  name: string
  image: string
  target_point: number
}

export default function ChildHome() {
  const currentChild = useStore(state => state.currentChild)
  const setMode = useStore(state => state.setMode)
  const totalPoints = useStore(state => state.totalPoints)
  const router = useRouter()
  const currentLevel = 1
  const levelName = '习惯小萌新'
  const mainGoal = null as MainGoal | null
  const todayPoints = 0

  const getLevelColor = (level: number) => {
    const colors = ['#FBBF24', '#F97316', '#EF4444', '#8B5CF6', '#06B6D4', '#10B981']
    return colors[(level - 1) % colors.length]
  }

  return (
    <View flex={1} backgroundColor="#FFF1F2">
      <ScrollView flex={1} padding="$4" paddingBottom={140} showsVerticalScrollIndicator={false}>
        <YStack gap="$5">
          {/* Header Section */}
          <YStack gap="$4" paddingTop="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$4" alignItems="center">
                <View
                  width={64}
                  height={64}
                  borderRadius={32}
                  borderWidth={3}
                  borderColor="#E11D48"
                  overflow="hidden"
                  backgroundColor="white"
                >
                  {currentChild?.avatar ? (
                    <Image
                      source={{ uri: currentChild.avatar }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <View flex={1} justifyContent="center" alignItems="center">
                      <Text color="#E11D48" fontWeight="bold" fontSize={24}>
                        {currentChild?.name?.charAt(0) || '宝'}
                      </Text>
                    </View>
                  )}
                </View>

                <YStack gap="$1">
                  <Text fontSize="$6" fontWeight="700" color="#881337">
                    {currentChild?.name || '小宝贝'} 👋
                  </Text>
                  <XStack alignItems="center" gap="$2">
                    <View backgroundColor={getLevelColor(currentLevel)} paddingHorizontal="$2" paddingVertical="$0.5" borderRadius="$1">
                      <Text fontSize="$2" color="white" fontWeight="600">Lv.{currentLevel}</Text>
                    </View>
                    <Text fontSize="$3" color="#881337" fontWeight="500">{levelName}</Text>
                  </XStack>
                </YStack>
              </XStack>

              <TouchableOpacity onPress={() => router.push('/auth-parent')} style={{ opacity: 0.3, padding: 8 }}>
                <IconSymbol size={24} name="person.fill" color="#881337" />
              </TouchableOpacity>
            </XStack>

            {/* Points Display */}
            <Card
              padding="$4"
              backgroundColor="#E11D48"
              borderRadius="$borderRadiusXL"
              shadowColor="#E11D48"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.3}
              shadowRadius={20}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text color="rgba(255,255,255,0.8)" fontSize="$2">我的积分</Text>
                  <Text color="white" fontSize="$9" fontWeight="700">{totalPoints || 0}</Text>
                </YStack>
                <View width={48} height={48} borderRadius={24} backgroundColor="rgba(255,255,255,0.2)" alignItems="center" justifyContent="center">
                  <IconSymbol size={28} name="star.fill" color="white" />
                </View>
              </XStack>
            </Card>
          </YStack>

          {/* Main Goal Card */}
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol size={20} name="target" color="#E11D48" />
              <Text fontSize="$4" fontWeight="600" color="#881337">当前目标</Text>
            </XStack>

            {mainGoal ? (
              <Card
                padding="$4"
                backgroundColor="white"
                borderRadius="$borderRadiusLg"
                borderWidth={2}
                borderColor="#E11D48"
                shadowColor="#881337"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={12}
              >
                <XStack gap="$4" alignItems="center">
                  <View
                    width={80}
                    height={80}
                    borderRadius="$borderRadiusLg"
                    overflow="hidden"
                    backgroundColor="#FFF1F2"
                  >
                    {mainGoal.image ? (
                      <Image
                        source={{ uri: mainGoal.image }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <View flex={1} justifyContent="center" alignItems="center">
                        <IconSymbol size={40} name="gift.fill" color="#E11D48" />
                      </View>
                    )}
                  </View>
                  <YStack flex={1} gap="$2">
                    <Text fontSize="$5" fontWeight="600" color="#881337">{mainGoal.name}</Text>
                    <View
                      width="100%"
                      height={10}
                      borderRadius={5}
                      backgroundColor="#FFF1F2"
                      overflow="hidden"
                    >
                      <View
                        height="100%"
                        width={`${Math.min(100, (totalPoints / mainGoal.target_point) * 100)}%`}
                        backgroundColor="#E11D48"
                        borderRadius={5}
                      />
                    </View>
                    <XStack justifyContent="space-between">
                      <Text fontSize="$2" color="#881337" opacity={0.7}>
                        {totalPoints} / {mainGoal.target_point}
                      </Text>
                      <Text fontSize="$2" color="#F97316" fontWeight="600">
                        还差 {Math.max(0, mainGoal.target_point - totalPoints)}
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>
              </Card>
            ) : (
              <Card
                padding="$5"
                backgroundColor="white"
                borderRadius="$borderRadiusLg"
                borderWidth={2}
                borderColor="#FECDD3"
                borderStyle="dashed"
              >
                <YStack alignItems="center" gap="$3">
                  <View width={56} height={56} borderRadius={28} backgroundColor="#FFF1F2" alignItems="center" justifyContent="center">
                    <IconSymbol size={28} name="plus" color="#E11D48" />
                  </View>
                  <Text fontSize="$4" color="#881337" fontWeight="500">还没有设置目标</Text>
                  <Button
                    size="$2"
                    backgroundColor="#E11D48"
                    borderRadius="$borderRadiusLg"
                  >
                    <Text color="white" fontWeight="600" fontSize="$3">去梦想宝库设置</Text>
                  </Button>
                </YStack>
              </Card>
            )}
          </YStack>

          {/* Today's Progress */}
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol size={20} name="calendar" color="#E11D48" />
              <Text fontSize="$4" fontWeight="600" color="#881337">今日成就</Text>
            </XStack>

            <Card
              padding="$4"
              backgroundColor="white"
              borderRadius="$borderRadiusLg"
              shadowColor="#881337"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.06}
              shadowRadius={8}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$3" alignItems="center">
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor="#ECFDF5"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconSymbol size={24} name="plus" color="#059669" />
                  </View>
                  <YStack>
                    <Text fontSize="$5" fontWeight="600" color="#059669">+{todayPoints} 分</Text>
                    <Text fontSize="$2" color="#881337" opacity={0.6}>今日获得积分</Text>
                  </YStack>
                </XStack>

                <Text fontSize="$3" color="#881337">
                  {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                </Text>
              </XStack>

              {todayPoints === 0 && (
                <YStack marginTop="$3" paddingTop="$3" borderTopWidth={1} borderTopColor="#FECDD3">
                  <Text fontSize="$3" color="#881337" textAlign="center" opacity={0.7}>
                    快去任务大厅完成任务赚积分吧！🚀
                  </Text>
                </YStack>
              )}
            </Card>
          </YStack>

          {/* Quick Stats */}
          <XStack gap="$3">
            <Card
              flex={1}
              padding="$3"
              backgroundColor="white"
              borderRadius="$borderRadiusLg"
              alignItems="center"
            >
              <View width={36} height={36} borderRadius={18} backgroundColor="#FEF3C7" alignItems="center" justifyContent="center" marginBottom="$2">
                <IconSymbol size={18} name="checklist" color="#D97706" />
              </View>
              <Text fontSize="$4" fontWeight="600" color="#881337">0</Text>
              <Text fontSize="$2" color="#881337" opacity={0.6}>完成任务</Text>
            </Card>
            <Card
              flex={1}
              padding="$3"
              backgroundColor="white"
              borderRadius="$borderRadiusLg"
              alignItems="center"
            >
              <View width={36} height={36} borderRadius={18} backgroundColor="#FECDD3" alignItems="center" justifyContent="center" marginBottom="$2">
                <IconSymbol size={18} name="gift.fill" color="#E11D48" />
              </View>
              <Text fontSize="$4" fontWeight="600" color="#881337">0</Text>
              <Text fontSize="$2" color="#881337" opacity={0.6}>已兑换</Text>
            </Card>
            <Card
              flex={1}
              padding="$3"
              backgroundColor="white"
              borderRadius="$borderRadiusLg"
              alignItems="center"
            >
              <View width={36} height={36} borderRadius={18} backgroundColor="#DBEAFE" alignItems="center" justifyContent="center" marginBottom="$2">
                <IconSymbol size={18} name="star.fill" color="#2563EB" />
              </View>
              <Text fontSize="$4" fontWeight="600" color="#881337">1</Text>
              <Text fontSize="$2" color="#881337" opacity={0.6}>勋章</Text>
            </Card>
          </XStack>
        </YStack>
      </ScrollView>
    </View>
  )
}