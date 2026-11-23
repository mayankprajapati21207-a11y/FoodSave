import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Upload, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Users
} from 'lucide-react';

const DonateFood = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pickupAddress, setPickupAddress] = useState('Mehta Banquets, Behind Rajpath Club, Bodakdev, SG Highway, Ahmedabad 380059');
  const [hoursUntilExpiry, setHoursUntilExpiry] = useState(24);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, ngosRes] = await Promise.all([
          api.get('/categories'),
          api.get('/ngos')
        ]);
        setCategories(catsRes.data);
        if (catsRes.data.length > 0) setCategoryId(catsRes.data[0].id);
        setNgos(ngosRes.data && ngosRes.data.length > 0 ? ngosRes.data : [
          {
            id: 1,
            organization_name: 'Robin Hood Army Ahmedabad (Thaltej Chapter)',
            capacity_people_served: 850,
            address: 'Community Center, Near Zydus Hospital, Thaltej, Ahmedabad 380054',
            registration_number: 'GJ/AHM/2018/00912'
          },
          {
            id: 2,
            organization_name: 'Annamrita Foundation Gujarat',
            capacity_people_served: 1200,
            address: 'Vastrapur Lake Road, Vastrapur, Ahmedabad 380015',
            registration_number: 'GJ/AHM/2015/00431'
          }
        ]);
      } catch (e) {
        console.error(e);
        setNgos([
          {
            id: 1,
            organization_name: 'Robin Hood Army Ahmedabad (Thaltej Chapter)',
            capacity_people_served: 850,
            address: 'Community Center, Near Zydus Hospital, Thaltej, Ahmedabad 380054',
            registration_number: 'GJ/AHM/2018/00912'
          },
          {
            id: 2,
            organization_name: 'Annamrita Foundation Gujarat',
            capacity_people_served: 1200,
            address: 'Vastrapur Lake Road, Vastrapur, Ahmedabad 380015',
            registration_number: 'GJ/AHM/2015/00431'
          }
        ]);
      }
    };
    loadData();
  }, []);

  const handleSubmitDonation = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'donor' && user.role !== 'super_admin') {
      alert(`You are currently logged in as ${user.role.replace('_', ' ')}. Please switch to Food Donor role to post direct food donations.`);
      return;
    }

    setSubmitting(true);
    try {
      const deadline = new Date(Date.now() + hoursUntilExpiry * 3600 * 1000).toISOString();
      await api.post('/donations', {
        title,
        description,
        category_id: Number(categoryId),
        quantity: Number(quantity),
        unit,
        pickup_address: pickupAddress,
        pickup_deadline: deadline,
        image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      alert('Food donation posted successfully! Verified local NGOs have been notified.');
      navigate('/dashboard/donor');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-[#18391E] rounded-3xl p-8 sm:p-12 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#75B843] bg-emerald-800/80 px-3 py-1 rounded-full">
              Donor Portal & Network
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif mt-3 tracking-tight">
              Share Nourishment. <br />
              <span className="text-[#75B843]">Empower Local Shelters.</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-3 leading-relaxed">
              Are you an event caterer, conference organizer, banquet hall, or corporate canteen with wholesome surplus food? Post a donation in 60 seconds and let verified charity networks collect and distribute it safely.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Donation Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-50 text-[#218838] rounded-2xl">
                <HeartHandshake size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-serif">Post a Food Donation</h2>
                <p className="text-xs text-gray-500">Provide details so NGOs can coordinate prompt thermal collection</p>
              </div>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Food Title / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Fresh Gujarati Thali Portions & Khichdi Kadhi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Details & Storage Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Mention preparation time, packaging format (sealed foil trays, boxes), and whether hot or refrigerated..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Food Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.5"
                      placeholder="e.g. 25"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-2 py-2.5 text-xs sm:text-sm text-gray-800 font-medium"
                    >
                      <option value="kg">kg</option>
                      <option value="portions">portions</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pickup Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pickup Deadline Window
                  </label>
                  <select
                    value={hoursUntilExpiry}
                    onChange={(e) => setHoursUntilExpiry(Number(e.target.value))}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 font-medium"
                  >
                    <option value={6}>Within 6 Hours (Urgent Hot Food)</option>
                    <option value={12}>Within 12 Hours (Today)</option>
                    <option value={24}>Within 24 Hours (Refrigerated)</option>
                    <option value={48}>Within 48 Hours (Packaged/Produce)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 border border-emerald-100">
                <ShieldCheck size={18} className="text-[#218838] shrink-0" />
                <span>
                  <strong>Safety Pledge:</strong> I confirm this food has been prepared in a hygienic environment and stored within food safety temperature limits.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#218838] to-[#75B843] text-white rounded-2xl text-sm font-extrabold shadow-md shadow-emerald-700/20 hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                {submitting ? 'Publishing Donation...' : 'Publish Food Donation'}
              </button>
            </form>
          </div>

          {/* Nearby Verified NGOs List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">
                  Partner Charities & Shelters
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                Your donations are directly routed to verified NGOs with thermal vans and community kitchens.
              </p>

              <div className="space-y-4">
                {ngos.map((ngo) => (
                  <div key={ngo.id} className="p-4 bg-[#F8FAF5] rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-gray-900">{ngo.organization_name}</div>
                        <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <Users size={12} /> Serves {ngo.capacity_people_served} meals / day
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                          <MapPin size={11} /> {ngo.address}
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                        Reg: {ngo.registration_number || 'NGO-VERIFIED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick donor benefits */}
            <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Corporate Donor Benefits
              </h4>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#218838]" /> Official Digital Receipt for CSR Compliance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#218838]" /> Zero Disposal & Hauler Landfill Fees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#218838]" /> Real-time Carbon Offset Certification
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DonateFood;
