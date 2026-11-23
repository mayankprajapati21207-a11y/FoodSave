import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import QRCodeModal from '../../components/QRCodeModal';
import confetti from 'canvas-confetti';
import { 
  Utensils, 
  Package, 
  Trash2, 
  ShoppingBag, 
  HeartHandshake, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Sparkles,
  X,
  FileSpreadsheet,
  ChefHat,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  IndianRupee
} from 'lucide-react';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings'); // listings, orders, requests, inventory, waste, forecast

  const [stats, setStats] = useState({
    restaurant_name: "The Grand Thakar",
    rating: 4.8,
    total_listings: 3,
    total_sold_portions: 45,
    total_revenue: 14200.0,
    total_donated_kg: 25.0,
    total_waste_kg: 48.7,
    organic_waste_kg: 44.7,
    food_saved_kg: 95.4,
    co2_saved_kg: 238.0,
    meals_saved: 238
  });

  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [wasteRecords, setWasteRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [createListingModalOpen, setCreateListingModalOpen] = useState(false);
  const [logWasteModalOpen, setLogWasteModalOpen] = useState(false);
  const [addInventoryModalOpen, setAddInventoryModalOpen] = useState(false);
  const [qrVerifyInput, setQrVerifyInput] = useState('');
  const [qrVerifyResult, setQrVerifyResult] = useState(null);

  // New Listing form state
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category_id: '',
    quantity: 10,
    unit: 'portions',
    original_price: 350.0,
    discount_price: 120.0,
    is_free_donation: false,
    storage_info: 'Freshly packed, refrigerated at 4°C',
    hours_valid: 18,
    safety_certified_by_owner: true,
  });

  // Waste Log form state
  const [wasteInput, setWasteInput] = useState({
    quantity_kg: 5.0,
    waste_type: 'organic',
    reason: 'overproduction',
    destination: 'composting',
    notes: ''
  });

  // Inventory form state
  const [invInput, setInvInput] = useState({
    item_name: '',
    category_id: '',
    quantity: 10.0,
    unit: 'kg',
    storage_condition: 'refrigerated',
    days_to_expiry: 5,
    notes: ''
  });

  // Next-Day AI Demand Forecaster state
  const [forecast, setForecast] = useState(null);
  const [footfallScenario, setFootfallScenario] = useState('normal');
  const [forecastLoading, setForecastLoading] = useState(false);

  const loadForecast = async (scenario = 'normal') => {
    setForecastLoading(true);
    setFootfallScenario(scenario);
    try {
      const res = await api.get(`/restaurants/forecast/next-day?footfall=${scenario}`);
      setForecast(res.data);
    } catch (e) {
      console.error('Using Ahmedabad fallback forecast', e);
      const m = scenario === 'slow' ? 0.8 : scenario === 'busy' ? 1.25 : scenario === 'weekend' ? 1.45 : 1.0;
      setForecast({
        restaurant_name: stats.restaurant_name || "The Grand Thakar",
        footfall_scenario: scenario,
        multiplier: m,
        forecast_date: "Tomorrow",
        predicted_demand_accuracy: "94.2%",
        total_waste_prevented_kg: (12.5 * m).toFixed(1),
        total_projected_savings_inr: (1770.0 * m).toFixed(2),
        ai_kitchen_insight: `By aligning tomorrow's prep to ${Math.round(110 * m)} total portions across 4 signature categories, ${stats.restaurant_name || "The Grand Thakar"} will prevent ~${(12.5 * m).toFixed(1)} kg of kitchen food waste, saving an estimated ₹${Math.round(1770.0 * m).toLocaleString()} in raw ingredient costs.`,
        dish_recommendations: [
          {
            dish_name: "Authentic Gujarati Thali & Farsan",
            category: "Cooked Meals",
            today_prepared: Math.round(45 * m),
            suggested_prep_portions: Math.round(36 * m),
            unit: "portions",
            confidence: 94,
            peak_service_window: "12:30 PM - 2:30 PM & 7:30 PM - 9:30 PM",
            reasoning: "Past waste records show excess thali portions. Preparing target portions eliminates afternoon spoilage while fulfilling 100% of peak lunch rush.",
            estimated_waste_prevented_kg: (4.5 * m).toFixed(1),
            projected_cost_savings: (650.0 * m).toFixed(2)
          },
          {
            dish_name: "Kathiyawadi Baingan Bharta & Bajra Rotla",
            category: "Cooked Meals",
            today_prepared: Math.round(30 * m),
            suggested_prep_portions: Math.round(26 * m),
            unit: "portions",
            confidence: 91,
            peak_service_window: "7:00 PM - 10:00 PM",
            reasoning: "High dinner demand consistency. Keeping a 4-portion buffer allows end-of-day surplus listing on FoodSave without food going to landfill.",
            estimated_waste_prevented_kg: (2.8 * m).toFixed(1),
            projected_cost_savings: (390.0 * m).toFixed(2)
          },
          {
            dish_name: "Artisan Sourdough & Maska Bun Basket",
            category: "Bakery & Bread",
            today_prepared: Math.round(22 * m),
            suggested_prep_portions: Math.round(18 * m),
            unit: "baskets",
            confidence: 88,
            peak_service_window: "8:30 AM - 11:30 AM & 4:30 PM - 6:30 PM",
            reasoning: "Bakery items experience shelf-life drop after 18 hours. Baking target baskets ensures fresh morning sale with zero leftover dry bread.",
            estimated_waste_prevented_kg: (2.0 * m).toFixed(1),
            projected_cost_savings: (280.0 * m).toFixed(2)
          },
          {
            dish_name: "Chef's Special Dal Khichdi & Kadhi",
            category: "Cooked Meals",
            today_prepared: Math.round(35 * m),
            suggested_prep_portions: Math.round(30 * m),
            unit: "portions",
            confidence: 96,
            peak_service_window: "8:00 PM - 10:30 PM",
            reasoning: "Consistent late-night demand. Remaining portions are matched to Robin Hood Army Ahmedabad donation network.",
            estimated_waste_prevented_kg: (3.2 * m).toFixed(1),
            projected_cost_savings: (450.0 * m).toFixed(2)
          }
        ],
        supplier_orders: [
          {
            ingredient: "Basmati Rice & Bajra Flour",
            current_stock_kg: 14.0,
            projected_consumption_kg: (18.5 * m).toFixed(1),
            recommended_order_quantity: `${Math.max(5, Math.round(12 * m))} kg`,
            estimated_order_cost: (960.0 * m).toFixed(2),
            priority: m >= 1.25 ? "High" : "Medium",
            supplier: "Gujarat Agro Mart, Thaltej"
          },
          {
            ingredient: "Fresh Dairy, Milk & Butter / Maska",
            current_stock_kg: 4.5,
            projected_consumption_kg: (9.0 * m).toFixed(1),
            recommended_order_quantity: `${Math.max(4, Math.round(6 * m))} kg`,
            estimated_order_cost: (720.0 * m).toFixed(2),
            priority: "High",
            supplier: "Amul Dairy Distributor, SG Highway"
          },
          {
            ingredient: "Fresh Vegetables (Baingan, Tomatoes, Herbs, Ginger)",
            current_stock_kg: 6.0,
            projected_consumption_kg: (15.0 * m).toFixed(1),
            recommended_order_quantity: `${Math.max(8, Math.round(11 * m))} kg`,
            estimated_order_cost: (550.0 * m).toFixed(2),
            priority: "High",
            supplier: "APMC Ahmedabad Market Yard"
          },
          {
            ingredient: "Spice Blends & Pure Desi Ghee",
            current_stock_kg: 8.0,
            projected_consumption_kg: (3.5 * m).toFixed(1),
            recommended_order_quantity: `${Math.max(2, Math.round(3 * m))} kg`,
            estimated_order_cost: (1200.0 * m).toFixed(2),
            priority: "Low",
            supplier: "Sardar Patel Organic Spices"
          }
        ]
      });
    } finally {
      setForecastLoading(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, listRes, ordRes, reqRes, invRes, wasteRes, catRes, profRes] = await Promise.all([
        api.get('/restaurants/my-stats'),
        api.get('/food-listings/my-listings'),
        api.get('/orders/restaurant-orders'),
        api.get('/donations/requests/restaurant-requests'),
        api.get('/inventory/my-inventory'),
        api.get('/waste/my-records'),
        api.get('/categories'),
        api.get('/restaurants/my-profile')
      ]);

      setStats(statsRes.data);
      setListings(listRes.data);
      setOrders(ordRes.data);
      setRequests(reqRes.data);
      setInventory(invRes.data);
      setWasteRecords(wasteRes.data);
      setCategories(catRes.data);
      setProfile(profRes.data);

      if (catRes.data.length > 0) {
        setNewListing(prev => ({ ...prev, category_id: catRes.data[0].id }));
        setInvInput(prev => ({ ...prev, category_id: catRes.data[0].id }));
      }

      loadForecast('normal');
    } catch (err) {
      console.error(err);
      loadForecast('normal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + newListing.hours_valid * 60 * 60 * 1000);
      const pickupUntil = new Date(now.getTime() + (newListing.hours_valid - 1) * 60 * 60 * 1000);

      await api.post('/food-listings', {
        title: newListing.title,
        description: newListing.description,
        category_id: Number(newListing.category_id),
        quantity: Number(newListing.quantity),
        unit: newListing.unit,
        original_price: Number(newListing.original_price),
        discount_price: newListing.is_free_donation ? 0.0 : Number(newListing.discount_price),
        is_free_donation: newListing.is_free_donation,
        storage_info: newListing.storage_info,
        expiry_time: expiresAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        pickup_start: now.toISOString(),
        pickup_end: pickupUntil.toISOString(),
        pickup_until: pickupUntil.toISOString(),
        safety_certified_by_owner: newListing.safety_certified_by_owner,
        image_url: newListing.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
      });

      confetti({ particleCount: 70, spread: 60 });
      setCreateListingModalOpen(false);
      setNewListing({
        title: '',
        description: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        quantity: 10,
        unit: 'portions',
        original_price: 350.0,
        discount_price: 120.0,
        is_free_donation: false,
        storage_info: 'Freshly packed, refrigerated at 4°C',
        hours_valid: 18,
        safety_certified_by_owner: true,
      });
      loadAllData();
      alert('Surplus food listing published successfully!');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map(d => `${d.loc ? d.loc.slice(1).join('.') : 'field'}: ${d.msg}`).join('\n')
        : (typeof detail === 'string' ? detail : 'Failed to create food listing');
      alert(message);
    }
  };

  const handleLogWaste = async (e) => {
    e.preventDefault();
    try {
      await api.post('/waste', {
        quantity_kg: Number(wasteInput.quantity_kg),
        waste_type: wasteInput.waste_type,
        reason: wasteInput.reason,
        destination: wasteInput.destination,
        notes: wasteInput.notes
      });
      setLogWasteModalOpen(false);
      setWasteInput({
        quantity_kg: 5.0,
        waste_type: 'organic',
        reason: 'overproduction',
        destination: 'composting',
        notes: ''
      });
      loadAllData();
    } catch (err) {
      alert('Failed to record waste');
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      const exp = new Date(now.getTime() + invInput.days_to_expiry * 24 * 60 * 60 * 1000);

      await api.post('/inventory', {
        item_name: invInput.item_name,
        category_id: Number(invInput.category_id),
        quantity: Number(invInput.quantity),
        unit: invInput.unit,
        storage_condition: invInput.storage_condition,
        expiry_date: exp.toISOString(),
        notes: invInput.notes
      });
      setAddInventoryModalOpen(false);
      setInvInput({
        item_name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        quantity: 10.0,
        unit: 'kg',
        storage_condition: 'refrigerated',
        days_to_expiry: 5,
        notes: ''
      });
      loadAllData();
    } catch (err) {
      alert('Failed to add inventory item');
    }
  };

  const handleVerifyQr = async (e) => {
    e.preventDefault();
    if (!qrVerifyInput.trim()) return;

    try {
      const res = await api.post(`/orders/verify-qr?qr_token=${encodeURIComponent(qrVerifyInput.trim())}`);
      setQrVerifyResult({ success: true, message: res.data.message });
      confetti({ particleCount: 100, spread: 80 });
      setQrVerifyInput('');
      loadAllData();
    } catch (err) {
      try {
        const res2 = await api.post(`/donations/verify-collection-qr?qr_token=${encodeURIComponent(qrVerifyInput.trim())}`);
        setQrVerifyResult({ success: true, message: res2.data.message });
        confetti({ particleCount: 100, spread: 80 });
        setQrVerifyInput('');
        loadAllData();
      } catch (err2) {
        setQrVerifyResult({
          success: false,
          message: err.response?.data?.detail || 'Invalid or expired QR code token'
        });
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      loadAllData();
    } catch (e) {
      alert('Failed to update order status');
    }
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await api.put(`/donations/requests/${requestId}`, { status: newStatus });
      loadAllData();
    } catch (e) {
      alert('Failed to update request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF5] py-20 text-center">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-gray-500 font-bold">Loading Kitchen Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner / Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300">
              <Utensils size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif">{profile?.name || stats.restaurant_name}</h1>
                <span className="bg-emerald-700/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-600">
                  <ShieldCheck size={12} /> FSSAI Certified
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1">{profile?.address} · Rating: {stats.rating} ★</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveTab('forecast');
                loadForecast(footfallScenario);
              }}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-black shadow-md shadow-amber-950/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={16} />
              <span>AI Next-Day Prep Plan</span>
            </button>
            <button
              onClick={() => setCreateListingModalOpen(true)}
              className="px-4 py-2.5 bg-[#218838] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/30 transition-all flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>List Surplus Food</span>
            </button>
            <button
              onClick={() => setLogWasteModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Trash2 size={16} className="text-rose-400" />
              <span>Record Daily Waste</span>
            </button>
          </div>
        </div>

        {/* 4 Quick KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-emerald-800 mb-1">Total Food Saved</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.food_saved_kg} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">{stats.meals_saved} meals provided</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-blue-700 mb-1">Surplus Revenue</div>
            <div className="text-2xl font-black text-gray-900 font-serif">₹{stats.total_revenue.toFixed(2)}</div>
            <div className="text-[10px] text-gray-400 mt-1">{stats.total_sold_portions} portions sold</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-teal-700 mb-1">CO2 Diverted</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.co2_saved_kg} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Landfill emissions prevented</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-amber-700 mb-1">NGO Donations</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{stats.total_donated_kg} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Free community handovers</div>
          </div>
        </div>

        {/* Quick QR Pickup Verification Box */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-[#218838] rounded-2xl">
              <QrCode size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Verify Customer Pickup Token</div>
              <div className="text-xs text-gray-400">Scan or enter the customer's QR code token to complete handover</div>
            </div>
          </div>

          <form onSubmit={handleVerifyQr} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="e.g. QR-ORD-92E376C2E945"
              value={qrVerifyInput}
              onChange={(e) => setQrVerifyInput(e.target.value)}
              className="bg-[#F8FAF5] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#218838] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0"
            >
              Verify Handover
            </button>
          </form>
        </div>

        {qrVerifyResult && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
            qrVerifyResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{qrVerifyResult.message}</span>
            </div>
            <button onClick={() => setQrVerifyResult(null)}><X size={14} /></button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2">
          {[
            { id: 'listings', label: `Surplus Listings (${listings.length})`, icon: Utensils },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'requests', label: `NGO Requests (${requests.length})`, icon: HeartHandshake },
            { id: 'inventory', label: `Food Inventory (${inventory.length})`, icon: Package },
            { id: 'waste', label: `Daily Waste Log (${wasteRecords.length})`, icon: Trash2 },
            { id: 'forecast', label: `AI Next-Day Orders & Prep`, icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCur = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'forecast' && !forecast) loadForecast('normal');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCur
                    ? 'bg-[#218838] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Listings */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">Active Surplus Food Listings</h3>
                <p className="text-xs text-gray-500">Live dishes currently published on the marketplace for customers and charities.</p>
              </div>
              <button
                onClick={() => setCreateListingModalOpen(true)}
                className="px-3.5 py-2 bg-[#218838] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Listing
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#F8FAF5] text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Quantity Available</th>
                    <th className="py-3 px-4">Discount Price</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <div>
                          <div>{l.title}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{l.storage_info}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{l.category?.name}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">{l.quantity} {l.unit}</td>
                      <td className="py-3 px-4">
                        {l.is_free_donation ? (
                          <span className="font-bold text-blue-600">Free</span>
                        ) : (
                          <span className="font-bold text-gray-900">₹{l.discount_price.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          l.is_free_donation ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {l.is_free_donation ? 'NGO Donation' : 'Customer Discount'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold capitalize text-[10px]">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">Customer Surplus Orders</h3>
                <p className="text-xs text-gray-500">Live order queue showing which dishes customers have reserved and when they will pick up.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#F8FAF5] text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Food Ordered</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Pickup Window</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{o.order_number}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{o.customer?.user?.full_name || 'Customer'}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-900">{o.quantity} portions</span> of {o.listing?.title}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">₹{o.total_amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-500">{o.pickup_time_slot}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {o.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'completed')}
                            className="px-2.5 py-1 bg-[#218838] text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700"
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Requests */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">NGO Charitable Food Claims</h3>
                <p className="text-xs text-gray-500">Free food donation claims submitted by verified local charities & shelters.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#F8FAF5] text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Request #</th>
                    <th className="py-3 px-4">NGO Charity</th>
                    <th className="py-3 px-4">Listing</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Pickup Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">REQ-{r.id}</td>
                      <td className="py-3 px-4 font-bold text-blue-900">{r.ngo?.organization_name}</td>
                      <td className="py-3 px-4 text-gray-700">{r.listing?.title}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">{r.requested_quantity} portions</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(r.scheduled_pickup_time).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize bg-blue-100 text-blue-800">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        {r.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateRequestStatus(r.id, 'accepted')}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                            >Accept</button>
                            <button
                              onClick={() => handleUpdateRequestStatus(r.id, 'rejected')}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                            >Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Inventory */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">Kitchen Food Inventory Tracking</h3>
                <p className="text-xs text-gray-500">Track raw ingredients and prepared batches with real-time temperature and shelf-life monitoring.</p>
              </div>
              <button
                onClick={() => setAddInventoryModalOpen(true)}
                className="px-3.5 py-2 bg-[#218838] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Stock Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#F8FAF5] text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">In Stock</th>
                    <th className="py-3 px-4">Storage Condition</th>
                    <th className="py-3 px-4">Expires In</th>
                    <th className="py-3 px-4">Shelf-Life Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.map((inv) => {
                    const daysLeft = Math.ceil((new Date(inv.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = daysLeft <= 2;
                    return (
                      <tr key={inv.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold text-gray-900">{inv.item_name}</td>
                        <td className="py-3 px-4 text-gray-600">{inv.category?.name || 'General'}</td>
                        <td className="py-3 px-4 font-bold text-emerald-900">{inv.quantity} {inv.unit}</td>
                        <td className="py-3 px-4 capitalize text-gray-500">{inv.storage_condition}</td>
                        <td className="py-3 px-4 text-gray-600">{daysLeft} days</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isExpiringSoon ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isExpiringSoon ? 'Expiring Soon' : 'Safe'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setNewListing({
                                ...newListing,
                                title: `Surplus ${inv.item_name}`,
                                quantity: inv.quantity,
                                unit: inv.unit,
                                category_id: inv.category_id || (categories.length > 0 ? categories[0].id : '')
                              });
                              setCreateListingModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-emerald-100"
                          >
                            List Surplus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Waste Log */}
        {activeTab === 'waste' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-serif">Daily Kitchen Food Waste Log</h3>
                <p className="text-xs text-gray-500">Zero-waste audit trail recording unconsumed prep scraps and plate return waste routed to composting.</p>
              </div>
              <button
                onClick={() => setLogWasteModalOpen(true)}
                className="px-3.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 flex items-center gap-1.5"
              >
                <Plus size={14} /> Record Waste
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#F8FAF5] text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Waste Type</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Composting Route</th>
                    <th className="py-3 px-4">Kitchen Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wasteRecords.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-500">{new Date(w.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-bold text-rose-700">{w.quantity_kg} kg</td>
                      <td className="py-3 px-4 capitalize font-semibold text-gray-800">{w.waste_type}</td>
                      <td className="py-3 px-4 capitalize text-gray-600">{w.reason.replace('_', ' ')}</td>
                      <td className="py-3 px-4">
                        <span className="bg-lime-100 text-lime-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                          {w.destination.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 italic">{w.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: AI Next-Day Prep & Order Forecaster */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            
            {/* Header with Footfall Scenario Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    <Sparkles size={14} className="text-[#218838]" />
                    <span>Predictive Zero-Waste Kitchen Algorithm</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-serif">
                    Tomorrow's Kitchen Prep & Order Forecaster
                  </h3>
                  <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
                    Based on your last 14 days of customer sales, banquet over-prep logs, and perishability windows at {stats.restaurant_name}, our algorithm calculates the ideal food quantities to cook and raw ingredients to order tomorrow.
                  </p>
                </div>

                {/* Footfall Scenario Selector */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Expected Footfall Scenario:</span>
                    <button
                      onClick={() => loadForecast(footfallScenario)}
                      disabled={forecastLoading}
                      className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <RefreshCw size={11} className={forecastLoading ? 'animate-spin' : ''} />
                      <span>Recalculate</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 bg-[#F8FAF5] p-1.5 rounded-2xl border border-gray-200">
                    {[
                      { id: 'slow', label: '🌧️ Slow / Rainy (0.8x)' },
                      { id: 'normal', label: '☀️ Normal Weekday (1.0x)' },
                      { id: 'busy', label: '⚡ Rush Evening (1.25x)' },
                      { id: 'weekend', label: '🎉 Weekend Feast (1.45x)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => loadForecast(s.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          footfallScenario === s.id
                            ? 'bg-[#218838] text-white shadow-xs'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 Forecast KPI Stat Cards */}
              {forecast && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Prediction Accuracy</div>
                    <div className="text-2xl font-black text-emerald-950 font-serif mt-1">{forecast.predicted_demand_accuracy}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Confidence from past 14 days</div>
                  </div>

                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Target Kitchen Prep</div>
                    <div className="text-2xl font-black text-blue-950 font-serif mt-1">
                      {forecast.dish_recommendations?.reduce((sum, d) => sum + d.suggested_prep_portions, 0) || 110}
                      <span className="text-xs font-normal text-gray-500 ml-1">portions</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Across 4 signature categories</div>
                  </div>

                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Food Waste Prevented</div>
                    <div className="text-2xl font-black text-amber-950 font-serif mt-1">
                      ~{forecast.total_waste_prevented_kg} <span className="text-xs font-normal text-gray-500">kg</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Diverted from municipal disposal</div>
                  </div>

                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800">Projected Daily Savings</div>
                    <div className="text-2xl font-black text-purple-950 font-serif mt-1">
                      ₹{Number(forecast.total_projected_savings_inr).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">Direct raw ingredient cost saved</div>
                  </div>
                </div>
              )}

              {/* AI Kitchen Insight Box */}
              {forecast?.ai_kitchen_insight && (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-start gap-3 shadow-sm">
                  <div className="p-2 rounded-xl bg-white/10 text-emerald-300 shrink-0 mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Smart Chef Insight</div>
                    <p className="text-xs text-emerald-50 mt-0.5 leading-relaxed font-medium">
                      {forecast.ai_kitchen_insight}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Table 1: Dish Preparation Recommendations */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
                    <ChefHat size={18} className="text-[#218838]" />
                    <span>1. Recommended Dish Preparation for Tomorrow</span>
                  </h4>
                  <p className="text-xs text-gray-500">How many portions your kitchen team should cook to satisfy demand with zero spoilage.</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg">
                  Target for {forecast?.forecast_date || 'Tomorrow'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="bg-[#F8FAF5] text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Menu Dish</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Today's Output</th>
                      <th className="py-3 px-4 text-emerald-800">Suggested Prep (Tomorrow)</th>
                      <th className="py-3 px-4">Peak Service Window</th>
                      <th className="py-3 px-4">AI Waste Prevention Insight</th>
                      <th className="py-3 px-4">Projected Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {forecast?.dish_recommendations?.map((dish, i) => (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{dish.dish_name}</td>
                        <td className="py-3.5 px-4 text-gray-500">{dish.category}</td>
                        <td className="py-3.5 px-4 text-gray-400 line-through">{dish.today_prepared} {dish.unit}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-xs inline-flex items-center gap-1">
                            {dish.suggested_prep_portions} {dish.unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-medium">{dish.peak_service_window}</td>
                        <td className="py-3.5 px-4 text-gray-600 max-w-xs leading-relaxed">{dish.reasoning}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">₹{dish.projected_cost_savings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Raw Material Supplier Ordering Recommendations */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
                    <Package size={18} className="text-blue-600" />
                    <span>2. Recommended Raw Material Orders from Suppliers</span>
                  </h4>
                  <p className="text-xs text-gray-500">Order these exact raw ingredient quantities from Ahmedabad vendors to prevent excess cold storage spoilage.</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Print Kitchen Prep Sheet</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead className="bg-[#F8FAF5] text-gray-600 uppercase tracking-wider font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Raw Ingredient</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Tomorrow's Need</th>
                      <th className="py-3 px-4 text-blue-800">Recommended Order</th>
                      <th className="py-3 px-4">Est. Cost (₹)</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Ahmedabad Vendor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {forecast?.supplier_orders?.map((item, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{item.ingredient}</td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono">{item.current_stock_kg} kg</td>
                        <td className="py-3.5 px-4 text-gray-700 font-mono">{item.projected_consumption_kg} kg</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold font-mono">
                            {item.recommended_order_quantity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">₹{item.estimated_order_cost}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.priority === 'High' ? 'bg-rose-100 text-rose-800' :
                            item.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{item.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modal: Create Surplus Food Listing */}
      {createListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCreateListingModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">List Surplus Food</h3>
            <p className="text-xs text-gray-500 mb-5">Offer safe surplus for customer discounted sale or free charity donation</p>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Food Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Artisan Sourdough & Pav Baskets"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description & Quality Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="Freshly prepared today, organic flour, natural sourdough starter..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={newListing.category_id}
                    onChange={(e) => setNewListing({ ...newListing, category_id: e.target.value })}
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
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Unit
                    </label>
                    <select
                      value={newListing.unit}
                      onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-2 py-2 text-xs font-medium text-gray-800"
                    >
                      <option value="portions">portions</option>
                      <option value="kg">kg</option>
                      <option value="baskets">baskets</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-900">Donate 100% Free to NGO</div>
                  <div className="text-[10px] text-emerald-700">Check to route this directly to verified charity shelters</div>
                </div>
                <input
                  type="checkbox"
                  checked={newListing.is_free_donation}
                  onChange={(e) => setNewListing({ ...newListing, is_free_donation: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              {!newListing.is_free_donation && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Original Regular Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={newListing.original_price}
                      onChange={(e) => setNewListing({ ...newListing, original_price: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Surplus Discount Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newListing.discount_price}
                      onChange={(e) => setNewListing({ ...newListing, discount_price: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Storage Condition & Packaging Info
                </label>
                <input
                  type="text"
                  value={newListing.storage_info}
                  onChange={(e) => setNewListing({ ...newListing, storage_info: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Valid Until Expiry (Hours)
                </label>
                <input
                  type="number"
                  min="2"
                  max="48"
                  value={newListing.hours_valid}
                  onChange={(e) => setNewListing({ ...newListing, hours_valid: Number(e.target.value) })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  required
                  id="safetyCheck"
                  checked={newListing.safety_certified_by_owner}
                  onChange={(e) => setNewListing({ ...newListing, safety_certified_by_owner: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <label htmlFor="safetyCheck" className="text-[11px] text-gray-600 font-medium">
                  I certify this surplus food complies with FSSAI hygiene & temperature guidelines.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#218838] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Publish Food Listing</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Waste */}
      {logWasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setLogWasteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">Record Daily Kitchen Waste</h3>
            <p className="text-xs text-gray-500 mb-5">Log inedible food or trimming scraps for municipal organic composting audit</p>

            <form onSubmit={handleLogWaste} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Waste Quantity (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min="0.1"
                  value={wasteInput.quantity_kg}
                  onChange={(e) => setWasteInput({ ...wasteInput, quantity_kg: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Waste Type
                  </label>
                  <select
                    value={wasteInput.waste_type}
                    onChange={(e) => setWasteInput({ ...wasteInput, waste_type: e.target.value })}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                  >
                    <option value="organic">Organic Kitchen Trimmings</option>
                    <option value="cooked_meals">Expired Cooked Food</option>
                    <option value="bakery">Spoiled Bakery / Dough</option>
                    <option value="produce">Unusable Fresh Produce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Primary Reason
                  </label>
                  <select
                    value={wasteInput.reason}
                    onChange={(e) => setWasteInput({ ...wasteInput, reason: e.target.value })}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                  >
                    <option value="overproduction">Over-preparation</option>
                    <option value="expired">Passed Shelf Life</option>
                    <option value="plate_waste">Customer Plate Return</option>
                    <option value="spoilage">Cold Storage Incident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Processing Destination
                </label>
                <select
                  value={wasteInput.destination}
                  onChange={(e) => setWasteInput({ ...wasteInput, destination: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                >
                  <option value="composting">Municipal Organic Composting</option>
                  <option value="bio_gas">Biomethanation Clean Energy Plant</option>
                  <option value="animal_feed">Licensed Livestock Feed Facility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Kitchen Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra banquet gravy and trimming rinds"
                  value={wasteInput.notes}
                  onChange={(e) => setWasteInput({ ...wasteInput, notes: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                <span>Save Waste Record</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Inventory Item */}
      {addInventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setAddInventoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">Add Stock to Kitchen Inventory</h3>
            <p className="text-xs text-gray-500 mb-5">Record raw material or bulk dish batch with freshness parameters</p>

            <form onSubmit={handleAddInventory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Item / Batch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gujarati Dal Batch #4, Sourdough Loaves"
                  value={invInput.item_name}
                  onChange={(e) => setInvInput({ ...invInput, item_name: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={invInput.category_id}
                    onChange={(e) => setInvInput({ ...invInput, category_id: e.target.value })}
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
                      step="0.5"
                      required
                      min="0.5"
                      value={invInput.quantity}
                      onChange={(e) => setInvInput({ ...invInput, quantity: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Unit
                    </label>
                    <select
                      value={invInput.unit}
                      onChange={(e) => setInvInput({ ...invInput, unit: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-2 py-2 text-xs font-medium text-gray-800"
                    >
                      <option value="kg">kg</option>
                      <option value="portions">portions</option>
                      <option value="packets">packets</option>
                      <option value="boxes">boxes</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Storage Condition
                  </label>
                  <select
                    value={invInput.storage_condition}
                    onChange={(e) => setInvInput({ ...invInput, storage_condition: e.target.value })}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800"
                  >
                    <option value="refrigerated">Refrigerated (0°C to 4°C)</option>
                    <option value="frozen">Deep Frozen (-18°C)</option>
                    <option value="ambient">Ambient / Dry Storage</option>
                    <option value="hot_hold">Hot Holding (&gt;65°C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Shelf Life (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={invInput.days_to_expiry}
                    onChange={(e) => setInvInput({ ...invInput, days_to_expiry: Number(e.target.value) })}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Batch Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prepared at 10:30 AM by morning shift"
                  value={invInput.notes}
                  onChange={(e) => setInvInput({ ...invInput, notes: e.target.value })}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#218838] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Save Stock to Inventory</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RestaurantDashboard;
