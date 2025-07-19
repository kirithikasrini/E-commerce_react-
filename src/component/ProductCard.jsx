import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast , Bounce} from 'react-toastify';

const ProductCard = ({ product, addToCart, toggleFavorite, isFavorited , cart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const[inCart,setInCart] = useState(false);

  useEffect(() => {
    const exist = Array.isArray(cart) && cart.some(item => item.id === product.id);
    setInCart(exist);
  }, [cart, product.id]);

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));


  const handleAddToCart = () => {
    if(!inCart){
      addToCart({ ...product, quantity : 1 })
      toast.success("Added to cart" , {
        position: "top-center",
        autoClose : 3000,
        closeOnClick:false,
        pauseOnHover:true,
        progress:undefined,
        theme:"dark",
        transition: Bounce,
      })
      setInCart(true);
    if (!user) {
      onProtectedCLick();
      return;
    }
    addToCart(product);
    toast.success("Added to cart");
  }
  };
  const handleFavoriteClick = () => {
    if(!user){
      onProtectedClick();
      return;
    }
    toggleFavorite(product);
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition">
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        />
        <button
          onClick={() => handleFavoriteClick(product)}
          className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow text-lg"
        >
        {isFavorited ? '💖' : '🤍'} 
        </button>

        <span
        className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded text-white font-medium
        ${product.stock === 0 ? 'bg-gray-400' :
        product.stock < 10 ? 'bg-red-400' : 'bg-green-400'}
        `   }>
        {product.stock === 0
          ? 'Out of Stock': product.stock < 10 ? 'Low Stock': 'In Stock'}
          </span>

      </div>

      <div className="p-4">
        <h3 className="font-semibold text-md cursor-pointer hover:text-fuchsia-600"
        onClick={() => navigate(`/product/${product.id}`)}>{product.title}</h3>
        <p className="text-fuchsia-600 font-bold mb-2">${product.price}</p>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(Math.round(product.rating))].map((_, i) => (
            <span key={i} className="text-yellow-400">★</span>
          ))}
          {[...Array(5 - Math.round(product.rating))].map((_, i) => (
            <span key={i} className="text-gray-300">★</span>
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-2 bg-fuchsia-500 text-white px-4 py-2 text-sm rounded hover:bg-fuchsia-600 transition w-full"
        >
         {inCart ? 'Go to Cart' : 'Add to Cart'}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;
