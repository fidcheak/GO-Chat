import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { SplashScreen } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    const inApp = segments[0] === '(app)';

    if (isAuthenticated && !inApp) {
      router.replace('/(app)');
    } else if (!isAuthenticated && inApp) {
      router.replace('/(auth)/login');
    }

    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <Stack>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}