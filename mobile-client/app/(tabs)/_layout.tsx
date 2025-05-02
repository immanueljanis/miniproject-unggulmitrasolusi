import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="kategori/index"
        options={{
          title: 'Kategori',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="newspaper-variant-multiple-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pelanggan/index"
        options={{
          title: 'Pelanggan',
          tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account-group" size={24} color={color} />),
        }}
      />
      <Tabs.Screen
        name="barang/index"
        options={{
          title: 'Barang',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package-variant" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="penjualan/index"
        options={{
          title: 'Penjualan',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="receipt" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}