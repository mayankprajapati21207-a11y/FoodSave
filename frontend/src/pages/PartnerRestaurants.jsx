import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Utensils, Star, MapPin, Clock, ShieldCheck, ArrowRight, Award } from 'lucide-react';

const AHMEDABAD_RESTAURANTS_FALLBACK = [
  {
    id: 1,
    name: 'The Grand Thakar',
    cuisine_type: 'Authentic Gujarati & Kathiyawadi',
    address: 'Near Thaltej Cross Road, SG Highway, Thaltej',
    city: 'Ahmedabad',
    rating: 4.8,
    opening_hours: '11:00 AM - 11:00 PM',
    description: 'Renowned heritage culinary institution serving authentic Gujarati Thali, Farsan, and Kathiyawadi specialties with zero food waste protocol.',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Sankalp Express',
    cuisine_type: 'South Indian & Fast Food',
    address: 'Sindhu Bhavan Road, Bodakdev',
    city: 'Ahmedabad',
    rating: 4.6,
    opening_hours: '10:00 AM - 10:30 PM',
    description: 'Famous South Indian restaurant chain delivering hot dosas, idlis, and vadas with rigorous daily surplus redistribution.',
    image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Gordhan Thal',
    cuisine_type: 'Royal Gujarati Dining',
    address: 'Behind Rajpath Club, Bodakdev, SG Highway',
    city: 'Ahmedabad',
    rating: 4.9,
    opening_hours: '11:30 AM - 10:30 PM',
    description: 'Premier festive Gujarati and Rajasthani banquet hall offering freshly prepared meal portions through FoodSave donation network.',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  }
];

const PartnerRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, leadRes] = await Promise.all([
          api.get('/restaurants'),
          api.get('/admin/leaderboard')
        ]);
        setRestaurants(Array.isArray(restRes?.data) && restRes.data.length > 0 ? restRes.data : AHMEDABAD_RESTAURANTS_FALLBACK);
        setLeaderboard(Array.isArray(leadRes?.data) ? leadRes.data : []);
      } catch (e) {
        console.error(e);
        setRestaurants(AHMEDABAD_RESTAURANTS_FALLBACK);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            Zero-Waste Champions
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-serif mt-3">
            Our Certified Partner Kitchens
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Meet the forward-thinking culinary innovators dedicated to feeding communities and eliminating commercial organic landfill waste.
          </p>
        </div>

        {/* Top Leaderboard Podium */}
        {leaderboard.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white mb-16 shadow-xl border border-emerald-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold">
                <Award size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">Monthly Eco-Leaderboard</h3>
                <p className="text-xs text-emerald-300">Top restaurants rescuing surplus meals and avoiding carbon emissions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Array.isArray(leaderboard) ? leaderboard.slice(0, 3) : []).map((item, idx) => (
                <div key={item.restaurant_id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>Rank #{idx + 1}</span>
                    <span className="flex items-center gap-1"><Star size={12} fill="currentColor" /> {item.rating}</span>
                  </div>
                  <div className="font-bold text-sm text-white">{item.restaurant_name}</div>
                  <div className="text-xs text-emerald-300 mt-0.5">{item.cuisine_type}</div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs">
                    <div>
                      <div className="text-white font-bold">{item.food_saved_kg} kg</div>
                      <div className="text-[10px] text-gray-400">Food Rescued</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-300 font-bold">{item.meals_provided}</div>
                      <div className="text-[10px] text-gray-400">Meals Served</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurant Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading partner restaurants...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Array.isArray(restaurants) ? restaurants : []).map((rest) => (
              <div
                key={rest.id}
                className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={rest.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span>{rest.rating}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono">
                      <Clock size={11} /> {rest.opening_hours}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                      <ShieldCheck size={14} />
                      <span>FSSAI / Safety Certified</span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#218838] transition-colors">
                      {rest.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{rest.cuisine_type}</p>
                    
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {rest.description || 'Committed zero-waste restaurant partner.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={14} className="text-emerald-600 shrink-0" />
                      <span className="truncate">{rest.address}, {rest.city}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/available-food?restaurant_id=${rest.id}`}
                    className="w-full py-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/60"
                  >
                    <span>View Today's Surplus Dishes</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PartnerRestaurants;
