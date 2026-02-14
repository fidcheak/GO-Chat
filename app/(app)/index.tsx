import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import Button from '@/components/ui/Button';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Welcome to GO Chat!</ThemedText>
      <ThemedText style={styles.subtitle}>
        This is the main application screen.
      </ThemedText>
      <Link href="/(app)/search" asChild>
        <Button title="Search for Users" />
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
});