import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  Lock, 
  Mail, 
  ArrowRight, 
  Shield, 
  Utensils, 
  HeartHandshake, 
  Heart, 
  User, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const Login = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'super_admin', label: 'Super Admin', sub: 'Priya Sharma (Gujarat Hub)', email: 'admin@foodsave.org', pass: 'admin123', icon: Shield, color: 'border-purple-200 text-purple-700 bg-purple-50/50' },
    { role: 'restaurant', label: 'Restaurant Owner', sub: 'The Grand Thakar, Thaltej', email: 'bistro@foodsave.org', pass: 'restaurant123', icon: Utensils, color: 'border-emerald-200 text-emerald-800 bg-emerald-50/50' },
    { role: 'ngo', label: 'NGO / Charity', sub: 'Robin Hood Army Ahmedabad', email: 'ngo@foodsave.org', pass: 'ngo123', icon: HeartHandshake, color: 'border-blue-200 text-blue-700 bg-blue-50/50' },
    { role: 'donor', label: 'Food Donor', sub: 'Mehta Banquets, SG Highway', email: 'donor@foodsave.org', pass: 'donor123', icon: Heart, color: 'border-amber-200 text-amber-700 bg-amber-50/50' },
    { role: 'customer', label: 'Customer', sub: 'Aarav Joshi (Thaltej resident)', email: 'customer@foodsave.org', pass: 'customer123', icon: User, color: 'border-rose-200 text-rose-700 bg-rose-50/50' },
  ];

  const redirectByRole = (role) => {
    switch (role) {
      case 'super_admin': return '/dashboard/admin';
      case 'restaurant': return '/dashboard/restaurant';
      case 'ngo': return '/dashboard/ngo';
      case 'donor': return '/dashboard/donor';
      case 'customer': return '/dashboard/customer';
      default: return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = await login(email, password);
      navigate(redirectByRole(userData.role));
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (account) => {
    setEmail(account.email);
    setPassword(account.pass);
    setLoading(true);
    setError('');
    try {
      const userData = await quickDemoLogin(account.role);
      navigate(redirectByRole(userData.role));
    } catch (err) {
      setError('Failed to login with demo credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#218838] to-[#75B843] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Leaf size={26} />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-gray-900 font-serif">
            Welcome to FoodSave
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your role-specific dashboard and tools
          </p>
        </div>

        {/* 1-Click Demo Credentials Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-950 mb-3">
            <Sparkles size={14} className="text-[#218838]" />
            <span>1-Click Test Login (All 5 Roles)</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleDemoFill(acc)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs hover:brightness-95 transition-all ${acc.color}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {acc.label}
                        <span className="text-[10px] font-normal text-gray-500">· {acc.sub}</span>
                      </div>
                      <div className="text-[10px] text-gray-500">{acc.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold underline">Login</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Standard Form */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#218838] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#218838] hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
