import React from 'react';
import { Product } from '../../../types';
import { useDashboardStats } from '../hooks/useDashboard';
import DashboardStats from '../components/DashboardStats';
import MonthlyChart from '../components/MonthlyChart';
import ProductLeaderboard from '../components/ProductLeaderboard';

interface DashboardPageProps {
  products: Product[];
}

export default function DashboardPage({ products }: DashboardPageProps) {
  const { data, loading, error } = useDashboardStats(products);

  return (
    <div className="space-y-6" id="azlive-analytics-dashboard">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-secondary">Mon Tableau de Bord (Statistiques simples)</h2>
        <p className="text-sm text-slate-500 font-serif">
          Suivez facilement vos ventes, l'argent reçu en Mobile Money et le rendement de vos produits stars.
        </p>
      </div>

      {error && (
        <div className="bg-white border border-rose-100 rounded-2xl p-4 text-xs text-rose-600">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="text-center text-xs text-slate-400 font-mono py-2">
          Chargement des statistiques…
        </div>
      )}

      {/* METRICS ROW */}
      <DashboardStats
        caTotalCumule={data?.caTotalCumule ?? 0}
        articlesVendusTotal={data?.articlesVendusTotal ?? 0}
        totalLivesRealises={data?.totalLivesRealises ?? 0}
        nbrArticlesEnStock={data?.nbrArticlesEnStock ?? 0}
      />

      {/* MONTHLY CHART */}
      <MonthlyChart data={data?.monthlyChartData ?? []} />

      {/* PRODUCT LEADERBOARD */}
      <ProductLeaderboard items={data?.productLeaderboard ?? []} />
    </div>
  );
}
