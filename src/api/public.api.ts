// Client API du formulaire public de commande (live TikTok).
// IMPORTANT : ces appels ne portent AUCUN token — la page est publique et partagée
// aux clients. Le backend expose des endpoints AllowAny dédiés.

const API_URL = import.meta.env.VITE_URL_BACKEND || '';

export interface PublicOrderItem {
  commande_id: number;
  produit: string;
  code_jp: string;
  taille: string;
  couleur: string;
  prix_unitaire: string | null;
  quantite: number | null;
  stock_disponible?: number | null;
  stock_actuel?: number | null;
  en_rupture?: boolean;
  en_liste_attente?: boolean;
  a_son_tour?: boolean;
  position_file?: number;
  personnes_devant?: number;
  ordre_jp?: number;
  infos_completes?: boolean;
  pret_a_confirmer?: boolean;
  timeout_minutes?: number;
  turn_started_at?: string | null;
  turn_expires_at?: string | null;
}

export interface PublicOrderLookup {
  live: { id: number; titre: string; statut: string };
  vendeur: string;
  found: boolean;
  jp_turn_timeout_minutes?: number;
  client?: {
    nom: string;
    telephone: string;
    adresse: string;
    date_livraison?: string;
    heure_livraison?: string;
  };
  /** JP à son tour (formulaire). */
  commandes: PublicOrderItem[];
  /** JP en file — position uniquement. */
  commandes_liste_attente?: PublicOrderItem[];
}

export interface PublicOrderSubmitPayload {
  handle: string;
  nom: string;
  telephone: string;
  adresse: string;
  date_livraison: string;
  heure_livraison: string;
  accept_partial?: boolean;
  items: { commande_id: number; quantite: number; accept_partial?: boolean }[];
}

export interface PublicOrderSubmitResult {
  status: string;
  traitees: {
    commande_id: number;
    status: string;
    complet: boolean;
    en_attente?: boolean;
    quantite_confirmee?: number;
  }[];
  erreurs: {
    commande_id?: number;
    detail: string;
    rupture_stock?: boolean;
    stock_propose?: number;
    quantite_demandee?: number;
    pas_encore_tour?: boolean;
  }[];
}

export interface PublicOrderCancelResult {
  status: string;
  annulees: { commande_id: number; status: string; annule: boolean }[];
  erreurs: { commande_id?: number; detail: string }[];
}

function buildUrl(path: string): string {
  return `${API_URL}${path.replace(/^\//, '')}`;
}

async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data?.detail) return String(data.detail);
    if (data?.champs_manquants) return `Champs manquants : ${data.champs_manquants.join(', ')}`;
    return `Erreur (${res.status})`;
  } catch {
    return `Erreur (${res.status})`;
  }
}

export async function fetchPublicTikTokLoginUrl(liveId: number): Promise<{ auth_url: string }> {
  const res = await fetch(buildUrl(`public/lives/${liveId}/tiktok-login/`), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function lookupPublicOrders(liveId: number, handle: string): Promise<PublicOrderLookup> {
  const res = await fetch(
    buildUrl(`public/lives/${liveId}/order-form/?handle=${encodeURIComponent(handle)}`),
    { method: 'GET', headers: { 'Content-Type': 'application/json' } },
  );
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function submitPublicOrder(
  liveId: number,
  payload: PublicOrderSubmitPayload,
): Promise<PublicOrderSubmitResult> {
  const res = await fetch(buildUrl(`public/lives/${liveId}/order-form/`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  // 400 peut contenir des erreurs métier (rupture de stock) utiles à afficher.
  if (!res.ok) {
    if (data && Array.isArray(data.erreurs)) {
      return data as PublicOrderSubmitResult;
    }
    throw new Error((data && data.detail) || `Erreur (${res.status})`);
  }
  return data as PublicOrderSubmitResult;
}

export async function cancelPublicOrders(
  liveId: number,
  payload: { handle: string; commande_ids?: number[] },
): Promise<PublicOrderCancelResult> {
  const res = await fetch(buildUrl(`public/lives/${liveId}/order-form/cancel/`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (data && Array.isArray(data.erreurs)) {
      return data as PublicOrderCancelResult;
    }
    throw new Error((data && data.detail) || `Erreur (${res.status})`);
  }
  return data as PublicOrderCancelResult;
}
