'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEdit, FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import { User } from '@/types';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import ProtectedAdminLayout from '@/components/ProtectedAdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';

// Esquema de validação para o formulário de usuário
const userSchema = z.object({
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  role: z.enum(['USER', 'ADMIN']),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      password: '',
      role: 'USER',
    }
  });

  // Verificar se o usuário é admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Carregar lista de usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar usuários. Tente novamente mais tarde.');
        console.error('Erro ao buscar usuários:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Abrir modal para criar novo usuário
  const handleCreateUser = () => {
    setEditingUser(null);
    reset({
      username: '',
      password: '',
      role: 'USER' as const,
    });
    setShowModal(true);
  };

  // Abrir modal para editar usuário
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    reset({
      username: user.username,
      password: '',
      role: (user.role as 'USER' | 'ADMIN') || 'USER' as const,
    });
    setShowModal(true);
  };

  // Abrir modal para confirmar exclusão
  const handleDeleteClick = (userId: number) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  // Salvar usuário (criar ou editar)
  const onSubmit = async (data: UserFormData) => {
    // Garantir que role seja do tipo correto
    const userData = {
      ...data,
      role: data.role as 'USER' | 'ADMIN'
    };
    try {
      if (editingUser) {
        // Editar usuário existente
        const updatedUser = await userService.updateUser(editingUser.id!, {
          ...userData,
          id: editingUser.id,
        });
        
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        const newUser = await userService.createUser(userData);
        setUsers([...users, newUser]);
        setSuccess('Usuário criado com sucesso!');
      }
      
      setShowModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao salvar usuário. Tente novamente.');
      console.error('Erro ao salvar usuário:', err);
    }
  };

  // Excluir usuário
  const confirmDelete = async () => {
    if (!deleteUserId) return;
    
    try {
      await userService.deleteUser(deleteUserId);
      setUsers(users.filter(u => u.id !== deleteUserId));
      setSuccess('Usuário excluído com sucesso!');
      setShowDeleteModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao excluir usuário. Tente novamente.');
      console.error('Erro ao excluir usuário:', err);
    }
  };

  // Alterar papel do usuário (admin/user)
  const handleToggleRole = async (userId: number, currentRole: string) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN' as 'USER' | 'ADMIN';
      const updatedUser = await userService.changeUserRole(userId, newRole);
      
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      setSuccess(`Papel do usuário alterado para ${newRole}!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao alterar papel do usuário. Tente novamente.');
      console.error('Erro ao alterar papel do usuário:', err);
    }
  };

  if (currentUser?.role !== 'ADMIN') {
    return null; // Não renderiza nada se não for admin
  }

  return (
    <ProtectedAdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <button
            onClick={handleCreateUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Novo Usuário
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome de Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Papel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'ADMIN' ? (
                          <><FaUserShield className="mr-1" /> Admin</>
                        ) : (
                          <><FaUser className="mr-1" /> Usuário</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleRole(user.id!, user.role || 'USER')}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title={user.role === 'ADMIN' ? 'Tornar usuário comum' : 'Tornar administrador'}
                      >
                        {user.role === 'ADMIN' ? <FaUser /> : <FaUserShield />}
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para criar/editar usuário */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    {...register('username')}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs italic">{errors.username.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Senha {editingUser && '(deixe em branco para manter a atual)'}
                  </label>
                  <input
                    type="password"
                    {...register('password')}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs italic">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Papel
                  </label>
                  <select
                    {...register('role')}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="USER">Usuário</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
              <p className="mb-4">Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedAdminLayout>
  );
}
