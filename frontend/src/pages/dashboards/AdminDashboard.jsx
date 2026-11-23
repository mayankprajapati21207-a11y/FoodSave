import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  Users, 
  Utensils, 
  HeartHandshake, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  FileText, 
  Download, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  TrendingUp,
  Activity,
  Filter,
  Check,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [sidebarTab, setSidebarTab] = useState('overview'); // overview, users, restaurants, ngos, listings, orders, waste, complaints, logs

  const [stats, setStats] = useState({
    total_users: 7,
    total_restaurants: 4,
    total_ngos: 2,
    total_donors: 1,
    total_customers: 1,
    total_food_listed_kg: 1250.0,
    total_food_donated_kg: 480.0,
    total_food_sold_portions: 860,
    total_food_waste_recorded_kg: 620.0,
    total_organic_waste_processed_kg: 490.0,
    total_co2_saved_kg: 2250.0,
    total_meals_saved: 2150
  });

  const [usersList, setUsersList] = useState([]);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [ngosList, setNgosList] = useState([]);
  const [listingsList, setListingsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [wasteList, setWasteList] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsRes, usersRes, restRes, ngoRes,
        listRes, ordRes, wasteRes, compRes, logsRes
      ] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/users'),
        api.get('/restaurants?verified_only=false'),
        api.get('/ngos?verified_only=false'),
        api.get('/food-listings?status_filter='),
        api.get('/orders/all'),
        api.get('/waste/all-records'),
        api.get('/admin/complaints'),
        api.get('/admin/audit-logs')
      ]);

      setStats(statsRes.data);
      setUsersList(usersRes.data);
      setRestaurantsList(restRes.data);
      setNgosList(ngoRes.data);
      setListingsList(listRes.data);
      setOrdersList(ordRes.data);
      setWasteList(wasteRes.data);
      setComplaintsList(compRes.data);
      setAuditLogs(logsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, null, {
        params: { is_active: !currentActive }
      });
      loadAdminData();
    } catch (err) {
      alert('Failed to update user active status');
    }
  };

  const handleToggleUserVerify = async (userId, currentVerify) => {
    try {
      await api.put(`/admin/users/${userId}/status`, null, {
        params: { is_verified: !currentVerify }
      });
      loadAdminData();
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, newStatus) => {
    try {
      await api.put(`/admin/complaints/${complaintId}`, {
        status: newStatus,
        admin_notes: `Processed by ${user.full_name}`
      });
      loadAdminData();
    } catch (err) {
      alert('Failed to update complaint status');
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchSearch = u.full_name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter ? u.role === userRoleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="bg-[#F8FAF5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 border border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-purple-300">
              <Shield size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif">Super Admin Command Center</h1>
                <span className="bg-purple-600/80 text-purple-100 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Full Authority
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1">Platform-wide moderation, safety auditing, entity verification and reports</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="/api/reports/export/waste-csv"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <Download size={13} /> Export Waste CSV
            </a>
            <a
              href="/api/reports/export/orders-csv"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <Download size={13} /> Export Orders CSV
            </a>
          </div>
        </div>

        {/* Layout Grid with Sidebar & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-3 sm:p-4 border border-emerald-100 shadow-sm flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5">
            <div className="hidden lg:block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Management Modules
            </div>

            {[
              { id: 'overview', label: 'Platform Overview', icon: Activity },
              { id: 'users', label: `Users (${usersList.length})`, icon: Users },
              { id: 'restaurants', label: `Restaurants (${restaurantsList.length})`, icon: Utensils },
              { id: 'ngos', label: `NGOs (${ngosList.length})`, icon: HeartHandshake },
              { id: 'listings', label: `Food Listings (${listingsList.length})`, icon: FileText },
              { id: 'orders', label: `Orders (${ordersList.length})`, icon: ShoppingBag },
              { id: 'waste', label: `Waste Records (${wasteList.length})`, icon: Trash2 },
              { id: 'complaints', label: `Inquiries (${complaintsList.length})`, icon: MessageSquare },
              { id: 'logs', label: `Audit Logs (${auditLogs.length})`, icon: Clock },
            ].map((item) => {
              const Icon = item.icon;
              const isCur = sidebarTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSidebarTab(item.id)}
                  className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-left ${
                    isCur
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. Overview */}
            {sidebarTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">Total Users</div>
                    <div className="text-2xl font-black text-gray-900 font-serif">{stats.total_users}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{stats.total_customers} diners · {stats.total_donors} donors</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-emerald-700 mb-1">Partner Kitchens</div>
                    <div className="text-2xl font-black text-emerald-900 font-serif">{stats.total_restaurants}</div>
                    <div className="text-[10px] text-emerald-600 mt-1">Certified kitchens</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-blue-700 mb-1">Verified NGOs</div>
                    <div className="text-2xl font-black text-blue-900 font-serif">{stats.total_ngos}</div>
                    <div className="text-[10px] text-blue-600 mt-1">Community networks</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-teal-700 mb-1">Food Rescued</div>
                    <div className="text-2xl font-black text-teal-900 font-serif">{stats.total_food_listed_kg} kg</div>
                    <div className="text-[10px] text-teal-600 mt-1">{stats.total_meals_saved} meals provided</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-amber-700 mb-1">Free NGO Donations</div>
                    <div className="text-2xl font-black text-amber-900 font-serif">{stats.total_food_donated_kg} kg</div>
                    <div className="text-[10px] text-amber-600 mt-1">Shelter handovers</div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
                    <div className="text-[10px] font-bold uppercase text-rose-700 mb-1">Organic Composted</div>
                    <div className="text-2xl font-black text-rose-900 font-serif">{stats.total_organic_waste_processed_kg} kg</div>
                    <div className="text-[10px] text-rose-600 mt-1">Diverted from landfill</div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
                  <h3 className="font-bold text-base text-gray-900 font-serif mb-2">Platform Health & Safety Summary</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    FoodSave microservices and database tables are in active sync. Automated hygiene and shelf-life triggers are verifying all new surplus postings. All 5 user roles are operating smoothly.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Users Management */}
            {sidebarTab === 'users' && (
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif">Platform User Accounts</h3>
                    <p className="text-xs text-gray-500">Manage account access, verify entities, and configure roles</p>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800"
                    />
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="bg-[#F8FAF5] border border-gray-200 rounded-xl px-2 py-1.5 text-xs text-gray-800"
                    >
                      <option value="">All Roles</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="ngo">NGO</option>
                      <option value="donor">Donor</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-xs">
                    <thead className="bg-[#F8FAF5] text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900">
                            <div>{u.full_name}</div>
                            <div className="text-[10px] text-gray-400 font-normal">{u.email}</div>
                          </td>
                          <td className="py-3 px-4 capitalize font-semibold text-gray-700">
                            {u.role.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {u.is_active ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {u.is_verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleUserActive(u.id, u.is_active)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                u.is_active ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {u.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleToggleUserVerify(u.id, u.is_verified)}
                              className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-[10px] font-bold"
                            >
                              {u.is_verified ? 'Unverify' : 'Verify'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Restaurants Management */}
            {sidebarTab === 'restaurants' && (
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">Partner Restaurants Directory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurantsList.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl border border-gray-100 bg-[#F8FAF5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">{r.name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          FSSAI Verified
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{r.address}, {r.city}</p>
                      <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Rating: {r.rating} ★</span>
                        <span className="text-emerald-700 font-semibold">{r.cuisine_type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NGOs Management */}
            {sidebarTab === 'ngos' && (
              <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">NGO Charity Verifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ngosList.map((n) => (
                    <div key={n.id} className="p-4 rounded-2xl border border-gray-100 bg-[#F8FAF5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">{n.organization_name}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                          {n.registration_number || 'REG-NGO'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{n.address}</p>
                      <p className="text-xs text-blue-700 font-bold">Capacity: {n.capacity_people_served} meals/day</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Food Listings */}
            {sidebarTab === 'listings' && (
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">Surplus Listings Moderation</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-xs">
                    <thead className="bg-[#F8FAF5] text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Restaurant</th>
                        <th className="py-3 px-4">Quantity</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listingsList.map((l) => (
                        <tr key={l.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-900">{l.title}</td>
                          <td className="py-3 px-4 text-gray-600">{l.restaurant?.name}</td>
                          <td className="py-3 px-4 text-emerald-800 font-bold">{l.quantity} {l.unit}</td>
                          <td className="py-3 px-4 font-bold">
                            {l.is_free_donation ? 'Free' : `₹${l.discount_price}`}
                          </td>
                          <td className="py-3 px-4 capitalize font-semibold">{l.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. Orders */}
            {sidebarTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">All Customer Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-xs">
                    <thead className="bg-[#F8FAF5] text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ordersList.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono font-bold">{o.order_number}</td>
                          <td className="py-3 px-4 font-medium text-gray-800">{o.listing?.title}</td>
                          <td className="py-3 px-4 text-gray-600">{o.customer?.user?.full_name}</td>
                          <td className="py-3 px-4 font-bold">₹{o.total_amount.toFixed(2)}</td>
                          <td className="py-3 px-4 capitalize font-bold text-emerald-800">{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. Waste Records */}
            {sidebarTab === 'waste' && (
              <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">Organic & Non-Organic Waste Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-xs">
                    <thead className="bg-[#F8FAF5] text-gray-500 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Kitchen</th>
                        <th className="py-3 px-4">Quantity (kg)</th>
                        <th className="py-3 px-4">Waste Type</th>
                        <th className="py-3 px-4">Reason</th>
                        <th className="py-3 px-4">Destination</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {wasteList.map((w) => (
                        <tr key={w.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-500">{new Date(w.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{w.restaurant?.name}</td>
                          <td className="py-3 px-4 font-bold text-rose-700">{w.quantity_kg} kg</td>
                          <td className="py-3 px-4 capitalize font-semibold">{w.waste_type}</td>
                          <td className="py-3 px-4 capitalize text-gray-600">{w.reason.replace('_', ' ')}</td>
                          <td className="py-3 px-4 capitalize text-emerald-700 font-bold">{w.destination}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. Complaints & Inquiries */}
            {sidebarTab === 'complaints' && (
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">Inquiries & Support Tickets</h3>
                <div className="space-y-3">
                  {complaintsList.map((comp) => (
                    <div key={comp.id} className="p-4 rounded-2xl border border-gray-100 bg-[#F8FAF5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">{comp.subject}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{comp.message}</p>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-200">
                        <span>From: {comp.name} ({comp.email})</span>
                        {comp.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateComplaintStatus(comp.id, 'resolved')}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Audit Logs */}
            {sidebarTab === 'logs' && (
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 font-serif">System Audit Logs</h3>
                <div className="space-y-2 font-mono text-[11px]">
                  {auditLogs.map((l) => (
                    <div key={l.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-purple-700">[{l.action}]</span> {l.details}
                      </div>
                      <span className="text-gray-400">{new Date(l.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
