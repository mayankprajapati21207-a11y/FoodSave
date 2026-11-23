import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ShieldCheck, Leaf } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, title, token, subtext, status }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 text-center relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-700 mb-3">
          <QrCode size={28} />
        </div>

        <h3 className="text-lg font-bold text-gray-900">{title || 'Pickup Verification Code'}</h3>
        <p className="text-xs text-gray-500 mt-1 mb-5">{subtext || 'Present this code at the restaurant counter for handover'}</p>

        {/* Realistic SVG QR Code Display */}
        <div className="bg-emerald-50/50 p-6 rounded-2xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center relative mb-5">
          <div className="w-48 h-48 bg-white p-3 rounded-xl shadow-md flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Corner position markers */}
              <rect x="5" y="5" width="25" height="25" fill="#218838" rx="4" />
              <rect x="10" y="10" width="15" height="15" fill="#FFFFFF" rx="2" />
              <rect x="14" y="14" width="7" height="7" fill="#218838" />

              <rect x="70" y="5" width="25" height="25" fill="#218838" rx="4" />
              <rect x="75" y="10" width="15" height="15" fill="#FFFFFF" rx="2" />
              <rect x="79" y="14" width="7" height="7" fill="#218838" />

              <rect x="5" y="70" width="25" height="25" fill="#218838" rx="4" />
              <rect x="10" y="75" width="15" height="15" fill="#FFFFFF" rx="2" />
              <rect x="14" y="79" width="7" height="7" fill="#218838" />

              {/* Pseudo random QR data blocks */}
              <rect x="35" y="10" width="5" height="5" fill="#252B25" />
              <rect x="45" y="10" width="5" height="10" fill="#252B25" />
              <rect x="55" y="5" width="8" height="5" fill="#252B25" />
              <rect x="38" y="22" width="6" height="6" fill="#218838" />
              <rect x="50" y="25" width="10" height="5" fill="#252B25" />

              <rect x="10" y="38" width="5" height="12" fill="#252B25" />
              <rect x="20" y="42" width="8" height="6" fill="#252B25" />
              <rect x="12" y="55" width="12" height="6" fill="#252B25" />

              <rect x="75" y="38" width="6" height="15" fill="#252B25" />
              <rect x="85" y="45" width="8" height="8" fill="#252B25" />
              <rect x="72" y="58" width="12" height="6" fill="#252B25" />

              <rect x="38" y="72" width="12" height="5" fill="#252B25" />
              <rect x="55" y="75" width="8" height="12" fill="#252B25" />
              <rect x="42" y="85" width="18" height="6" fill="#252B25" />
              <rect x="68" y="82" width="6" height="8" fill="#252B25" />
              <rect x="80" y="75" width="12" height="15" fill="#252B25" />

              {/* Center badge */}
              <circle cx="50" cy="50" r="12" fill="#FFFFFF" />
              <circle cx="50" cy="50" r="10" fill="#75B843" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Leaf size={14} className="text-white fill-white" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs font-semibold">
            <span>{token || 'FOODSAVE-TOKEN'}</span>
            <button
              onClick={copyToClipboard}
              className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
              title="Copy Token"
            >
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 bg-gray-50 py-2 px-3 rounded-xl border border-gray-100">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Verifiable only by registered FoodSave operators</span>
        </div>

      </div>
    </div>
  );
};

export default QRCodeModal;
