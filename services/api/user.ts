import api from './index';
import { User } from '@/types';

export const searchUsers = (query: string): Promise<User[]> => {
  return api.get(`/users/search?username=${query}`).then(res => res.data);
};
