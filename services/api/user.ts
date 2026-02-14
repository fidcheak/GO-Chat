import API from '.';
import { User } from '@/types';

export const searchUsers = async (username: string): Promise<User[]> => {
  const { data } = await API.get<User[]>('/users/search', {
    params: { username },
  });

  // Ensure we always return an array, even if the API response is unexpected.
  return Array.isArray(data) ? data : [];
};