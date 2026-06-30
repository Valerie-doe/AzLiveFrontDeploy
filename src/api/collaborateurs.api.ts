import { apiRequest, fetchPaginated, getJsonHeaders } from './client';
import { CollaborateurApiResponse } from '../features/live-hub/types/liveApi.types';

export async function fetchCollaborateurs(): Promise<CollaborateurApiResponse[]> {
  return fetchPaginated<CollaborateurApiResponse>('collaborateurs/');
}

export async function createCollaborateur(payload: {
  nom: string;
  telephone?: string;
  role?: string;
  vendeur: number;
}): Promise<CollaborateurApiResponse> {
  return apiRequest<CollaborateurApiResponse>('collaborateurs/', {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function deleteCollaborateur(id: string | number): Promise<void> {
  await apiRequest<void>(`collaborateurs/${id}/`, {
    method: 'DELETE',
    headers: getJsonHeaders(),
  });
}
