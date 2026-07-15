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
  infos_completes?: boolean;
  pret_a_confirmer?: boolean;
}

export interface PublicOrderLookup {
  live: { id: number; titre: string; statut: string };
  vendeur: string;
  found: boolean;
  client?: {
    nom: string;
    telephone: string;
    adresse: string;
    date_livraison?: string;
    heure_livraison?: string;
  };
  /** JP à compléter ou à confirmer (stock dispo). */
  commandes: PublicOrderItem[];
  /** JP déjà en file d'attente (infos OK) — ne pas afficher dans le formulaire. */
  commandes_liste_attente?: PublicOrderItem[];
}

export interface PublicOrderSubmitPayload {
  handle: string;
  nom: string;
  telephone: string;
  adresse: string;
  date_livraison: string;
  heure_livraison: string;
  items: { commande_id: number; quantite: number }[];
}

export interface PublicOrderSubmitResult {
  status: string;
  traitees: {
    commande_id: number;
    status: string;
    complet: boolean;
    en_attente?: boolean;
  }[];
  erreurs: { commande_id?: number; detail: string; rupture_stock?: boolean }[];
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
