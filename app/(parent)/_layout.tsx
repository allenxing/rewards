import { Tabs , Link } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ParentTabLayout() {
  const isIOS = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#C4B5FD',
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: isIOS ? 'rgba(30, 27, 75, 0.7)' : 'rgba(30, 27, 75, 0.8)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
          elevation: 8,
          backdropFilter: isIOS ? 'blur(20px)' : 'none',
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
          backgroundColor: 'rgba(30, 27, 75, 0.7)',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
        },
        headerTitleStyle: {
          fontSize: 19,
          fontWeight: '700',
          color: 'white',
        },
        headerTintColor: '#C4B5FD',
        headerShadowVisible: true,
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
                  <IconSymbol size={24} name="plus" color="#C4B5FD" />
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
                  <IconSymbol size={24} name="plus" color="#C4B5FD" />
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
                  <IconSymbol size={24} name="plus" color="#C4B5FD" />
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