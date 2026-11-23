import React, { useState } from 'react';
import api from '../services/api';
import { Calculator, X, Sparkles, TrendingUp, Droplets, IndianRupee, Utensils, TreePine } from 'lucide-react';

const WasteCalculatorModal = ({ isOpen, onClose }) => {
  const [wasteType, setWasteType] = useState('cooked_meals');
  const [kgPerWeek, setKgPerWeek] = useState(15);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    annual_waste_kg: 780,
    annual_co2_kg: 2184,
    annual_water_liters: 2496000,
    annual_financial_loss: 140400,
    potential_meals_saved: 1950,
    trees_equivalent: 100.3
  });

  if (!isOpen) return null;

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/calculator/calculate', {
        waste_type: wasteType,
        quantity_kg_per_week: Number(kgPerWeek),
        weeks: 52
      });
      setResult(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <Calculator size={26} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-serif">Smart Food Waste Calculator</h3>
            <p className="text-xs text-gray-500">Calculate the real ecological and financial cost of surplus food</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 my-6 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
              Primary Food Waste Category
            </label>
            <select
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="cooked_meals">Cooked Entrees & Prepared Meals</option>
              <option value="bakery">Artisan Bakery & Pastries</option>
              <option value="fresh_produce">Fresh Fruits & Raw Produce</option>
              <option value="dairy">Dairy, Cheeses & Eggs</option>
              <option value="mixed">Commercial Mixed Food Waste</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Average Surplus / Waste per Week
              </label>
              <span className="text-sm font-extrabold text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs font-mono">
                {kgPerWeek} kg / week
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="150"
              step="1"
              value={kgPerWeek}
              onChange={(e) => setKgPerWeek(e.target.value)}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Small Cafe (2 kg)</span>
              <span>Medium Bistro (25 kg)</span>
              <span>Large Buffet / Hotel (150 kg)</span>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#218838] to-[#75B843] text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-700/20 hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            {loading ? 'Calculating...' : 'Recalculate Annual Impact'}
          </button>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-center">
            <div className="text-emerald-700 mb-1 flex justify-center"><Utensils size={18} /></div>
            <div className="text-lg font-black text-emerald-950 font-serif">
              {result.potential_meals_saved.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold uppercase text-emerald-800">Meals Rescuable</div>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 text-center">
            <div className="text-amber-700 mb-1 flex justify-center"><TrendingUp size={18} /></div>
            <div className="text-lg font-black text-amber-950 font-serif">
              {result.annual_co2_kg.toLocaleString()} <span className="text-xs font-normal">kg</span>
            </div>
            <div className="text-[10px] font-bold uppercase text-amber-800">CO2 Emissions</div>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-center">
            <div className="text-blue-700 mb-1 flex justify-center"><Droplets size={18} /></div>
            <div className="text-lg font-black text-blue-950 font-serif">
              {(result.annual_water_liters / 1000).toFixed(0)}k <span className="text-xs font-normal">L</span>
            </div>
            <div className="text-[10px] font-bold uppercase text-blue-800">Water Footprint</div>
          </div>

          <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-100 text-center">
            <div className="text-rose-700 mb-1 flex justify-center"><IndianRupee size={18} /></div>
            <div className="text-lg font-black text-rose-950 font-serif">
              ₹{result.annual_financial_loss.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold uppercase text-rose-800">Cost of Waste</div>
          </div>

          <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-100 text-center sm:col-span-2">
            <div className="text-teal-700 mb-1 flex justify-center"><TreePine size={18} /></div>
            <div className="text-lg font-black text-teal-950 font-serif">
              {result.trees_equivalent} trees
            </div>
            <div className="text-[10px] font-bold uppercase text-teal-800">Annual Trees Absorbing Power</div>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-5 text-center leading-relaxed">
          By listing daily surplus on <strong>FoodSave</strong>, over 80% of this food can be redistributed to paying customers or donated to local charities within hours.
        </p>

      </div>
    </div>
  );
};

export default WasteCalculatorModal;
