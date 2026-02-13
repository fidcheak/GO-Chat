import api from './index';

export const getChat = (userId: string) => {
  // This is a placeholder function
  return api.post('/chat/get', { userId });
};
