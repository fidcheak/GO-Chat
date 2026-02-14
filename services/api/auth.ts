import API from '.';
import { AuthResponse, User } from '@/types';

export const register = async (credentials: Omit<User, 'id'>): Promise<AuthResponse> => {
  const { data } = await API.post('/auth/register', credentials);
  return data;
};

export const login = async (credentials: Omit<User, 'id'>): Promise<AuthResponse> => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};