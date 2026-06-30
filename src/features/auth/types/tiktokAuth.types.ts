import { AzLiveUser, AzLiveVendeur } from './facebookAuth.types';

export interface TikTokProfile {
  openId: string | null;
  displayName: string;
  username: string;
  avatarUrl?: string | null;
  unionId?: string | null;
}

export interface TikTokTokenInfo {
  azliveToken: string;
  tiktokAccessToken: string | null;
  tiktokRefreshToken: string | null;
  expiresAt: string | null;
}

export interface TikTokLoginUrlResponse {
  auth_url: string;
  state: string;
  redirect_uri: string;
  scopes: string[];
}

export interface PendingTikTokAuth {
  token: string;
  user: AzLiveUser;
  vendeur: AzLiveVendeur;
  profile: TikTokProfile;
  oauthScopes: string[];
  created: boolean;
  tiktokConnected: boolean;
}

export interface TikTokAuthSession {
  token: string;
  user: AzLiveUser;
  vendeur: AzLiveVendeur;
  platform: 'TikTok';
  profile: TikTokProfile;
  tokens: TikTokTokenInfo;
  oauthScopes: string[];
  tiktokConnected: boolean;
  created: boolean;
}
