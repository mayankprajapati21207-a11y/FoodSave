// Offline / GitHub Pages resilient mock data store with LocalStorage persistence

export const INITIAL_CATEGORIES = [
  { id: 1, name: "Cooked Meals", description: "Warm nutritious Gujarati thalis, biryanis, curries, khichdi, and rotis" },
  { id: 2, name: "Bakery & Bread", description: "Fresh sourdough, pav, maska bun, khari, and artisan baked goods" },
  { id: 3, name: "Fresh Produce", description: "Farm-fresh vegetables, organic greens, and seasonal fruits" },
  { id: 4, name: "Dairy & Cheeses", description: "Fresh milk, paneer, curd, butter, and artisanal cheeses" },
  { id: 5, name: "Packaged Pantry", description: "Sealed dry grains, pulses, snacks, spices, and non-perishables" },
  { id: 6, name: "Beverages", description: "Fresh juices, spiced buttermilk (chaas), and herbal infusions" },
  { id: 7, name: "Desserts & Sweets", description: "Traditional Gujarati sweets, mohanthal, halwa, and pastries" }
];

export const INITIAL_RESTAURANTS = [
  {
    id: 1,
    name: "The Grand Thakar",
    cuisine_type: "Authentic Gujarati & Kathiyawadi",
    address: "Near Thaltej Cross Road, SG Highway, Thaltej",
    city: "Ahmedabad",
    rating: 4.8,
    opening_hours: "11:00 AM - 11:00 PM",
    description: "Renowned heritage culinary institution serving authentic Gujarati Thali, Farsan, and Kathiyawadi specialties with zero food waste protocol.",
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    latitude: 23.0500,
    longitude: 72.5100
  },
  {
    id: 2,
    name: "Sankalp Express",
    cuisine_type: "South Indian & Fast Food",
    address: "Sindhu Bhavan Road, Bodakdev",
    city: "Ahmedabad",
    rating: 4.6,
    opening_hours: "10:00 AM - 10:30 PM",
    description: "Famous South Indian restaurant chain delivering hot dosas, idlis, and vadas with rigorous daily surplus redistribution.",
    image_url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    latitude: 23.0450,
    longitude: 72.5180
  },
  {
    id: 3,
    name: "Gordhan Thal",
    cuisine_type: "Royal Gujarati Dining",
    address: "Behind Rajpath Club, Bodakdev, SG Highway",
    city: "Ahmedabad",
    rating: 4.9,
    opening_hours: "11:30 AM - 10:30 PM",
    description: "Premier festive Gujarati and Rajasthani banquet hall offering freshly prepared meal portions through FoodSave donation network.",
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    latitude: 23.0380,
    longitude: 72.5120
  }
];

export const INITIAL_NGOS = [
  {
    id: 1,
    organization_name: "Robin Hood Army Ahmedabad (Thaltej Chapter)",
    registration_number: "GJ/AHM/2018/00912",
    capacity_people_served: 850,
    address: "Community Center, Near Zydus Hospital, Thaltej, Ahmedabad 380054",
    latitude: 23.0540,
    longitude: 72.5080,
    is_verified: true
  },
  {
    id: 2,
    organization_name: "Annamrita Foundation Gujarat",
    registration_number: "GJ/AHM/2015/00431",
    capacity_people_served: 1200,
    address: "Vastrapur Lake Road, Vastrapur, Ahmedabad 380015",
    latitude: 23.0350,
    longitude: 72.5290,
    is_verified: true
  }
];

