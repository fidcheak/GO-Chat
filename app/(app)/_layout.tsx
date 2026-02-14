import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";

function LogoutButton() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      title="Logout"
      onPress={handleLogout}
      color={useThemeColor({}, "tint")}
    />
  );
}

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="search"
        options={{
          title: "Search Users",
          headerRight: () => <LogoutButton />,
        }}
      />
      {/* Добавляем эту секцию, чтобы чат стал доступен для навигации */}
      <Stack.Screen
        name="chat"
        options={{
          title: "Чат",
          headerBackTitle: "Назад",
        }}
      />
    </Stack>
  );
}
