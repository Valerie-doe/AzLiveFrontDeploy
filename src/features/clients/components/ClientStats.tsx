import React from 'react';
import { Users, DollarSign, ShoppingBag } from 'lucide-react';
import { StatCard } from '../../../shared';

interface ClientStatsProps {
  totalClients: number;
  averageSpentPerOrder: number;
  fidelityPercentage: number;
  activeLoyalClients: number;
}

export default function ClientStats({
  totalClients,
  averageSpentPerOrder,
  fidelityPercentage,
  activeLoyalClients,
}: ClientStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        label="Nombre de clients"
        value={`${totalClients} clients`}
        icon={<Users className="h-5 w-5 text-indigo-600" />}
        iconBgClass="bg-indigo-50"
        borderClass="border-slate-100"
      />
      <StatCard
        label="Prix moyen / Commande"
        value={<span className="text-indigo-600">{averageSpentPerOrder.toLocaleString()} Ar</span>}
        icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
        iconBgClass="bg-indigo-50"
        borderClass="border-slate-100"
      />
      <StatCard
        label="Fidélité (% + fidèles)"
        value={
          <span className="text-emerald-600">
            {fidelityPercentage}% ({activeLoyalClients} clients) 🔥
          </span>
        }
        icon={<ShoppingBag className="h-5 w-5 text-emerald-600" />}
        iconBgClass="bg-emerald-50"
        borderClass="border-slate-100"
      />
    </div>
  );
}
