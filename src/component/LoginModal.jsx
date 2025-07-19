
import React, { useState } from 'react';
import { loginUser } from '../api/dummyJsonAPI';
import { toast } from 'react-toastify';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      toast.success(`Welcome, ${user.username}!`);
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-lg p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-fuchsia-600 mb-4">Login to Continue</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-fuchsia-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-fuchsia-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded hover:bg-fuchsia-700"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-fuchsia-600 font-medium hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
