import api from '.';
import { User } from '../../types';

export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await api.get<User[]>(`/users/search?q=${query}`);
  return response.data;
};
