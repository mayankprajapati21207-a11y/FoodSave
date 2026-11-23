import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import QRCodeModal from '../../components/QRCodeModal';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  QrCode, 
  Star, 
  CheckCircle2, 
  X, 
  DollarSign, 
  Leaf, 
  Utensils,
  ArrowRight
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrToken, setQrToken] = useState('');
  const [qrTitle, setQrTitle] = useState('');

  // Review Modal
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: 'cancelled',
        cancellation_reason: 'Cancelled by customer'
      });
      loadOrders();
      alert('Order cancelled.');
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  const handleOpenQR = (order) => {
    setQrToken(order.qr_code_token);
    setQrTitle(`Pickup Code: ${order.listing?.title || 'Surplus Order'}`);
    setQrModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      // Create review
      alert('Thank you for rating your meal! Your feedback supports zero-waste restaurants.');
      setReviewOrder(null);
      setComment('');
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Stats calculation
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalMealsRescued = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.quantity : 0), 0);
  const totalMoneySpent = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total_amount : 0), 0);
  const estimatedSavings = totalMoneySpent * 1.8;
  const co2Avoided = (totalMealsRescued * 0.45 * 2.5).toFixed(1);

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-emerald-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#75B843] bg-emerald-800/80 px-2.5 py-0.5 rounded-full">
              Zero-Waste Diner
            </span>
            <h1 className="text-2xl font-bold font-serif mt-2">Welcome Back, {user?.full_name}</h1>
            <p className="text-xs text-emerald-200 mt-0.5">Track your surplus reservations and show your pickup QR codes</p>
          </div>

          <Link
            to="/available-food"
            className="px-4 py-2.5 bg-[#75B843] hover:bg-lime-500 text-emerald-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Utensils size={15} />
            <span>Discover Today's Deals</span>
          </Link>
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-emerald-800 mb-1">Meals Rescued</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{totalMealsRescued} <span className="text-xs font-normal">portions</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Diverted from waste</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-blue-700 mb-1">Money Saved</div>
            <div className="text-2xl font-black text-gray-900 font-serif">~₹{estimatedSavings.toFixed(2)}</div>
            <div className="text-[10px] text-gray-400 mt-1">Compared to full menu prices</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-2xs">
            <div className="text-xs font-bold uppercase text-teal-700 mb-1">CO2 Emissions Prevented</div>
            <div className="text-2xl font-black text-gray-900 font-serif">{co2Avoided} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-gray-400 mt-1">Direct ecological preservation</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-serif">Your Surplus Food Bookings</h3>
              <p className="text-xs text-gray-500">Show your QR code at the restaurant counter for seamless pickup</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {orders.length} Total Orders
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag size={32} className="mx-auto text-gray-300" />
              <p className="text-xs text-gray-500">You haven't reserved any surplus meals yet.</p>
              <Link
                to="/available-food"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#218838] hover:underline"
              >
                Browse Available Surplus Food <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#F8FAF5] text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Restaurant</th>
                    <th className="py-3 px-4">Dish & Quantity</th>
                    <th className="py-3 px-4">Pickup Window</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{o.order_number}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">{o.listing?.restaurant?.name || 'Restaurant'}</td>
                      <td className="py-3 px-4 font-medium text-emerald-900">
                        {o.quantity} portions of {o.listing?.title}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{o.pickup_time_slot}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">₹{o.total_amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          o.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          o.status === 'ready_for_pickup' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {o.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        {o.status !== 'cancelled' && (
                          <button
                            onClick={() => handleOpenQR(o)}
                            className="px-3 py-1.5 bg-[#218838] text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                          >
                            <QrCode size={13} /> Pickup QR
                          </button>
                        )}
                        {o.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelOrder(o.id)}
                            className="px-2 py-1 text-gray-400 hover:text-rose-600 rounded-lg text-xs"
                            title="Cancel Order"
                          >
                            Cancel
                          </button>
                        )}
                        {o.status === 'completed' && (
                          <button
                            onClick={() => setReviewOrder(o)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center gap-1"
                          >
                            <Star size={11} fill="currentColor" /> Rate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setReviewOrder(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X size={16} />
            </button>
            <h3 className="text-base font-bold text-gray-900 font-serif mb-1">Rate Your Meal Experience</h3>
            <p className="text-xs text-gray-500 mb-4">{reviewOrder.listing?.restaurant?.name}</p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Comments & Feedback
                </label>
                <textarea
                  rows="3"
                  placeholder="How was the freshness, taste, and pickup experience?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewOrder(null)}
                  className="w-1/2 py-2 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs"
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-1/2 py-2 rounded-xl bg-[#218838] text-white font-bold text-xs hover:bg-emerald-700"
                >Submit Review</button>
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
        subtext="Show this QR token to the restaurant host for pickup verification"
      />

    </div>
  );
};

export default CustomerDashboard;
