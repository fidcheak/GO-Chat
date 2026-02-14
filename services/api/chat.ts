import API from '.';

// This is a placeholder for a future function.
export const getChat = async (chatId: string) => {
  const { data } = await API.post('/chat/get', { chatId });
  return data;
};