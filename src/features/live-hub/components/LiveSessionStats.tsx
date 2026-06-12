import React from 'react';
import { Order } from '../../../types';
import { DollarSign, ShoppingBag, Clock, User } from 'lucide-react';

interface LiveSessionStatsProps {
  sessionOrders: Order[];
}

export default function LiveSessionStats({ sessionOrders }: LiveSessionStatsProps) {
  const statsRevenue = sessionOrders.filter((o) => o.status !== 'annulé').reduce((sum, o) => sum + o.price, 0);
  const statsItemsSold = sessionOrders.filter((o) => o.status !== 'annulé').length;
  const statsAvgPrice = statsItemsSold > 0 ? Math.round(statsRevenue / statsItemsSold) : 0;
  const statsUniqueClients = new Set(
    sessionOrders
      .filter((o) => o.status !== 'annulé')
      .map((o) => o.customerHandle || o.customerName || o.customerPhone)
      .filter(Boolean)
  ).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-indigo-50/20 p-3.5 rounded-3xl border border-indigo-100/50" id="live-session-stats-cards">
      <div className="bg-white p-4 rounded-2xl border border-indigo-150/40 shadow-sm flex items-center justify-between gap-2.5">
        <div className="space-y-1 overflow-hidden">
          <span className="text-[9px] font-mono uppercase text-indigo-500 font-extrabold block tracking-wider leading-none">Chiffre d'affaires</span>
          <span className="text-sm sm:text-base font-black text-slate-900 truncate block">{statsRevenue.toLocaleString()} Ar</span>
          <span className="text-[9px] text-slate-400 font-serif leading-none block">Recettes de ce live</span>
        </div>
        <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <DollarSign className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm flex items-center justify-between gap-2.5">
        <div className="space-y-1 overflow-hidden">
          <span className="text-[9px] font-mono uppercase text-slate-400 font-extrabold block tracking-wider leading-none">Articles vendus</span>
          <span className="text-sm sm:text-base font-black text-slate-900 truncate block">{statsItemsSold} pcs</span>
          <span className="text-[9px] text-slate-400 font-serif leading-none block">Non annulés</span>
        </div>
        <div className="h-9 w-9 bg-slate-50 text-slate-650 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm flex items-center justify-between gap-2.5">
        <div className="space-y-1 overflow-hidden">
          <span className="text-[9px] font-mono uppercase text-slate-400 font-extrabold block tracking-wider leading-none">Prix Moyen</span>
          <span className="text-sm sm:text-base font-black text-slate-900 truncate block">{statsAvgPrice.toLocaleString()} Ar</span>
          <span className="text-[9px] text-slate-400 font-serif leading-none block">Par commande</span>
        </div>
        <div className="h-9 w-9 bg-slate-50 text-slate-650 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm flex items-center justify-between gap-2.5">
        <div className="space-y-1 overflow-hidden">
          <span className="text-[9px] font-mono uppercase text-slate-400 font-extrabold block tracking-wider leading-none">Nombre de clients</span>
          <span className="text-sm sm:text-base font-black text-slate-900 truncate block">{statsUniqueClients}</span>
          <span className="text-[9px] text-slate-400 font-serif leading-none block">Acheteurs uniques</span>
        </div>
        <div className="h-9 w-9 bg-slate-50 text-slate-650 rounded-xl flex items-center justify-center flex-shrink-0">
          <User className="h-4.5 w-4.5" />
        </div>
      </div>
    </div>
  );
}
