import React from 'react';
import { TrendingUp, ShoppingBag, Tv, Package } from 'lucide-react';
import { StatCard } from '../../../shared';

interface DashboardStatsProps {
  caTotalCumule: number;
  articlesVendusTotal: number;
  totalLivesRealises: number;
  nbrArticlesEnStock: number;
}

export default function DashboardStats({
  caTotalCumule,
  articlesVendusTotal,
  totalLivesRealises,
  nbrArticlesEnStock,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-indigo-100 shadow-sm flex items-center justify-between gap-3 min-w-0">
        <div className="space-y-1 min-w-0">
          <span className="text-[10px] font-mono uppercase text-indigo-500 font-black block tracking-wider">
            Chiffre d&apos;affaires
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-950 font-sans break-words">
            {caTotalCumule.toLocaleString()} Ar
          </span>
          <span className="text-[10px] text-indigo-500 block font-serif">
            Ventes cumulées de la boutique
          </span>
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <StatCard
        label="Articles vendus"
        value={articlesVendusTotal}
        subLabel="Articles validés et confirmés"
        icon={<ShoppingBag className="h-5 w-5 text-emerald-600" />}
        iconBgClass="bg-emerald-50"
        borderClass="border-slate-100"
      />

      <StatCard
        label="Lives réalisés"
        value={totalLivesRealises}
        subLabel="Livestreams enregistrés"
        icon={<Tv className="h-5 w-5 text-rose-600" />}
        iconBgClass="bg-rose-50"
        borderClass="border-slate-100"
      />

      <StatCard
        label="Articles en stock"
        value={nbrArticlesEnStock}
        subLabel="Stock disponible en boutique"
        icon={<Package className="h-5 w-5 text-amber-600" />}
        iconBgClass="bg-amber-50"
        borderClass="border-slate-100"
      />
    </div>
  );
}
