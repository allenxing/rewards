import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ChildTabLayout() {
  const isIOS = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E11D48',
        tabBarInactiveTintColor: '#881337',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: isIOS ? 'rgba(255, 241, 242, 0.95)' : '#FFF1F2',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          ...(isIOS && {
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 20,
            borderRadius: 32,
          }),
          paddingTop: 12,
          paddingBottom: isIOS ? 28 : 16,
          height: isIOS ? 96 : 76,
          shadowColor: '#E11D48',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.15,
          shadowRadius: 32,
          elevation: 12,
          backdropFilter: 'blur(20px)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 6,
          marginBottom: isIOS ? 0 : 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '我的主场',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quests/index"
        options={{
          title: '任务大厅',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="checklist" color={color} />,
        }}
      />
      <Tabs.Screen
        name="treasures/index"
        options={{
          title: '梦想宝库',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gift.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="hall-of-fame/index"
        options={{
          title: '荣誉墙',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="star.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}