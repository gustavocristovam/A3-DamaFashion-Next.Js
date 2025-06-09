'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaBoxOpen, FaUserLock, FaUserPlus } from 'react-icons/fa';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o dashboard se o usuário já estiver autenticado
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaBoxOpen className="text-blue-600 text-2xl" />
            <h1 className="text-xl font-bold text-gray-800">DamaFashion</h1>
          </div>
          <div className="space-x-4">
            <Link 
              href="/auth/login" 
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/auth/register" 
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Registrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Sistema de Gerenciamento de Inventário</h2>
          <p className="text-xl text-gray-600 mb-10">Gerencie seu estoque, produtos, categorias e fornecedores de forma eficiente e organizada.</p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                  <FaUserLock className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold">Já possui uma conta?</h3>
                <p className="text-gray-600 mt-2">Acesse o sistema para gerenciar seu inventário</p>
              </div>
              <Link 
                href="/auth/login" 
                className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
              >
                Entrar
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-6">
                <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                  <FaUserPlus className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold">Novo por aqui?</h3>
                <p className="text-gray-600 mt-2">Crie sua conta para começar a usar o sistema</p>
              </div>
              <Link 
                href="/auth/register" 
                className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-center rounded-md transition-colors"
              >
                Registrar
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} DamaFashion. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
