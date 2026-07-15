import { apiRequest, fetchPaginated, getJsonHeaders } from './client';
import { LiveApiResponse, LiveWritePayload } from '../features/live-hub/types/liveApi.types';

export async function fetchLives(
  vendeurId?: string | number | null,
  opts?: { sync?: boolean },
): Promise<LiveApiResponse[]> {
  const params = new URLSearchParams();
  if (vendeurId != null && vendeurId !== '') {
    params.set('vendeur_id', String(vendeurId));
  }
  // Sync TikTools uniquement sur demande explicite (F5 / refresh hub), pas en poll.
  if (opts?.sync) {
    params.set('sync', '1');
  }
  const query = params.toString() ? `?${params.toString()}` : '';
  return fetchPaginated<LiveApiResponse>(`lives/${query}`);
}

export async function fetchLiveById(id: string | number): Promise<LiveApiResponse> {
  return apiRequest<LiveApiResponse>(`lives/${id}/`, {
    method: 'GET',
    headers: getJsonHeaders(),
  });
}

export async function createLive(payload: LiveWritePayload): Promise<LiveApiResponse> {
  return apiRequest<LiveApiResponse>('lives/', {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function updateLive(id: string | number, payload: LiveWritePayload): Promise<LiveApiResponse> {
  return apiRequest<LiveApiResponse>(`lives/${id}/`, {
    method: 'PATCH',
    headers: getJsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function demarrerLive(id: string | number): Promise<LiveApiResponse> {
  const response = await apiRequest<{ live: LiveApiResponse }>(`lives/${id}/demarrer/`, {
    method: 'POST',
    headers: getJsonHeaders(),
  });
  return response.live;
}

export async function arreterLive(id: string | number): Promise<LiveApiResponse> {
  const response = await apiRequest<{ live: LiveApiResponse }>(`lives/${id}/arreter/`, {
    method: 'POST',
    headers: getJsonHeaders(),
  });
  return response.live;
}
