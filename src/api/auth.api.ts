import { apiRequest, getJsonHeaders } from './client';
import { AuthMeResponse } from '../features/auth/types/facebookAuth.types';

export async function fetchAuthMe(token: string): Promise<AuthMeResponse> {
  return apiRequest<AuthMeResponse>('auth/me/', {
    method: 'GET',
    headers: getJsonHeaders(token),
  });
}
