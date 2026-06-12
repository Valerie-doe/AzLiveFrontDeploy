import React from 'react';
import { Order, Product, LiveSession } from '../../../types';
import { computeDashboardData } from '../hooks/useDashboard';
import DashboardStats from '../components/DashboardStats';
import MonthlyChart from '../components/MonthlyChart';
import ProductLeaderboard from '../components/ProductLeaderboard';

interface DashboardPageProps {
  orders: Order[];
  products: Product[];
  liveSessions?: LiveSession[];
}

export default function DashboardPage({ orders, products, liveSessions = [] }: DashboardPageProps) {
  const {
    caTotalCumule,
    articlesVendusTotal,
    totalLivesRealises,
    nbrArticlesEnStock,
    monthlyChartData,
    productLeaderboard,
  } = computeDashboardData(orders, products, liveSessions);

  return (
    <div className="space-y-6" id="azlive-analytics-dashboard">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Mon Tableau de Bord (Statistiques simples)</h2>
        <p className="text-sm text-slate-500 font-serif">
          Suivez facilement vos ventes, l'argent reçu en Mobile Money et le rendement de vos produits stars.
        </p>
      </div>

      {/* METRICS ROW */}
      <DashboardStats
        caTotalCumule={caTotalCumule}
        articlesVendusTotal={articlesVendusTotal}
        totalLivesRealises={totalLivesRealises}
        nbrArticlesEnStock={nbrArticlesEnStock}
      />

      {/* MONTHLY CHART */}
      <MonthlyChart data={monthlyChartData} />

      {/* PRODUCT LEADERBOARD */}
      <ProductLeaderboard items={productLeaderboard} />
    </div>
  );
}
