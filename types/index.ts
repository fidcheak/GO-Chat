export interface User {
  id: string | number;
  username: string;
}

export interface AuthResponse {
  id: string | number;
  username: string;
}

export interface Message {
  id?: string;
  chatId: string;
  from: string;
  content: string;
  createdAt: string;
}