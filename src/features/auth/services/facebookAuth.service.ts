import {
  FacebookAuthSession,
  FacebookPageApiResponse,
  FacebookPageOption,
  PendingFacebookAuth,
} from '../types/facebookAuth.types';

export function mapFacebookPageFromApi(page: FacebookPageApiResponse): FacebookPageOption {
  return {
    id: page.id,
    pageId: page.page_id,
    nom: page.nom,
    statut: page.statut,
    pageAccessToken: page.access_token ?? null,
    webhookSubscribed: page.webhook_subscribed,
  };
}

export function buildPendingFacebookAuth(params: {
  token: string;
  user: PendingFacebookAuth['user'];
  vendeur: PendingFacebookAuth['vendeur'];
  pages: FacebookPageOption[];
  oauthScopes: string[];
  created: boolean;
  facebookConnected: boolean;
}): PendingFacebookAuth {
  return {
    token: params.token,
    user: params.user,
    vendeur: params.vendeur,
    pages: params.pages,
    oauthScopes: params.oauthScopes,
    created: params.created,
    facebookConnected: params.facebookConnected,
  };
}

export function buildFacebookSession(
  pending: PendingFacebookAuth,
  selectedPages: FacebookPageOption[],
): FacebookAuthSession {
  // La première page cochée sert de page principale (identité vendeur),
  // tout en conservant l'ensemble des pages sélectionnées.
  const primaryPage = selectedPages[0];
  return {
    token: pending.token,
    user: pending.user,
    vendeur: {
      ...pending.vendeur,
      facebook_page_id: primaryPage.pageId,
      facebook_page_name: primaryPage.nom,
    },
    platform: 'Facebook',
    selectedPage: primaryPage,
    selectedPages,
    oauthScopes: pending.oauthScopes,
    facebookConnected: pending.facebookConnected,
    created: pending.created,
  };
}

export function resolvePageAccessToken(
  page: FacebookPageOption,
  vendeurPages?: FacebookPageOption[],
): string | null {
  if (page.pageAccessToken) return page.pageAccessToken;

  const match = vendeurPages?.find(
    (p) => p.pageId === page.pageId || p.id === page.id,
  );
  return match?.pageAccessToken ?? null;
}

export function parseFacebookErrorMessage(error: string): string {
  const normalized = decodeURIComponent(error).toLowerCase();

  if (normalized.includes('access_denied') || normalized.includes('refus')) {
    return 'Autorisation Facebook refusée. Veuillez réessayer et accepter les permissions.';
  }
  if (normalized.includes('invalid') && normalized.includes('token')) {
    return 'Token Facebook invalide ou expiré. Veuillez vous reconnecter.';
  }

  return decodeURIComponent(error);
}
