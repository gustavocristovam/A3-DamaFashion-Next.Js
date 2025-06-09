import api from './api';
import { Supplier } from '../types';

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>('/suppliers');
    return response.data;
  },
  
  getById: async (id: number): Promise<Supplier> => {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },
  
  create: async (supplier: Supplier): Promise<Supplier> => {
    const response = await api.post<Supplier>('/suppliers', supplier);
    return response.data;
  },
  
  update: async (id: number, supplier: Supplier): Promise<Supplier> => {
    const response = await api.put<Supplier>(`/suppliers/${id}`, supplier);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  }
};
