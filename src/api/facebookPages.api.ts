import { apiRequest, getJsonHeaders, DEFAULT_VENDEUR_ID } from './client';
import { FacebookPageApiResponse } from '../features/live-hub/types/liveApi.types';

export async function fetchFacebookPages(
  vendeurId: number = DEFAULT_VENDEUR_ID,
): Promise<FacebookPageApiResponse[]> {
  const response = await apiRequest<FacebookPageApiResponse[] | { results: FacebookPageApiResponse[] }>(
    `vendeurs/facebook-pages/?vendeur_id=${vendeurId}`,
    { method: 'GET', headers: getJsonHeaders() },
  );
  return Array.isArray(response) ? response : response.results ?? [];
}
