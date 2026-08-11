import api from './api';
import { User, ApiResponse } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string, role?: string) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', { name, email, password, role });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
