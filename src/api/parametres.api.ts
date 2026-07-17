import { apiRequest, getJsonHeaders } from './client';

export interface PlatformSettings {
  nom_plateforme: string;
  taux_commission: string;
  jp_turn_timeout_minutes: number;
  updated_at: string;
}

export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>('parametres/', {
    method: 'GET',
    headers: getJsonHeaders(),
  });
}

export async function updatePlatformSettings(
  payload: Partial<Pick<PlatformSettings, 'jp_turn_timeout_minutes' | 'nom_plateforme' | 'taux_commission'>>,
): Promise<PlatformSettings> {
  return apiRequest<PlatformSettings>('parametres/', {
    method: 'PATCH',
    headers: getJsonHeaders(),
    body: JSON.stringify(payload),
  });
}
