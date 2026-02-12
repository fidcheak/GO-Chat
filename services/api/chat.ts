import api from '.';

export const getChat = async (userId: string | number) => {
  // TODO: Implement chat fetching logic
  const response = await api.post('/chat/get', { userId });
  return response.data;
};
