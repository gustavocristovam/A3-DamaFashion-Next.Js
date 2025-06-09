import api from './api';
import { Product } from '../types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
  
  create: async (product: Product): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },
  
  update: async (id: number, product: Product): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};
