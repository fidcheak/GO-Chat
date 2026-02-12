export interface User {
  id: string | number;
  username: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}
