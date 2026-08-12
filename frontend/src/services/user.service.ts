import api from './api';
import { User, PaginatedResponse, ApiResponse } from '../types';

export const userService = {
  getUsers: async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params });
    return response.data;
  },
  createUser: async (data: any) => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data;
  },
  updateUser: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/users/${id}`);
    return response.data;
  },
};
