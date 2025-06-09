'use client';

import { useState, useEffect } from 'react';

// Hook para manipular localStorage de forma mais segura com TypeScript
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Inicializa o estado com o valor do localStorage (se existir)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      }
    } catch (error) {
      console.error(`Erro ao recuperar ${key} do localStorage:`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Função para atualizar o valor no localStorage e no estado
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
