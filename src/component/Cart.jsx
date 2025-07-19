import React, { useState } from 'react';
import { addOrder } from '../api/dummyJsonAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = ({ cartItems, updateCartQuantity, removeFromCart, clearCart }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();

  const getTotalPrice = () =>
    cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );

  const confirmRemove = (item) => {
    setItemToRemove(item);
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove.id);
    setShowConfirm(false);
    setItemToRemove(null);
  };

  const handleCheckout = async () => {
    try {
      const now = new Date();

      for (const item of cartItems) {
        const shippingInfo = item.shippingInformation || "Ships in 2 days";
        const days = parseInt(shippingInfo.match(/\d+/)) || 2;

        const deliveryDate = new Date(now);
        deliveryDate.setDate(now.getDate() + days);

        const order = {
          id: Math.random().toString(36).substring(2, 6),
          productId: item.id,
          title: item.title,
          quantity: item.quantity || 1,
          price: (item.price * (item.quantity || 1)).toFixed(2),
          image: item.thumbnail,
          orderDate: now.toISOString(),
          shippingDate: deliveryDate.toISOString(),
        };

        await addOrder(order);
      }

      toast.success("Order placed successfully!");
      clearCart(); 
      navigate("/order");
    } catch (error) {
      console.error("Order failed", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Your Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-contain" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-500">${item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, 'dec')}
                      className="px-2 bg-gray-200 rounded"
                    >−</button>
                    <span className="font-semibold">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 'inc')}
                      className="px-2 bg-gray-200 rounded"
                    >+</button>
                  </div>

                  <button
                    onClick={() => confirmRemove(item)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-blue-600 font-bold text-lg">
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <p className="text-lg font-bold">
              Total: ${getTotalPrice().toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              className="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to remove this item?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmRemove}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
