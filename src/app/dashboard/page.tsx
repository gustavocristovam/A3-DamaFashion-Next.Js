'use client';

import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { productService } from '@/services/productService';
import { stockService } from '@/services/stockService';
import { categoryService } from '@/services/categoryService';
import { Product, Stock, Category } from '@/types';
import { FaBoxOpen, FaShoppingBag, FaTag, FaTruck } from 'react-icons/fa';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, stocksData, categoriesData] = await Promise.all([
          productService.getAll(),
          stockService.getAll(),
          categoryService.getAll()
        ]);
        
        setProducts(productsData);
        setStocks(stocksData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ProtectedLayout>
        <LoadingSpinner />
      </ProtectedLayout>
    );
  }

  // Calcular estatísticas
  const totalProducts = products.length;
  const lowStockItems = stocks.filter(stock => stock.quantity < 10).length;
  const totalStockItems = stocks.reduce((sum, item) => sum + item.quantity, 0);
  
  // Produtos com estoque baixo para exibir no alerta
  const lowStockProducts = products
    .filter(product => product.stock && product.stock.quantity < 10)
    .sort((a, b) => (a.stock?.quantity || 0) - (b.stock?.quantity || 0))
    .slice(0, 5);

  return (
    <ProtectedLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gerenciamento de inventário</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaShoppingBag className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaBoxOpen className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total em Estoque</p>
              <p className="text-2xl font-bold text-gray-800">{totalStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FaTag className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Itens com Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-800">{lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FaTruck className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Fornecedores</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(products.map(p => p.supplier?.id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de estoque baixo */}
      {lowStockItems > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaTag className="text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Atenção!</span> Você tem {lowStockItems} produtos com estoque baixo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabelas de produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos recentes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Produtos Recentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/products/${product.id}`} className="text-blue-600 hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      R$ {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {categories.find(cat => cat.id === product.categoryId)?.name || 'N/A'}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t">
            <Link href="/products" className="text-blue-600 hover:underline text-sm">
              Ver todos os produtos →
            </Link>
          </div>
        </div>

        {/* Produtos com estoque baixo */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Produtos com Estoque Baixo</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/products/${product.id}`} className="text-blue-600 hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock?.quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Estoque Baixo
                      </span>
                    </td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      Nenhum produto com estoque baixo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t">
            <Link href="/stock" className="text-blue-600 hover:underline text-sm">
              Gerenciar estoque →
            </Link>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
