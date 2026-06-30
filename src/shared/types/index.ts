export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
  prixUnitaire: number;
  jpCode: string;
}

export interface ProductImage {
  id: string;
  url: string;
  createdAt?: string;
}

export interface ProductVendeur {
  id: number;
  nom: string;
  facebookPageName?: string;
}

export interface Product {
  id: string;
  name: string;
  image?: string;
  images?: ProductImage[];
  vendeur_id?: number;
  vendeur?: ProductVendeur;
  variants: ProductVariant[];
}

export type OrderStatus = 'JP capturé' | 'confirmé' | 'préparé' | 'en livraison' | 'livré' | 'annulé';
export type ChatStatus = 'En attente' | 'Confirmé' | 'Relancé x1' | 'Relancé x2' | 'Relancé x3' | 'Pas de réponse';
export type DeliveryStatus = 'au bureau' | 'en préparation' | 'assigné livreur' | 'en livraison' | 'livré';

export interface Order {
  id: string;
  jpCode: string;
  customerName: string;
  customerPhone: string;
  customerHandle: string;
  productId: string;
  productName: string;
  price: number;
  currency: string;
  orderTime: string;
  status: OrderStatus;
  isPriority: boolean;
  chatStatus: ChatStatus;
  chatMessage: string;
  remindersCount: number;
  deliveryStatus: DeliveryStatus;
  deliveryAddress: string;
  prefDeliveryDate: string;
  sentToDelivery: boolean;
  paymentType: 'À la livraison' | 'Mobile Money';
  isPaid: boolean;
  mobileMoneyScreenshot?: string;
  commentSnippet?: string;
  liveSessionId?: string;
  /** Titre du live associé à la commande (pour l'affichage multi-lives côté Clients). */
  liveTitle?: string;
  /** Identifiant Facebook (PSID/ASID) du client, si capturé depuis un commentaire Live. */
  facebookId?: string;
  /** Date/heure complète de création de la commande (ISO), pour tri et affichage détaillé. */
  orderDateTime?: string;
  /** Quantité calculée pour la commande (1 par défaut, le backend gère une unité par commande). */
  quantity?: number;
  /** Photo du produit commandé (URL), pour l'affichage dans les tableaux de commandes. */
  productImage?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: 'Commercial' | 'Modérateur' | 'Secrétaire' | 'Superviseur';
  avatar: string;
  phone: string;
  connectedPages: string[];
  stats: {
    claimsInputs: number;
    validatedPayments: number;
    ticketsPrinted: number;
  };
  isActive: boolean;
}

/**
 * Pont de diffusion WebRTC (WHIP) renvoyé par le backend au démarrage d'un live.
 * Sert à publier la webcam du navigateur vers MediaMTX, qui relaie vers Facebook.
 */
export interface LiveBroadcastBridge {
  status: string;
  path?: string;
  whipUrl?: string;
  publishToken?: string;
}

export interface LiveSession {
  id: string;
  title: string;
  date: string;
  status: 'Créé' | 'En cours' | 'Terminé';
  connectedPages?: string[];
  selectedProductIds?: string[];
  assignedCollaborator?: string;
  operateurId?: number | null;
  vendeurId?: number;
  totalOrders: number;
  revenue: number;
  orders: Order[];
  broadcast?: LiveBroadcastBridge | null;
}
