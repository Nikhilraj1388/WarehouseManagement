import api from './api';
import { Challan, PaginatedResponse, ApiResponse, ChallanStatus } from '../types';

export const challanService = {
  getChallans: async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Challan>>>('/challans', { params });
    return response.data;
  },
  getChallan: async (id: string) => {
    const response = await api.get<ApiResponse<Challan>>(`/challans/${id}`);
    return response.data;
  },
  createChallan: async (data: any) => {
    const response = await api.post<ApiResponse<Challan>>('/challans', data);
    return response.data;
  },
  updateChallanStatus: async (id: string, status: ChallanStatus) => {
    const response = await api.patch<ApiResponse<Challan>>(`/challans/${id}/status`, { status });
    return response.data;
  },
};
