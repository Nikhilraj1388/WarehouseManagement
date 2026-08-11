import api from './api';
import { Customer, PaginatedResponse, ApiResponse, FollowUp } from '../types';

export const customerService = {
  getCustomers: async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Customer>>>('/customers', { params });
    return response.data;
  },
  getCustomer: async (id: string) => {
    const response = await api.get<ApiResponse<Customer & { followUps: FollowUp[] }>>(`/customers/${id}`);
    return response.data;
  },
  createCustomer: async (data: Partial<Customer>) => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data;
  },
  updateCustomer: async (id: string, data: Partial<Customer>) => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data;
  },
  addFollowUp: async (id: string, note: string) => {
    const response = await api.post<ApiResponse<FollowUp>>(`/customers/${id}/follow-ups`, { note });
    return response.data;
  },
};
