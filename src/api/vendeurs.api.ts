import { apiRequest, getJsonHeaders } from './client';

export interface VendeurApiResponse {
  id: number;
  nom: string;
  is_demo_mode: boolean;
  tiktok_username?: string | null;
  [key: string]: unknown;
}

/**
 * Bascule un vendeur en mode démo via l'endpoint backend existant
 * (`POST /vendeurs/connect/`, platform=demo). Le backend génère alors des
 * diffusions de live simulées au lieu d'appeler Facebook — c'est exactement le
 * flux de démarrage used par les tests backend (`LiveDiffusionTest`).
 */
export async function enableVendeurDemoMode(vendeurId: number): Promise<VendeurApiResponse> {
  return apiRequest<VendeurApiResponse>('vendeurs/connect/', {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ vendeur_id: vendeurId, platform: 'demo' }),
  });
}

/** Enregistre le @TikTok (unique_id) requis pour la détection live TikTools. */
export async function setVendeurTikTokUsername(
  vendeurId: number,
  tiktokUsername: string,
): Promise<VendeurApiResponse> {
  return apiRequest<VendeurApiResponse>('vendeurs/connect/', {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({
      vendeur_id: vendeurId,
      platform: 'tiktok',
      tiktok_username: tiktokUsername,
    }),
  });
}
