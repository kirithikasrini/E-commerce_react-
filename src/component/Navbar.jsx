import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, favCount, onSearch, openLoginModal, user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
      <h1
        className="text-xl font-bold text-black-800 cursor-pointer"
        onClick={() => navigate('/')}
      >
        🛍️ Product Store 
      </h1>

      <input
        type="text"
        placeholder="Search products..."
        onChange={(event) => onSearch(event.target.value)}
        className="border rounded px-4 py-1 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <div className="flex items-center gap-4">
        <div
          className="text-sm font-medium px-3 py-1 text-fuchsia-700 rounded cursor-pointer"
          onClick={() => navigate('/order')}
        >
          Orders
        </div>

        <div
          className="text-sm font-medium px-3 py-1 text-fuchsia-700 rounded cursor-pointer"
          onClick={() => navigate('/add-product')}
        >
          ➕ Add Product
        </div>

        <div className="relative cursor-pointer" onClick={() => navigate('/favorites')}>
          <span className="text-2xl">❤️</span>
          {favCount > 0 && (
            <span className="absolute top-0 right-0 text-xs bg-purple-500 text-white rounded-full px-1">
              {favCount}
            </span>
          )}
        </div>

        <div
        className={`relative cursor-pointer ${!user ? 'pointer-events-none opacity-50' : ''}`}
        onClick={() => {
          if (user) {
          navigate('/cart');
          }
        }}
      >
  <span className="text-2xl">🛒</span>
  {cartCount > 0 && (
    <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
      {cartCount}
    </span>
  )}
      </div>

       {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-fuchsia-700">👤 {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded font-semibold hover:bg-fuchsia-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div
              className="text-sm font-medium px-3 py-1 text-fuchsia-700 rounded cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Login
            </div>
          </>
        )}

    
     

  
 
      
      </div>
    </nav>
  );
};

export default Navbar;
