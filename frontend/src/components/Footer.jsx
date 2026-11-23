import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldCheck, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1C231C] text-gray-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#218838] to-[#75B843] flex items-center justify-center text-white">
                <Leaf size={22} />
              </div>
              <div>
                <span className="text-2xl font-black text-white font-serif tracking-tight">
                  Food<span className="text-[#75B843]">Save</span>
                </span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 -mt-1">
                  Save Food · Share Hope
                </p>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Empowering restaurants, charities, donors, and conscious consumers to eliminate commercial food waste, feed underprivileged communities, and fight climate change through intelligent surplus distribution.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck size={16} /> Certified Safe Food Distribution Protocol
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/available-food" className="hover:text-emerald-400 transition-colors">Available Surplus Food</Link></li>
              <li><Link to="/donate-food" className="hover:text-emerald-400 transition-colors">Donate Food Portal</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How FoodSave Works</Link></li>
              <li><Link to="/partner-restaurants" className="hover:text-emerald-400 transition-colors">Partner Restaurants</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400 transition-colors">Live Impact & Stats</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
              <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Waste Calculator</a></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Partner Portal</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>FoodSave Gujarat Innovation Centre, Near Thaltej Cross Road, SG Highway, Ahmedabad, Gujarat 380054</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-emerald-500 shrink-0" />
                <span>+91 99784 28476</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-emerald-500 shrink-0" />
                <span>mayankprajapati@foodsave.org</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FoodSave Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-emerald-400">
              Built with <Heart size={12} className="text-rose-500 fill-rose-500" /> for Zero Food Waste
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
