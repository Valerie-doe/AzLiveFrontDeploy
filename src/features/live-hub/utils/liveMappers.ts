import { Collaborator, LiveBroadcastBridge, LiveSession } from '../../../types';
import { DEFAULT_VENDEUR_ID } from '../../../api/client';
import {
  CollaborateurApiResponse,
  LiveApiResponse,
  LiveStatutApi,
  LiveWritePayload,
} from '../types/liveApi.types';

const STATUS_TO_UI: Record<LiveStatutApi, LiveSession['status']> = {
  planifie: 'Créé',
  en_cours: 'En cours',
  termine: 'Terminé',
};

const ROLE_TO_API: Record<Collaborator['role'], string> = {
  Commercial: 'operateur',
  Modérateur: 'moderateur',
  Secrétaire: 'secretaire',
  Superviseur: 'superviseur',
};

const ROLE_FROM_API: Record<string, Collaborator['role']> = {
  operateur: 'Commercial',
  moderateur: 'Modérateur',
  secretaire: 'Secrétaire',
  superviseur: 'Superviseur',
};

function mapBroadcastFromApi(api: LiveApiResponse): LiveBroadcastBridge | null {
  const webrtc = api.diffusion_plateformes?.webrtc;
  if (!webrtc) return null;
  return {
    status: webrtc.status,
    path: webrtc.path,
    whipUrl: webrtc.whip_url,
    publishToken: webrtc.publish_token,
  };
}

export function mapLiveFromApi(api: LiveApiResponse): LiveSession {
  return {
    id: String(api.id),
    title: api.titre,
    date: api.date_live || '',
    status: STATUS_TO_UI[api.statut] ?? 'Créé',
    connectedPages: api.pages_facebook || [],
    // Backend renvoie des IDs (number[]) pour alléger la liste ; compat objets {id}.
    selectedProductIds: (api.produits_dressing || []).map((p) =>
      String(typeof p === 'object' && p !== null ? p.id : p),
    ),
    assignedCollaborator: api.operateur_nom || undefined,
    operateurId: api.operateur,
    vendeurId: api.vendeur,
    totalOrders: api.nb_fiches ?? 0,
    revenue: api.chiffre_affaires ?? 0,
    orders: [],
    broadcast: mapBroadcastFromApi(api),
    confirmationLink: api.confirmation_link || undefined,
    confirmationComment: api.confirmation_comment || undefined,
  };
}

export function buildLiveCreatePayload(params: {
  title: string;
  dateLive: string;
  operateurId?: number | null;
  pages: string[];
  productIds?: string[];
  vendeurId?: number;
}): LiveWritePayload {
  return {
    titre: params.title.trim(),
    date_live: params.dateLive ? new Date(params.dateLive).toISOString() : null,
    statut: 'planifie',
    vendeur: params.vendeurId ?? DEFAULT_VENDEUR_ID,
    operateur: params.operateurId ?? null,
    pages_facebook: params.pages,
    produits_dressing_ids: (params.productIds || []).map(Number),
  };
}

export function buildLiveUpdatePayload(params: {
  title?: string;
  dateLive?: string;
  operateurId?: number | null;
  pages?: string[];
  productIds?: string[];
}): LiveWritePayload {
  const payload: LiveWritePayload = {};
  if (params.title !== undefined) payload.titre = params.title.trim();
  if (params.dateLive !== undefined) {
    payload.date_live = params.dateLive ? new Date(params.dateLive).toISOString() : null;
  }
  if (params.operateurId !== undefined) payload.operateur = params.operateurId;
  if (params.pages !== undefined) payload.pages_facebook = params.pages;
  if (params.productIds !== undefined) {
    payload.produits_dressing_ids = params.productIds.map(Number);
  }
  return payload;
}

export function buildDressingPayload(productIds: string[]): LiveWritePayload {
  return { produits_dressing_ids: productIds.map(Number) };
}

export function mapCollaboratorFromApi(api: CollaborateurApiResponse): Collaborator {
  return {
    id: String(api.id),
    name: api.nom,
    phone: api.telephone || '',
    role: ROLE_FROM_API[api.role] ?? 'Commercial',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(api.nom)}&background=6366f1&color=fff`,
    connectedPages: [],
    stats: { claimsInputs: 0, validatedPayments: 0, ticketsPrinted: 0 },
    isActive: true,
  };
}

export function buildCollaboratorPayload(
  collab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>,
  vendeurId?: number,
) {
  return {
    nom: collab.name.trim(),
    telephone: collab.phone || '',
    role: ROLE_TO_API[collab.role] ?? 'operateur',
    vendeur: vendeurId ?? DEFAULT_VENDEUR_ID,
  };
}
