import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { Button } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

function LogoutButton() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // The root layout will handle the redirect
  };

  return <Button title="Logout" onPress={handleLogout} color={useThemeColor({}, 'tint')} />;
}

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen
        name="search"
        options={{
          title: 'Search Users',
          headerRight: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}