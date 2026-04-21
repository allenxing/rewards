// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Card } from 'tamagui'
import { useEffect } from 'react'
import { Image } from 'expo-image'
import * as FileSystem from 'expo-file-system'
import { useStore } from '../../src/store'
import type { Wish } from '../../src/types'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

export default function WishManagement() {
  const currentChild = useStore(state => state.currentChild)
  const totalPoints = useStore(state => state.totalPoints)
  const loadTotalPoints = useStore(state => state.loadTotalPoints)
  const wishes = useStore(state => state.wishes)
  const loadWishes = useStore(state => state.loadWishes)
  const deleteWish = useStore(state => state.deleteWish)
  const updateWish = useStore(state => state.updateWish)
  const exchangeWish = useStore(state => state.exchangeWish)

  useEffect(() => {
    if (currentChild) {
      loadWishes(currentChild.id)
      loadTotalPoints(currentChild.id)
    }
  }, [currentChild, loadWishes, loadTotalPoints])

  const handleDeleteWish = async (wishId: number) => {
    try {
      await deleteWish(wishId)
    } catch (error) {
      console.error('删除愿望失败:', error)
    }
  }

  const handleToggleLock = async (wish: Wish) => {
    try {
      const newStatus = wish.status === 'locked' ? 'active' : 'locked'
      await updateWish(wish.id, { status: newStatus })
    } catch (error) {
      console.error('更新愿望状态失败:', error)
    }
  }

  const handleExchangeWish = async (wish: Wish) => {
    if (!currentChild || wish.status !== 'active') return
    
    if (totalPoints < wish.target_point) {
      alert(`积分不足！当前积分: ${totalPoints}，需要: ${wish.target_point}`)
      return
    }
    
    try {
      const success = await exchangeWish(wish.id, currentChild.id)
      if (success) {
        alert('兑换成功！')
        if (currentChild) {
          await loadTotalPoints(currentChild.id)
        }
      } else {
        alert('兑换失败，请稍后重试')
      }
    } catch (error) {
      console.error('兑换愿望失败:', error)
      alert('兑换失败，请稍后重试')
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '挑战中'
      case 'locked': return '已锁定'
      case 'achieved': return '已达成'
      case 'exchanged': return '已兑换'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'
      case 'locked': return '#F59E0B'
      case 'achieved': return '#8B5CF6'
      case 'exchanged': return '#64748B'
      default: return '#64748B'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'personal': return '个人'
      case 'family': return '家庭'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return '#8B5CF6'
      case 'family': return '#F59E0B'
      default: return '#64748B'
    }
  }

  const canExchange = (wish: Wish) => {
    return wish.status === 'active' && totalPoints >= wish.target_point
  }

  const progress = (wish: Wish) => {
    return Math.min(100, (totalPoints / wish.target_point) * 100)
  }

  return (
    <View flex={1} bg={t.background}>
      <View bg={t.backgroundGradient} padding="$4">
        <Text fontSize="$5" fontWeight="700" color="white">愿望清单</Text>
      </View>

      <ScrollView flex={1} px="$4" paddingBottom={120} showsVerticalScrollIndicator={false}>
        <YStack gap="$5">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color="white">共 {wishes.length} 个愿望</Text>
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
              pressStyle={{ scale: 0.97, bg: 'rgba(139, 92, 246, 0.1)' }}
            >
              <XStack ai="center" gap="$2" px="$2">
                <IconSymbol size={16} name="line.3.horizontal.decrease.circle" color="#A5B4FC" />
                <Text fontSize="$3" fontWeight="600" color="#A5B4FC">筛选</Text>
              </XStack>
            </Button>
          </XStack>

          {wishes.length === 0 ? (
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
              <View width={72} height={72} borderRadius={36} bg="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" alignItems="center" justifyContent="center" marginBottom="$4" shadowColor="#F59E0B" shadowOffset={{width:0, height:4}} shadowOpacity={0.4} shadowRadius={12}>
                <IconSymbol size={32} name="gift.fill" color="white" />
              </View>
              <Text fontSize="$5" fontWeight="700" color="white">还没有愿望</Text>
              <Text fontSize="$3" color="#A5B4FC" marginTop="$2">点击右上角"+"创建愿望</Text>
            </Card>
          ) : (
            <YStack gap="$3">
              {wishes.map(wish => (
                <Card
                  key={wish.id}
                  padding="$4"
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(139, 92, 246, 0.3)"
                  shadowColor="#000000"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.2}
                  shadowRadius={12}
                  backdropFilter="blur(10px)"
                >
                  <XStack gap="$3" alignItems="center">
                    <View
                      width={60}
                      height={60}
                      br="$4"
                      bg={t.bg.light}
                      overflow="hidden"
                    >
                      {wish.image ? (
                        <Image
                          source={{ uri: `${FileSystem.documentDirectory}${wish.image}` }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="cover"
                        />
                      ) : (
                        <View flex={1} jc="center" ai="center">
                          <IconSymbol size={28} name="gift.fill" color="#F59E0B" />
                        </View>
                      )}
                    </View>
                    
                    <YStack flex={1} gap="$1">
                      <XStack alignItems="center" gap="$2">
                        <Text fontSize="$4" fontWeight="600" color="white">{wish.name}</Text>
                        {wish.is_main_goal && (
                          <View bg="rgba(139, 92, 246, 0.3)" px="$2" py="$0.5" br="$1">
                            <Text fontSize="$2" fontWeight="600" color="#C4B5FD">主目标</Text>
                          </View>
                        )}
                      </XStack>
                      <XStack alignItems="center" gap="$2" flexWrap="wrap">
                        <View bg={`${getTypeColor(wish.type)}20`} px="$2" py="$0.5" br="$1">
                          <Text fontSize="$2" fontWeight="600" color={getTypeColor(wish.type)}>
                            {getTypeLabel(wish.type)}
                          </Text>
                        </View>
                        <View bg="rgba(16, 185, 129, 0.2)" px="$2" py="$0.5" br="$1">
                          <Text fontSize="$2" fontWeight="600" color="#34D399">{wish.target_point}分</Text>
                        </View>
                        <View bg={`${getStatusColor(wish.status)}20`} px="$2" py="$0.5" br="$1">
                          <Text fontSize="$2" fontWeight="600" color={getStatusColor(wish.status)}>
                            {getStatusLabel(wish.status)}
                          </Text>
                        </View>
                      </XStack>
                      <View width="100%" height={6} br={3} bg="rgba(255,255,255,0.1)" overflow="hidden" mt="$1">
                        <View height="100%" width={`${progress(wish)}%`} bg={getStatusColor(wish.status)} br={3} />
                      </View>
                      <Text fontSize="$2" color="#A5B4FC" mt="$1">
                        当前积分: {totalPoints} / {wish.target_point}
                      </Text>
                    </YStack>

                    <XStack gap="$2">
                      {wish.status === 'active' && canExchange(wish) && (
                        <Button
                          size="$2"
                          bg="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                          br="$4"
                          px="$3"
                          pressStyle={{ scale: 0.9 }}
                          onPress={() => handleExchangeWish(wish)}
                        >
                          <Text fontSize="$2" fontWeight="600" color="white">兑换</Text>
                        </Button>
                      )}
                      <Button
                        size="$2"
                        bg={wish.status === 'locked' ? "rgba(245, 158, 11, 0.3)" : "rgba(148, 163, 184, 0.2)"}
                        br="$4"
                        px="$2"
                        pressStyle={{ scale: 0.9 }}
                        onPress={() => handleToggleLock(wish)}
                      >
                        <IconSymbol size={14} name={wish.status === 'locked' ? "lock.open" : "lock"} color={wish.status === 'locked' ? "#F59E0B" : "#94A3B8"} />
                      </Button>
                      <Button
                        size="$2"
                        bg="rgba(239, 68, 68, 0.2)"
                        br="$4"
                        px="$2"
                        pressStyle={{ scale: 0.9 }}
                        onPress={() => handleDeleteWish(wish.id)}
                      >
                        <IconSymbol size={14} name="trash" color="#EF4444" />
                      </Button>
                    </XStack>
                  </XStack>
                </Card>
              ))}
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </View>
  )
}