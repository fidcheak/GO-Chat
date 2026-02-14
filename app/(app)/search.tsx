import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useDebounce } from '@/hooks/useDebounce';
import { useThemeColor } from '@/hooks/useThemeColor';
import { searchUsers } from '@/services/api/user';
import { User } from '@/types';

function UserListItem({ item }: { item: User }) {
  const color = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'inputBorder');

  return (
    <View style={[styles.userItem, { borderColor }]}>
      <ThemedText style={styles.username}>{item.username}</ThemedText>
    </View>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const color = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'inputBorder');
  const placeholderTextColor = useThemeColor({}, 'placeholder');

  useEffect(() => {
    async function fetchUsers() {
      // Don't search if the query is empty, but clear results
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const users = await searchUsers(debouncedQuery);
        setResults(users);
      } catch (error) {
        console.error('Failed to search users:', error);
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
        placeholder="Search for users..."
        placeholderTextColor={placeholderTextColor}
        value={query}
        onChangeText={setQuery}
      />

      {loading && <ActivityIndicator style={styles.loader} />}

      {!loading && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <ThemedText>
            {debouncedQuery ? 'No users found.' : 'Start typing to search for users.'}
          </ThemedText>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={UserListItem}
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