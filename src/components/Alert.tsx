'use client';

import { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children?: ReactNode;
  message?: string;
  onClose?: () => void;
}

export default function Alert({ type, children, message, onClose }: AlertProps) {
  const styles = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700'
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${styles[type]} relative`} role="alert">
      {message || children}
      
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Fechar"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}
