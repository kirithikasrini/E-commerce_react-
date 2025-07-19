import React, { useEffect, useState } from 'react';
import { fetchAllOrders } from '../api/dummyJsonAPI';
import axios from 'axios';
import { toast } from 'react-toastify';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [confirmId, setConfirmId] = useState(null); 

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchAllOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${id}`);
      setOrders(orders.filter(order => order.id !== id));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error('Failed to cancel order');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🛒 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="italic text-gray-600">No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 mb-4 rounded shadow-sm border relative"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-purple-700 font-semibold">{order.title}</h3>
                <p>Quantity: {order.quantity}</p>
                <p>Total: ${(order.price * order.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  Ordered on: {new Date(order.orderDate).toLocaleString()}
                </p>
                <p className="text-green-600 text-sm">
                  Estimated delivery: {new Date(order.shippingDate).toDateString()}
                </p>
              </div>
              <img
                src={order.thumbnail}
                alt={order.title}
                className="w-20 h-20 object-contain rounded"
              />
            </div>

            
            <button
              className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => setConfirmId(order.id)}
            >
              Cancel Order
            </button>

            {confirmId === order.id && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow text-center">
                  <p className="mb-4 text-lg font-semibold"> Cancel this order? </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        handleDelete(order.id);
                        setConfirmId(null);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
