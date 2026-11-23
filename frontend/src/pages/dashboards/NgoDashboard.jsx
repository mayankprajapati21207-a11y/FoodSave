import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import QRCodeModal from '../../components/QRCodeModal';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  Utensils, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Sparkles,
  Users,
  Search,
  Building2,
  X
} from 'lucide-react';

const NgoDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse'); // browse, my_requests, direct_donations, history, profile

  const [stats, setStats] = useState({
    organization_name: "Robin Hood Army Ahmedabad (Thaltej Chapter)",
    is_verified: true,
    capacity_people_served: 850,
    total_food_collected_kg: 185.0,
    meals_distributed: 462,
    co2_diverted_kg: 462.5,
    active_pickups_count: 2
  });

  const [availableListings, setAvailableListings] = useState([]);
  const [availableDirectDonations, setAvailableDirectDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [claimedDonations, setClaimedDonations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [qrTitle, setQrTitle] = useState('');

  // Request modal
  const [requestModalListing, setRequestModalListing] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState(10);
  const [requestNotes, setRequestNotes] = useState('Scheduled for community night shelter dinner service.');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes, donRes, reqRes, claimedRes, profRes] = await Promise.all([
        api.get('/ngos/my-stats'),
        api.get('/food-listings?status_filter=available&is_free_only=true'),
        api.get('/donations/available'),
        api.get('/donations/requests/my-requests'),
        api.get('/donations/ngo-donations'),
        api.get('/ngos/my-profile')
      ]);

      setStats(statsRes.data);
      setAvailableListings(listRes.data);
      setAvailableDirectDonations(donRes.data);
      setMyRequests(reqRes.data);
      setClaimedDonations(claimedRes.data);
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

  const handleOpenRequestModal = (listing) => {
    setRequestModalListing(listing);
    setRequestQuantity(Math.min(listing.quantity, 15));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/donations/requests', {
        listing_id: requestModalListing.id,
        requested_quantity: Number(requestQuantity),
        notes: requestNotes
      });
      confetti({ particleCount: 100, spread: 70 });
      setRequestModalListing(null);
      loadData();
      alert('Food donation request submitted to kitchen!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimDirectDonation = async (donationId) => {
    try {
      await api.put(`/donations/${donationId}/claim`);
      confetti({ particleCount: 80, spread: 60 });
      loadData();
      alert('Donation claimed! Show your QR token upon pickup.');
    } catch (err) {
      alert('Failed to claim donation');
    }
  };

  const showCollectionQR = (token, title) => {
    setQrToken(token);
    setQrTitle(title);
    setQrModalOpen(true);
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-blue-300">
              <HeartHandshake size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif">{profile?.organization_name || stats.organization_name}</h1>
                <span className="bg-blue-600/80 text-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Charity
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-1">
                Reg: {profile?.registration_number || 'NGO-FED-8849-2022'} · Serving ~{stats.capacity_people_served} people/day
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <Utensils size={15} />
              <span>Browse Surplus to Claim</span>
            </button>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-blue-800 mb-1">Food Rescued</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.total_food_collected_kg} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Total collected to date</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-emerald-800 mb-1">Meals Shared</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.meals_distributed}</div>
            <div className="text-[10px] text-gray-400 mt-1">Shelter portions distributed</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-teal-800 mb-1">CO2 Diverted</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.co2_diverted_kg} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Emissions avoided</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-amber-800 mb-1">Active Pickups</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.active_pickups_count}</div>
            <div className="text-[10px] text-gray-400 mt-1">Pending thermal handovers</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2">
          {[
            { id: 'browse', label: `Available Surplus (${availableListings.length + availableDirectDonations.length})`, icon: Utensils },
            { id: 'my_requests', label: `Active Restaurant Pickups (${myRequests.length})`, icon: HeartHandshake },
            { id: 'direct_donations', label: `Direct Donor Claims (${claimedDonations.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCur = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCur
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Browse Available Food */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Restaurant Free Listings */}
            <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-serif">Free Restaurant Surplus Listings</h3>
                  <p className="text-xs text-gray-500">Chefs providing prepared nutritional food for local shelters</p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {availableListings.length} Available
                </span>
              </div>

              {availableListings.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No free restaurant listings available right now.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableListings.map((l) => (
                    <div key={l.id} className="p-4 rounded-2xl border border-gray-100 bg-[#F8FAF5] flex flex-col justify-between">
                      <div>
                        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                          <img src={l.image_url} alt="" className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                            100% Free Donation
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900">{l.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{l.description}</p>
                        <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                          <MapPin size={11} /> {l.restaurant?.name} ({l.restaurant?.address})
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">
                          {l.quantity} {l.unit} available
                        </span>
                        <button
                          onClick={() => handleOpenRequestModal(l)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Request Food
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Donor Donations */}
            <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-serif">Direct Donor Donations (Catering / Corporate)</h3>
                  <p className="text-xs text-gray-500">Unclaimed bulk banquet and grocery surplus</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  {availableDirectDonations.length} Available
                </span>
              </div>

              {availableDirectDonations.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No direct donor postings right now.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableDirectDonations.map((d) => (
                    <div key={d.id} className="p-4 rounded-2xl border border-gray-100 bg-[#F8FAF5] flex flex-col justify-between">
                      <div>
                        <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                          <img src={d.image_url} alt="" className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-amber-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                            Donor Bulk
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900">{d.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description}</p>
                        <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                          <MapPin size={11} /> {d.pickup_address}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800">
                          {d.quantity} {d.unit}
                        </span>
                        <button
                          onClick={() => handleClaimDirectDonation(d.id)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Claim Donation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Restaurant Requests */}
        {activeTab === 'my_requests' && (
          <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Active Surplus Handover Requests</h3>
              <p className="text-xs text-gray-500">Show the digital QR verification code upon arrival at the restaurant</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#F8FAF5] text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Food Item</th>
                    <th className="py-3 px-4">Restaurant</th>
                    <th className="py-3 px-4">Quantity Requested</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Pickup QR Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-900">{req.listing?.title}</td>
                      <td className="py-3 px-4 text-gray-700">{req.listing?.restaurant?.name}</td>
                      <td className="py-3 px-4 font-bold text-blue-900">{req.requested_quantity} portions</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          req.status === 'collected' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => showCollectionQR(req.qr_code_token, req.listing?.title)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
                        >
                          <QrCode size={13} />
                          <span>Show QR Code</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Direct Donations Claimed */}
        {activeTab === 'direct_donations' && (
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Claimed Direct Donations</h3>
              <p className="text-xs text-gray-500">Corporate caterer and event surplus ready for pickup</p>
            </div>

            <div className="space-y-3">
              {claimedDonations.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No claimed direct donations yet.</div>
              ) : (
                claimedDonations.map((d) => (
                  <div key={d.id} className="p-4 bg-[#F8FAF5] rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{d.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                          {d.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Quantity: {d.quantity} {d.unit}</p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} /> {d.pickup_address}
                      </p>
                    </div>

                    <button
                      onClick={() => showCollectionQR(d.qr_code_token, d.title)}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 flex items-center gap-1.5"
                    >
                      <QrCode size={14} /> Show Verification QR
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Modal: Request Food */}
      {requestModalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-blue-100 relative">
            <button
              onClick={() => setRequestModalListing(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">Request Food for Shelter</h3>
            <p className="text-xs text-gray-500 mb-5">{requestModalListing.title} ({requestModalListing.restaurant?.name})</p>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Required Quantity (Portions / kg) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={requestModalListing.quantity}
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
                />
                <span className="text-[10px] text-gray-400">Max available: {requestModalListing.quantity} {requestModalListing.unit}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Intended Beneficiaries & Notes
                </label>
                <textarea
                  rows="3"
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                ></textarea>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 border border-blue-100 flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-700 shrink-0" />
                <span>Our mobile collection vehicle maintains food thermal safety standards during transit.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalListing(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >{submitting ? 'Submitting...' : 'Submit Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={qrTitle}
        token={qrToken}
        subtext="Present this token to the kitchen or donor coordinator upon arrival"
      />

    </div>
  );
};

export default NgoDashboard;
