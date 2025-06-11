export interface User {
  id?: number;
  username: string;
  password?: string;
  role?: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface Category {
  id?: number;
  name: string;
}

export interface Supplier {
  id?: number;
  name: string;
  contact: string;
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  supplierId: number;
  stock?: Stock;
}

export interface Stock {
  id?: number;
  quantity: number;
  productId: number;
}
