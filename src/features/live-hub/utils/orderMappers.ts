import { DeliveryStatus, Order, OrderStatus } from '../../../types';
import {
  CommandeApiResponse,
  CommandeProduitApi,
  CommandeVarianteApi,
} from '../../../api/commandes.api';

const STATUT_TO_ORDER: Record<string, OrderStatus> = {
  jp_capture: 'JP capturé',
  confirme: 'confirmé',
  prepare: 'préparé',
  en_livraison: 'en livraison',
  livre: 'livré',
  annule: 'annulé',
};

const LIVRAISON_TO_DELIVERY: Record<string, DeliveryStatus> = {
  au_bureau: 'au bureau',
  en_preparation: 'en préparation',
  assigne_livreur: 'assigné livreur',
  en_livraison: 'en livraison',
  livre: 'livré',
};

function resolveVariante(
  produit: CommandeProduitApi,
  variante: CommandeVarianteApi | null,
): CommandeVarianteApi | undefined {
  if (variante) return variante;
  return produit.variantes?.[0];
}

function formatOrderTime(dateCreation: string): string {
  const parsed = new Date(dateCreation);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toTimeString().split(' ')[0];
}

function resolveHandle(client: CommandeApiResponse['client']): string {
  if (client.social_handle) return client.social_handle;
  return `@${(client.nom || 'client').toLowerCase().replace(/\s+/g, '_')}`;
}

export function mapOrderFromApi(api: CommandeApiResponse): Order {
  const variante = resolveVariante(api.produit, api.variante);
  const status = STATUT_TO_ORDER[api.statut] ?? 'JP capturé';
  const isMobileMoney = api.paiement?.methode === 'mobile_money';

  return {
    id: String(api.id),
    jpCode: variante?.code_jp || '',
    customerName: api.client.nom,
    customerPhone: api.client.telephone || '',
    customerHandle: resolveHandle(api.client),
    facebookId: api.client.facebook_id || undefined,
    orderDateTime: api.date_creation,
    quantity: 1,
    productId: String(api.produit.id),
    productName: api.produit.nom,
    productImage: api.produit.photo || undefined,
    price: variante ? Number(variante.prix_unitaire) || 0 : 0,
    currency: 'Ar',
    orderTime: formatOrderTime(api.date_creation),
    status,
    isPriority: api.ordre_jp === 1,
    chatStatus: 'En attente',
    chatMessage: '',
    remindersCount: 0,
    deliveryStatus: api.livraison ? LIVRAISON_TO_DELIVERY[api.livraison.statut] ?? 'au bureau' : 'au bureau',
    deliveryAddress: api.client.adresse || '',
    prefDeliveryDate: api.client.date_livraison_preferee || '',
    sentToDelivery: status === 'en livraison' || status === 'livré',
    paymentType: isMobileMoney ? 'Mobile Money' : 'À la livraison',
    isPaid: api.paiement?.statut === 'paye',
    mobileMoneyScreenshot: api.paiement?.capture_mobile_money || undefined,
    liveSessionId: api.live ? String(api.live.id) : undefined,
    liveTitle: api.live?.titre || undefined,
  };
}
