// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Card, Button, Dialog } from 'tamagui'
import { useState, useEffect } from 'react'
import { Image } from 'expo-image'
import * as FileSystem from 'expo-file-system'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { useStore } from '../../../src/store'
import wishService from '../../../src/services/db/wishService'
import type { Wish } from '../../../src/types'

export default function WishTreasury() {
  const currentChild = useStore(state => state.currentChild)
  const totalPoints = useStore(state => state.totalPoints)
  const loadTotalPoints = useStore(state => state.loadTotalPoints)
  const exchangeWish = useStore(state => state.exchangeWish)
  const setMainGoal = useStore(state => state.setMainGoal)
  
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null)
  const [showExchangeDialog, setShowExchangeDialog] = useState(false)

  const loadWishes = async () => {
    if (!currentChild) return
    try {
      setLoading(true)
      const wishList = await wishService.getWishes(currentChild.id)
      setWishes(wishList)
    } catch (error) {
      console.error('加载愿望失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWishes()
  }, [currentChild])

  const mainGoal = wishes.find(w => w.is_main_goal && w.status === 'active')
  const achievedWishes = wishes.filter(w => w.status === 'achieved' || w.status === 'exchanged')
  const activeWishes = wishes.filter(w => w.status === 'active')

  const handleSetMainGoal = async (wish: Wish) => {
    try {
      await setMainGoal(wish.id)
      await loadWishes()
    } catch (error) {
      console.error('设置目标失败:', error)
    }
  }

  const handleExchange = async () => {
    if (!selectedWish || !currentChild) return
    
    try {
      const success = await exchangeWish(selectedWish.id, currentChild.id)
      
      if (success) {
        setShowExchangeDialog(false)
        setSelectedWish(null)
        alert(`恭喜！已成功兑换 "${selectedWish.name}"！`)
        await loadWishes()
        await loadTotalPoints(currentChild.id)
      } else {
        alert('积分不足，无法兑换')
      }
    } catch (error) {
      console.error('兑换愿望失败:', error)
      alert('兑换失败，请重试')
    }
  }

  const getProgress = (target: number) => {
    if (!totalPoints || totalPoints <= 0) return 0
    return Math.min(100, (totalPoints / target) * 100)
  }

  const getStatusLabel = (status: string, isMain: boolean) => {
    if (isMain && status === 'active') return '挑战中'
    if (status === 'active') return '静候中'
    if (status === 'achieved') return '可兑换'
    if (status === 'exchanged') return '已兑换'
    return status
  }

  const canExchange = (wish: Wish) => {
    return totalPoints >= wish.target_point && (wish.status === 'active' || wish.status === 'achieved')
  }

  return (
    <View flex={1} backgroundColor="#FFF1F2">
      <YStack padding="$4" paddingTop="$6" gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$7" fontWeight="700" color="#881337">梦想宝库</Text>
          <View backgroundColor="#E11D48" paddingHorizontal="$3" paddingVertical="$1" borderRadius="$borderRadiusLg">
            <XStack alignItems="center" gap="$1">
              <IconSymbol size={16} name="star.fill" color="white" />
              <Text fontSize="$4" color="white" fontWeight="700">{totalPoints}</Text>
            </XStack>
          </View>
        </XStack>
        <Text fontSize="$3" color="#881337" opacity={0.6}>努力攒积分，兑换喜欢的礼物！</Text>
      </YStack>

      <ScrollView flex={1} padding="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$6">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol size={20} name="target" color="#E11D48" />
              <Text fontSize="$4" fontWeight="600" color="#881337">我的目标</Text>
            </XStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} gap="$3">
              {wishes.map(wish => (
                <Card
                  key={wish.id}
                  width={140}
                  padding="$3"
                  backgroundColor="white"
                  borderRadius="$borderRadiusLg"
                  borderWidth={wish.is_main_goal ? 2 : 1}
                  borderColor={wish.is_main_goal ? '#E11D48' : '#FECDD3'}
                >
                  <View width="100%" height={100} borderRadius="$borderRadiusMd" backgroundColor="#FFF1F2" overflow="hidden" marginBottom="$2">
                    {wish.image ? (
                      <Image
                        source={{ uri: `${FileSystem.documentDirectory}${wish.image}` }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                      />
                    ) : (
                      <View flex={1} justifyContent="center" alignItems="center">
                        <IconSymbol size={40} name="gift.fill" color="#E11D48" />
                      </View>
                    )}
                  </View>
                  <Text fontSize="$3" fontWeight="600" color="#881337" numberOfLines={1}>{wish.name}</Text>
                  <View width="100%" height={8} borderRadius={4} backgroundColor="#FFF1F2" overflow="hidden" marginTop="$2">
                    <View height="100%" width={`${getProgress(wish.target_point)}%`} backgroundColor={wish.is_main_goal ? "#E11D48" : "#FBBF24"} borderRadius={4} />
                  </View>
                  <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
                    <Text fontSize="$2" color="#881337" opacity={0.6}>{totalPoints}/{wish.target_point}</Text>
                    <Text fontSize="$2" color={wish.is_main_goal ? "#E11D48" : canExchange(wish) ? "#059669" : "#881337"} fontWeight="600">
                      {getStatusLabel(wish.status, wish.is_main_goal)}
                    </Text>
                  </XStack>
                  {canExchange(wish) && wish.status !== 'exchanged' && (
                    <Button size="$2" bg="#059669" mt="$2" br="$4" onPress={() => {
                      setSelectedWish(wish)
                      setShowExchangeDialog(true)
                    }}>
                      <Text color="white" fontSize="$2" fontWeight="600">立即兑换</Text>
                    </Button>
                  )}
                  {!wish.is_main_goal && wish.status !== 'exchanged' && (
                    <Button size="$2" bg="#E11D48" mt="$2" br="$4" variant="outlined" onPress={() => handleSetMainGoal(wish)}>
                      <Text color="white" fontSize="$2" fontWeight="600">设为目标</Text>
                    </Button>
                  )}
                </Card>
              ))}
            </ScrollView>
          </YStack>

          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
              <IconSymbol size={20} name="trophy.fill" color="#D97706" />
              <Text fontSize="$4" fontWeight="600" color="#881337">已兑换的奖励</Text>
            </XStack>
            {achievedWishes.length === 0 ? (
              <Card padding="$6" backgroundColor="white" borderRadius="$borderRadiusLg" borderWidth={1} borderColor="#FECDD3" alignItems="center">
                <View width={56} height={56} borderRadius={28} backgroundColor="#FFF1F2" alignItems="center" justifyContent="center" marginBottom="$3">
                  <IconSymbol size={28} name="gift.fill" color="#E11D48" />
                </View>
                <Text fontSize="$4" fontWeight="600" color="#881337">还没有兑换过奖励</Text>
                <Text fontSize="$3" color="#881337" opacity={0.6} marginTop="$1" textAlign="center">努力完成任务赚积分，就能兑换喜欢的礼物哦~</Text>
              </Card>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} gap="$3">
                {achievedWishes.map(wish => (
                  <Card key={wish.id} width={120} padding="$3" backgroundColor="white" borderRadius="$borderRadiusLg" borderWidth={1} borderColor="#FECDD3">
                    <View width="100%" height={80} borderRadius="$borderRadiusMd" backgroundColor="#FFF1F2" overflow="hidden" marginBottom="$2">
                      {wish.image ? (
                        <Image
                          source={{ uri: `${FileSystem.documentDirectory}${wish.image}` }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="cover"
                        />
                      ) : (
                        <View flex={1} justifyContent="center" alignItems="center">
                          <IconSymbol size={24} name="gift.fill" color="#E11D48" />
                        </View>
                      )}
                    </View>
                    <Text fontSize="$3" fontWeight="600" color="#881337" numberOfLines={1}>{wish.name}</Text>
                    <Text fontSize="$2" color="#059669" fontWeight="600">✓ 已兑换</Text>
                  </Card>
                ))}
              </ScrollView>
            )}
          </YStack>
        </YStack>
      </ScrollView>

      <Dialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
        <Dialog.Portal>
          <Dialog.Overlay backgroundColor="rgba(136, 19, 55, 0.5)" />
          <Dialog.Content backgroundColor="white" borderRadius="$borderRadiusXL" padding="$5" borderWidth={2} borderColor="#E11D48">
            {selectedWish && (
              <YStack gap="$4" alignItems="center">
                <View width={80} height={80} borderRadius={40} backgroundColor="#FFF1F2" alignItems="center" justifyContent="center">
                  <IconSymbol size={40} name="gift.fill" color="#E11D48" />
                </View>
                <Text fontSize="$5" fontWeight="700" color="#881337" textAlign="center">
                  确认兑换 "{selectedWish.name}"？
                </Text>
                <YStack gap="$2" alignItems="center">
                  <Text fontSize="$4" color="#881337">将消耗 {selectedWish.target_point} 积分</Text>
                  <Text fontSize="$3" color="#881337" opacity={0.6}>兑换后积分余额: {totalPoints - selectedWish.target_point}</Text>
                </YStack>
                <XStack gap="$3">
                  <Button backgroundColor="#FECDD3" borderRadius="$borderRadiusLg" onPress={() => setShowExchangeDialog(false)}>
                    <Text color="#881337" fontWeight="600">取消</Text>
                  </Button>
                  <Button backgroundColor="#059669" borderRadius="$borderRadiusLg" onPress={handleExchange}>
                    <Text color="white" fontWeight="600">确认兑换</Text>
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