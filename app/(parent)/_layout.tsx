import { Tabs , Link } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { themeStyles } from '../../src/utils/theme';

const t = themeStyles.parent;

export default function ParentTabLayout() {
  const isIOS = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.brand.primary,
        tabBarInactiveTintColor: t.text.muted,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: t.bg.nav,
          borderTopColor: t.border.light,
          borderTopWidth: 1,
          ...(isIOS && {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            borderRadius: 28,
          }),
          paddingTop: 8,
          paddingBottom: isIOS ? 24 : 12,
          height: isIOS ? 88 : 70,
          shadowColor: t.shadow.dark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: isIOS ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: t.bg.nav,
          shadowColor: t.shadow.dark,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          borderBottomWidth: 1,
          borderBottomColor: t.border.light,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: t.text.primary,
        },
        headerTintColor: t.brand.primary,
        headerShadowVisible: false,
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '首页',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
            headerTitle: '家庭成长激励助手',
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: '任务',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="checklist" color={color} />,
            headerTitle: '任务管理',
            headerRight: () => (
              <Link href="/parent/tasks/add" asChild>
                <TouchableOpacity style={{ padding: 8 }}>
                  <IconSymbol size={24} name="plus" color={t.brand.primary} />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="wishes"
          options={{
            title: '愿望',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="gift.fill" color={color} />,
            headerTitle: '愿望管理',
            headerRight: () => (
              <Link href="/parent/wishes/add" asChild>
                <TouchableOpacity style={{ padding: 8 }}>
                  <IconSymbol size={24} name="plus" color={t.brand.primary} />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="children"
          options={{
            title: '孩子',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.2.fill" color={color} />,
            headerTitle: '孩子管理',
            headerRight: () => (
              <Link href="/parent/children/add" asChild>
                <TouchableOpacity style={{ padding: 8 }}>
                  <IconSymbol size={24} name="plus" color={t.brand.primary} />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: '统计',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="chart.bar.fill" color={color} />,
            headerTitle: '数据统计',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '设置',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} />,
            headerTitle: '设置',
          }}
        />
      </Tabs>
  );
}