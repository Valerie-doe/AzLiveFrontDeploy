import { apiRequest, getJsonHeaders } from './client';

export interface VendeurApiResponse {
  id: number;
  nom: string;
  is_demo_mode: boolean;
  [key: string]: unknown;
}

/**
 * Bascule un vendeur en mode démo via l'endpoint backend existant
 * (`POST /vendeurs/connect/`, platform=demo). Le backend génère alors des
 * diffusions de live simulées au lieu d'appeler Facebook — c'est exactement le
 * flux de démarrage utilisé par les tests backend (`LiveDiffusionTest`).
 */
export async function enableVendeurDemoMode(vendeurId: number): Promise<VendeurApiResponse> {
  return apiRequest<VendeurApiResponse>('vendeurs/connect/', {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ vendeur_id: vendeurId, platform: 'demo' }),
  });
}
