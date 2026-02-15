import axios from "axios";
import { Message } from "../../types";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/**
 * Создает или получает существующий чат
 */
export const getChatId = async (users: string[]): Promise<string> => {
  const { data } = await api.post<{ chatId: string }>("/chat/get", { users });

  return data.chatId;
};

/**
 * Получает историю сообщений
 * GET /chat/messages/get?chatId=
 */
export const getChatHistory = async (chatId: string): Promise<Message[]> => {
  const { data } = await api.get<Message[]>("/chat/messages/get", {
    params: { chatId },
  });

  return data ?? [];
};

