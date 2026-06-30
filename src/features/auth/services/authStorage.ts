import {
  FacebookAuthSession,
  FacebookPageOption,
  PendingFacebookAuth,
} from '../types/facebookAuth.types';
import {
  PendingTikTokAuth,
  TikTokAuthSession,
  TikTokProfile,
  TikTokTokenInfo,
} from '../types/tiktokAuth.types';
import { formatTikTokAccountLabel } from './tiktokAuth.service';

const LOCAL_KEYS = {
  AUTH_TOKEN: 'azlive_auth_token',
  AUTHENTICATED: 'azlive_authenticated',
  USER: 'azlive_user',
  VENDEUR: 'azlive_vendeur',
  PLATFORM: 'azlive_auth_platform',
  SELECTED_FACEBOOK_PAGE: 'azlive_facebook_selected_page',
  OAUTH_SCOPES: 'azlive_facebook_oauth_scopes',
  FACEBOOK_CONNECTED: 'azlive_facebook_connected',
  TIKTOK_PROFILE: 'azlive_tiktok_profile',
  TIKTOK_TOKENS: 'azlive_tiktok_tokens',
  TIKTOK_OAUTH_SCOPES: 'azlive_tiktok_oauth_scopes',
  TIKTOK_CONNECTED: 'azlive_tiktok_connected',
  TIKTOK_OPEN_ID: 'azlive_tiktok_open_id',
  CONNECTED_PAGES_LIST: 'azlive_connected_pages',
  SESSION_CREATED: 'azlive_session_created',
  DEMO_MODE: 'azlive_demo_mode',
} as const;

const SESSION_KEYS = {
  PENDING_FACEBOOK_AUTH: 'azlive_pending_facebook_auth',
  FACEBOOK_OAUTH_STATE: 'azlive_facebook_oauth_state',
  FACEBOOK_OAUTH_SCOPES: 'azlive_facebook_oauth_scopes',
  PENDING_TIKTOK_AUTH: 'azlive_pending_tiktok_auth',
  TIKTOK_OAUTH_STATE: 'azlive_tiktok_oauth_state',
  TIKTOK_OAUTH_SCOPES: 'azlive_tiktok_oauth_scopes',
} as const;

const FALLBACK_TOKEN = 'f5ced7b1d05bbce2f5d73870049c9e94638d5c0c';

export function getAuthToken(): string {
  return localStorage.getItem(LOCAL_KEYS.AUTH_TOKEN) || FALLBACK_TOKEN;
}

export function hasRealAuthToken(): boolean {
  return Boolean(localStorage.getItem(LOCAL_KEYS.AUTH_TOKEN));
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(LOCAL_KEYS.AUTHENTICATED) === 'true';
}

export function getStoredUser() {
  return readJson(LOCAL_KEYS.USER);
}

export function getStoredVendeur() {
  return readJson(LOCAL_KEYS.VENDEUR);
}

export function getStoredVendeurId(): number | null {
  const vendeur = getStoredVendeur() as { id?: number } | null;
  return vendeur?.id ?? null;
}

