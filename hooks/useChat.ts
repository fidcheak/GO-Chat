import { useCallback, useEffect, useRef, useState } from "react";
import { getChatHistory } from "../services/api/chat";

export interface Message {
  id?: string;
  chatId: string;
  from: string;
  content: string;
  createdAt?: string;
}

const HTTP_URL = process.env.EXPO_PUBLIC_API_URL || "";
const WS_PATH = process.env.EXPO_PUBLIC_WS_PATH || "/ws";

const getWsUrl = () => {
  const baseUrl = HTTP_URL.replace(/\/$/, "");
  // Если в кэше застрял /ws/chat, насильно меняем на /ws
  const path =
    WS_PATH === "/ws/chat"
      ? "/ws"
      : WS_PATH.startsWith("/")
        ? WS_PATH
        : `/${WS_PATH}`;
  return baseUrl.replace(/^https/, "wss").replace(/^http/, "ws") + path;
};

export const useChat = (chatId: string | null, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (!chatId) return;

    const WS_URL = getWsUrl();
    const finalUrl = `${WS_URL}?chatId=${chatId}`;

    console.log("LOG: Connecting to:", finalUrl);

    const ws = new WebSocket(finalUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("LOG: WebSocket Connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        // Добавляем в конец массива (новые снизу)
        setMessages((prev) => [...prev, message]);
      } catch (e) {
        console.warn("WS parse error:", e);
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => ws.close();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const history = await getChatHistory(chatId);
        if (!cancelled) {
          // История обычно приходит от старых к новым, оставляем как есть
          setMessages(history);
        }
      } catch (e) {
        console.error("History load failed:", e);
      }
    };

    loadHistory();
    connect();

    return () => {
      cancelled = true;
      wsRef.current?.close();
    };
  }, [chatId, connect]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const message: Message = {
        chatId: chatId!,
        from: userId,
        content,
        createdAt: new Date().toISOString(),
      };

      wsRef.current.send(JSON.stringify(message));
      // ВАЖНО: setMessages здесь НЕ вызываем, ждем ответа от WS (onmessage)
    },
    [chatId, userId],
  );

  return { messages, sendMessage, isConnected };
};
