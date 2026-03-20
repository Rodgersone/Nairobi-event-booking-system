import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/auth/register', formData);
      
      // FULL UPDATE: Match the nested user structure from backend
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        alert(`Karibu, ${response.data.user.name}! Account created.`);
        navigate('/'); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-10 pt-24">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-center mb-2 text-black tracking-tight">Join the Community</h2>
        <p className="text-gray-500 text-center mb-8 font-medium">Access exclusive events across Nairobi.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700 ml-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all bg-gray-50"
              placeholder="Kevin Kevo"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all bg-gray-50"
              placeholder="kevin@kevo.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700 ml-1">M-Pesa Number</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all bg-gray-50"
              placeholder="254700000000"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all bg-gray-50"
              placeholder="Min 6 characters"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-gray-800 disabled:opacity-50 transition shadow-lg active:scale-[0.98] mt-4"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-green-600 font-black hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;