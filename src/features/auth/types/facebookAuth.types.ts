export interface FacebookPageOption {
  id: number;
  pageId: string;
  nom: string;
  statut: string;
  pageAccessToken?: string | null;
  webhookSubscribed?: boolean;
}

export interface AzLiveUser {
  id: number;
  username: string;
  email: string;
}

export interface AzLiveVendeur {
  id: number;
  nom: string;
  contact?: string;
  facebook_page_id?: string | null;
  facebook_page_name?: string | null;
  is_demo_mode?: boolean;
  pages_facebook?: FacebookPageOption[];
}

export interface FacebookLoginUrlResponse {
  auth_url: string;
  state: string;
  redirect_uri: string;
  scopes: string[];
}

export interface FacebookAuthPayload {
  token: string;
  created: boolean;
  user: AzLiveUser;
  vendeur: AzLiveVendeur;
}

export interface AuthMeResponse {
  user: AzLiveUser;
  vendeur: AzLiveVendeur | null;
  facebook_connected: boolean;
  tiktok_connected: boolean;
}

export interface FacebookPageApiResponse {
  id: number;
  page_id: string;
  nom: string;
  statut: string;
  webhook_subscribed?: boolean;
  access_token?: string;
}

export interface PendingFacebookAuth {
  token: string;
  user: AzLiveUser;
  vendeur: AzLiveVendeur;
  pages: FacebookPageOption[];
  oauthScopes: string[];
  created: boolean;
  facebookConnected: boolean;
}

export interface FacebookAuthSession {
  token: string;
  user: AzLiveUser;
  vendeur: AzLiveVendeur;
  platform: 'Facebook';
  /** Page principale (rétro-compat : `facebook_page_id`/`name` du vendeur). */
  selectedPage: FacebookPageOption;
  /** Toutes les pages cochées par l'utilisateur lors de l'authentification. */
  selectedPages: FacebookPageOption[];
  oauthScopes: string[];
  facebookConnected: boolean;
  created: boolean;
}