export const INITIAL_LISTINGS = [
  {
    id: 1,
    title: "Fresh Artisan Sourdough & Maska Bun Basket",
    description: "Daily baked artisanal sourdough loaves and fresh buttery maska buns from morning batches, packed in eco-friendly bread boxes.",
    category_id: 2,
    category: { id: 2, name: "Bakery & Bread" },
    restaurant_id: 1,
    restaurant: INITIAL_RESTAURANTS[0],
    quantity: 8,
    unit: "baskets",
    original_price: 350.0,
    discount_price: 120.0,
    is_free_donation: false,
    storage_info: "Room temperature, ambient dry bread box",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Special Kathiyawadi Baingan Bharta & Rotla Meal Box",
    description: "Authentic roasted spiced eggplant curry with 2 hot Bajra Rotlas, fresh jaggery (Gud), and garlic chutney.",
    category_id: 1,
    category: { id: 1, name: "Cooked Meals" },
    restaurant_id: 1,
    restaurant: INITIAL_RESTAURANTS[0],
    quantity: 14,
    unit: "portions",
    original_price: 240.0,
    discount_price: 99.0,
    is_free_donation: false,
    storage_info: "Thermal hot-holding above 65°C",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Chef's Special Dal Khichdi & Kadhi (Free NGO Donation)",
    description: "Nutritious moong dal khichdi prepared with pure ghee, served with traditional sweet-sour Gujarati kadhi. Dedicated for community shelters.",
    category_id: 1,
    category: { id: 1, name: "Cooked Meals" },
    restaurant_id: 1,
    restaurant: INITIAL_RESTAURANTS[0],
    quantity: 25,
    unit: "portions",
    original_price: 0.0,
    discount_price: 0.0,
    is_free_donation: true,
    storage_info: "Insulated hot food container",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Steamed Idli & Medu Vada Combo with Sambar",
    description: "8 pieces of fluffy steamed idlis and golden crispy medu vadas with warm vegetable sambar and fresh coconut chutney.",
    category_id: 1,
    category: { id: 1, name: "Cooked Meals" },
    restaurant_id: 2,
    restaurant: INITIAL_RESTAURANTS[1],
    quantity: 12,
    unit: "portions",
    original_price: 220.0,
    discount_price: 85.0,
    is_free_donation: false,
    storage_info: "Sealed food-grade containers, warm holding",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Royal Gujarati Farsan Platter (Khaman & Khandvi)",
    description: "Freshly steamed soft nylon khaman, spiced khandvi rolls with mustard tadka, and crispy green chilies.",
    category_id: 2,
    category: { id: 2, name: "Bakery & Bread" },
    restaurant_id: 3,
    restaurant: INITIAL_RESTAURANTS[2],
    quantity: 10,
    unit: "boxes",
    original_price: 260.0,
    discount_price: 110.0,
    is_free_donation: false,
    storage_info: "Air-conditioned ambient packaging",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Bulk Festive Pulao & Vegetable Biryani (Charity Claim)",
    description: "40 portions of aromatic basmati rice cooked with fresh seasonal vegetables and whole garam spices. Ideal for shelter dinner distribution.",
    category_id: 1,
    category: { id: 1, name: "Cooked Meals" },
    restaurant_id: 3,
    restaurant: INITIAL_RESTAURANTS[2],
    quantity: 40,
    unit: "portions",
    original_price: 0.0,
    discount_price: 0.0,
    is_free_donation: true,
    storage_info: "Commercial thermal insulation vessel",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  }
];

export const INITIAL_ORDERS = [
  {
    id: 1,
    order_number: "FS-ORD-101",
    customer: { user: { full_name: "Aarav Joshi", email: "customer@foodsave.org" } },
    listing: INITIAL_LISTINGS[0],
    quantity: 2,
    total_amount: 240.0,
    pickup_time_slot: "Today, 6:30 PM - 8:00 PM",
    qr_code_token: "QR-ORD-AARAV101",
    status: "confirmed"
  },
  {
    id: 2,
    order_number: "FS-ORD-102",
    customer: { user: { full_name: "Pooja Trivedi", email: "pooja@example.com" } },
    listing: INITIAL_LISTINGS[1],
    quantity: 1,
    total_amount: 99.0,
    pickup_time_slot: "Today, 7:30 PM - 9:00 PM",
    qr_code_token: "QR-ORD-POOJA102",
    status: "ready_for_pickup"
  }
];

export const INITIAL_INVENTORY = [
  {
    id: 1,
    item_name: "Sourdough Loaves & Maska Buns",
    category_id: 2,
    category: { id: 2, name: "Bakery & Bread" },
    quantity: 18.0,
    unit: "baskets",
    storage_condition: "ambient",
    expiry_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in_stock"
  },
  {
    id: 2,
    item_name: "Gujarati Dal Batch #4",
    category_id: 1,
    category: { id: 1, name: "Cooked Meals" },
    quantity: 15.0,
    unit: "kg",
    storage_condition: "refrigerated",
    expiry_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in_stock"
  },
  {
    id: 3,
    item_name: "Fresh Paneer Blocks",
    category_id: 4,
    category: { id: 4, name: "Dairy & Cheeses" },
    quantity: 8.5,
    unit: "kg",
    storage_condition: "refrigerated",
    expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "in_stock"
  }
];

export const INITIAL_WASTE = [
  {
    id: 1,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    quantity_kg: 8.5,
    waste_type: "organic",
    reason: "overproduction",
    destination: "composting",
    notes: "Banquet trimming and peelings"
  },
  {
    id: 2,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    quantity_kg: 4.2,
    waste_type: "cooked_meals",
    reason: "plate_waste",
    destination: "bio_gas",
    notes: "Plate returns routed to biomethanation"
  }
];

// Helper to get or init from localStorage
export function getStoredData(key, defaultData) {
  try {
    const raw = localStorage.getItem(`foodsave_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage read error', e);
  }
  return defaultData;
}

export function saveStoredData(key, data) {
  try {
    localStorage.setItem(`foodsave_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error', e);
  }
}
