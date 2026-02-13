import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';

import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useDebounce } from '@/hooks/useDebounce';
import { searchUsers } from '@/services/api/user';
import { User } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const color = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#ccc', dark: '#555' }, 'icon');

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      searchUsers(debouncedQuery)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.input, { color, backgroundColor, borderColor }]}
        placeholder="Search for users..."
        value={query}
        onChangeText={setQuery}
        placeholderTextColor={borderColor}
      />
      {loading && <ActivityIndicator style={styles.loader} />}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.userItem}>
            <ThemedText>{item.username}</ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={() =>
          !loading && debouncedQuery ? (
            <ThemedText style={styles.emptyText}>No users found.</ThemedText>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
