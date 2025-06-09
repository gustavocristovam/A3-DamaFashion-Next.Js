import { User } from '../types';
import { apiClient } from './api';

const BASE_URL = '/api/users';

export const userService = {
  // Obter todos os usuários
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  // Obter usuário por ID
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Criar novo usuário
  createUser: async (user: User): Promise<User> => {
    const response = await apiClient.post(BASE_URL, user);
    return response.data;
  },

  // Atualizar usuário existente
  updateUser: async (id: number, user: User): Promise<User> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, user);
    return response.data;
  },

  // Excluir usuário
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
  
  // Alterar papel do usuário (admin ou user)
  changeUserRole: async (id: number, role: string): Promise<User> => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/role`, { role });
    return response.data;
  }
};
