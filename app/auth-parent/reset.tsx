import { View, Text, YStack, Button, Input, Card } from 'tamagui'
import { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { themeStyles } from '../../src/utils/theme'

const t = themeStyles.parent

const SECURITY_QUESTIONS = [
  '孩子的小学名字是什么？',
  '家长出生的城市是？',
  '孩子最好的朋友叫？',
  '第一次带孩子去的游乐场是？',
  '家里宠物的名字是？'
]

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<'question' | 'reset'>('question')
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    loadSecurityQuestion()
  }, [])

  const loadSecurityQuestion = async () => {
    const question = await getItemAsync('security_question')
    if (question) {
      setSelectedQuestion(question)
    } else {
      setSelectedQuestion(SECURITY_QUESTIONS[0])
    }
  }

  const handleVerifyAnswer = async () => {
    if (!securityAnswer.trim()) {
      setError('请输入密保答案')
      return
    }
    
    const storedAnswer = await getItemAsync('security_answer')
    if (securityAnswer === storedAnswer) {
      setStep('reset')
      setError('')
    } else {
      setError('密保答案错误')
    }
  }

  const handleResetPassword = async () => {
    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      setError('请输入4位数字密码')
      return
    }
    if (password !== confirmPassword) {
      setError('两次密码不一致')
      return
    }
    
    try {
      setLoading(true)
      await setItemAsync('parent_password', password)
      await setItemAsync('password_attempts', '0')
      alert('密码重置成功！')
      router.replace('/auth-parent')
    } catch (e) {
      setError('重置密码失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View flex={1} bg={t.background}>
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$8">
        <YStack alignItems="center" gap="$3">
          <View 
            width={80} 
            height={80} 
            borderRadius={40} 
            bg={t.brand.gradient} 
            justifyContent="center" 
            alignItems="center"
            shadowColor="#8B5CF6"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.4}
            shadowRadius={20}
          >
            <IconSymbol size={40} name="lock.rotation" color="white" />
          </View>
          <Text fontSize="$7" fontWeight="700" color="white">
            找回密码
          </Text>
          <Text fontSize="$3" color="#A5B4FC">
            {step === 'question' ? '回答密保问题以重置密码' : '请输入新密码'}
          </Text>
        </YStack>

        <YStack width="100%" maxWidth={320} gap="$4">
          {step === 'question' ? (
            <>
              <Card padding="$4" bg={t.bg.card} borderRadius="$4" borderWidth={1} borderColor="rgba(139, 92, 246, 0.3)">
                <Text fontSize="$4" color="white" fontWeight="600" marginBottom="$2">密保问题</Text>
                <Text fontSize="$3" color="#A5B4FC">{selectedQuestion}</Text>
              </Card>

              <Input
                placeholder="请输入密保答案"
                value={securityAnswer}
                onChangeText={setSecurityAnswer}
                bg={t.bg.card}
                borderColor="rgba(139, 92, 246, 0.3)"
                borderWidth={1}
                borderRadius="$4"
                padding="$4"
                fontSize="$4"
                color="white"
                placeholderTextColor="#94A3B8"
              />
            </>
          ) : (
            <>
              <Input
                placeholder="请输入新密码（4位数字）"
                value={password}
                onChangeText={setPassword}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                bg={t.bg.card}
                borderColor="rgba(139, 92, 246, 0.3)"
                borderWidth={1}
                borderRadius="$4"
                padding="$4"
                fontSize="$5"
                color="white"
                textAlign="center"
                placeholderTextColor="#94A3B8"
              />

              <Input
                placeholder="请再次输入新密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                bg={t.bg.card}
                borderColor="rgba(139, 92, 246, 0.3)"
                borderWidth={1}
                borderRadius="$4"
                padding="$4"
                fontSize="$5"
                color="white"
                textAlign="center"
                placeholderTextColor="#94A3B8"
              />
            </>
          )}

          {error && (
            <Card padding="$3" borderRadius="$3" alignItems="center" backgroundColor="rgba(239, 68, 68, 0.1)">
              <Text fontSize="$3" color="#EF4444">{error}</Text>
            </Card>
          )}

          <Button
            bg={t.brand.gradient}
            borderRadius="$6"
            paddingVertical="$4"
            shadowColor="#8B5CF6"
            shadowOffset={{ width: 0, height: 8 }}
            shadowOpacity={0.4}
            shadowRadius={20}
            pressStyle={{ scale: 0.97 }}
            onPress={step === 'question' ? handleVerifyAnswer : handleResetPassword}
            disabled={loading}
          >
            <Text color="white" fontWeight="700" fontSize="$5">
              {loading ? '处理中...' : step === 'question' ? '确认' : '重置密码'}
            </Text>
          </Button>

          <Button variant="outlined" onPress={() => router.back()}>
            <Text color="#A5B4FC" fontSize="$3">返回</Text>
          </Button>
        </YStack>
      </YStack>
    </View>
  )
}
