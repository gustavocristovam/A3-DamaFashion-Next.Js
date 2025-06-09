'use client';

import { useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
}

/**
 * Hook personalizado para gerenciar notificações toast na aplicação
 * Permite exibir mensagens temporárias de sucesso, erro, aviso ou informação
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    const id = Date.now();
    
    // Adiciona o novo toast à lista
    setToasts((prevToasts) => [...prevToasts, { message, type, id }]);
    
    // Remove o toast após a duração especificada
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}
