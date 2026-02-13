import api from './index';
import { User } from '@/types';

interface AuthCredentials {
  username: string;
  password: string;
}

export const register = (credentials: AuthCredentials): Promise<User> => {
  return api.post('/auth/register', credentials).then(res => res.data);
};

export const login = (credentials: AuthCredentials): Promise<User> => {
  return api.post('/auth/login', credentials).then(res => res.data);
};
