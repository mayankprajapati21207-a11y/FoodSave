import React, { useState } from 'react';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How does FoodSave guarantee food safety?",
      a: "Every participating restaurant must submit valid food handling accreditation (such as FSSAI license). Unsold food must be recorded with preparation timestamps and kept in certified thermal storage (<4°C for chilled, >65°C for hot). Any food past shelf-life is strictly diverted to composting."
    },
    {
      q: "Can individuals or corporate catering donate food?",
      a: "Yes! Event caterers, corporate banquets, and bulk food donors can use the Food Donation Portal to list edible surplus. Vetted NGOs with temperature-controlled vans collect the food directly."
    },
    {
      q: "How do customer pickups work?",
      a: "When a customer reserves surplus food, a dynamic QR code token is generated. At the pickup window, the customer shows the code to the restaurant host, who verifies it in the FoodSave dashboard before handing over the sealed meal."
    },
    {
      q: "How are non-consumable wastes handled?",
      a: "Food that has exceeded safety thresholds or was returned as plate waste is recorded in our Daily Food Waste module and routed to certified municipal composting or biomethanation plants for clean energy."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/complaints/submit', formData);
      confetti({ particleCount: 80, spread: 60 });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            We Are Here To Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-serif mt-3">
            Contact FoodSave
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Have questions about partnering as a restaurant, registering an NGO, or need assistance with a reservation? Reach out to our dedicated team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 font-serif">Headquarters & Hotline</h3>
              
              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-[#218838] rounded-xl shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">FoodSave Gujarat HQ</div>
                    <p className="mt-0.5 text-gray-500">FoodSave Gujarat Innovation Centre, Near Thaltej Cross Road, SG Highway, Ahmedabad, Gujarat 380054</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-[#218838] rounded-xl shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Partner & Support Hotline</div>
                    <p className="mt-0.5 text-gray-500 font-medium">+91 99784 28476</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">Available Mon-Sat 7:00 AM - 11:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-[#218838] rounded-xl shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">General Support & Inquiries</div>
                    <p className="mt-0.5 text-gray-500 font-medium">mayankprajapati@foodsave.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick emergency notice */}
            <div className="p-5 bg-emerald-50/70 rounded-3xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
              <div className="font-bold text-emerald-950">Immediate Surplus Collection Alert?</div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                If you have an urgent banquet surplus (&gt;100 portions) requiring immediate thermal collection within 2 hours, call our rapid response hotline directly.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">Send Us a Message</h3>
            <p className="text-xs text-gray-500 mb-6">Our admin coordination team responds within 2-4 hours.</p>

            {submitted ? (
              <div className="bg-emerald-50 p-8 rounded-2xl text-center border border-emerald-200 text-[#218838] space-y-2">
                <CheckCircle2 size={36} className="mx-auto" />
                <h4 className="text-base font-bold text-gray-900">Message Received!</h4>
                <p className="text-xs text-gray-600">
                  Thank you for contacting FoodSave. A team member has been assigned to your ticket.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Restaurant Onboarding Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tell us about your organization, requirement, or feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8FAF5] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#218838] text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {submitting ? 'Sending...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 font-serif">Frequently Asked Questions</h3>
            <p className="text-xs text-gray-500 mt-1">Quick answers to common questions about FoodSave</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-gray-800 hover:text-emerald-700"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
