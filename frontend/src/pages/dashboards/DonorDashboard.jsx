import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import QRCodeModal from '../../components/QRCodeModal';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Building2, 
  QrCode,
  Sparkles,
  X
} from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('donations'); // donations, post, ngos, stats

  const [stats, setStats] = useState({
    total_donations_count: 2,
    collected_donations_count: 1,
    total_kg_donated: 115.0,
    meals_provided: 287,
    co2_saved_kg: 287.5
  });

  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal & QR
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [qrTitle, setQrTitle] = useState('');

  // Post donation state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState(25);
  const [unit, setUnit] = useState('kg');
  const [pickupAddress, setPickupAddress] = useState('Mehta Banquets, Behind Rajpath Club, Bodakdev, SG Highway, Ahmedabad 380059');
  const [hoursDeadline, setHoursDeadline] = useState(24);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, donRes, catRes, ngoRes, profRes] = await Promise.all([
        api.get('/donors/my-stats'),
        api.get('/donations/my-donations'),
        api.get('/categories'),
        api.get('/ngos'),
        api.get('/donors/my-profile')
      ]);

      setStats(statsRes.data);
      setDonations(donRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
      setNgos(ngoRes.data);
      setProfile(profRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePostDonation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const deadline = new Date(Date.now() + hoursDeadline * 3600 * 1000).toISOString();
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

      confetti({ particleCount: 100, spread: 70 });
      setTitle('');
      setDescription('');
      setActiveTab('donations');
      loadData();
      alert('Food donation posted! Verified charities have been notified for pickup.');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to post donation');
    } finally {
      setSubmitting(false);
    }
  };

  const showCollectionQR = (token, donTitle) => {
    setQrToken(token);
    setQrTitle(donTitle);
    setQrModalOpen(true);
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300">
              <Heart size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif">{profile?.organization_name || user?.full_name}</h1>
                <span className="bg-amber-700/80 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                  {profile?.donor_type || 'Corporate'} Donor
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-1">
                Connected with {ngos.length} certified regional food rescue non-profits
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('post')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md"
          >
            <Plus size={16} />
            <span>Post New Food Donation</span>
          </button>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-amber-800 mb-1">Total Food Donated</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.total_kg_donated} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Diverted from waste</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-emerald-800 mb-1">Meals Provided</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.meals_provided}</div>
            <div className="text-[10px] text-gray-400 mt-1">Direct community impact</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-teal-800 mb-1">Carbon Saved</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.co2_saved_kg} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Methane emissions avoided</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-purple-800 mb-1">Completed Collections</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.collected_donations_count}</div>
            <div className="text-[10px] text-gray-400 mt-1">Out of {stats.total_donations_count} postings</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2">
          {[
            { id: 'donations', label: `My Donations (${donations.length})`, icon: Heart },
            { id: 'post', label: 'Post Food Donation', icon: Plus },
            { id: 'ngos', label: `Nearby Partner NGOs (${ngos.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCur = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCur
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: My Donations */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">Donation History & Status</h3>
                <p className="text-xs text-gray-500">Track claim status, pickup coordination, and collection confirmation</p>
              </div>
              <button
                onClick={() => setActiveTab('post')}
                className="px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> New Donation
              </button>
            </div>

            <div className="space-y-3">
              {donations.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No food donations posted yet.</div>
              ) : (
                donations.map((d) => (
                  <div key={d.id} className="p-4 bg-[#F8FAF5] rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{d.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          d.status === 'collected' ? 'bg-emerald-100 text-emerald-800' :
                          d.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 font-medium mt-1">
                        Quantity: {d.quantity} {d.unit} · Category: {d.category?.name || 'Cooked Meals'}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Pickup Location: {d.pickup_address}
                      </p>
                      {d.ngo && (
                        <p className="text-[11px] text-blue-700 font-semibold mt-1">
                          Claimed by: {d.ngo.organization_name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showCollectionQR(d.qr_code_token, d.title)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs"
                      >
                        <QrCode size={14} /> Show Verification QR
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Post Donation */}
        {activeTab === 'post' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">Post a Food Donation</h3>
            <p className="text-xs text-gray-500 mb-6">Describe surplus catering, banquet, or grocery food for immediate charity rescue</p>

            <form onSubmit={handlePostDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Donation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Gourmet Wraps & Fresh Fruit Boxes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description & Handling Instructions
                </label>
                <textarea
                  rows="3"
                  placeholder="Sealed containers, stored chilled, includes 20 vegetarian portions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
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
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-2 py-2 text-xs font-medium text-gray-800"
                    >
                      <option value="kg">kg</option>
                      <option value="portions">portions</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pickup Address *
                </label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pickup Deadline Window
                </label>
                <select
                  value={hoursDeadline}
                  onChange={(e) => setHoursDeadline(Number(e.target.value))}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                >
                  <option value={8}>Within 8 Hours (Hot / Fresh)</option>
                  <option value={24}>Within 24 Hours (Refrigerated)</option>
                  <option value={48}>Within 48 Hours (Produce / Bakery)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-950 border border-amber-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-700 shrink-0" />
                <span>Certified wholesome and stored under hygienic conditions for human consumption.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                {submitting ? 'Publishing...' : 'Publish Food Donation'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Nearby NGOs */}
        {activeTab === 'ngos' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Verified Partner Charities</h3>
              <p className="text-xs text-gray-500">Organizations ready to pick up and distribute food donations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ngos.map((ngo) => (
                <div key={ngo.id} className="p-4 bg-[#F8FAF5] rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{ngo.organization_name}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{ngo.address}</p>
                  <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <Users size={12} /> Capacity: {ngo.capacity_people_served} meals / day
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={qrTitle}
        token={qrToken}
        subtext="Present this token to the NGO collection driver for handover verification"
      />

    </div>
  );
};

export default DonorDashboard;
