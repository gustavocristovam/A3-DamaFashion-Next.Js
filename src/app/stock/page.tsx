'use client';

import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { stockService } from '@/services/stockService';
import { productService } from '@/services/productService';
import { Stock, Product } from '@/types';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const stockSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  quantity: z.string().min(1, 'Quantidade é obrigatória'),
});

type StockFormData = z.infer<typeof stockSchema>;

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StockFormData>({
    resolver: zodResolver(stockSchema),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stocksData, productsData] = await Promise.all([
        stockService.getAll(),
        productService.getAll(),
      ]);
      
      setStocks(stocksData);
      setProducts(productsData);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (stock: Stock | null = null) => {
    setEditingStock(stock);
    
    if (stock) {
      setValue('productId', stock.product?.id?.toString() || '');
      setValue('quantity', stock.quantity.toString());
    } else {
      reset();
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStock(null);
    reset();
  };

  const onSubmit = async (data: StockFormData) => {
    try {
      const stockData: Stock = {
        quantity: parseInt(data.quantity),
        product: { id: parseInt(data.productId) } as Product,
      };

      if (editingStock) {
        await stockService.update(editingStock.id!, stockData);
        setSuccess('Estoque atualizado com sucesso!');
      } else {
        await stockService.create(stockData);
        setSuccess('Estoque criado com sucesso!');
      }

      closeModal();
      fetchData();
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao salvar estoque');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de estoque?')) {
      try {
        await stockService.delete(id);
        setSuccess('Registro de estoque excluído com sucesso!');
        fetchData();
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Erro ao excluir registro de estoque');
        console.error(err);
      }
    }
  };

  // Função para obter o nome do produto pelo ID
  const getProductName = (productId: number | undefined) => {
    if (!productId) return 'N/A';
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'N/A';
  };

  if (loading && stocks.length === 0) {
    return (
      <ProtectedLayout>
        <LoadingSpinner />
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Estoque</h1>
          <p className="text-gray-600">Gerencie o estoque dos produtos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Novo Registro de Estoque
        </button>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      {/* Tabela de estoque */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getProductName(stock.product?.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.quantity > 10 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Em estoque
                      </span>
                    ) : stock.quantity > 0 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Estoque baixo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Sem estoque
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => openModal(stock)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(stock.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {stocks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum registro de estoque encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de criação/edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingStock ? 'Editar Estoque' : 'Novo Registro de Estoque'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                  Produto
                </label>
                <select
                  id="productId"
                  {...register('productId')}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.productId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!!editingStock}
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  {...register('quantity')}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
