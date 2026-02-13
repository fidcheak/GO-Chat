import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

export default function AppIndex() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to GO</ThemedText>
      <Link href="/search" style={styles.link}>
        <ThemedText type="link">Search for users</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 16,
  },
});
