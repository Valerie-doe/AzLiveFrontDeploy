import { apiRequest, getJsonHeaders } from './client';
import { fetchAuthMe } from './auth.api';
import { TikTokLoginUrlResponse } from '../features/auth/types/tiktokAuth.types';
import { buildTikTokProfileFromAuthMe } from '../features/auth/services/tiktokAuth.service';

export async function fetchTikTokLoginUrl(): Promise<TikTokLoginUrlResponse> {
  return apiRequest<TikTokLoginUrlResponse>('auth/tiktok/login/', {
    method: 'GET',
    headers: getJsonHeaders(''),
  });
}

export async function loadTikTokAccountAfterAuth(token: string) {
  const authMe = await fetchAuthMe(token);

  if (!authMe.vendeur) {
    throw new Error('Aucun profil vendeur associé à ce compte TikTok.');
  }

  if (!authMe.tiktok_connected && !authMe.vendeur.tiktok_username) {
    throw new Error('Aucun compte TikTok n\'a pu être récupéré pour cette session.');
  }

  const profile = buildTikTokProfileFromAuthMe(authMe);

  return {
    token,
    user: authMe.user,
    vendeur: authMe.vendeur,
    profile,
    tiktokConnected: authMe.tiktok_connected,
  };
}

export function parseTikTokCallbackParams(search: string): {
  token: string | null;
  created: boolean;
  error: string | null;
} {
  const params = new URLSearchParams(search);
  return {
    token: params.get('token'),
    created: params.get('created') === 'true',
    error: params.get('error') || params.get('error_description'),
  };
}
