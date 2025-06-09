import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaShoppingBag, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 text-xl font-bold">
          <FaShoppingBag />
          <span>DamaFashion</span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <Link href="/products" className="hover:text-gray-300">
              Produtos
            </Link>
            <Link href="/categories" className="hover:text-gray-300">
              Categorias
            </Link>
            <Link href="/suppliers" className="hover:text-gray-300">
              Fornecedores
            </Link>
            <Link href="/stock" className="hover:text-gray-300">
              Estoque
            </Link>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                <FaUser className="inline mr-1" />
                {user?.username}
              </span>
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
