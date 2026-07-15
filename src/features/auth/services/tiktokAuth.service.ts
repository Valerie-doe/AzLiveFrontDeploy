import { AuthMeResponse } from '../types/facebookAuth.types';
import {
  PendingTikTokAuth,
  TikTokAuthSession,
  TikTokProfile,
  TikTokTokenInfo,
} from '../types/tiktokAuth.types';

export function buildTikTokProfileFromAuthMe(authMe: AuthMeResponse): TikTokProfile {
  const vendeur = authMe.vendeur;
  // Ne jamais retomber sur authMe.user.username (souvent tt_<open_id>) :
  // ce n'est pas un @TikTok utilisable pour TikTools.
  const username = vendeur?.tiktok_username || '';

  return {
    openId: null,
    displayName: vendeur?.nom || authMe.user.username,
    username,
    avatarUrl: null,
    unionId: null,
  };
}

/** True si value est un unique_id TikTok (ex. azplus.mg), pas un display name. */
export function isValidTikTokUniqueId(value: string | null | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().replace(/^@+/, '').toLowerCase();
  return /^[a-z0-9._-]+$/.test(normalized);
}

export function buildPendingTikTokAuth(params: {
  token: string;
  user: PendingTikTokAuth['user'];
  vendeur: PendingTikTokAuth['vendeur'];
  profile: TikTokProfile;
  oauthScopes: string[];
  created: boolean;
  tiktokConnected: boolean;
}): PendingTikTokAuth {
  return { ...params };
}

export function buildTikTokTokenInfo(azliveToken: string): TikTokTokenInfo {
  return {
    azliveToken,
    tiktokAccessToken: null,
    tiktokRefreshToken: null,
    expiresAt: null,
  };
}

export function buildTikTokSession(pending: PendingTikTokAuth): TikTokAuthSession {
  return {
    token: pending.token,
    user: pending.user,
    vendeur: pending.vendeur,
    platform: 'TikTok',
    profile: pending.profile,
    tokens: buildTikTokTokenInfo(pending.token),
    oauthScopes: pending.oauthScopes,
    tiktokConnected: pending.tiktokConnected,
    created: pending.created,
  };
}

export function parseTikTokErrorMessage(error: string): string {
  const normalized = decodeURIComponent(error).toLowerCase();

  if (normalized.includes('access_denied') || normalized.includes('refus')) {
    return 'Autorisation TikTok refusée. Veuillez réessayer et accepter les permissions.';
  }
  if (normalized.includes('invalid') && normalized.includes('token')) {
    return 'Token TikTok invalide ou expiré. Veuillez vous reconnecter.';
  }

  return decodeURIComponent(error);
}

export function isTikTokSessionExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
}

export function formatTikTokAccountLabel(profile: TikTokProfile): string {
  const handle = profile.username.startsWith('@') ? profile.username : `@${profile.username}`;
  return profile.displayName && profile.displayName !== profile.username
    ? `${profile.displayName} (${handle})`
    : handle;
}
