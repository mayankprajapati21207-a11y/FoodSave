import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Utensils, 
  Tag, 
  HeartHandshake, 
  SlidersHorizontal,
  X
} from 'lucide-react';

const AvailableFood = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [maxPrice, setMaxPrice] = useState(500);
  const [isFreeOnly, setIsFreeOnly] = useState(false);

  // Reservation Modal state
  const [activeModalListing, setActiveModalListing] = useState(null);
  const [reserveQuantity, setReserveQuantity] = useState(1);
  const [pickupSlot, setPickupSlot] = useState("Today, 6:00 PM - 8:00 PM");
  const [submitting, setSubmitting] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = `/food-listings?status_filter=available`;
      if (selectedCategory) url += `&category_id=${selectedCategory}`;
      if (isFreeOnly) url += `&is_free_only=true`;
      if (maxPrice && !isFreeOnly) url += `&max_price=${maxPrice}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      setListings(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setCategories([]);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, isFreeOnly, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (activeModalListing.is_free_donation) {
      // NGO Request Flow
      if (user.role !== 'ngo') {
        alert('This free donation listing is reserved for registered NGO / Charity partners. Please switch role to NGO to request it.');
        return;
      }
      setSubmitting(true);
      try {
        await api.post('/donations/requests', {
          listing_id: activeModalListing.id,
          requested_quantity: reserveQuantity,
          notes: "Scheduled pickup for community shelter meals."
        });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        alert('Food request sent to restaurant! Check your NGO Dashboard for pickup schedule.');
        setActiveModalListing(null);
        navigate('/dashboard/ngo');
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to submit request');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Customer Order Flow
      if (user.role !== 'customer') {
        alert(`You are logged in as ${user.role.replace('_', ' ')}. Please switch role to Customer to purchase discounted meals.`);
        return;
      }
      setSubmitting(true);
      try {
        await api.post('/orders', {
          listing_id: activeModalListing.id,
          quantity: reserveQuantity,
          pickup_time_slot: pickupSlot,
          payment_method: "online"
        });
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        alert('Order reserved successfully! Show your pickup QR code at the counter.');
        setActiveModalListing(null);
        navigate('/dashboard/customer');
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to place order');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            Zero-Waste Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-serif mt-2">
            Available Surplus Food Today
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse delicious, perfectly safe surplus meals and bakery items prepared by verified local restaurants at steep discounts or available for NGO donation.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search food by name, ingredients, or restaurant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#F8FAF5] border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#218838] text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Search Food
            </button>
          </form>

          {/* Category Pills & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === null
                    ? 'bg-[#218838] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {(Array.isArray(categories) ? categories : []).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#218838] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Price slider & Free toggle */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-between sm:justify-start pt-2 lg:pt-0 border-t border-gray-100 lg:border-t-0">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={isFreeOnly}
                  onChange={(e) => setIsFreeOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
                />
                <span>Free NGO Donations Only</span>
              </label>

              {!isFreeOnly && (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/60">
                  <span className="text-emerald-800">Max: ₹{maxPrice}</span>
                  <input
                    type="range"
                    min="50"
                    max="600"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-24 accent-emerald-600 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-gray-500 font-semibold">Loading surplus delicacies...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-50 text-[#218838] rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">No Food Listings Found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Try adjusting your category filter, price limit, or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setIsFreeOnly(false);
                setMaxPrice(500);
                setSearch('');
              }}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(listings) ? listings : []).map((item) => {
              const discountPercent = item.original_price > 0
                ? Math.round(((item.original_price - item.discount_price) / item.original_price) * 100)
                : 100;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        {item.is_free_donation ? (
                          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Free NGO Donation
                          </span>
                        ) : (
                          <span className="bg-[#218838] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono">
                          <Clock size={11} /> Pickup: Today
                        </span>
                        <span className="bg-white/90 backdrop-blur-xs text-emerald-900 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                          {item.quantity} {item.unit} left
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                        <span>{item.category?.name || 'Cooked Entree'}</span>
                        <span className="flex items-center gap-1 text-emerald-600 lowercase font-normal">
                          <ShieldCheck size={12} /> food safety verified
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-gray-900 group-hover:text-[#218838] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Utensils size={13} className="text-emerald-600" />
                          <span>{item.restaurant?.name || 'Partner Restaurant'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <MapPin size={13} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{item.restaurant?.address || 'Downtown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer & Action */}
                  <div className="p-5 pt-0">
                    <div className="p-3 bg-emerald-50/60 rounded-2xl flex items-center justify-between">
                      <div>
                        {item.is_free_donation ? (
                          <div className="text-sm font-extrabold text-blue-700 font-serif">
                            ₹0.00 <span className="text-[10px] text-gray-500 font-sans">(Donation)</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-[#218838] font-serif">
                              ₹{item.discount_price.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{item.original_price.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setActiveModalListing(item);
                          setReserveQuantity(1);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
                          item.is_free_donation
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-[#218838] hover:bg-emerald-700'
                        }`}
                      >
                        {item.is_free_donation ? 'Request Food' : 'Reserve & Save'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Reservation & Order Modal */}
      {activeModalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 text-left relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalListing(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                activeModalListing.is_free_donation ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeModalListing.is_free_donation ? 'NGO Free Pickup' : 'Customer Surplus Booking'}
              </span>
            </div>

            <h3 className="text-lg font-black text-gray-900 font-serif">
              {activeModalListing.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">{activeModalListing.restaurant?.name}</p>

            <div className="space-y-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 mb-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Unit Price:</span>
                <span className="font-bold text-gray-900">
                  {activeModalListing.is_free_donation ? 'FREE (₹0.00)' : `₹${activeModalListing.discount_price.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Quantity Needed ({activeModalListing.unit}):</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReserveQuantity(Math.max(1, reserveQuantity - 1))}
                    className="w-7 h-7 bg-white rounded-lg border border-gray-200 font-bold"
                  >-</button>
                  <span className="font-bold text-xs px-2">{reserveQuantity}</span>
                  <button
                    onClick={() => setReserveQuantity(Math.min(activeModalListing.quantity, reserveQuantity + 1))}
                    className="w-7 h-7 bg-white rounded-lg border border-gray-200 font-bold"
                  >+</button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Select Pickup Window:
                </label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                >
                  <option value="Today, 6:00 PM - 7:30 PM">Today, 6:00 PM - 7:30 PM</option>
                  <option value="Today, 7:30 PM - 9:00 PM">Today, 7:30 PM - 9:00 PM</option>
                  <option value="Tomorrow Morning, 8:30 AM - 10:00 AM">Tomorrow Morning, 8:30 AM - 10:00 AM</option>
                </select>
              </div>

              {!activeModalListing.is_free_donation && (
                <div className="pt-2 border-t border-emerald-200/60 flex justify-between items-center text-sm font-black text-gray-900">
                  <span>Total Due at Pickup:</span>
                  <span className="text-[#218838]">₹{(activeModalListing.discount_price * reserveQuantity).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-100/60 p-3 rounded-xl mb-5">
              <ShieldCheck size={16} className="shrink-0 text-[#218838]" />
              <span>Certified under FoodSave safe cold-chain & packing protocol.</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveModalListing(null)}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleReserve}
                disabled={submitting}
                className="w-1/2 py-2.5 rounded-xl bg-[#218838] text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-700/20"
              >
                {submitting ? 'Confirming...' : 'Confirm Handover'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AvailableFood;
