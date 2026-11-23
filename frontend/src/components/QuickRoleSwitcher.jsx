import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Utensils, HeartHandshake, Heart, User, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

const QuickRoleSwitcher = () => {
  const { user, quickDemoLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { key: 'super_admin', label: 'Super Admin', name: 'Priya Sharma (State Admin)', email: 'admin@foodsave.org', path: '/dashboard/admin', icon: Shield, color: 'text-purple-600 bg-purple-50' },
    { key: 'restaurant', label: 'Restaurant Owner', name: 'Grand Thakar (Thaltej)', email: 'bistro@foodsave.org', path: '/dashboard/restaurant', icon: Utensils, color: 'text-emerald-700 bg-emerald-50' },
    { key: 'ngo', label: 'NGO / Charity', name: 'Robin Hood Army Ahmedabad', email: 'ngo@foodsave.org', path: '/dashboard/ngo', icon: HeartHandshake, color: 'text-blue-600 bg-blue-50' },
    { key: 'donor', label: 'Food Donor', name: 'Mehta Banquets (SG Hwy)', email: 'donor@foodsave.org', path: '/dashboard/donor', icon: Heart, color: 'text-amber-600 bg-amber-50' },
    { key: 'customer', label: 'Customer', name: 'Aarav Joshi (Thaltej)', email: 'customer@foodsave.org', path: '/dashboard/customer', icon: User, color: 'text-rose-600 bg-rose-50' },
  ];

  const handleSwitch = async (roleKey, targetPath) => {
    setSwitching(true);
    try {
      await quickDemoLogin(roleKey);
      navigate(targetPath);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 max-w-[calc(100vw-1.5rem)]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200/80 overflow-hidden transition-all duration-300">
        {open && (
          <div className="p-3 w-[calc(100vw-2rem)] max-w-xs sm:w-84 max-h-[70vh] overflow-y-auto border-b border-gray-100">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                1-Click Role Switcher
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Ahmedabad Demo
              </span>
            </div>
            <div className="space-y-1.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isCurrent = user?.role === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    disabled={switching}
                    onClick={() => handleSwitch(r.key, r.path)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-white/20 text-white' : r.color}`}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="font-bold">{r.label}</div>
                        <div className={`text-[10px] ${isCurrent ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {r.name}
                        </div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 size={16} className="text-white shrink-0" />
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Switch
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-[#218838] to-[#75B843] text-white text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-lime-300 animate-pulse"></span>
            <span>
              Role: <strong className="capitalize">{user ? user.role.replace('_', ' ') : 'Guest'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-90 text-[11px]">
            <span>Click to Switch Role</span>
            {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickRoleSwitcher;
