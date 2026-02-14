import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemedText } from "../../components/ui/ThemedText";
import { ThemedView } from "../../components/ui/ThemedView";
import { Message, useChat } from "../../hooks/useChat";
import { getChatId } from "../../services/api/chat";
import { useAuthStore } from "../../store/auth";

// Определяем типы для параметров навигации.
// Предполагаем, что при навигации на этот экран передается `userId` собеседника.
type ChatScreenRouteProp = RouteProp<{ params: { userId: string } }, "params">;

const ChatScreen = () => {
  // Получаем текущего пользователя из глобального хранилища Zustand
  const { user: currentUser } = useAuthStore();
  // Получаем параметры маршрута, включая ID собеседника
  const route = useRoute<ChatScreenRouteProp>();
  const otherUserId = route.params?.userId;

  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");

  const currentUserId = currentUser?.id.toString();

  // Инициализация чата при загрузке экрана, если есть все необходимые ID
  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setError("Не удалось определить пользователей для начала чата.");
      return;
    }

    const initiateChat = async () => {
      try {
        // Вызываем API для получения ID чата с реальными ID пользователей
        const id = await getChatId([currentUserId, otherUserId]);
        setChatId(id);
      } catch (err) {
        console.error("Failed to initiate chat:", err);
        setError("Не удалось начать чат. Пожалуйста, попробуйте позже.");
      }
    };

    initiateChat();
  }, [currentUserId, otherUserId]); // Эффект перезапустится, если ID изменятся

  // Хук для управления WebSocket-соединением и сообщениями.
  // Передаем реальный ID текущего пользователя.
  const { messages, sendMessage, isConnected } = useChat(
    chatId,
    currentUserId || "",
  );

  const handleSend = () => {
    if (messageContent.trim() && currentUserId) {
      sendMessage(messageContent);
      setMessageContent("");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Определяем, является ли сообщение "нашим"
    const isMyMessage = item.from === currentUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <ThemedText>{item.content}</ThemedText>
      </View>
    );
  };

  // Рендеринг состояний загрузки и ошибок
  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!chatId || !currentUserId) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 10 }}>Создание чата...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.statusText}>
          Статус: {isConnected ? "Подключено" : "Нет соединения"}
        </ThemedText>
      </ThemedView>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.chatId}-${index}`}
        style={styles.messageList}
        contentContainerStyle={{
          paddingBottom: 10,
          flexDirection: "column-reverse",
        }}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageContent}
          onChangeText={setMessageContent}
          placeholder="Введите сообщение..."
          placeholderTextColor="#999"
        />
        <Button
          title="Отправить"
          onPress={handleSend}
          disabled={!isConnected}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  statusText: {
    color: "#666",
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: "#6bb5ea",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#000000",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
});

export default ChatScreen;
