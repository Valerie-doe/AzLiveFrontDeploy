import { getAuthToken } from '../features/auth/services/authStorage';

const API_URL = import.meta.env.VITE_URL_BACKEND || '';

export const DEFAULT_VENDEUR_ID = Number(import.meta.env.VITE_VENDEUR_ID || 1);

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export function getJsonHeaders(token?: string): Record<string, string> {
  const authToken = token ?? getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Token ${authToken}` } : {}),
  };
}

export function getAuthHeaders(token?: string): Record<string, string> {
  const authToken = token ?? getAuthToken();
  return authToken ? { Authorization: `Token ${authToken}` } : {};
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path.replace(/^\//, '')}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    const detail =
      payload && typeof payload === 'object' && 'detail' in payload
        ? String((payload as { detail: unknown }).detail)
        : `Erreur API (${response.status})`;
    throw new ApiError(detail, response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function fetchPaginated<T>(path: string): Promise<T[]> {
  const response = await apiRequest<PaginatedResponse<T> | T[]>(path, {
    method: 'GET',
    headers: getJsonHeaders(),
  });
  return Array.isArray(response) ? response : response.results ?? [];
}
