import { Stack } from 'expo-router';

import theme from '~/constants/colors';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function ConnectionsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'none',
        contentStyle: {
          backgroundColor: theme.colors.backgroundColor,
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.colors.backgroundColor,
          },
          contentStyle: {
            backgroundColor: theme.colors.backgroundColor,
          },
        }}
      />
    </Stack>
  );
}
