import API from '.';
import { User } from '@/types';

export const searchUsers = async (query: string): Promise<User[]> => {
  // The backend seems to not support a query parameter,
  // returning all users instead.
  // In a real scenario, you'd use a query param like:
  // const { data } = await API.get(`/users/search?q=${query}`);
  const { data } = await API.get('/users/search');

  if (Array.isArray(data)) {
    // Filter client-side if a query is provided, as a temporary workaround
    if (query) {
      return data.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
    }
    return data;
  }
  return []; // Or handle unexpected format
};