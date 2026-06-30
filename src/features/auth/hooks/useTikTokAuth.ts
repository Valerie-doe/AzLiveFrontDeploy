import { useCallback, useState } from 'react';
import { ApiError } from '../../../api/client';
import {
  fetchTikTokLoginUrl,
  loadTikTokAccountAfterAuth as fetchTikTokAccountAfterAuth,
} from '../../../api/tiktokAuth.api';
import {
  clearTikTokOAuthState,
  getTikTokOAuthScopesFromSession,
  setTikTokOAuthScopes,
  setTikTokOAuthState,
} from '../services/authStorage';
import { buildPendingTikTokAuth } from '../services/tiktokAuth.service';

export function useTikTokAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTikTokOAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loginData = await fetchTikTokLoginUrl();
      setTikTokOAuthState(loginData.state);
      setTikTokOAuthScopes(loginData.scopes);
      window.location.href = loginData.auth_url;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Impossible de démarrer la connexion TikTok.';
      setError(message);
      setIsLoading(false);
    }
  }, []);

  const loadTikTokAccountAfterAuth = useCallback(async (token: string, created: boolean) => {
    const result = await fetchTikTokAccountAfterAuth(token);
    clearTikTokOAuthState();

    return buildPendingTikTokAuth({
      token: result.token,
      user: result.user,
      vendeur: result.vendeur,
      profile: result.profile,
      oauthScopes: getTikTokOAuthScopesFromSession(),
      created,
      tiktokConnected: result.tiktokConnected,
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    startTikTokOAuth,
    loadTikTokAccountAfterAuth,
    clearError,
  };
}
