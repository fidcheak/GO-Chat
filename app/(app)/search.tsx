import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useDebounce } from '@/hooks/useDebounce';
import { useThemeColor } from '@/hooks/useThemeColor';
import { searchUsers } from '@/services/api/user';
import { User } from '@/types';

/**
 * Компонент для отображения одного пользователя в списке.
 * Он не использует хуки состояния и является "чистым" - просто получает
 * props и рендерит UI.
 */
function UserListItem({ item }: { item: User }) {
  // Хуки, связанные с темой, здесь использовать можно, т.к. это функциональный компонент.
  const borderColor = useThemeColor({}, 'inputBorder');

  return (
    <View style={[styles.userItem, { borderColor }]}>
      <ThemedText style={styles.username}>{item.username}</ThemedText>
    </View>
  );
}

/**
 * Основной компонент экрана поиска.
 * Вся логика, включая состояние, debounce и запросы к API, находится здесь.
 */
export default function SearchScreen() {
  // --- Хуки вызываются на верхнем уровне функционального компонента ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Кастомный хук для получения "отложенного" значения строки поиска
  const debouncedQuery = useDebounce(query, 500);

  // Хуки для получения цветов темы
  const color = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'inputBorder');
  const placeholderTextColor = useThemeColor({}, 'placeholder');

  // Хук для выполнения побочных эффектов (запросов к API)
  useEffect(() => {
    async function fetchUsers() {
      // 1. Убираем пробелы и проверяем, что строка не пустая
      const trimmedQuery = debouncedQuery.trim();
      if (!trimmedQuery) {
        setResults([]); // Если строка пустая, очищаем результаты
        return;
      }

      setLoading(true);
      try {
        // 2. Делаем запрос с корректным query-параметром
        const users = await searchUsers(trimmedQuery);
        setResults(users);
      } catch (error: any) {
        // 3. Обрабатываем ошибки
        console.error(
          'Search error:',
          error.response?.status,
          error.response?.data
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [debouncedQuery]); // Эффект перезапускается только при изменении debouncedQuery

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.searchInput, { color, borderColor }]}
        placeholder="Search for users..."
        placeholderTextColor={placeholderTextColor}
        value={query}
        onChangeText={setQuery}
      />

      {loading && <ActivityIndicator style={styles.loader} />}

      {!loading && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <ThemedText>
            {debouncedQuery.trim() ? 'No users found.' : 'Start typing to search for users.'}
          </ThemedText>
        </View>
      )}

      {/* 4. FlatList корректно рендерит UserListItem */}
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
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
