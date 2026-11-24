import axios from 'axios';
import {
  INITIAL_CATEGORIES,
  INITIAL_RESTAURANTS,
  INITIAL_NGOS,
  INITIAL_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_WASTE,
  getStoredData,
  saveStoredData
} from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Resilient Mock Data Engine for offline preview & testing
export function handleMockFallback(config) {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  console.info(`[FoodSave Mock Engine] Serving: ${method.toUpperCase()} ${url}`);

  // Auth: Registration
  if (url.includes('/auth/register')) {
    let body = {};
    if (typeof config.data === 'string') {
      try {
        body = JSON.parse(config.data || '{}');
      } catch (e) {
        body = {};
      }
    } else if (config.data && typeof config.data === 'object') {
      body = config.data;
    }
    const role = body.role || 'customer';
    const newId = Date.now();
    const newUser = {
      id: newId,
      email: body.email || 'user@foodsave.org',
      full_name: body.full_name || 'FoodSave Partner',
      phone: body.phone || '+91 99784 28476',
      role: role,
      is_active: true,
      is_verified: true,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString()
    };

    // Store in registered users list
    const regUsers = getStoredData('registered_users', []);
    regUsers.push({ ...newUser, password: body.password });
    saveStoredData('registered_users', regUsers);

    // Profile initialization for role
    if (role === 'restaurant') {
      const rests = getStoredData('restaurants', INITIAL_RESTAURANTS);
      const newRest = {
        id: newId,
        user_id: newId,
        name: body.restaurant_name || body.full_name || "My Restaurant",
        cuisine_type: body.restaurant_cuisine || "Authentic Cuisine",
        address: body.restaurant_address || "SG Highway, Thaltej, Ahmedabad",
        city: "Ahmedabad",
        rating: 5.0,
        opening_hours: "11:00 AM - 11:00 PM",
        description: "Fresh cuisine with zero food waste commitment.",
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        latitude: 23.0500,
        longitude: 72.5100
      };
      rests.unshift(newRest);
      saveStoredData('restaurants', rests);
      saveStoredData('my_restaurant_profile', newRest);
    } else if (role === 'ngo') {
      const ngos = getStoredData('ngos', INITIAL_NGOS);
      const newNgo = {
        id: newId,
        user_id: newId,
        organization_name: body.ngo_name || body.full_name || "Community Food Relief NGO",
        registration_number: body.ngo_registration_number || "GJ/AHM/2026/089",
        capacity_people_served: 750,
        address: body.ngo_address || "Thaltej, Ahmedabad",
        latitude: 23.0520,
        longitude: 72.5120,
        is_verified: true
      };
      ngos.unshift(newNgo);
      saveStoredData('ngos', ngos);
      saveStoredData('my_ngo_profile', newNgo);
    } else if (role === 'donor') {
      const newDonor = {
        id: newId,
        user_id: newId,
        organization_name: body.donor_org_name || body.full_name || "Community Food Donor",
        donor_type: body.donor_type || "organization",
        address: "Bodakdev, SG Highway, Ahmedabad",
        is_verified: true
      };
      saveStoredData('my_donor_profile', newDonor);
    }

    const token = `jwt_mock_${newId}`;
    return {
      data: {
        access_token: token,
        token_type: "bearer",
        user: newUser
      },
      status: 200
    };
  }

  // Auth: Login
  if (url.includes('/auth/login')) {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const email = (body.email || '').toLowerCase();

    const demoProfiles = {
      'admin@foodsave.org': { id: 1, email: 'admin@foodsave.org', full_name: 'Priya Sharma (Admin)', role: 'super_admin', is_active: true },
      'bistro@foodsave.org': { id: 2, email: 'bistro@foodsave.org', full_name: 'Rajesh Patel (Chef)', role: 'restaurant', is_active: true },
      'ngo@foodsave.org': { id: 3, email: 'ngo@foodsave.org', full_name: 'Dharmesh Shah (NGO)', role: 'ngo', is_active: true },
      'donor@foodsave.org': { id: 4, email: 'donor@foodsave.org', full_name: 'Anil Mehta (Donor)', role: 'donor', is_active: true },
      'customer@foodsave.org': { id: 5, email: 'customer@foodsave.org', full_name: 'Aarav Joshi', role: 'customer', is_active: true }
    };

    const regUsers = getStoredData('registered_users', []);
    const foundReg = regUsers.find((u) => (u.email || '').toLowerCase() === email);
    const demo = demoProfiles[email];

    const loggedUser = foundReg || demo || {
      id: Date.now(),
      email: body.email || 'user@foodsave.org',
      full_name: (body.email || 'user').split('@')[0],
      role: 'customer',
      is_active: true,
      is_verified: true,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString()
    };

    const token = `jwt_mock_${loggedUser.id}`;
    return {
      data: {
        access_token: token,
        token_type: "bearer",
        user: loggedUser
      },
      status: 200
    };
  }

  // Auth: Current Profile Check
  if (url.includes('/auth/me')) {
    const saved = localStorage.getItem('foodsave_user');
    const u = saved ? JSON.parse(saved) : { id: 1, email: 'customer@foodsave.org', full_name: 'Aarav Joshi', role: 'customer' };
    return { data: u, status: 200 };
  }

  // Categories
  if (url.includes('/categories')) {
    return { data: INITIAL_CATEGORIES, status: 200 };
  }

  // Restaurants
  if (url.includes('/restaurants/my-stats')) {
    return {
      data: {
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
      },
      status: 200
    };
  }

  // NGO My Stats
  if (url.includes('/ngos/my-stats')) {
    return {
      data: {
        organization_name: "Robin Hood Army Ahmedabad (Thaltej Chapter)",
        is_verified: true,
        capacity_people_served: 850,
        total_food_collected_kg: 185.0,
        meals_distributed: 462,
        co2_diverted_kg: 462.5,
        active_pickups_count: 2
      },
      status: 200
    };
  }

  // Donor My Stats
  if (url.includes('/donors/my-stats')) {
    return {
      data: {
        total_donations_count: 2,
        collected_donations_count: 1,
        total_kg_donated: 115.0,
        meals_provided: 287,
        co2_saved_kg: 287.5
      },
      status: 200
    };
  }

  if (url.includes('/restaurants/my-profile')) {
    const customProfile = getStoredData('my_restaurant_profile', INITIAL_RESTAURANTS[0]);
    return { data: customProfile, status: 200 };
  }

  // NGO Profile
  if (url.includes('/ngos/my-profile')) {
    const customNgo = getStoredData('my_ngo_profile', INITIAL_NGOS[0]);
    return { data: customNgo, status: 200 };
  }

  // Donor Profile
  if (url.includes('/donors/my-profile')) {
    const customDonor = getStoredData('my_donor_profile', {
      id: 1,
      organization_name: "Mehta Banquets & Catering",
      donor_type: "organization",
      address: "Bodakdev, SG Highway, Ahmedabad"
    });
    return { data: customDonor, status: 200 };
  }

  if (url.includes('/restaurants/forecast/next-day')) {
    const m = url.includes('slow') ? 0.8 : url.includes('busy') ? 1.25 : url.includes('weekend') ? 1.45 : 1.0;
    return {
      data: {
        restaurant_name: "The Grand Thakar",
        footfall_scenario: "normal",
        multiplier: m,
        forecast_date: "Tomorrow",
        predicted_demand_accuracy: "94.2%",
        total_waste_prevented_kg: (12.5 * m).toFixed(1),
        total_projected_savings_inr: (1770.0 * m).toFixed(2),
        ai_kitchen_insight: `By aligning tomorrow's prep to ${Math.round(110 * m)} total portions across 4 signature categories, The Grand Thakar will prevent ~${(12.5 * m).toFixed(1)} kg of kitchen food waste, saving an estimated ₹${Math.round(1770.0 * m).toLocaleString()} in raw ingredient costs.`,
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
      },
      status: 200
    };
  }

  if (url.includes('/restaurants')) {
    return { data: INITIAL_RESTAURANTS, status: 200 };
  }

  // NGOs
  if (url.includes('/ngos')) {
    return { data: INITIAL_NGOS, status: 200 };
  }

  // Food Listings
  if (url.includes('/food-listings')) {
    const stored = getStoredData('listings', INITIAL_LISTINGS);
    if (method === 'post') {
      const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
      const newListing = {
        id: stored.length + 1,
        title: body.title || "Surplus Delicacy",
        description: body.description || "",
        category_id: Number(body.category_id) || 1,
        category: { id: Number(body.category_id) || 1, name: "Cooked Meals" },
        restaurant_id: 1,
        restaurant: INITIAL_RESTAURANTS[0],
        quantity: Number(body.quantity) || 10,
        unit: body.unit || "portions",
        original_price: Number(body.original_price) || 350.0,
        discount_price: body.is_free_donation ? 0.0 : Number(body.discount_price) || 120.0,
        is_free_donation: Boolean(body.is_free_donation),
        storage_info: body.storage_info || "Freshly packed, refrigerated at 4°C",
        status: "available",
        image_url: body.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
      };
      stored.unshift(newListing);
      saveStoredData('listings', stored);
      return { data: newListing, status: 200 };
    }
    return { data: Array.isArray(stored) ? stored : INITIAL_LISTINGS, status: 200 };
  }

  // Impact Reports
  if (url.includes('/reports/impact')) {
    return {
      data: {
        food_saved_kg: 2450.0,
        meals_provided: 6125,
        co2_diverted_kg: 6125.0,
        water_saved_liters: 5880000,
        total_waste_kg: 480.0,
        organic_processed_kg: 390.0,
        partner_restaurants_count: 3,
        ngos_count: 2,
        monthly_trends: [
          { month: 'Jun', food_saved_kg: 420, waste_recorded_kg: 180 },
          { month: 'Jul', food_saved_kg: 680, waste_recorded_kg: 210 },
          { month: 'Aug', food_saved_kg: 950, waste_recorded_kg: 190 },
          { month: 'Sep', food_saved_kg: 1340, waste_recorded_kg: 240 },
          { month: 'Oct', food_saved_kg: 1820, waste_recorded_kg: 280 },
          { month: 'Nov', food_saved_kg: 2450, waste_recorded_kg: 310 }
        ]
      },
      status: 200
    };
  }

  // Leaderboard
  if (url.includes('/admin/leaderboard')) {
    return {
      data: [
        { restaurant_id: 1, restaurant_name: "The Grand Thakar", cuisine_type: "Authentic Gujarati & Kathiyawadi", food_saved_kg: 840, meals_provided: 2100, co2_diverted_kg: 2100, rating: 4.8 },
        { restaurant_id: 2, restaurant_name: "Gordhan Thal", cuisine_type: "Royal Gujarati Dining", food_saved_kg: 620, meals_provided: 1550, co2_diverted_kg: 1550, rating: 4.9 },
        { restaurant_id: 3, restaurant_name: "Sankalp Express", cuisine_type: "South Indian & Fast Food", food_saved_kg: 480, meals_provided: 1200, co2_diverted_kg: 1200, rating: 4.6 }
      ],
      status: 200
    };
  }

  // Orders
  if (url.includes('/orders')) {
    const orders = getStoredData('orders', INITIAL_ORDERS);
    if (method === 'post') {
      const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
      const newOrd = {
        id: orders.length + 1,
        order_number: `FS-ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        customer: { user: { full_name: "Aarav Joshi", email: "customer@foodsave.org" } },
        listing: INITIAL_LISTINGS[0],
        quantity: body.quantity || 1,
        total_amount: (body.quantity || 1) * 120.0,
        pickup_time_slot: body.pickup_time_slot || "Today, 6:30 PM - 8:00 PM",
        qr_code_token: `QR-ORD-${Date.now().toString(36).toUpperCase()}`,
        status: "confirmed"
      };
      orders.unshift(newOrd);
      saveStoredData('orders', orders);
      return { data: newOrd, status: 200 };
    }
    return { data: Array.isArray(orders) ? orders : INITIAL_ORDERS, status: 200 };
  }

  // QR Verification
  if (url.includes('/verify-qr')) {
    return { data: { success: true, message: "QR Token Successfully Verified! Order Marked as Completed." }, status: 200 };
  }

  // Donations
  if (url.includes('/donations')) {
    const defaultDonations = [
      {
        id: 1,
        title: "50 Gourmet Wraps & Fresh Fruit Boxes",
        description: "Packed banquet catering surplus, vegetarian and fruit boxes.",
        quantity: 50,
        unit: "boxes",
        status: "available",
        pickup_address: "Mehta Banquets, Behind Rajpath Club, Bodakdev, SG Highway, Ahmedabad 380059",
        category: { id: 1, name: "Cooked Meals" },
        donor: { organization_name: "Mehta Banquets & Catering" },
        qr_code_token: "QR-DON-92819A"
      }
    ];
    const don = getStoredData('donations', defaultDonations);
    if (method === 'post') {
      const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
      const newD = {
        id: don.length + 1,
        title: body.title || "Surplus Banquet Food",
        description: body.description || "",
        quantity: body.quantity || 20,
        unit: body.unit || "portions",
        status: "available",
        pickup_address: body.pickup_address || "Thaltej, Ahmedabad",
        category: { id: 1, name: "Cooked Meals" },
        donor: { organization_name: "Community Donor" },
        qr_code_token: `QR-DON-${Date.now().toString(36).toUpperCase()}`
      };
      don.unshift(newD);
      saveStoredData('donations', don);
      return { data: newD, status: 200 };
    }
    return { data: Array.isArray(don) ? don : defaultDonations, status: 200 };
  }

  // Inventory
  if (url.includes('/inventory')) {
    const inv = getStoredData('inventory', INITIAL_INVENTORY);
    if (method === 'post') {
      const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
      const newItem = {
        id: inv.length + 1,
        item_name: body.item_name || 'Kitchen Prep Item',
        category: { name: 'Cooked Meals' },
        quantity: body.quantity || 10,
        unit: body.unit || 'kg',
        storage_condition: body.storage_condition || 'refrigerated',
        expiry_date: body.expiry_date || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_stock'
      };
      inv.unshift(newItem);
      saveStoredData('inventory', inv);
      return { data: newItem, status: 200 };
    }
    return { data: Array.isArray(inv) ? inv : INITIAL_INVENTORY, status: 200 };
  }

  // Waste
  if (url.includes('/waste')) {
    const waste = getStoredData('waste', INITIAL_WASTE);
    if (method === 'post') {
      const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
      const newW = {
        id: waste.length + 1,
        date: new Date().toISOString(),
        quantity_kg: body.quantity_kg || 5.0,
        waste_type: body.waste_type || 'organic',
        reason: body.reason || 'overproduction',
        destination: body.destination || 'composting',
        notes: body.notes || ''
      };
      waste.unshift(newW);
      saveStoredData('waste', waste);
      return { data: newW, status: 200 };
    }
    return { data: Array.isArray(waste) ? waste : INITIAL_WASTE, status: 200 };
  }

  // Waste Calculator
  if (url.includes('/calculator/calculate')) {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const kg = (body.quantity_kg_per_week || 15) * (body.weeks || 52);
    return {
      data: {
        annual_waste_kg: kg,
        annual_co2_kg: Math.round(kg * 2.8),
        annual_water_liters: Math.round(kg * 3200),
        annual_financial_loss: Math.round(kg * 180),
        potential_meals_saved: Math.round(kg / 0.4),
        trees_equivalent: (kg * 2.8 / 21.77).toFixed(1)
      },
      status: 200
    };
  }

  // Notifications
  if (url.includes('/notifications')) {
    return {
      data: [
        { id: 1, title: "Surplus Food Verified", message: "Your recent listing has been approved and published to the marketplace.", is_read: false, created_at: new Date().toISOString() },
        { id: 2, title: "NGO Claim Scheduled", message: "Robin Hood Army Ahmedabad has confirmed pickup for today at 6:30 PM.", is_read: true, created_at: new Date().toISOString() }
      ],
      status: 200
    };
  }

  // Admin users / overview
  if (url.includes('/admin/stats') || url.includes('/admin/dashboard')) {
    return {
      data: {
        total_users: 12,
        total_restaurants: 5,
        total_ngos: 3,
        total_donors: 4,
        total_customers: 28,
        total_waste_kg: 540.0,
        total_saved_kg: 2450.0
      },
      status: 200
    };
  }

  if (url.includes('/admin/users')) {
    return {
      data: [
        { id: 1, full_name: "Priya Sharma", email: "admin@foodsave.org", role: "super_admin", is_active: true },
        { id: 2, full_name: "Rajesh Patel", email: "bistro@foodsave.org", role: "restaurant", is_active: true },
        { id: 3, full_name: "Dharmesh Shah", email: "ngo@foodsave.org", role: "ngo", is_active: true },
        { id: 4, full_name: "Anil Mehta", email: "donor@foodsave.org", role: "donor", is_active: true },
        { id: 5, full_name: "Aarav Joshi", email: "customer@foodsave.org", role: "customer", is_active: true }
      ],
      status: 200
    };
  }

  // Default empty array/obj fallback
  return { data: [], status: 200 };
}

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodsave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Auto-enable client-side mock adapter on GitHub Pages or static domains without live backend URL
    const isStaticHost = typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1' && 
      !import.meta.env.VITE_API_URL;

    if (isStaticHost) {
      config.adapter = async (cfg) => {
        const mockRes = handleMockFallback(cfg);
        return {
          data: mockRes.data,
          status: mockRes.status || 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: cfg
        };
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with resilient mock fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend 401 unauth
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('foodsave_token');
        localStorage.removeItem('foodsave_user');
      }
    }

    // If network error, 404, or 500, gracefully fallback to mock data
    if (!error.response || error.response.status === 404 || error.response.status >= 500 || error.code === 'ERR_NETWORK') {
      try {
        const fallbackResponse = handleMockFallback(error.config);
        return Promise.resolve(fallbackResponse);
      } catch (mockErr) {
        console.error('Mock fallback error', mockErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
