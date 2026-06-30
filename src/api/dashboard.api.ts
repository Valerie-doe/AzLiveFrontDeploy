import { apiRequest, getJsonHeaders } from './client';

export interface DashboardMonthlyApi {
  mois: string;
  chiffre_affaires: number;
}

export interface DashboardBestSellerApi {
  rang: number;
  produit_nom: string;
  code_jp: string;
  prix_unitaire: number;
  unites_vendues: number;
  stock_restant: number;
  revenus_cumules: number;
}

export interface DashboardStatsApi {
  chiffre_affaires: number;
  articles_vendus: number;
  lives_realises: number;
  articles_en_stock: number;
  monthly_chart_data: DashboardMonthlyApi[];
  best_sellers_ranking: DashboardBestSellerApi[];
  nombre_jps: number;
  confirmes: number;
  taux_confirmation: number;
  montant_a_reverser: number;
  commission_plateforme: number;
}

/**
 * Statistiques agrégées du tableau de bord (CA, articles vendus, lives, stock,
 * graphe mensuel, meilleurs produits). Calculées côté backend par
 * `DashboardStatsAPIView` (`GET /dashboard/stats/`).
 */
export async function fetchDashboardStats(
  vendeurId?: string | number | null,
): Promise<DashboardStatsApi> {
  const query = vendeurId != null ? `?vendeur_id=${vendeurId}` : '';
  return apiRequest<DashboardStatsApi>(`dashboard/stats/${query}`, {
    method: 'GET',
    headers: getJsonHeaders(),
  });
}
