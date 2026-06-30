import { apiRequest, getJsonHeaders } from './client';

export interface CommandeVarianteApi {
  id: number;
  taille: string;
  couleur: string;
  prix_unitaire: string;
  stock: number;
  code_jp: string;
}

export interface CommandeProduitApi {
  id: number;
  nom: string;
  photo?: string | null;
  variantes?: CommandeVarianteApi[];
  vendeur?: { id: number } | null;
}

export interface CommandeClientApi {
  id: number;
  nom: string;
  telephone: string;
  adresse: string;
  date_livraison_preferee?: string | null;
  social_handle?: string | null;
  facebook_id?: string | null;
  tiktok_id?: string | null;
}

export interface CommandePaiementApi {
  id: number;
  methode: string;
  statut: string;
  capture_mobile_money?: string | null;
}

export interface CommandeLivraisonApi {
  id: number;
  statut: string;
}

export interface CommandeLiveApi {
  id: number;
  titre: string;
}

export interface CommandeApiResponse {
  id: number;
  client: CommandeClientApi;
  produit: CommandeProduitApi;
  variante: CommandeVarianteApi | null;
  ordre_jp: number;
  statut: string;
  date_creation: string;
  paiement: CommandePaiementApi | null;
  livraison: CommandeLivraisonApi | null;
  live?: CommandeLiveApi | null;
}

/**
 * Récupère les commandes (JP capturés) rattachées à un live donné.
 * Le filtre `live_id` est géré côté backend par `CommandeListCreateView`.
 */
export async function fetchCommandesByLive(liveId: string | number): Promise<CommandeApiResponse[]> {
  const response = await apiRequest<CommandeApiResponse[] | { results: CommandeApiResponse[] }>(
    `commandes/?live_id=${liveId}`,
    { method: 'GET', headers: getJsonHeaders() },
  );
  return Array.isArray(response) ? response : response.results ?? [];
}

/**
 * Récupère toutes les commandes d'un vendeur (tous lives confondus).
 * Le filtre `vendeur_id` est géré côté backend par `CommandeListCreateView`.
 */
export async function fetchCommandesByVendeur(
  vendeurId: string | number,
): Promise<CommandeApiResponse[]> {
  const response = await apiRequest<CommandeApiResponse[] | { results: CommandeApiResponse[] }>(
    `commandes/?vendeur_id=${vendeurId}`,
    { method: 'GET', headers: getJsonHeaders() },
  );
  return Array.isArray(response) ? response : response.results ?? [];
}

/**
 * Recherche globale de commandes (client, téléphone, produit, variante, code JP,
 * statut, n° de commande). Géré côté backend par `CommandeSearchAPIView`.
 */
export async function searchCommandes(query: string): Promise<CommandeApiResponse[]> {
  const response = await apiRequest<CommandeApiResponse[] | { results: CommandeApiResponse[] }>(
    `commandes/search/?q=${encodeURIComponent(query)}`,
    { method: 'GET', headers: getJsonHeaders() },
  );
  return Array.isArray(response) ? response : response.results ?? [];
}
