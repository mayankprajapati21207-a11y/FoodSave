import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import { Utensils, HeartHandshake, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix for default Leaflet icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG pins
const restaurantIcon = new L.DivIcon({
  className: 'custom-pin',
  html: `<div style="background-color: #218838; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M6 2v20"/><path d="M18 14v8"/><path d="M18 2v6"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const ngoIcon = new L.DivIcon({
  className: 'custom-pin',
  html: `<div style="background-color: #0284c7; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const AHMEDABAD_FALLBACK_RESTAURANTS = [
  {
    id: 1,
    name: 'The Grand Thakar',
    cuisine_type: 'Authentic Gujarati & Kathiyawadi',
    address: 'Near Thaltej Cross Road, SG Highway, Thaltej, Ahmedabad 380054',
    latitude: 23.0500,
    longitude: 72.5100,
  },
  {
    id: 2,
    name: 'Sankalp Express',
    cuisine_type: 'South Indian & Fast Food',
    address: 'Sindhu Bhavan Road, Bodakdev, Ahmedabad 380054',
    latitude: 23.0450,
    longitude: 72.5180,
  },
  {
    id: 3,
    name: 'Gordhan Thal',
    cuisine_type: 'Royal Gujarati Dining',
    address: 'Behind Rajpath Club, Bodakdev, SG Highway, Ahmedabad 380059',
    latitude: 23.0380,
    longitude: 72.5120,
  }
];

const AHMEDABAD_FALLBACK_NGOS = [
  {
    id: 1,
    organization_name: 'Robin Hood Army Ahmedabad (Thaltej Chapter)',
    capacity_people_served: 850,
    address: 'Community Center, Near Zydus Hospital, Thaltej, Ahmedabad 380054',
    latitude: 23.0540,
    longitude: 72.5080,
  },
  {
    id: 2,
    organization_name: 'Annamrita Foundation Gujarat',
    capacity_people_served: 1200,
    address: 'Vastrapur Lake Road, Vastrapur, Ahmedabad 380015',
    latitude: 23.0350,
    longitude: 72.5290,
  }
];

const InteractiveMap = ({ height = '450px' }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const [resRes, resNgo] = await Promise.all([
          api.get('/restaurants'),
          api.get('/ngos')
        ]);
        setRestaurants(Array.isArray(resRes?.data) && resRes.data.length > 0 ? resRes.data : AHMEDABAD_FALLBACK_RESTAURANTS);
        setNgos(Array.isArray(resNgo?.data) && resNgo.data.length > 0 ? resNgo.data : AHMEDABAD_FALLBACK_NGOS);
      } catch (err) {
        console.error('Using Ahmedabad fallback locations for map', err);
        setRestaurants(AHMEDABAD_FALLBACK_RESTAURANTS);
        setNgos(AHMEDABAD_FALLBACK_NGOS);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, []);

  const defaultCenter = [23.0500, 72.5100]; // Thaltej, Ahmedabad, Gujarat

  return (
    <div className="relative rounded-3xl overflow-hidden border border-emerald-100 shadow-lg bg-white" style={{ height }}>
      {loading ? (
        <div className="h-full flex items-center justify-center bg-emerald-50/50">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium">Loading Ahmedabad partner network map...</p>
          </div>
        </div>
      ) : (
        <>
          <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Restaurant Markers */}
            {(Array.isArray(restaurants) ? restaurants : []).map((r) => (
              <Marker
                key={`rest-${r.id}`}
                position={[r.latitude || 23.0500, r.longitude || 72.5100]}
                icon={restaurantIcon}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <div className="flex items-center gap-1.5 text-[#218838] font-bold text-xs uppercase tracking-wider mb-1">
                      <Utensils size={12} /> Partner Restaurant
                    </div>
                    <div className="font-bold text-sm text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.cuisine_type}</div>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {r.address}
                    </div>
                    <Link
                      to="/available-food"
                      className="mt-2.5 block text-center py-1 px-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Browse Surplus Meals
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* NGO Markers */}
            {(Array.isArray(ngos) ? ngos : []).map((n) => (
              <Marker
                key={`ngo-${n.id}`}
                position={[n.latitude || 23.0540, n.longitude || 72.5080]}
                icon={ngoIcon}
              >
                <Popup>
                  <div className="p-1 min-w-[180px]">
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                      <HeartHandshake size={12} /> Verified Charity
                    </div>
                    <div className="font-bold text-sm text-gray-900">{n.organization_name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Capacity: {n.capacity_people_served} meals/day</div>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {n.address}
                    </div>
                    <Link
                      to="/donate-food"
                      className="mt-2.5 block text-center py-1 px-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Donate to this NGO
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map legend overlay */}
          <div className="absolute bottom-4 left-4 z-400 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#218838]"></span>
              <span className="font-medium text-gray-700">Restaurants ({restaurants.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="font-medium text-gray-700">NGOs ({ngos.length})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InteractiveMap;
