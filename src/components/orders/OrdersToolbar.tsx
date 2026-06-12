import React from 'react';
import { motion } from 'motion/react';
import { Search, Truck } from 'lucide-react';

interface OrdersToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onLaunchAZExpress: () => void;
}

export default function OrdersToolbar({
  searchQuery,
  onSearchChange,
  selectedCount,
  onLaunchAZExpress
}: OrdersToolbarProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:w-5/12">
        <span className="absolute left-3.5 top-3 text-slate-400">
          <Search className="h-4.5 w-4.5" />
        </span>
        <input
          type="text"
          placeholder="Rechercher un client, son téléphone (034, 032...), son code JP..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold"
          id="orders-search-bar"
        />
      </div>

      {/* Dispatch action */}
      {selectedCount > 0 ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 w-full md:w-auto justify-end"
        >
          <span className="text-xs font-sans font-bold text-slate-500">
            {selectedCount} sélectionné(s)
          </span>
          <button
            onClick={onLaunchAZExpress}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold uppercase text-[11px] tracking-wider rounded-xl flex items-center gap-2 shadow-md shadow-emerald-100 transition-all cursor-pointer hover:shadow-lg hover:scale-101 border-none"
            id="btn-dispatch-azexpress"
          >
            <Truck className="h-4.5 w-4.5" /> Donner les colis au livreur (AZExpress)
          </button>
        </motion.div>
      ) : (
        <div className="text-xs text-slate-400 font-serif text-center md:text-right w-full md:w-auto">
          💡 <span className="font-sans font-semibold">Astuce :</span> Cochez les cases des colis prêts pour les donner aux livreurs AZExpress en un clic !
        </div>
      )}
    </div>
  );
}
