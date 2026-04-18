// @ts-nocheck
import { View, Text, ScrollView, YStack, XStack, Card, Switch, Button } from 'tamagui'
import * as LocalAuthentication from 'expo-local-authentication'
import { useStore } from '../../src/store'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

export default function Settings() {
  const biometricsEnabled = useStore(state => state.biometricsEnabled)
  const soundEnabled = useStore(state => state.soundEnabled)
  const vibrationEnabled = useStore(state => state.vibrationEnabled)
  const darkMode = useStore(state => state.darkMode)
  const setBiometricsEnabled = useStore(state => state.setBiometricsEnabled)
  const setSoundEnabled = useStore(state => state.setSoundEnabled)
  const setVibrationEnabled = useStore(state => state.setVibrationEnabled)
  const setDarkMode = useStore(state => state.setDarkMode)
  const loadChildren = useStore(state => state.loadChildren)

  const handleRefresh = async () => {
    await loadChildren()
    alert('数据已刷新')
  }

  const handleBiometricsToggle = async (enabled: boolean) => {
    if (enabled) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      
      if (!hasHardware || !isEnrolled) {
        alert('此设备不支持生物识别功能')
        return
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '验证身份以开启生物识别',
      })
      
      if (!result.success) {
        return
      }
    }
    
    await setBiometricsEnabled(enabled)
  }

  const handleExport = async () => {
    try {
      const result = await backupService.exportBackup()
      if (result) {
        alert('备份已导出！')
      }
    } catch (error) {
      alert('导出失败')
    }
  }

  const handleImport = async () => {
    try {
      const success = await backupService.importBackup()
      if (success) {
        alert('导入成功，请重启应用！')
      } else {
        alert('导入已取消')
      }
    } catch (error) {
      alert('导入失败')
    }
  }

  const SettingItem = ({ icon, title, description, value, onValueChange, iconColor = '#C4B5FD' }: any) => (
    <Card
      padding="$4"
      bg={t.bg.card}
      br="$4"
      bw={1}
      bc={t.border.lighter}
      marginBottom="$3"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$3" flex={1}>
          <View
            width={40}
            height={40}
            borderRadius={20}
            bg={t.bg.light}
            alignItems="center"
            justifyContent="center"
          >
            <IconSymbol size={20} name={icon} color={iconColor} />
          </View>
          <View flex={1}>
            <Text fontSize="$4" fontWeight="600" color="white">{title}</Text>
            {description && (
              <Text fontSize="$2" color="#A5B4FC" marginTop="$1">{description}</Text>
            )}
          </View>
        </XStack>
        <Switch
          checked={value}
          onCheckedChange={onValueChange}
          bg={value ? '#8B5CF6' : '#4B5563'}
          borderWidth={0}
        >
          <Switch.Thumb bg="white" />
        </Switch>
      </XStack>
    </Card>
  )

  return (
    <View flex={1} bg={t.background}>
      <ScrollView flex={1} px="$4" py="$4" paddingBottom={120}>
        <YStack gap="$6">
          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="700" color="white">设置</Text>
            <Text fontSize="$3" color="#A5B4FC">自定义您的使用体验</Text>
          </YStack>

          <Button
            bg={t.bg.card}
            borderWidth={1}
            borderColor={t.border.primary}
            borderRadius="$4"
            py="$3"
            px="$4"
            onPress={handleRefresh}
          >
            <XStack alignItems="center" gap="$2">
              <IconSymbol size={18} name="arrow.clockwise" color="#C4B5FD" />
              <Text color="#C4B5FD" fontWeight="600" fontSize="$3">刷新数据</Text>
            </XStack>
          </Button>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="#A5B4FC">安全设置</Text>
            <SettingItem
              icon="face.id"
              title="生物识别登录"
              description="使用指纹或面容快速进入家长模式"
              value={biometricsEnabled}
              onValueChange={handleBiometricsToggle}
            />
            <SettingItem
              icon="lock.fill"
              title="修改密码"
              description="更新家长模式密码"
              value={false}
              onValueChange={() => {}}
            />
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="#A5B4FC">通知与反馈</Text>
            <SettingItem
              icon="speaker.wave.2.fill"
              title="声音"
              description="完成任务时的提示音"
              value={soundEnabled}
              onValueChange={setSoundEnabled}
            />
            <SettingItem
              icon="waveform"
              title="振动反馈"
              description="操作时的触觉反馈"
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
            />
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="#A5B4FC">外观</Text>
            <SettingItem
              icon="moon.fill"
              title="深色模式"
              description="使用深色主题"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="#A5B4FC">数据管理</Text>
            <Card
              padding="$4"
              bg={t.bg.card}
              br="$4"
              bw={1}
              bc={t.border.lighter}
              pressStyle={{ opacity: 0.8 }}
              onPress={handleExport}
            >
              <XStack alignItems="center" gap="$3">
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  bg={t.bg.light}
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconSymbol size={20} name="arrow.down.doc.fill" color="#F59E0B" />
                </View>
                <View flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="white">导出数据</Text>
                  <Text fontSize="$2" color="#A5B4FC" marginTop="$1">备份孩子的成长数据</Text>
                </View>
                <IconSymbol size={20} name="chevron.right" color="#A5B4FC" />
              </XStack>
            </Card>
            <Card
              padding="$4"
              bg={t.bg.card}
              br="$4"
              bw={1}
              bc="rgba(245, 158, 11, 0.3)"
              pressStyle={{ opacity: 0.8 }}
              onPress={handleImport}
            >
              <XStack alignItems="center" gap="$3">
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  bg="rgba(245, 158, 11, 0.1)"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconSymbol size={20} name="arrow.up.doc.fill" color="#F59E0B" />
                </View>
                <View flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="white">导入数据</Text>
                  <Text fontSize="$2" color="#A5B4FC" marginTop="$1">从备份恢复数据</Text>
                </View>
                <IconSymbol size={20} name="chevron.right" color="#A5B4FC" />
              </XStack>
            </Card>
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$4" fontWeight="600" color="#A5B4FC">关于</Text>
            <Card
              padding="$4"
              bg={t.bg.card}
              br="$4"
              bw={1}
              bc={t.border.lighter}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="#A5B4FC">版本</Text>
                <Text fontSize="$3" color="white">1.0.0</Text>
              </XStack>
            </Card>
          </YStack>

          <Button
            marginTop="$4"
            marginBottom="$8"
            bg="rgba(239, 68, 68, 0.1)"
            br="$4"
            bw={1}
            bc="rgba(239, 68, 68, 0.3)"
            pressStyle={{ bg: 'rgba(239, 68, 68, 0.2)' }}
          >
            <Text color="#EF4444" fontSize="$4" fontWeight="600">退出家长模式</Text>
          </Button>
        </YStack>
      </ScrollView>
    </View>
  )
}
