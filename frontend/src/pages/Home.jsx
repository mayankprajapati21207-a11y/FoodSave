import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import WasteCalculatorModal from '../components/WasteCalculatorModal';
import InteractiveMap from '../components/InteractiveMap';
import confetti from 'canvas-confetti';
import { 
  Leaf, 
  ArrowRight, 
  ShieldCheck, 
  Utensils, 
  HeartHandshake, 
  Sparkles, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Star, 
  Calculator,
  CheckCircle2,
  Users,
  Award
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [impactStats, setImpactStats] = useState({
    food_saved_kg: 2450,
    meals_provided: 6125,
    co2_diverted_kg: 6125,
    water_saved_liters: 5880000,
    partner_restaurants_count: 4,
    ngos_count: 2
  });
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [orderModalListing, setOrderModalListing] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, impactRes] = await Promise.all([
          api.get('/food-listings?status_filter=available'),
          api.get('/reports/impact')
        ]);
        const listings = Array.isArray(listingsRes?.data) ? listingsRes.data : [];
        setFeaturedListings(listings.slice(0, 4));
        if (impactRes?.data && typeof impactRes.data === 'object' && !Array.isArray(impactRes.data)) {
          setImpactStats((prev) => ({ ...prev, ...impactRes.data }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleQuickOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      alert(`You are currently logged in as ${user.role.replace('_', ' ')}. Please switch to Customer to purchase surplus food.`);
      return;
    }

    setOrderSubmitting(true);
    try {
      await api.post('/orders', {
        listing_id: orderModalListing.id,
        quantity: orderQuantity,
        pickup_time_slot: "Today, 6:30 PM - 8:00 PM",
        payment_method: "online"
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setOrderModalListing(null);
      alert('Order placed successfully! Check your dashboard for your pickup QR code.');
      navigate('/dashboard/customer');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen text-[#252B25]">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#18391E] text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#75B843_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Subtle background glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#75B843]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#218838]/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Leaf size={14} className="text-[#75B843]" />
                <span>Join The Circular Food Revolution</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-serif">
                Save Food. Feed People. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#75B843] to-lime-200">
                  Protect Our Planet.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                FoodSave seamlessly bridges local restaurants, donors, registered charities, and conscious customers. Discover high-quality surplus meals at up to 70% off, divert commercial waste from landfills, and share hope.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/available-food"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#75B843] to-[#218838] text-white font-extrabold text-sm shadow-xl shadow-emerald-950/40 hover:brightness-110 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                >
                  <Utensils size={18} />
                  <span>Explore Available Food</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} className="text-[#75B843]" />
                  <span>Register as Partner</span>
                </Link>

                <button
                  onClick={() => setCalculatorOpen(true)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs border border-emerald-700/50 transition-all flex items-center justify-center gap-2"
                >
                  <Calculator size={16} />
                  <span>Waste Calculator</span>
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/60 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-white font-serif">100%</div>
                  <div className="text-[11px] text-emerald-300 font-medium">Food Safety Inspected</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-serif">50-70%</div>
                  <div className="text-[11px] text-emerald-300 font-medium">Customer Savings</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-serif">0 kg</div>
                  <div className="text-[11px] text-emerald-300 font-medium">Landfill Target</div>
                </div>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative">
                  <img
                    src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80"
                    alt="Fresh surplus bakery and cooked meals"
                    className="w-full h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Floating Live Badge */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white text-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <Utensils size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">The Grand Thakar Artisan Maska Bun & Sourdough</div>
                        <div className="text-[11px] text-emerald-700 font-semibold">Today's Fresh Surplus · ₹120.00 <span className="line-through text-gray-400 font-normal">₹350.00</span></div>
                      </div>
                    </div>
                    <Link
                      to="/available-food"
                      className="px-3 py-1.5 bg-[#218838] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Live Impact Stats Counter Bar */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100 p-5 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="p-3 sm:p-0 rounded-2xl bg-emerald-50/40 sm:bg-transparent space-y-1 sm:border-r sm:border-gray-100">
              <div className="text-2xl sm:text-4xl font-black text-[#218838] font-serif">
                {Number(impactStats.food_saved_kg).toLocaleString()} <span className="text-sm sm:text-lg font-normal">kg</span>
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
                Surplus Food Rescued
              </div>
            </div>

            <div className="p-3 sm:p-0 rounded-2xl bg-lime-50/40 sm:bg-transparent space-y-1 sm:border-r sm:border-gray-100">
              <div className="text-2xl sm:text-4xl font-black text-[#75B843] font-serif">
                {Number(impactStats.meals_provided).toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
                Meals Distributed
              </div>
            </div>

            <div className="p-3 sm:p-0 rounded-2xl bg-teal-50/40 sm:bg-transparent space-y-1 sm:border-r sm:border-gray-100">
              <div className="text-2xl sm:text-4xl font-black text-emerald-800 font-serif">
                {Number(impactStats.co2_diverted_kg).toLocaleString()} <span className="text-sm sm:text-lg font-normal">kg</span>
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
                GHG Avoided
              </div>
            </div>

            <div className="p-3 sm:p-0 rounded-2xl bg-blue-50/40 sm:bg-transparent space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-teal-700 font-serif">
                {impactStats.partner_restaurants_count + impactStats.ngos_count}
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
                Kitchens & NGOs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How FoodSave Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            Transparent Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-serif mt-3">
            How FoodSave Works
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            A frictionless cycle connecting surplus kitchens with hungry communities and zero-waste diners in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#218838] flex items-center justify-center font-bold text-lg mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Restaurants List Surplus</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              At shift closing or banquet end, chefs log wholesome surplus portions, set pickup windows, and certify hygiene.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-lime-50 text-[#75B843] flex items-center justify-center font-bold text-lg mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Safety Verification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every listing passes storage temperature guidelines and shelf-life checks. Unsafe food is routed to organic composting.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Reserve or Donate</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              NGOs claim bulk free donations for shelters, while consumers purchase discounted delicious meals in 1 click.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">QR Code Handover</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Secure QR token verification ensures accurate collection, instant inventory update, and real-time impact tracking.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Featured Available Surplus Food */}
      <section className="py-16 bg-white border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#218838]">Fresh Opportunities Today</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif mt-1">
                Featured Surplus Meals
              </h2>
            </div>
            <Link
              to="/available-food"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#218838] hover:text-emerald-800 transition-colors"
            >
              <span>View All Available Food</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Array.isArray(featuredListings) ? featuredListings : []).map((listing) => (
              <div
                key={listing.id}
                className="bg-[#F8FAF5] rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    {listing.is_free_donation ? (
                      <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Free NGO Donation
                      </span>
                    ) : (
                      <span className="bg-[#218838] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {Math.round(((listing.original_price - listing.discount_price) / listing.original_price) * 100)}% Off
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono">
                    <Clock size={10} />
                    <span>Expires in 18h</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                      {listing.category?.name || 'Cooked Meals'}
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-[#218838] transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                    <div>
                      {listing.is_free_donation ? (
                        <span className="text-sm font-bold text-blue-700">Free Pickup</span>
                      ) : (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-[#218838] font-serif">
                            ₹{listing.discount_price.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{listing.original_price.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setOrderModalListing(listing);
                        setOrderQuantity(1);
                      }}
                      className="px-3 py-1.5 bg-[#218838] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Food Waste Reduction Benefits (Triple Bottom Line) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            Why It Matters
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-serif mt-3">
            Triple Bottom Line Impact
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Every plate rescued creates measurable positive ripple effects for society, businesses, and ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#218838] flex items-center justify-center mb-6">
              <IndianRupee size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Economic Benefit</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Restaurants recover production costs on otherwise lost inventory. Customers access nourishing gourmet meals at steep discounts. Donors receive documentation for CSR and tax relief.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <HeartHandshake size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Social Solidarity</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Empowering registered charities and shelters to reliably source warm, prepared meals for underserved families without logistics overhead or dignity barriers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-lime-50 text-[#75B843] flex items-center justify-center mb-6">
              <Leaf size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Planetary Preservation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Food decaying in landfills generates dangerous methane. Rescuing just 1 kg of food avoids 2.5 kg of greenhouse gases and conserves thousands of liters of virtual agricultural water.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Partner Network Map */}
      <section className="py-16 bg-white border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#218838]">Live Geographic Network</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif mt-1">
              Find Food Near You
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Explore participating restaurants with surplus ready for pickup and nearby partner NGOs.
            </p>
          </div>
          <InteractiveMap height="460px" />
        </div>
      </section>

      {/* 7. Community Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-serif mt-3">
            Voices from Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "As an authentic dining restaurant in Thaltej, judging daily banquet and thali demand is challenging. FoodSave transformed our closing hour. Rather than discarding fresh surplus, conscious neighbors and charities collect them. We recovered ₹65,000 last month alone!"
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=100&q=80"
                alt="Rajesh Patel"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-gray-900">Rajesh Patel</div>
                <div className="text-[10px] text-gray-500">Executive Chef, The Grand Thakar, Thaltej</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "Our Ahmedabad team serves over 850 hot meals daily across Thaltej, SG Highway, and Bodakdev. The seamless donation requests and QR collection verification on FoodSave have made receiving fresh food dependable and completely dignified."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                alt="Dharmesh Shah"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-gray-900">Dharmesh Shah</div>
                <div className="text-[10px] text-gray-500">City Coordinator, Robin Hood Army Ahmedabad</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "I get gourmet fresh meals and artisanal thalis for under ₹150 on my commute along SG Highway, knowing I helped prevent food waste. FoodSave is hands down the best sustainability initiative in Ahmedabad."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="Aarav Joshi"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-gray-900">Aarav Joshi</div>
                <div className="text-[10px] text-gray-500">Resident, Thaltej, Ahmedabad</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="bg-gradient-to-r from-[#218838] to-[#75B843] py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
            Ready to Turn Food Waste into Shared Hope?
          </h2>
          <p className="text-sm sm:text-base text-emerald-50 max-w-xl mx-auto leading-relaxed">
            Whether you run a kitchen, coordinate a charity, cater events, or simply care about delicious affordable food, FoodSave is free to join.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-white text-[#218838] font-black text-sm shadow-xl hover:bg-emerald-50 transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-2xl bg-emerald-900/40 border border-white/30 text-white font-bold text-sm hover:bg-emerald-900/60 transition-all"
            >
              Contact Our Enterprise Team
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Order Modal */}
      {orderModalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 text-left relative">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Reserve Surplus Food
            </h3>
            <p className="text-xs text-gray-500 mb-4">{orderModalListing.title}</p>
            
            <div className="bg-emerald-50/50 p-4 rounded-2xl mb-4 border border-emerald-100">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-600">Unit Price:</span>
                <span className="font-bold text-[#218838]">₹{orderModalListing.discount_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-600">Quantity to Reserve:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-xs"
                  >-</button>
                  <span className="font-bold text-xs px-2">{orderQuantity}</span>
                  <button
                    onClick={() => setOrderQuantity(Math.min(orderModalListing.quantity, orderQuantity + 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-xs"
                  >+</button>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-200/60 flex justify-between items-center text-sm font-black text-gray-900">
                <span>Total Amount:</span>
                <span className="text-[#218838]">₹{(orderModalListing.discount_price * orderQuantity).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-xl">
              <strong>Pickup Slot:</strong> Today between 6:30 PM - 8:00 PM at {orderModalListing.restaurant?.name || 'Restaurant'}.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setOrderModalListing(null)}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickOrder}
                disabled={orderSubmitting}
                className="w-1/2 py-2.5 rounded-xl bg-[#218838] text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-700/20"
              >
                {orderSubmitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      <WasteCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

    </div>
  );
};

export default Home;
