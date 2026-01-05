import { api } from 'boot/axios';
import type { User } from '../types/user';


export interface AuthResponse {
  token: string;
  user: User;
}

export const AuthApi = {
  // Регистрация
  register(credentials: Record<string, string>) {
    return api.post<AuthResponse>('/registration', credentials);
  },

  // Вход
  login(credentials: Record<string, string>) {
    return api.post<AuthResponse>('/login', credentials);
  }
};
