import React from 'react';
import { Order } from '../../../types';
import StatCard from '../../../shared/components/StatCard';
import { ShoppingBag, CheckCircle, Sparkles, Clock } from 'lucide-react';

interface LiveMetricsRowProps {
  orders: Order[];
  totalJPClaims: number;
  confirmationRate: number;
  revenue: number;
}

export default function LiveMetricsRow({ orders, totalJPClaims, confirmationRate, revenue }: LiveMetricsRowProps) {
  const clientsToRemind = orders.filter(o => o.chatStatus === 'En attente' || o.chatStatus.includes('Relancé')).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Réservations (JP)"
        value={totalJPClaims.toString()}
        icon={<ShoppingBag className="h-4.5 w-4.5 text-slate-650" />}
        iconBgClass="bg-slate-50"
      />
      <StatCard
        label="Commandes Confirmées"
        value={
          <span className="text-emerald-600 font-sans">
            {confirmationRate}%
          </span>
        }
        icon={<CheckCircle className="h-4.5 w-4.5 text-emerald-650" />}
        iconBgClass="bg-emerald-50"
      />
      <StatCard
        label="Ventes Estimées (Ar)"
        value={
          <span className="text-indigo-600 font-sans">
            {revenue.toLocaleString()} Ar
          </span>
        }
        icon={<Sparkles className="h-4.5 w-4.5 text-indigo-650" />}
        iconBgClass="bg-indigo-50"
      />
      <StatCard
        label="Clients à relancer"
        value={
          <span className="text-amber-600 font-sans">
            {clientsToRemind.toString()}
          </span>
        }
        icon={<Clock className="h-4.5 w-4.5 text-amber-650 animate-pulse" />}
        iconBgClass="bg-amber-50"
      />
    </div>
  );
}
