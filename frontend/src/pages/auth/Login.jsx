import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      
      // FULL UPDATE: Saving token and nested user object safely
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user)); 
        navigate('/'); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-gray-500 mb-8 font-medium">Securely login to your Nairobi Events account.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all bg-gray-50/50"
              placeholder="kevin@kevo.com"
              required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all bg-gray-50/50"
              placeholder="••••••••"
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all shadow-xl shadow-black/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        
        <p className="mt-10 text-gray-600 font-medium">
          New here? <Link to="/register" className="text-green-600 font-black hover:underline ml-1">Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;