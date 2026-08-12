import api from './api';
import { Product, PaginatedResponse, ApiResponse, StockMovement, MovementType } from '../types';

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
    return response.data;
  },
  getProduct: async (id: string) => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
  createProduct: async (data: Partial<Product>) => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },
  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/products/${id}`);
    return response.data;
  },
  updateStock: async (id: string, data: { quantity: number; movementType?: MovementType; type?: MovementType; reason: string }) => {
    const payload = {
      quantity: data.quantity,
      type: data.type || data.movementType || 'IN',
      movementType: data.movementType || data.type || 'IN',
      reason: data.reason
    };
    const response = await api.post<ApiResponse<StockMovement>>(`/products/${id}/stock`, payload);
    return response.data;
  },
  getMovements: async (id: string) => {
    const response = await api.get<ApiResponse<StockMovement[]>>(`/products/${id}/movements`);
    return response.data;
  },
};
