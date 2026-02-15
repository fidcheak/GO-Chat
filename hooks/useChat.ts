import { useCallback, useEffect, useRef, useState } from "react";
import { getChatHistory } from "../services/api/chat";
import { Message } from "../types";

const HTTP_URL = process.env.EXPO_PUBLIC_API_URL || "";
const WS_PATH = process.env.EXPO_PUBLIC_WS_PATH || "/ws";

const getWsUrl = () => {
  const baseUrl = HTTP_URL.replace(/\/$/, "");
  const path =
    WS_PATH === "/ws/chat"
      ? "/ws"
      : WS_PATH.startsWith("/")
        ? WS_PATH
        : `/${WS_PATH}`;
  return baseUrl.replace(/^https/, "wss").replace(/^http/, "ws") + path;
};

// Хелпер для создания уникального ключа для сообщения
const getMessageKey = (msg: Message) => `${msg.from}-${msg.createdAt}`;

export const useChat = (chatId: string | null, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messageKeys = useRef(new Set<string>());

  useEffect(() => {
    if (!chatId) return;

    let isCancelled = false;

    const fetchHistoryAndConnect = async () => {
      // 1. Загрузка истории
      setIsLoading(true);
      setError(null);
      try {
        const history = await getChatHistory(chatId);
        if (isCancelled) return;

        // Сортируем от старых к новым
        history.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        // Обновляем состояние и ключи
        setMessages(history);
        messageKeys.current = new Set(history.map(getMessageKey));

      } catch (e) {
        console.error("History load failed:", e);
        if (!isCancelled) {
          setError("Не удалось загрузить историю сообщений.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }

      // 2. Подключение к WebSocket
      const ws = new WebSocket(`${getWsUrl()}?chatId=${chatId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isCancelled) setIsConnected(true);
        console.log("LOG: WebSocket Connected");
      };

      ws.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          const key = getMessageKey(message);

          // Проверяем на дубликаты перед добавлением
          if (!messageKeys.current.has(key)) {
            messageKeys.current.add(key);
            setMessages((prev) => [...prev, message]);
          }
        } catch (err) {
          console.warn("WS parse error:", err);
        }
      };

      ws.onclose = () => {
        if (!isCancelled) setIsConnected(false);
      };

      ws.onerror = (err) => {
        console.error("WebSocket Error:", err);
        if (!isCancelled) {
          setError("Ошибка WebSocket соединения.");
          setIsConnected(false);
        }
        ws.close();
      };
    };

    fetchHistoryAndConnect();

    return () => {
      isCancelled = true;
      wsRef.current?.close();
    };
  }, [chatId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.warn("WS not ready to send message.");
        return;
      }

      const message: Message = {
        chatId: chatId!,
        from: userId,
        content,
        createdAt: new Date().toISOString(),
      };

      wsRef.current.send(JSON.stringify(message));

      // Оптимистичное добавление (необязательно, но улучшает UX)
      // Убедимся, что не дублируем сообщение, которое придет от WS
      const key = getMessageKey(message);
      if (!messageKeys.current.has(key)) {
        messageKeys.current.add(key);
        setMessages((prev) => [...prev, message]);
      }
    },
    [chatId, userId],
  );

  return { messages, sendMessage, isConnected, isLoading, error };
};
