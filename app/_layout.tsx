// @ts-nocheck
// import '../tamagui.generated.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TamaguiProvider, View, Text } from 'tamagui';
import { PortalProvider } from '@tamagui/portal';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import config from '../tamagui.config';
import { initDB } from '../src/services/db';
import { useStore } from '../src/store';

export const unstable_settings = {
  anchor: '(parent)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const loadChildren = useStore(state => state.loadChildren);
  const currentChild = useStore(state => state.currentChild);
  const loadTotalPoints = useStore(state => state.loadTotalPoints);
  const currentMode = useStore(state => state.mode);

  // 加载当前孩子的积分
  useEffect(() => {
    if (currentChild?.id) {
      loadTotalPoints(currentChild.id);
    }
  }, [currentChild, loadTotalPoints]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        await loadChildren();
        setDbInitialized(true);
      } catch (error) {
        setInitError((error as Error).message);
        console.error('初始化失败:', error);
      }
    };

    initialize();
  }, [loadChildren]);

  if (initError) {
    return (
      <TamaguiProvider config={config} defaultTheme="parent">
        <PortalProvider>
          <View flex={1} justifyContent="center" alignItems="center" padding={20}>
            <Text fontSize={18} color="red" textAlign="center">
              应用初始化失败: {initError}
            </Text>
          </View>
        </PortalProvider>
      </TamaguiProvider>
    );
  }

  if (!dbInitialized) {
    return (
      <TamaguiProvider config={config} defaultTheme="parent">
        <PortalProvider>
          <View flex={1} justifyContent="center" alignItems="center">
            <Text fontSize={18}>正在加载...</Text>
          </View>
        </PortalProvider>
      </TamaguiProvider>
    );
  }

  // 根据当前模式选择主题
  const currentTheme = currentMode === 'parent' ? 'parent' : 'child'

  return (
    <TamaguiProvider config={config} defaultTheme={currentTheme}>
      <PortalProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(parent)" options={{ headerShown: false }} />
            <Stack.Screen name="(child)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen 
              name="parent/tasks/add" 
              options={{ 
                presentation: 'modal', 
                headerShown: true, 
                title: '添加任务',
                headerStyle: { backgroundColor: '#0F172A' },
                headerTintColor: '#C4B5FD',
                headerTitleStyle: { color: '#FFFFFF', fontWeight: '600' },
                contentStyle: { backgroundColor: '#0F172A' }
              }} 
            />
            <Stack.Screen 
              name="parent/wishes/add" 
              options={{ 
                presentation: 'modal', 
                headerShown: true, 
                title: '添加愿望',
                headerStyle: { backgroundColor: '#0F172A' },
                headerTintColor: '#FBBF24',
                headerTitleStyle: { color: '#FFFFFF', fontWeight: '600' },
                contentStyle: { backgroundColor: '#0F172A' }
              }} 
            />
            <Stack.Screen 
              name="parent/children/add" 
              options={{ 
                presentation: 'modal', 
                headerShown: true, 
                title: '添加孩子',
                headerStyle: { backgroundColor: '#0F172A' },
                headerTintColor: '#C4B5FD',
                headerTitleStyle: { color: '#FFFFFF', fontWeight: '600' },
                contentStyle: { backgroundColor: '#0F172A' }
              }} 
            />
          </Stack>
          <StatusBar style="dark" />
        </ThemeProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}
