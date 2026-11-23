import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';
import { 
  Leaf, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  User, 
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Heart
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin': return '/dashboard/admin';
      case 'restaurant': return '/dashboard/restaurant';
      case 'ngo': return '/dashboard/ngo';
      case 'donor': return '/dashboard/donor';
      case 'customer': return '/dashboard/customer';
      default: return '/';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Admin</span>;
      case 'restaurant':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Restaurant</span>;
      case 'ngo':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">NGO Partner</span>;
      case 'donor':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Food Donor</span>;
      case 'customer':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Customer</span>;
      default:
        return null;
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Available Food', path: '/available-food' },
    { name: 'Donate Food', path: '/donate-food' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Partners', path: '/partner-restaurants' },
    { name: 'Impact & Stats', path: '/impact' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#218838] to-[#75B843] flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Leaf size={24} className="animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#252B25] flex items-center gap-1 font-serif">
                Food<span className="text-[#218838]">Save</span>
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#75B843] -mt-1">
                Save Food · Share Hope
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#218838] bg-emerald-50'
                      : 'text-gray-700 hover:text-[#218838] hover:bg-emerald-50/50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NotificationCenter />
                
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 text-sm font-bold transition-all border border-emerald-200/60"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all bg-white"
                  >
                    <img
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-500/20"
                    />
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[100px]">
                        {user.full_name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-gray-500 capitalize">
                        {user.role.replace('_', ' ')}
                      </div>
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900">{user.full_name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        <div className="mt-1">{getRoleBadge(user.role)}</div>
                      </div>
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium"
                      >
                        <LayoutDashboard size={14} /> My Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-medium text-left"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:text-[#218838] hover:bg-emerald-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#218838] to-[#75B843] text-white text-sm font-bold shadow-md shadow-emerald-700/20 hover:brightness-105 transition-all"
                >
                  <Sparkles size={16} />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated && <NotificationCenter />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#218838]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#218838] text-white font-bold text-sm shadow-sm"
                >
                  <LayoutDashboard size={16} /> Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-rose-600 font-bold text-sm"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl bg-gray-100 text-gray-800 font-bold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center rounded-xl bg-[#218838] text-white font-bold text-sm shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
