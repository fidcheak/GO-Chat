import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import useAuthStore from '@/store/auth';
import { useTheme } from '@react-navigation/native';

export default function AppLayout() {
  const { logout } = useAuthStore();
  const theme = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'GO',
          headerRight: () => (
            <Pressable onPress={logout}>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-out"
                  size={25}
                  color={theme.colors.text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="search" options={{ title: 'Search Users' }} />
    </Stack>
  );
}
