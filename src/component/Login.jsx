import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../api/dummyJsonAPI';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const user = await loginUser(email, password); // ✅ single object

    toast.success("Login successful!");
    localStorage.setItem('user', JSON.stringify(user));

    if (onLoginSuccess) {
      onLoginSuccess(user);
    }

    navigate('/');
  } catch (error) {
    toast.error("Invalid Email or password");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-fuchsia-700">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
            <input
            type="email"
            className="w-full border px-4 py-3 rounded focus:outline-none focus:ring focus:border-fuchsia-500"
             placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
                />
            </div>

          
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border px-4 py-3 rounded focus:outline-none focus:ring focus:border-fuchsia-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fuchsia-600 text-white py-3 rounded font-semibold hover:bg-fuchsia-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{" "}
          <a href="/register" className="text-fuchsia-600 font-medium hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
