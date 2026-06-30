import { useCallback, useState } from 'react';
import { ApiError } from '../../../api/client';
import { fetchFacebookLoginUrl, loadFacebookPagesForUser } from '../../../api/facebookAuth.api';
import {
  clearFacebookOAuthState,
  getFacebookOAuthScopesFromSession,
  setFacebookOAuthScopes,
  setFacebookOAuthState,
} from '../services/authStorage';
import { buildPendingFacebookAuth } from '../services/facebookAuth.service';

export function useFacebookAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startFacebookOAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loginData = await fetchFacebookLoginUrl();
      setFacebookOAuthState(loginData.state);
      setFacebookOAuthScopes(loginData.scopes);
      window.location.href = loginData.auth_url;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Impossible de démarrer la connexion Facebook.';
      setError(message);
      setIsLoading(false);
    }
  }, []);

  const loadFacebookPagesAfterAuth = useCallback(async (token: string) => {
    const result = await loadFacebookPagesForUser(token);
    clearFacebookOAuthState();

    const pending = buildPendingFacebookAuth({
      token: result.token,
      user: result.user,
      vendeur: result.vendeur,
      pages: result.pages,
      oauthScopes: getFacebookOAuthScopesFromSession(),
      created: false,
      facebookConnected: result.facebookConnected,
    });

    return pending;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    startFacebookOAuth,
    loadFacebookPagesAfterAuth,
    clearError,
  };
}
