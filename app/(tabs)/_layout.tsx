import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '今日',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shoe-prints" size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '履歴',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="list-alt" size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '統計',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-bar" size={size - 4} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cog" size={size - 4} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
