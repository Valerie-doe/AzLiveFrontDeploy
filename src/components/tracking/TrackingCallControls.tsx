import React from 'react';
import { Phone } from 'lucide-react';

interface TrackingCallControlsProps {
  onCallVendor: () => void;
  onCallRider: () => void;
  onCallCustomer: () => void;
  isCustomerPhoneAvailable: boolean;
}

export default function TrackingCallControls({
  onCallVendor,
  onCallRider,
  onCallCustomer,
  isCustomerPhoneAvailable
}: TrackingCallControlsProps) {
  return (
    <div className="bg-white p-4.5 rounded-2xl border border-slate-150 border-slate-200">
      <span className="text-[10px] font-mono uppercase font-black text-slate-400 block mb-2 px-1">📞 Passerelle Téléphonique d'Urgence (Point 12)</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        
        {/* Call Vendor button */}
        <button
          type="button"
          onClick={onCallVendor}
          className="p-3 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Phone className="h-4 w-4 text-emerald-400 animate-pulse" /> Appeler Vendeur
        </button>

        {/* Call Rider courier button */}
        <button
          type="button"
          onClick={onCallRider}
          className="p-3 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <Phone className="h-4 w-4 text-emerald-400 animate-pulse" /> Appeler Livreur
        </button>

        {/* Call Buyer customer button */}
        <button
          type="button"
          onClick={onCallCustomer}
          className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
            isCustomerPhoneAvailable 
              ? 'bg-indigo-600 hover:bg-indigo-555 text-white cursor-pointer' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          disabled={!isCustomerPhoneAvailable}
        >
          <Phone className="h-4 w-4 text-emerald-400 animate-pulse" /> Appeler Client
        </button>

      </div>
    </div>
  );
}
