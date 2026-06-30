import { useEffect, useMemo, useState } from 'react';
import { Product } from '../../types';
import { findProductByJpCode, findVariantByJpCode } from '../../products/utils/productUtils';
import { DashboardStatsApi, fetchDashboardStats } from '../../../api/dashboard.api';
import { getStoredVendeurId } from '../../auth/services/authStorage';

export interface ProductLeaderboardItem {
  name: string;
  count: number;
  value: number;
  code: string;
  image: string;
  size: string;
  color: string;
  stock: number;
  price: number;
}

export interface MonthlyChartEntry {
  name: string;
  "Chiffre d'affaires": number;
}

export interface DashboardViewModel {
  caTotalCumule: number;
  articlesVendusTotal: number;
  totalLivesRealises: number;
  nbrArticlesEnStock: number;
  monthlyChartData: MonthlyChartEntry[];
  productLeaderboard: ProductLeaderboardItem[];
}

/**
 * Transforme la réponse backend en modèle de vue attendu par les composants.
 * Le classement est enrichi (image / taille / couleur) à partir du catalogue
 * produits déjà chargé, sans dupliquer la logique d'agrégation (faite côté backend).
 */
function mapDashboardStats(api: DashboardStatsApi, products: Product[]): DashboardViewModel {
  const monthlyChartData: MonthlyChartEntry[] = api.monthly_chart_data.map((m) => ({
    name: m.mois,
    "Chiffre d'affaires": m.chiffre_affaires,
  }));

  const productLeaderboard: ProductLeaderboardItem[] = api.best_sellers_ranking.map((b) => {
    const variant = findVariantByJpCode(products, b.code_jp);
    const product =
      findProductByJpCode(products, b.code_jp) || products.find((p) => p.name === b.produit_nom);
    return {
      name: b.produit_nom,
      count: b.unites_vendues,
      value: b.revenus_cumules,
      code: b.code_jp,
      image: product?.image || '',
      size: variant?.size || 'Unique',
      color: variant?.color || 'Unique',
      stock: b.stock_restant,
      price: b.prix_unitaire,
    };
  });

  return {
    caTotalCumule: api.chiffre_affaires,
    articlesVendusTotal: api.articles_vendus,
    totalLivesRealises: api.lives_realises,
    nbrArticlesEnStock: api.articles_en_stock,
    monthlyChartData,
    productLeaderboard,
  };
}

interface UseDashboardStatsResult {
  data: DashboardViewModel | null;
  loading: boolean;
  error: string | null;
}

/**
 * Charge les statistiques du tableau de bord depuis le backend
 * (`GET /dashboard/stats/`) et les mappe pour les composants existants.
 */
export function useDashboardStats(products: Product[]): UseDashboardStatsResult {
  const [raw, setRaw] = useState<DashboardStatsApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await fetchDashboardStats(getStoredVendeurId());
        if (active) setRaw(stats);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Erreur chargement du tableau de bord');
          setRaw(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const data = useMemo(() => (raw ? mapDashboardStats(raw, products) : null), [raw, products]);

  return { data, loading, error };
}
