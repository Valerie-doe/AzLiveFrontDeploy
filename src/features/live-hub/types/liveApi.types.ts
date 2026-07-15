export type LiveStatutApi = 'planifie' | 'en_cours' | 'termine';

export interface LiveApiProduct {
  id: number;
  nom: string;
  variantes?: Array<{
    id: number;
    taille: string;
    couleur: string;
    prix_unitaire: string;
    stock: number;
    code_jp: string;
  }>;
}

export interface LiveBroadcastWebrtcApi {
  status: string;
  path?: string;
  whip_url?: string;
  publish_token?: string;
  detail?: string;
}

export interface LiveDiffusionApi {
  facebook?: unknown;
  tiktok?: unknown;
  webrtc?: LiveBroadcastWebrtcApi | null;
  started_at?: string;
}

export interface LiveApiResponse {
  id: number;
  titre: string;
  date_live: string | null;
  statut: LiveStatutApi;
  vendeur: number;
  operateur: number | null;
  operateur_nom: string | null;
  pages_facebook: string[];
  produits_dressing: LiveApiProduct[];
  chiffre_affaires: number;
  nb_fiches: number;
  confirmation_link?: string | null;
  confirmation_comment?: string | null;
  diffusion_plateformes?: LiveDiffusionApi | null;
}

export interface LiveWritePayload {
  titre?: string;
  date_live?: string | null;
  statut?: LiveStatutApi;
  vendeur?: number;
  operateur?: number | null;
  pages_facebook?: string[];
  produits_dressing_ids?: number[];
}

export interface CollaborateurApiResponse {
  id: number;
  nom: string;
  telephone: string;
  role: string;
  vendeur: number;
}

export interface FacebookPageApiResponse {
  id: number;
  page_id: string;
  nom: string;
  statut: string;
}
