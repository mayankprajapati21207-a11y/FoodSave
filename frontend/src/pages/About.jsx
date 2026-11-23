import React from 'react';
import { Leaf, ShieldCheck, HeartHandshake, Globe, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-[#F8FAF5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            Our Purpose & Vision
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 font-serif mt-3 tracking-tight">
            Ending Food Waste in Our Lifetime
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            One-third of all food produced globally is wasted, while millions face daily nutritional insecurity. <strong>FoodSave</strong> was founded to bridge this tragic paradox through intuitive technology, rigorous safety standards, and shared community value.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
              alt="Volunteers sharing food"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#218838] tracking-wider">
              <Sparkles size={16} /> Founded on Circular Economy
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif">
              A Zero-Waste Bridge for Modern Cities
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Restaurants and caterers pride themselves on hospitality and quality, but unpredictable foot traffic often leaves perfect culinary creations unserved at closing time. Before FoodSave, logistical friction made end-of-day donation prohibitively complex for busy chefs.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We engineered a real-time smart platform where chefs can record surplus in 60 seconds. Our algorithm matches bulk items with vetted charities with cooling equipment, and makes individual gourmet portions available to local diners at 50-70% off. Any remaining unconsumable organic waste is routed directly to licensed composting facilities.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-gray-800">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#218838]" /> 100% Traceability</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#218838]" /> Safe Temperature Tracking</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#218838]" /> Verified Non-Profits</span>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-emerald-50 text-[#218838] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={26} />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Uncompromising Safety</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Digital approval never replaces physical food hygiene. Strict cold-chain requirements ensure zero food safety compromise.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-lime-50 text-[#75B843] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HeartHandshake size={26} />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Community Dignity</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Donating food should be seamless, dependable, and celebrated. We empower grassroots charities to feed more families every week.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe size={26} />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Climate Action</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              If food waste were a country, it would be the third-largest greenhouse gas emitter. We track every kg diverted from landfills.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