export function getConnectedPageNames(): string[] {
  const raw = localStorage.getItem(LOCAL_KEYS.CONNECTED_PAGES_LIST);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function getSelectedFacebookPage(): FacebookPageOption | null {
  return readJson<FacebookPageOption>(LOCAL_KEYS.SELECTED_FACEBOOK_PAGE);
}

export function getOAuthScopes(): string[] {
  const raw = localStorage.getItem(LOCAL_KEYS.OAUTH_SCOPES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function saveFacebookSession(session: FacebookAuthSession): void {
  localStorage.setItem(LOCAL_KEYS.AUTH_TOKEN, session.token);
  localStorage.setItem(LOCAL_KEYS.AUTHENTICATED, 'true');
  localStorage.setItem(LOCAL_KEYS.USER, JSON.stringify(session.user));
  localStorage.setItem(LOCAL_KEYS.VENDEUR, JSON.stringify(session.vendeur));
  localStorage.setItem(LOCAL_KEYS.PLATFORM, session.platform);
  localStorage.setItem(LOCAL_KEYS.SELECTED_FACEBOOK_PAGE, JSON.stringify(session.selectedPage));
  localStorage.setItem(LOCAL_KEYS.OAUTH_SCOPES, JSON.stringify(session.oauthScopes));
  localStorage.setItem(LOCAL_KEYS.FACEBOOK_CONNECTED, String(session.facebookConnected));
  const selectedPageNames = (
    session.selectedPages?.length ? session.selectedPages : [session.selectedPage]
  ).map((page) => page.nom);
  localStorage.setItem(LOCAL_KEYS.CONNECTED_PAGES_LIST, JSON.stringify(selectedPageNames));
  localStorage.setItem(LOCAL_KEYS.SESSION_CREATED, String(session.created));
  localStorage.removeItem(LOCAL_KEYS.DEMO_MODE);
  clearPendingFacebookAuth();
}

export function saveDemoSession(pageNames: string[], platform: 'Facebook' | 'TikTok'): void {
  localStorage.setItem(LOCAL_KEYS.AUTHENTICATED, 'true');
  localStorage.setItem(LOCAL_KEYS.PLATFORM, platform);
  localStorage.setItem(LOCAL_KEYS.CONNECTED_PAGES_LIST, JSON.stringify(pageNames));
  localStorage.setItem(LOCAL_KEYS.DEMO_MODE, 'true');
  localStorage.removeItem(LOCAL_KEYS.AUTH_TOKEN);
  localStorage.removeItem(LOCAL_KEYS.USER);
  localStorage.removeItem(LOCAL_KEYS.VENDEUR);
  localStorage.removeItem(LOCAL_KEYS.SELECTED_FACEBOOK_PAGE);
  localStorage.removeItem(LOCAL_KEYS.OAUTH_SCOPES);
  localStorage.removeItem(LOCAL_KEYS.FACEBOOK_CONNECTED);
  localStorage.removeItem(LOCAL_KEYS.TIKTOK_PROFILE);
  localStorage.removeItem(LOCAL_KEYS.TIKTOK_TOKENS);
  localStorage.removeItem(LOCAL_KEYS.TIKTOK_OAUTH_SCOPES);
  localStorage.removeItem(LOCAL_KEYS.TIKTOK_CONNECTED);
  localStorage.removeItem(LOCAL_KEYS.TIKTOK_OPEN_ID);
}

export function isDemoSession(): boolean {
  return localStorage.getItem(LOCAL_KEYS.DEMO_MODE) === 'true';
}

export function getStoredTikTokProfile(): TikTokProfile | null {
  return readJson<TikTokProfile>(LOCAL_KEYS.TIKTOK_PROFILE);
}

export function getStoredTikTokTokens(): TikTokTokenInfo | null {
  return readJson<TikTokTokenInfo>(LOCAL_KEYS.TIKTOK_TOKENS);
}

export function getTikTokOAuthScopes(): string[] {
  const raw = localStorage.getItem(LOCAL_KEYS.TIKTOK_OAUTH_SCOPES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function saveTikTokSession(session: TikTokAuthSession): void {
  localStorage.setItem(LOCAL_KEYS.AUTH_TOKEN, session.token);
  localStorage.setItem(LOCAL_KEYS.AUTHENTICATED, 'true');
  localStorage.setItem(LOCAL_KEYS.USER, JSON.stringify(session.user));
  localStorage.setItem(LOCAL_KEYS.VENDEUR, JSON.stringify(session.vendeur));
  localStorage.setItem(LOCAL_KEYS.PLATFORM, session.platform);
  localStorage.setItem(LOCAL_KEYS.TIKTOK_PROFILE, JSON.stringify(session.profile));
  localStorage.setItem(LOCAL_KEYS.TIKTOK_TOKENS, JSON.stringify(session.tokens));
  localStorage.setItem(LOCAL_KEYS.TIKTOK_OAUTH_SCOPES, JSON.stringify(session.oauthScopes));
  localStorage.setItem(LOCAL_KEYS.TIKTOK_CONNECTED, String(session.tiktokConnected));
  if (session.profile.openId) {
    localStorage.setItem(LOCAL_KEYS.TIKTOK_OPEN_ID, session.profile.openId);
  } else {
    localStorage.removeItem(LOCAL_KEYS.TIKTOK_OPEN_ID);
  }
  localStorage.setItem(
    LOCAL_KEYS.CONNECTED_PAGES_LIST,
    JSON.stringify([formatTikTokAccountLabel(session.profile)]),
  );
  localStorage.setItem(LOCAL_KEYS.SESSION_CREATED, String(session.created));
  localStorage.removeItem(LOCAL_KEYS.DEMO_MODE);
  clearPendingTikTokAuth();
}

export function savePendingFacebookAuth(pending: PendingFacebookAuth): void {
  sessionStorage.setItem(SESSION_KEYS.PENDING_FACEBOOK_AUTH, JSON.stringify(pending));
}

export function getPendingFacebookAuth(): PendingFacebookAuth | null {
  return readSessionJson<PendingFacebookAuth>(SESSION_KEYS.PENDING_FACEBOOK_AUTH);
}

export function clearPendingFacebookAuth(): void {
  sessionStorage.removeItem(SESSION_KEYS.PENDING_FACEBOOK_AUTH);
}

export function setFacebookOAuthState(state: string): void {
  sessionStorage.setItem(SESSION_KEYS.FACEBOOK_OAUTH_STATE, state);
}

export function getFacebookOAuthState(): string | null {
  return sessionStorage.getItem(SESSION_KEYS.FACEBOOK_OAUTH_STATE);
}

export function clearFacebookOAuthState(): void {
  sessionStorage.removeItem(SESSION_KEYS.FACEBOOK_OAUTH_STATE);
}

export function setFacebookOAuthScopes(scopes: string[]): void {
  sessionStorage.setItem(SESSION_KEYS.FACEBOOK_OAUTH_SCOPES, JSON.stringify(scopes));
}

export function getFacebookOAuthScopesFromSession(): string[] {
  const raw = sessionStorage.getItem(SESSION_KEYS.FACEBOOK_OAUTH_SCOPES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function clearFacebookOAuthScopes(): void {
  sessionStorage.removeItem(SESSION_KEYS.FACEBOOK_OAUTH_SCOPES);
}

export function savePendingTikTokAuth(pending: PendingTikTokAuth): void {
  sessionStorage.setItem(SESSION_KEYS.PENDING_TIKTOK_AUTH, JSON.stringify(pending));
}

export function getPendingTikTokAuth(): PendingTikTokAuth | null {
  return readSessionJson<PendingTikTokAuth>(SESSION_KEYS.PENDING_TIKTOK_AUTH);
}

export function clearPendingTikTokAuth(): void {
  sessionStorage.removeItem(SESSION_KEYS.PENDING_TIKTOK_AUTH);
}

export function setTikTokOAuthState(state: string): void {
  sessionStorage.setItem(SESSION_KEYS.TIKTOK_OAUTH_STATE, state);
}

export function getTikTokOAuthState(): string | null {
  return sessionStorage.getItem(SESSION_KEYS.TIKTOK_OAUTH_STATE);
}

export function clearTikTokOAuthState(): void {
  sessionStorage.removeItem(SESSION_KEYS.TIKTOK_OAUTH_STATE);
}

export function setTikTokOAuthScopes(scopes: string[]): void {
  sessionStorage.setItem(SESSION_KEYS.TIKTOK_OAUTH_SCOPES, JSON.stringify(scopes));
}

export function getTikTokOAuthScopesFromSession(): string[] {
  const raw = sessionStorage.getItem(SESSION_KEYS.TIKTOK_OAUTH_SCOPES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function clearTikTokOAuthScopes(): void {
  sessionStorage.removeItem(SESSION_KEYS.TIKTOK_OAUTH_SCOPES);
}

export function clearSession(): void {
  Object.values(LOCAL_KEYS).forEach((key) => localStorage.removeItem(key));
  Object.values(SESSION_KEYS).forEach((key) => sessionStorage.removeItem(key));
}

function readJson<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readSessionJson<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
