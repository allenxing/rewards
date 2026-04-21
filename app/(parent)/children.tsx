// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Button, Card } from 'tamagui'
import { useStore } from '../../src/store'
import { Image } from 'expo-image'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { ThemedCard } from '@/components/ui/themed-components'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

export default function ChildrenManagement() {
  const children = useStore(state => state.children)
  const currentChild = useStore(state => state.currentChild)
  const setCurrentChild = useStore(state => state.setCurrentChild)
  const deleteChild = useStore(state => state.deleteChild)

  const themeColors = [
    { color: '#2563EB', name: '天空蓝' },
    { color: '#DC2626', name: '珊瑚红' },
    { color: '#D97706', name: '琥珀橙' },
    { color: '#059669', name: '森林绿' },
    { color: '#7C3AED', name: '紫罗兰' },
  ]

  const getThemeName = (color: string) => {
    const theme = themeColors.find(t => t.color === color)
    return theme ? theme.name : color
  }

  return (
    <View flex={1} bg={t.background}>
      <View flex={1} bg={t.backgroundGradient} padding="$4">
        <YStack gap="$6" flex={1}>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$1">
              <Text fontSize="$7" fontWeight="800" color="white">孩子列表</Text>
            </YStack>
          </XStack>

          {children.length === 0 ? (
            <ThemedCard
              flex={1}
              marginTop="$4"
              padding="$10"
              alignItems="center"
              justifyContent="center"
            >
              <View width={96} height={96} borderRadius={48} bg={t.brand.gradient} alignItems="center" justifyContent="center" marginBottom="$6" shadowColor={t.shadow.primary} shadowOffset={{ width: 0, height: 8 }} shadowOpacity={0.4} shadowRadius={20}>
                <IconSymbol size={48} name="person.2.fill" color="white" />
              </View>
              <Text fontSize="$6" fontWeight="700" color="white">还没有添加孩子</Text>
              <Text fontSize="$4" color="#A5B4FC" marginTop="$3" textAlign="center" fontWeight="500" maxWidth={300}>
                点击右上角添加孩子
              </Text>
            </ThemedCard>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap="$4">
                {children.map(child => (
                  <Card
                    key={child.id}
                    padding="$5"
                    bg={t.bg.card}
                    br="$6"
                    bw={currentChild?.id === child.id ? 2 : 1}
                    bc={currentChild?.id === child.id ? '#8B5CF6' : 'rgba(124, 58, 237, 0.3)'}
                    shadowColor={currentChild?.id === child.id ? '#8B5CF6' : '#6366F1'}
                    shadowOffset={{ width: 0, height: 8 }}
                    shadowOpacity={currentChild?.id === child.id ? 0.3 : 0.15}
                    shadowRadius={20}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <XStack gap="$4" alignItems="center">
                      <View
                        width={72}
                        height={72}
                        borderRadius={36}
                        bg={child.theme_color}
                        overflow="hidden"
                        bw={3}
                        bc={t.border.lighter}
                        shadowColor={child.theme_color}
                        shadowOffset={{ width: 0, height: 4 }}
                        shadowOpacity={0.4}
                        shadowRadius={12}
                      >
                        {child.avatar ? (
                          <Image
                            source={{ uri: child.avatar }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        ) : (
                          <View flex={1} justifyContent="center" alignItems="center">
                            <Text color="white" fontWeight="bold" fontSize={28}>
                              {child.name.charAt(0)}
                            </Text>
                          </View>
                        )}
                      </View>

                      <YStack flex={1} gap="$2">
                        <XStack alignItems="center" gap="$3">
                          <Text fontSize="$5" fontWeight="700" color="white">
                            {child.name}
                          </Text>
                          {currentChild?.id === child.id && (
                            <View bg="rgba(139, 92, 246, 0.2)" paddingHorizontal="$3" paddingVertical="$1" borderRadius="$2">
                              <Text fontSize="$2" color="#C4B5FD" fontWeight="700">当前</Text>
                            </View>
                          )}
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                          <View
                            width={16}
                            height={16}
                            borderRadius={8}
                            backgroundColor={child.theme_color}
                            shadowColor={child.theme_color}
                            shadowOffset={{ width: 0, height: 2 }}
                            shadowOpacity={0.4}
                            shadowRadius={4}
                          />
                          <Text fontSize="$3" color="#A5B4FC" fontWeight="500">{getThemeName(child.theme_color)}</Text>
                        </XStack>
                      </YStack>
                    </XStack>

                    <XStack gap="$3" flexWrap="wrap" justifyContent="flex-end" marginTop="$4">
                      {currentChild?.id !== child.id && (
                        <Button
                          size="$4"
                          bg={t.brand.gradient}
                          br="$10"
                          bw={1}
                          bc={t.border.lighter}
                          shadowColor="#000000"
                          shadowOffset={{ width: 0, height: 4 }}
                          shadowOpacity={0.2}
                          shadowRadius={12}
                          pressStyle={{ scale: 0.97, bg: 'rgba(139, 92, 246, 0.1)' }}
                          onPress={() => setCurrentChild(child)}
                        >
                          <Text color="white" fontSize="$3" fontWeight="600">切换</Text>
                        </Button>
                      )}
                      <Button
                        size="$4"
                        bg={t.bg.nav}
                        br="$10"
                        bw={1}
                        bc={t.border.lighter}
                        shadowColor="#000000"
                        shadowOffset={{ width: 0, height: 4 }}
                        shadowOpacity={0.2}
                        shadowRadius={12}
                        pressStyle={{ scale: 0.97, bg: 'rgba(139, 92, 246, 0.1)' }}
                        onPress={() => {
                          if (children.length > 1) {
                            deleteChild(child.id)
                          }
                        }}
                        disabled={children.length === 1}
                        opacity={children.length === 1 ? 0.5 : 1}
                      >
                        <Text color={children.length === 1 ? '#94A3B8' : 'white'} fontSize="$3" fontWeight="600">删除</Text>
                      </Button>
                    </XStack>
                  </Card>
                ))}
              </YStack>
            </ScrollView>
          )}
        </YStack>
      </View>
    </View>
  )
}