// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Dialog, Input, Card } from 'tamagui'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useStore } from '../../src/store'
import { Image } from 'expo-image'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

export default function ParentHome() {
  const router = useRouter()
  const currentChild = useStore(state => state.currentChild)
  const children = useStore(state => state.children)
  const setCurrentChild = useStore(state => state.setCurrentChild)
  const setMode = useStore(state => state.setMode)
  const totalPoints = useStore(state => state.totalPoints)
  const addPoints = useStore(state => state.addPoints)
  const deductPoints = useStore(state => state.deductPoints)
  const pendingSubmissions = useStore(state => state.pendingSubmissions)
  const loadPendingSubmissions = useStore(state => state.loadPendingSubmissions)
  const reviewSubmission = useStore(state => state.reviewSubmission)
  const submissionsLoading = useStore(state => state.submissionsLoading)

  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const [showPunishDialog, setShowPunishDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showChildSelector, setShowChildSelector] = useState(false)
  const [points, setPoints] = useState('')
  const [reason, setReason] = useState('')
  const [currentReviewSubmission, setCurrentReviewSubmission] = useState<any>(null)
  const [reviewNote, setReviewNote] = useState('')

  const handleSwitchChild = (child: any) => {
    setCurrentChild(child)
    setShowChildSelector(false)
  }

  useEffect(() => {
    if (currentChild?.id) {
      loadPendingSubmissions(currentChild.id)
    }
  }, [currentChild, loadPendingSubmissions])

  const handleReward = async () => {
    if (!currentChild || !points || isNaN(Number(points)) || Number(points) <= 0) return
    try {
      await addPoints(currentChild.id, Number(points), reason || '表现优秀')
      setShowRewardDialog(false)
      setPoints('')
      setReason('')
      alert(`已成功奖励 ${points} 积分！`)
    } catch (error) {
      alert('奖励失败，请重试')
    }
  }

  const handlePunish = async () => {
    if (!currentChild || !points || isNaN(Number(points)) || Number(points) <= 0) return
    try {
      const success = await deductPoints(currentChild.id, Number(points), reason || '表现不佳')
      if (success) {
        setShowPunishDialog(false)
        setPoints('')
        setReason('')
        alert(`已成功扣除 ${points} 积分！`)
      } else {
        alert('积分不足，无法扣除')
      }
    } catch (error) {
      alert('扣分失败，请重试')
    }
  }

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!currentReviewSubmission || !currentChild) return
    try {
      const success = await reviewSubmission(
        currentReviewSubmission.id,
        status,
        reviewNote,
        status === 'approved' ? currentReviewSubmission.point : 0,
        currentChild.id
      )
      if (success) {
        setShowReviewDialog(false)
        setCurrentReviewSubmission(null)
        setReviewNote('')
        alert(status === 'approved' ? '任务已批准，积分已到账！' : '任务已拒绝')
      } else {
        alert('审核失败，请重试')
      }
    } catch (error) {
      alert('审核失败，请重试')
    }
  }

  return (
    <View flex={1} bg={t.background}>
      <View flex={1} bg={t.backgroundGradient} padding="$4">
        <ScrollView flex={1} px="$4" pb={120} showsVerticalScrollIndicator={false}>
          <YStack gap="$6">
            <YStack gap="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$1" >
                  <Button
                    bg="transparent"
                    p={0}
                    onPress={() => children.length > 1 && setShowChildSelector(true)}
                    disabled={children.length <= 1}
                  >
                    <XStack alignItems="center" justifyContent="center" gap="$2">
                      <Text fontSize="$8" fontWeight="800" col={t.text.primary}>
                        {currentChild?.name || '添加孩子'}
                      </Text>
                      {children.length > 1 && (
                        <IconSymbol size={16} name="chevron.right" col={t.text.tertiary} />
                      )}
                    </XStack>
                  </Button>
                </YStack>
                <Button
                  size="$3"
                  bg={t.bg.nav}
                  br="$10"
                  bw={1}
                  bc={t.border.lighter}
                  shadowColor="#000000"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.2}
                  shadowRadius={12}
                  pressStyle={{
                    scale: 0.97,
                    shadowOpacity: 0.1,
                    bg: 'rgba(255, 255, 255, 0.15)',
                  }}
                  onPress={() => {
                    setMode('child')
                    router.replace('/(child)')
                  }}
                >
                  <XStack ai="center" gap="$2" px="$2">
                    <IconSymbol size={16} name="arrow.left" col={t.text.tertiary} />
                    <Text col={t.text.tertiary} fontWeight="600" fontSize="$3">孩子模式</Text>
                  </XStack>
                </Button>
              </XStack>
            </YStack>

            <XStack gap="$4">
              <Card
                flex={1}
                p="$5"
                bg={t.bg.card}
                br="$6"
                bw={1}
                bc="rgba(139, 92, 246, 0.3)"
                shadowColor={t.shadow.primary}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.15}
                shadowRadius={12}
                pressStyle={{ scale: 0.98, bg: 'rgba(40, 53, 73, 0.7)' }}
              >
                <XStack ai="center" gap="$3" mb="$3">
                  <View w={36} h={36} br={18} bg={t.brand.gradient} ai="center" jc="center" shadowColor={t.shadow.primary} shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                    <IconSymbol size={18} name="star.fill" col={t.text.primary} />
                  </View>
                  <Text fontSize="$3" col="#CBD5E1" fontWeight="500">当前积分</Text>
                </XStack>
                <Text fontSize="$10" fontWeight="800" col={t.text.primary}>{totalPoints || 0}</Text>
                <Text fontSize="$2" col={t.text.muted} mt="$1">累计奖励积分</Text>
              </Card>

              <Card
                flex={1}
                p="$5"
                bg={t.bg.card}
                br="$6"
                bw={1}
                bc="rgba(16, 185, 129, 0.3)"
                shadowColor="#10B981"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.15}
                shadowRadius={12}
                pressStyle={{ scale: 0.98, bg: 'rgba(40, 53, 73, 0.7)' }}
              >
                <XStack ai="center" gap="$3" mb="$3">
                  <View w={36} h={36} br={18} bg="linear-gradient(135deg, #10B981 0%, #059669 100%)" ai="center" jc="center" shadowColor="#10B981" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                    <IconSymbol size={18} name="clock.fill" col={t.text.primary} />
                  </View>
                  <Text fontSize="$3" col="#CBD5E1" fontWeight="500">待审核</Text>
                </XStack>
                <Text fontSize="$10" fontWeight="800" col="#34D399">{pendingSubmissions.length}</Text>
                <Text fontSize="$2" col="#34D399" mt="$1">等待处理任务</Text>
              </Card>
            </XStack>

            {currentChild && (
              <Card
                p="$5"
                bg="linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(79, 70, 229, 0.8) 100%)"
                br="$6"
                bw={1}
                bc="rgba(139, 92, 246, 0.5)"
                shadowColor={t.shadow.primary}
                shadowOffset={{ width: 0, height: 16 }}
                shadowOpacity={0.4}
                shadowRadius={32}
                pressStyle={{ scale: 0.98 }}
              >
                <XStack ai="center" gap="$4">
                  <View
                    w={72}
                    h={72}
                    br={36}
                    bg="rgba(255, 255, 255, 0.2)"
                    ov="hidden"
                    bw={4}
                    bc="rgba(255,255,255,0.3)"
                    shadowColor="#4C1D95"
                    shadowOffset={{ width: 0, height: 8 }}
                    shadowOpacity={0.4}
                    shadowRadius={20}
                  >
                    {currentChild.avatar ? (
                      <Image
                        source={{ uri: currentChild.avatar }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <View flex={1} jc="center" ai="center">
                        <Text col={t.text.primary} fontWeight="bold" fontSize={28}>
                          {currentChild?.name?.charAt(0) || '宝'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <YStack flex={1} gap="$1">
                    <Text col={t.text.primary} fontSize="$6" fontWeight="700">你好，{currentChild.name}！</Text>
                    <Text col="rgba(255,255,255,0.8)" fontSize="$4" fontWeight="500">继续加油，今日已获得 0 积分</Text>
                  </YStack>
                  <View w={40} h={40} br={20} bg="rgba(255,255,255,0.2)" ai="center" jc="center">
                    <IconSymbol size={20} name="chevron.right" col={t.text.primary} />
                  </View>
                </XStack>
              </Card>
            )}

            <YStack gap="$4">
              <Text fontSize="$5" fontWeight="700" col={t.text.primary}>快捷操作</Text>
              <XStack gap="$4">
                <Button
                  flex={1}
                  h={88}
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(16, 185, 129, 0.3)"
                  shadowColor="#10B981"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.15}
                  shadowRadius={12}
                  pressStyle={{
                    scale: 0.96,
                    bg: 'rgba(40, 53, 73, 0.7)',
                    shadowOpacity: 0.2,
                  }}
                  onPress={() => {
                    if (!currentChild) {
                      alert('请先添加孩子信息')
                      return
                    }
                    setShowRewardDialog(true)
                  }}
                >
                  <YStack ai="center" gap="$2">
                    <View w={44} h={44} br={22} bg="linear-gradient(135deg, #10B981 0%, #059669 100%)" ai="center" jc="center" shadowColor="#10B981" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                      <IconSymbol size={20} name="plus" col={t.text.primary} />
                    </View>
                    <Text fontSize="$3" col={t.text.primary} fontWeight="600">闪电奖励</Text>
                  </YStack>
                </Button>

                <Button
                  flex={1}
                  h={88}
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(239, 68, 68, 0.3)"
                  shadowColor="#EF4444"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.15}
                  shadowRadius={12}
                  pressStyle={{
                    scale: 0.96,
                    bg: 'rgba(40, 53, 73, 0.7)',
                    shadowOpacity: 0.2,
                  }}
                  onPress={() => {
                    if (!currentChild) {
                      alert('请先添加孩子信息')
                      return
                    }
                    if (totalPoints <= 0) {
                      alert('当前积分为0，无法扣分')
                      return
                    }
                    setShowPunishDialog(true)
                  }}
                >
                  <YStack ai="center" gap="$2">
                    <View w={44} h={44} br={22} bg="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)" ai="center" jc="center" shadowColor="#EF4444" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                      <IconSymbol size={20} name="minus" col={t.text.primary} />
                    </View>
                    <Text fontSize="$3" col={t.text.primary} fontWeight="600">扣分警告</Text>
                  </YStack>
                </Button>

                <Button
                  flex={1}
                  h={88}
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(245, 158, 11, 0.3)"
                  shadowColor="#F59E0B"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.15}
                  shadowRadius={12}
                  pressStyle={{
                    scale: 0.96,
                    bg: 'rgba(40, 53, 73, 0.7)',
                    shadowOpacity: 0.2,
                  }}
                  onPress={() => {
                  }}
                >
                  <YStack ai="center" gap="$2">
                    <View w={44} h={44} br={22} bg="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" ai="center" jc="center" shadowColor="#F59E0B" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                      <IconSymbol size={20} name="checklist" col={t.text.primary} />
                    </View>
                    <Text fontSize="$3" col={t.text.primary} fontWeight="600">管理任务</Text>
                  </YStack>
                </Button>
              </XStack>
            </YStack>

            <YStack gap="$4">
              <XStack jc="space-between" ai="center">
                <Text fontSize="$5" fontWeight="700" col={t.text.primary}>待审核任务</Text>
                <Text fontSize="$3" col={t.text.secondary} fontWeight="500">{pendingSubmissions.length} 个待处理</Text>
              </XStack>

              {submissionsLoading ? (
                <Card
                  p="$8"
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(124, 58, 237, 0.3)"
                  shadowColor={t.shadow.primary}
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.15}
                  shadowRadius={12}
                  ai="center"
                >
                  <Text fontSize="$4" col={t.text.secondary}>加载中...</Text>
                </Card>
              ) : pendingSubmissions.length === 0 ? (
                <Card
                  p="$8"
                  bg={t.bg.card}
                  br="$6"
                  bw={1}
                  bc="rgba(16, 185, 129, 0.3)"
                  shadowColor="#10B981"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.15}
                  shadowRadius={12}
                  ai="center"
                >
                  <View w={64} h={64} br={32} bg="linear-gradient(135deg, #10B981 0%, #059669 100%)" ai="center" jc="center" mb="$4" shadowColor="#10B981" shadowOffset={{width:0, height:2}} shadowOpacity={0.3} shadowRadius={8}>
                    <IconSymbol size={28} name="checkmark.circle.fill" col={t.text.primary} />
                  </View>
                  <Text fontSize="$5" fontWeight="700" col={t.text.primary}>孩子表现很棒</Text>
                  <Text fontSize="$3" col={t.text.secondary} mt="$2">今日无待审核任务</Text>
                </Card>
              ) : (
                <YStack gap="$3">
                  {pendingSubmissions.map(submission => (
                    <Card
                      key={submission.id}
                      p="$5"
                      bg={t.bg.card}
                      br="$6"
                      bw={1}
                      bc="rgba(124, 58, 237, 0.3)"
                      shadowColor={t.shadow.primary}
                      shadowOffset={{ width: 0, height: 4 }}
                      shadowOpacity={0.15}
                      shadowRadius={12}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <XStack gap="$4" ai="flex-start">
                        <View
                          w={52}
                          h={52}
                          br={26}
                          bg={t.brand.gradient}
                          ai="center"
                          jc="center"
                          shadowColor={t.shadow.primary}
                          shadowOffset={{width:0, height:2}}
                          shadowOpacity={0.3}
                          shadowRadius={8}
                        >
                          <Text fontSize="$6">{submission.icon || '📝'}</Text>
                        </View>
                        <YStack flex={1} gap="$2">
                          <Text fontSize="$5" fontWeight="700" col={t.text.primary}>
                            {submission.task_name}
                          </Text>
                          <Text fontSize="$3" col={t.text.secondary}>
                            {new Date(submission.submit_time).toLocaleString('zh-CN')}
                          </Text>
                          <View bg="rgba(16, 185, 129, 0.2)" px="$3" py="$1.5" br="$2" als="flex-start" mt="$1">
                            <Text fontSize="$3" fontWeight="700" col="#34D399">
                              +{submission.point} 积分
                            </Text>
                          </View>
                        </YStack>
                        <Button
                          size="$3"
                          bg={t.brand.gradient}
                          br="$10"
                          px="$4"
                          shadowColor={t.shadow.primary}
                          shadowOffset={{width:0, height:2}}
                          shadowOpacity={0.3}
                          shadowRadius={8}
                          pressStyle={{ scale: 0.95 }}
                          onPress={() => {
                            setCurrentReviewSubmission(submission)
                            setShowReviewDialog(true)
                          }}
                        >
                          <Text col={t.text.primary} fontSize="$3" fontWeight="600">审核</Text>
                        </Button>
                      </XStack>
                      {submission.photo && (
                        <View mt="$4" br="$4" ov="hidden">
                          <Image
                            source={{ uri: submission.photo }}
                            style={{ width: '100%', height: 180 }}
                            contentFit="cover"
                          />
                        </View>
                      )}
                    </Card>
                  ))}
                </YStack>
              )}
            </YStack>
          </YStack>
        </ScrollView>
      </View>

      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <Dialog.Portal>
          <Dialog.Overlay bg="rgba(15, 23, 42, 0.5)" />
          <Dialog.Content
            bg="white"
            br="$5"
            p="$5"
            bw={1}
            bc="#E4ECFC"
            shadowColor="#0F172A"
            shadowOffset={{ width: 0, height: 20 }}
            shadowOpacity={0.15}
            shadowRadius={30}
          >
            <YStack gap="$4">
              <XStack ai="center" gap="$2">
                <View w={32} h={32} br={16} bg="#ECFDF5" ai="center" jc="center">
                  <IconSymbol size={18} name="plus" col="#059669" />
                </View>
                <Text fontSize="$5" fontWeight="600" col="#0F172A">闪电奖励</Text>
              </XStack>

              <YStack gap="$3">
                <Text fontSize="$3" col="#64748B">
                  奖励给 {currentChild?.name || '孩子'} 的积分：
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {[5, 10, 20, 50].map(val => (
                    <Button
                      key={val}
                      size="$3"
                      bg={points === String(val) ? "#059669" : "#F1F5F9"}
                      br="$4"
                      onPress={() => setPoints(String(val))}
                    >
                      <Text fontSize="$3" fontWeight="600" color={points === String(val) ? "white" : "#64748B"}>+{val}</Text>
                    </Button>
                  ))}
                </XStack>
                <Input
                  placeholder="或自定义输入"
                  keyboardType="numeric"
                  value={points}
                  onChangeText={setPoints}
                  bg="#F8FAFC"
                  bc="#E4ECFC"
                  bw={1}
                />
                <Input
                  placeholder="奖励原因（可选）"
                  value={reason}
                  onChangeText={setReason}
                  bg="#F8FAFC"
                  bc="#E4ECFC"
                  bw={1}
                />
              </YStack>

              <XStack gap="$3" jc="flex-end" mt="$2">
                <Button
                  variant="outlined"
                  onPress={() => setShowRewardDialog(false)}
                  bc="#E4ECFC"
                >
                  <Text col="#64748B">取消</Text>
                </Button>
                <Button
                  bg="#059669"
                  onPress={handleReward}
                  disabled={!points || isNaN(Number(points)) || Number(points) <= 0}
                >
                  <Text col={t.text.primary} fontWeight="600">确认奖励</Text>
                </Button>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog open={showPunishDialog} onOpenChange={setShowPunishDialog}>
        <Dialog.Portal>
          <Dialog.Overlay bg="rgba(15, 23, 42, 0.5)" />
          <Dialog.Content
            bg="white"
            br="$5"
            p="$5"
            bw={1}
            bc="#E4ECFC"
            shadowColor="#0F172A"
            shadowOffset={{ width: 0, height: 20 }}
            shadowOpacity={0.15}
            shadowRadius={30}
          >
            <YStack gap="$4">
              <XStack ai="center" gap="$2">
                <View w={32} h={32} br={16} bg="#FEF2F2" ai="center" jc="center">
                  <IconSymbol size={18} name="minus" col="#DC2626" />
                </View>
                <Text fontSize="$5" fontWeight="600" col="#0F172A">扣分警告</Text>
              </XStack>

              <YStack gap="$3">
                <Text fontSize="$3" col="#64748B">
                  扣除 {currentChild?.name || '孩子'} 的积分：
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {[5, 10, 20].map(val => (
                    <Button
                      key={val}
                      size="$3"
                      bg={points === String(val) ? "#DC2626" : "#F1F5F9"}
                      br="$4"
                      onPress={() => setPoints(String(val))}
                    >
                      <Text fontSize="$3" fontWeight="600" color={points === String(val) ? "white" : "#64748B"}>-{val}</Text>
                    </Button>
                  ))}
                </XStack>
                <Input
                  placeholder="或自定义输入"
                  keyboardType="numeric"
                  value={points}
                  onChangeText={setPoints}
                  bg="#F8FAFC"
                  bc="#E4ECFC"
                  bw={1}
                />
                <Input
                  placeholder="扣分原因（必填）"
                  value={reason}
                  onChangeText={setReason}
                  bg="#F8FAFC"
                  bc="#E4ECFC"
                  bw={1}
                />
                <Text fontSize="$2" col="#64748B">
                  当前积分：{totalPoints}，最多可扣 {totalPoints} 分
                </Text>
              </YStack>

              <XStack gap="$3" jc="flex-end" mt="$2">
                <Button
                  variant="outlined"
                  onPress={() => setShowPunishDialog(false)}
                  bc="#E4ECFC"
                >
                  <Text col="#64748B">取消</Text>
                </Button>
                <Button
                  bg="#DC2626"
                  onPress={handlePunish}
                  disabled={!points || isNaN(Number(points)) || Number(points) <= 0 || Number(points) > totalPoints}
                >
                  <Text col={t.text.primary} fontWeight="600">确认扣除</Text>
                </Button>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <Dialog.Portal>
          <Dialog.Overlay bg="rgba(15, 23, 42, 0.5)" />
          <Dialog.Content
            bg="white"
            br="$5"
            p="$5"
            bw={1}
            bc="#E4ECFC"
            shadowColor="#0F172A"
            shadowOffset={{ width: 0, height: 20 }}
            shadowOpacity={0.15}
            shadowRadius={30}
            maxWidth={400}
          >
            <YStack gap="$4">
              <XStack ai="center" gap="$2">
                <View w={32} h={32} br={16} bg="#EFF6FF" ai="center" jc="center">
                  <IconSymbol size={18} name="doc.text.fill" col="#2563EB" />
                </View>
                <Text fontSize="$5" fontWeight="600" col="#0F172A">审核任务</Text>
              </XStack>

              {currentReviewSubmission && (
                <YStack gap="$3">
                  <XStack gap="$3" ai="center">
                    <View
                      w={44}
                      h={44}
                      br={22}
                      bg="#EFF6FF"
                      ai="center"
                      jc="center"
                    >
                      <Text fontSize="$5">{currentReviewSubmission.icon || '📝'}</Text>
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" col="#0F172A">
                        {currentReviewSubmission.task_name}
                      </Text>
                      <Text fontSize="$2" col="#64748B">
                        +{currentReviewSubmission.point} 积分
                      </Text>
                    </YStack>
                  </XStack>

                  {currentReviewSubmission.photo && (
                    <View br="$3" ov="hidden">
                      <Image
                        source={{ uri: currentReviewSubmission.photo }}
                        style={{ width: '100%', height: 160 }}
                        contentFit="cover"
                      />
                    </View>
                  )}

                  <Input
                    placeholder="审核备注（可选）"
                    value={reviewNote}
                    onChangeText={setReviewNote}
                    bg="#F8FAFC"
                    bc="#E4ECFC"
                    bw={1}
                  />
                </YStack>
              )}

              <XStack gap="$3" jc="flex-end" mt="$2">
                <Button
                  variant="outlined"
                  onPress={() => setShowReviewDialog(false)}
                  bc="#E4ECFC"
                >
                  <Text col="#64748B">取消</Text>
                </Button>
                <Button
                  bg="#DC2626"
                  onPress={() => handleReview('rejected')}
                >
                  <Text col={t.text.primary} fontWeight="600">拒绝</Text>
                </Button>
                <Button
                  bg="#059669"
                  onPress={() => handleReview('approved')}
                >
                  <Text col={t.text.primary} fontWeight="600">批准</Text>
                </Button>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog open={showChildSelector} onOpenChange={setShowChildSelector}>
        <Dialog.Portal>
          <Dialog.Overlay bg="rgba(0,0,0,0.7)" />
          <Dialog.Content bg={t.bg.modal} br="$8" p="$6" bw={1} bc="rgba(124, 58, 237, 0.4)" m="$4">
            <YStack gap="$5" ai="center">
              <Text fontSize="$5" fontWeight="700" col="white">切换孩子</Text>
              <XStack gap="$3" flexWrap="wrap" jc="center">
                {children.map(child => (
                  <Button
                    key={child.id}
                    bg={currentChild?.id === child.id ? child.theme_color : t.bg.card}
                    br="$6"
                    p="$4"
                    bw={currentChild?.id === child.id ? 2 : 1}
                    bc={currentChild?.id === child.id ? 'white' : 'rgba(139, 92, 246, 0.3)'}
                    onPress={() => handleSwitchChild(child)}
                    miw={100}
                  >
                    <YStack ai="center" gap="$2">
                      <View w={48} h={48} br={24} bg="rgba(255,255,255,0.2)" ai="center" jc="center">
                        {child.avatar ? (
                          <Image source={{uri: child.avatar}} style={{width: 48, height: 48, borderRadius: 24}} />
                        ) : (
                          <Text col="white" fontWeight="bold" fontSize={20}>{child.name.charAt(0)}</Text>
                        )}
                      </View>
                      <Text col="white" fontWeight="600" fontSize="$3">{child.name}</Text>
                    </YStack>
                  </Button>
                ))}
              </XStack>
              <Button variant="outlined" onPress={() => setShowChildSelector(false)} bw={1} bc="rgba(139, 92, 246, 0.5)" br="$4" py="$3" px="$8">
                <Text col="#A5B4FC" fontWeight="600">取消</Text>
              </Button>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
}
