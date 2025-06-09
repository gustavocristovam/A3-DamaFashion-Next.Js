import api from './api';
import { AuthRequest, AuthResponse, User } from '../types';

export const authService = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: User): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  }
};
