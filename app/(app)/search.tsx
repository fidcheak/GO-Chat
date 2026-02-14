import { useRouter } from "expo-router"; // Используем роутер от Expo
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useDebounce } from "@/hooks/useDebounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import { searchUsers } from "@/services/api/user";
import { User } from "@/types";

/**
 * Компонент для отображения одного пользователя в списке.
 * Теперь он кликабельный и перенаправляет в чат.
 */
function UserListItem({ item }: { item: User }) {
  const router = useRouter();
  const borderColor = useThemeColor({}, "inputBorder");

  const handlePress = () => {
    // Переходим на экран чата, передавая ID выбранного пользователя.
    // Expo Router сопоставит это с файлом app/(app)/chat.tsx
    router.push({
      pathname: "/chat",
      params: { userId: item.id },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.userItem, { borderColor }]}>
        <ThemedText style={styles.username}>{item.username}</ThemedText>
        <ThemedText style={styles.hintText}>
          Нажмите, чтобы начать чат
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Задержка поиска, чтобы не спамить API при каждом нажатии клавиши
  const debouncedQuery = useDebounce(query, 500);

  const color = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "inputBorder");
  const placeholderTextColor = useThemeColor({}, "placeholder");

  useEffect(() => {
    async function fetchUsers() {
      const trimmedQuery = debouncedQuery.trim();
      if (!trimmedQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const users = await searchUsers(trimmedQuery);
        setResults(users);
      } catch (error: any) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [debouncedQuery]);

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.searchInput, { color, borderColor }]}
        placeholder="Поиск пользователей..."
        placeholderTextColor={placeholderTextColor}
        value={query}
        onChangeText={setQuery}
      />

      {loading && <ActivityIndicator style={styles.loader} />}

      {!loading && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <ThemedText>
            {debouncedQuery.trim()
              ? "Пользователи не найдены."
              : "Введите имя для поиска собеседника."}
          </ThemedText>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={({ item }) => <UserListItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flex: 1,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
  },
  hintText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});
