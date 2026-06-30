import { apiRequest, getJsonHeaders } from './client';
import { fetchAuthMe } from './auth.api';
import {
  AuthMeResponse,
  FacebookLoginUrlResponse,
  FacebookPageApiResponse,
} from '../features/auth/types/facebookAuth.types';
import { mapFacebookPageFromApi } from '../features/auth/services/facebookAuth.service';

export { fetchAuthMe };

export async function fetchFacebookLoginUrl(): Promise<FacebookLoginUrlResponse> {
  return apiRequest<FacebookLoginUrlResponse>('auth/facebook/login/', {
    method: 'GET',
    headers: getJsonHeaders(''),
  });
}

export async function syncFacebookPages(token: string): Promise<{ pages_synced: number }> {
  return apiRequest<{ pages_synced: number }>('auth/facebook/sync-pages/', {
    method: 'POST',
    headers: getJsonHeaders(token),
  });
}

export async function fetchFacebookPages(vendeurId: number, token?: string): Promise<FacebookPageApiResponse[]> {
  const response = await apiRequest<FacebookPageApiResponse[] | { results: FacebookPageApiResponse[] }>(
    `vendeurs/facebook-pages/?vendeur_id=${vendeurId}`,
    {
      method: 'GET',
      headers: getJsonHeaders(token),
    },
  );
  return Array.isArray(response) ? response : response.results ?? [];
}

export async function loadFacebookPagesForUser(token: string) {
  await syncFacebookPages(token).catch(() => undefined);

  const authMe = await fetchAuthMe(token);
  if (!authMe.vendeur) {
    throw new Error('Aucun profil vendeur associé à ce compte Facebook.');
  }

  const pagesApi = await fetchFacebookPages(authMe.vendeur.id, token);
  const pages = pagesApi.map(mapFacebookPageFromApi);

  if (pages.length === 0 && authMe.vendeur.facebook_page_name) {
    pages.push({
      id: 0,
      pageId: authMe.vendeur.facebook_page_id || 'primary',
      nom: authMe.vendeur.facebook_page_name,
      statut: 'pret',
      pageAccessToken: null,
    });
  }

  return {
    token,
    user: authMe.user,
    vendeur: authMe.vendeur,
    pages,
    facebookConnected: authMe.facebook_connected,
  };
}

export function parseFacebookCallbackParams(search: string): {
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
