import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';
import { Package, Lock, Mail, User as UserIcon, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      if (isRegister) {
        const res = await authService.register(name, email, password, role);
        if (res.success && res.data) {
          login(res.data.token, res.data.user);
          toast.success('Account created successfully!');
          navigate('/dashboard');
        } else {
          toast.error(res.message || 'Registration failed');
        }
      } else {
        const res = await authService.login(email, password);
        if (res.success && res.data) {
          login(res.data.token, res.data.user);
          toast.success('Login successful');
          navigate('/dashboard');
        } else {
          toast.error(res.message || 'Login failed');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (isRegister ? 'Registration failed' : 'Invalid credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-[#F8FAFC] p-4">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-[24px] shadow-xl border border-white/20">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 text-center text-sm">
            {isRegister ? 'Register your user credentials below' : 'Sign in to Mini ERP Operations Portal'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900"
                  placeholder="Nikhil Rajput"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900"
                placeholder="nikhil@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900 appearance-none"
                >
                  <option value="ADMIN">ADMIN (Full Access)</option>
                  <option value="SALES">SALES (CRM & Challans)</option>
                  <option value="WAREHOUSE">WAREHOUSE (Products & Stock)</option>
                  <option value="ACCOUNTS">ACCOUNTS (Read-only Challans)</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Select ADMIN for full access to all features.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isRegister ? 'Register Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};
