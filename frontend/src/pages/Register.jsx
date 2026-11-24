import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Utensils, 
  HeartHandshake, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // customer, restaurant, ngo, donor
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Role specific fields
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantCuisine, setRestaurantCuisine] = useState('Artisan Cafe & Bakery');

  const [ngoName, setNgoName] = useState('');
  const [ngoRegNo, setNgoRegNo] = useState('');
  const [ngoAddress, setNgoAddress] = useState('');

  const [donorType, setDonorType] = useState('organization');
  const [donorOrgName, setDonorOrgName] = useState('');

  const [customerAddress, setCustomerAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleOptions = [
    { key: 'customer', label: 'Customer', desc: 'Browse discounted surplus meals', icon: User },
    { key: 'restaurant', label: 'Restaurant Owner', desc: 'Manage surplus & log daily waste', icon: Utensils },
    { key: 'ngo', label: 'NGO / Charity', desc: 'Claim free donations for shelters', icon: HeartHandshake },
    { key: 'donor', label: 'Food Donor', desc: 'Caterers & event food donors', icon: Heart },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      role,
      full_name: fullName,
      email,
      password,
      phone,
      restaurant_name: role === 'restaurant' ? restaurantName : undefined,
      restaurant_address: role === 'restaurant' ? restaurantAddress : undefined,
      restaurant_cuisine: role === 'restaurant' ? restaurantCuisine : undefined,
      ngo_name: role === 'ngo' ? ngoName : undefined,
      ngo_registration_number: role === 'ngo' ? ngoRegNo : undefined,
      ngo_address: role === 'ngo' ? ngoAddress : undefined,
      donor_type: role === 'donor' ? donorType : undefined,
      donor_org_name: role === 'donor' ? donorOrgName : undefined,
      customer_address: role === 'customer' ? customerAddress : undefined,
    };

    try {
      const userData = await register(payload);
      confetti({ particleCount: 100, spread: 70 });
      const rolePaths = {
        restaurant: '/dashboard/restaurant',
        ngo: '/dashboard/ngo',
        donor: '/dashboard/donor',
        customer: '/dashboard/customer',
      };
      navigate(rolePaths[userData?.role] || '/dashboard/customer');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#218838] to-[#75B843] flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Leaf size={26} />
            </div>
          </Link>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-gray-900 font-serif">
            Create Your FoodSave Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Choose your role to get custom dashboard permissions and tools
          </p>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {roleOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = role === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRole(opt.key)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className={`p-2 rounded-xl mb-1.5 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon size={18} />
                </div>
                <div className="text-xs font-bold">{opt.label}</div>
              </button>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rajesh Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rajesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98250 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Dynamic fields based on role */}
            {role === 'restaurant' && (
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Restaurant Profile Information
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Grand Thakar, Thaltej"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Authentic Gujarati & Kathiyawadi"
                      value={restaurantCuisine}
                      onChange={(e) => setRestaurantCuisine(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Near Thaltej Cross Road, SG Highway, Ahmedabad 380054"
                      value={restaurantAddress}
                      onChange={(e) => setRestaurantAddress(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'ngo' && (
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  NGO / Charity Credentials
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robin Hood Army Ahmedabad"
                      value={ngoName}
                      onChange={(e) => setNgoName(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GJ/AHM/2018/00912"
                      value={ngoRegNo}
                      onChange={(e) => setNgoRegNo(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Operating Facility Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Near Zydus Hospital, Thaltej, Ahmedabad 380054"
                    value={ngoAddress}
                    onChange={(e) => setNgoAddress(e.target.value)}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {role === 'donor' && (
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Donor Profile
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Donor Type
                    </label>
                    <select
                      value={donorType}
                      onChange={(e) => setDonorType(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 font-medium"
                    >
                      <option value="organization">Corporate / Caterer</option>
                      <option value="individual">Individual Donor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Organization Name (if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mehta Banquets & Event Caterers"
                      value={donorOrgName}
                      onChange={(e) => setDonorOrgName(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'customer' && (
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Default Delivery / Home Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thaltej Shilaj Road, Thaltej, Ahmedabad 380054"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-[#218838] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#218838] hover:underline">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
