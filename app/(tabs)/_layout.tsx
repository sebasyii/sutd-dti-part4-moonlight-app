import { Tabs } from 'expo-router';

import { TabBarIcon } from '../../components/TabBarIcon';

import theme from '~/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.white,
        // Change tab card background color
        tabBarStyle: {
          borderBlockColor: 'transparent',
          backgroundColor: theme.colors.cardColor,
        },
      }}>
      <Tabs.Screen
        name="sleep"
        options={{
          headerShown: false,
          title: 'Sleep',
          tabBarIcon: ({ color }) => <TabBarIcon name="moon-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="connections"
        options={{
          headerShown: false,
          title: 'Connections',
          tabBarIcon: ({ color }) => <TabBarIcon name="bluetooth-b" color={color} />,
        }}
      />
    </Tabs>
  );
}
