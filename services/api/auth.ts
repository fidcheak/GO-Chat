import api from '.';
import { AuthRequest, User } from '../../types';

export const register = async (data: AuthRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: AuthRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};
