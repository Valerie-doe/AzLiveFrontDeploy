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

export interface CaptureJpStatus {
  live_id: number;
  capture_active: boolean;
  unique_id: string;
  manual_capture: boolean;
  ws_mode: string;
  queued: boolean;
  queue_position: number | null;
  pool: { active: number; max: number; pending: number };
  ws_rate_limited: boolean;
  ws_rate_limit_remaining_seconds: number;
  tiktool_configured: boolean;
}

export interface CaptureJpActionResult {
  ok: boolean;
  detail: string;
  stopped?: boolean;
  status: CaptureJpStatus;
}

export async function fetchCaptureJpStatus(id: string | number): Promise<CaptureJpStatus> {
  return apiRequest<CaptureJpStatus>(`lives/${id}/capture-jp/`, {
    method: 'GET',
    headers: getJsonHeaders(),
  });
}

export async function startCaptureJp(id: string | number): Promise<CaptureJpActionResult> {
  return apiRequest<CaptureJpActionResult>(`lives/${id}/capture-jp/start/`, {
    method: 'POST',
    headers: getJsonHeaders(),
  });
}

export async function stopCaptureJp(id: string | number): Promise<CaptureJpActionResult> {
  return apiRequest<CaptureJpActionResult>(`lives/${id}/capture-jp/stop/`, {
    method: 'POST',
    headers: getJsonHeaders(),
  });
}
