import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Utensils, 
  HeartHandshake, 
  User, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Recycle, 
  FileText, 
  QrCode,
  ArrowRight
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Surplus Identification & Logging",
      desc: "At the end of service or buffet events, kitchen staff identify edible unsold food or kitchen trimmings.",
      icon: Utensils,
      color: "bg-emerald-50 text-emerald-700"
    },
    {
      num: "02",
      title: "Preparation & Storage Data Entry",
      desc: "Restaurant records food category, cooking timestamp, quantity, packaging type, and cold-chain temperature.",
      icon: FileText,
      color: "bg-lime-50 text-lime-700"
    },
    {
      num: "03",
      title: "Rigorous Food Safety Check",
      desc: "Safety protocol checks that time elapsed is within regulatory limits (<4 hours hot, <48 hours chilled) and hygiene standards are met.",
      icon: ShieldCheck,
      color: "bg-teal-50 text-teal-700"
    },
    {
      num: "04",
      title: "Dual-Channel Redistribution",
      desc: "Safe food is instantly listed for either direct free donation to local charities or discounted purchase by consumers.",
      icon: CheckCircle2,
      color: "bg-blue-50 text-blue-700"
    },
    {
      num: "05",
      title: "Order or NGO Claim Submission",
      desc: "Customers place pickup orders at 50-70% off; NGOs submit bulk requests for community shelters with intended meal counts.",
      icon: HeartHandshake,
      color: "bg-indigo-50 text-indigo-700"
    },
    {
      num: "06",
      title: "Kitchen Confirmation & Allocation",
      desc: "Restaurant reviews incoming claims, confirms packaging schedule, and reserves portions in real time.",
      icon: Utensils,
      color: "bg-purple-50 text-purple-700"
    },
    {
      num: "07",
      title: "Hygienic Packing & Scheduled Pickup",
      desc: "Meals are packed in food-grade sealed thermal containers adhering to safe food-handling protocols.",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-700"
    },
    {
      num: "08",
      title: "Handover with Secure QR Verification",
      desc: "Collector presents their dynamic FoodSave QR token. The restaurant scans or verifies the code to validate authentic handover.",
      icon: QrCode,
      color: "bg-amber-50 text-amber-700"
    },
    {
      num: "09",
      title: "Automated Inventory Deduction",
      desc: "The system immediately updates live inventory balances. When all units are claimed, the listing is automatically closed.",
      icon: CheckCircle2,
      color: "bg-lime-50 text-lime-700"
    },
    {
      num: "10",
      title: "Safe Organic Processing for Ineligible Food",
      desc: "Any food spoiled, expired, or plate-waste is strictly excluded from human consumption and directed to composting or biomethanation.",
      icon: Recycle,
      color: "bg-rose-50 text-rose-700"
    },
    {
      num: "11",
      title: "Continuous Super Admin Oversight & Auditing",
      desc: "Super Admins monitor all listings, dispute reports, and waste logs while generating official ESG & compliance analytics.",
      icon: Shield,
      color: "bg-emerald-50 text-emerald-800"
    }
  ];

  return (
    <div className="bg-[#F8FAF5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#218838] bg-emerald-50 px-3 py-1 rounded-full">
            Standard Operating Procedure
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 font-serif mt-3 tracking-tight">
            The 11-Step Zero-Waste Workflow
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            FoodSave follows an uncompromising food safety and traceability framework. We ensure commercial surplus reaches humans safely, while non-consumable waste enriches the soil.
          </p>
        </div>

        {/* Safety Warning Callout */}
        <div className="bg-amber-50/80 border-2 border-amber-200/80 rounded-3xl p-6 sm:p-8 mb-16 flex flex-col sm:flex-row items-start gap-5 shadow-xs">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950 font-serif">
              Food Safety is Our Paramount Priority
            </h3>
            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
              <strong>Strict Protocol:</strong> Unsafe, expired, or improperly stored food is never permitted for donation or sale on FoodSave. Digital approval never replaces physical food safety inspection. Chefs must visually inspect temperature, odor, texture, and container hygiene before listing any item. Unfit food must be diverted to verified composting or organic waste processors.
            </p>
          </div>
        </div>

        {/* 11 Steps Timeline */}
        <div className="space-y-4 mb-20">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center shrink-0 font-bold font-serif text-lg`}>
                    {s.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-serif">
                      {s.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl shrink-0">
                  <Icon size={14} />
                  <span>Step {idx + 1} of 11</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Roles Interaction Grid */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif mb-4">
            Five Connected Roles in One Platform
          </h2>
          <p className="text-xs text-gray-500 max-w-xl mx-auto mb-10">
            Each participant has dedicated role-based dashboards, verified credentials, and tailored tools.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-gray-100 text-left">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 w-fit mb-3"><Shield size={20} /></div>
              <h4 className="font-bold text-sm text-gray-900">Super Admin</h4>
              <p className="text-[11px] text-gray-500 mt-1">Platform moderation, verification of NGOs and restaurants, audit logs, and ESG reporting.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-gray-100 text-left">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit mb-3"><Utensils size={20} /></div>
              <h4 className="font-bold text-sm text-gray-900">Restaurant Owner</h4>
              <p className="text-[11px] text-gray-500 mt-1">List surplus meals, manage orders, confirm NGO donations, log waste kg, and track savings.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-gray-100 text-left">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 w-fit mb-3"><HeartHandshake size={20} /></div>
              <h4 className="font-bold text-sm text-gray-900">NGO / Charity</h4>
              <p className="text-[11px] text-gray-500 mt-1">Browse and claim free bulk surplus, coordinate thermal van collections, and track meals shared.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-gray-100 text-left">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit mb-3"><HeartHandshake size={20} /></div>
              <h4 className="font-bold text-sm text-gray-900">Food Donor</h4>
              <p className="text-[11px] text-gray-500 mt-1">Caterers and event halls post surplus food for nearby verified charities to rescue.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF5] border border-gray-100 text-left">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 w-fit mb-3"><User size={20} /></div>
              <h4 className="font-bold text-sm text-gray-900">Customer</h4>
              <p className="text-[11px] text-gray-500 mt-1">Discover discounted gourmet dishes, reserve pickup time slots, and verify with QR code.</p>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#218838] text-white text-xs sm:text-sm font-bold hover:bg-emerald-700 shadow-md transition-all"
            >
              <span>Join FoodSave Today</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;
