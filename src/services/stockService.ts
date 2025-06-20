import api from './api';
import { Stock } from '../types';

export const stockService = {
  getAll: async (): Promise<Stock[]> => {
    const response = await api.get<Stock[]>('/stocks');
    return response.data;
  },
  
  getById: async (id: number): Promise<Stock> => {
    const response = await api.get<Stock>(`/stocks/${id}`);
    return response.data;
  },
  
  create: async (stock: Stock): Promise<Stock> => {
    const response = await api.post<Stock>('/stocks', stock);
    return response.data;
  },
  
  update: async (id: number, quantity: number): Promise<Stock> => {
    const response = await api.put<Stock>(`/stocks/${id}`, quantity);
    return response.data;
  }
};
