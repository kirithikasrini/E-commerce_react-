import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate } from 'react-router-dom';
import ProductList from './component/ProductList';
import ProductDetail from './component/ProductDetail';
import Cart from './component/Cart';
import Navbar from './component/Navbar';
import Favorites from './component/Favorites';
import {ToastContainer , toast } from 'react-toastify';
import AddProduct from './component/AddProduct';
import Order from './component/Order';
import Login from './component/Login';
import LoginModal from './component/LoginModal';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [showLoginModal,setLoginModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    if (stored) setCart(JSON.parse(stored));
  }, []);
  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

const addToCart = (product) => {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    setCart(cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
        : item
    ));
  } else {
    setCart([...cart, { ...product, quantity: product.quantity || 1 }]);
  }
};
const updateCartQuantity = (id, type) => {
  setCart(prev =>
    prev.map(item =>
      item.id === id
        ? {
            ...item,
            quantity: type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
        : item
    )
  );
};

const removeFromCart = (id) => { 
    setCart(prev => prev.filter(item => item.id !== id));
  
};

  const toggleFavorite = (product) => {
    if (favorites.find(item => item.id === product.id)) {
      setFavorites(favorites.filter(item => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };
  const clearCart = () => {
    setCart([]);
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    toast.success('Login successful');
  }
  const handleProtectedClick = () => {
    if(!user){
      setLoginModal(true)
      return false;
    }
    return true;
  }

  return (
    <Router>
     <Navbar
          cartCount={cart.length}
          onSearch={setSearchTerm}
          favCount={favorites.length}
          user={user}
          setUser={setUser}
           openLoginModal={() => setLoginModal(true)}/>
          <ToastContainer />
         
      
        {showLoginModal && <LoginModal onClose={() => setLoginModal(false)} onLoginSuccess={handleLoginSuccess} />}

      <Routes>
        <Route
          path="/"
          element={
            <ProductList
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
              searchTerm={searchTerm}
              cart={cart}
              user={user}
            />
          }
        />

        <Route
          path="/cart" 
          element={
            user ?(
            <Cart
              cartItems={cart}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              cart={cart}
              user={user}
              onProtectedClick={handleProtectedClick}
            />
            ) :(
          
        <Navigate to ="/" /> )
            } />
            
        <Route
          path="/product/:id"
          element={
          <ProductDetail addToCart={addToCart} cart={cart} user={user} onProtectedClick ={handleProtectedClick} />}
        />

        <Route path="/favorites" 
        element={
          user ?(
        <Favorites favorites={favorites} cart={cart}
              user={user}
              onProtectedClick={handleProtectedClick} /> ):( <Navigate to ="/" />  ) }/>

        <Route path="/add-product" element={<AddProduct />} />

        <Route path="/order" element={<Order />} />

        <Route path="/login" element={<Login  onLoginSuccess={handleLoginSuccess}/> } />
      </Routes>
    </Router>
  );
};

export default App;

