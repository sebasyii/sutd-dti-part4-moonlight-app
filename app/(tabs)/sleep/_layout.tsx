import { Link, Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';

import theme from '~/constants/colors';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function SleepLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'none',
        headerTintColor: theme.colors.white,
        contentStyle: {
          backgroundColor: theme.colors.backgroundColor,
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="alarm"
        options={{
          headerTitle: 'Start Sleep Session',
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerRight: () => (
            <Link href="/(tabs)/sleep/sleep_session" asChild>
              <Pressable>
                <Text
                  style={{
                    color: theme.colors.white,
                    marginRight: 10,
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  Start
                </Text>
              </Pressable>
            </Link>
          ),
          headerStyle: {
            backgroundColor: theme.colors.backgroundColor,
          },
        }}
      />
      <Stack.Screen
        name="[sleep_session_settings]"
        options={{
          headerTitle: 'Edit Sleep Session',
          headerTitleStyle: {
            fontWeight: '600',
          },
          gestureEnabled: false,
          headerBackVisible: false,
          headerRight: () => (
            <Link href="/(tabs)/sleep/alarm" asChild>
              <Pressable>
                <Text
                  style={{
                    color: theme.colors.white,
                    marginRight: 10,
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  Save
                </Text>
              </Pressable>
            </Link>
          ),
          headerStyle: {
            backgroundColor: theme.colors.backgroundColor,
          },
        }}
      />
      <Stack.Screen
        name="sleep_session"
        options={{
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: theme.colors.backgroundColor,
          },
        }}
      />
    </Stack>
  );
}
