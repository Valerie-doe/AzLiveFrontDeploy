export interface ProductVariant {
  id: string; // unique variation id
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  jpCode: string; // e.g. "JP1", "JP2"
  size: string;
  color: string;
  price: number;
  currency: string; // Defaulting to "Ar" (Ariary)
  stock: number;
  image?: string;
  variants?: ProductVariant[];
}

export type OrderStatus = 'JP capturé' | 'confirmé' | 'préparé' | 'en livraison' | 'livré' | 'annulé';
export type ChatStatus = 'En attente' | 'Confirmé' | 'Relancé x1' | 'Relancé x2' | 'Relancé x3' | 'Pas de réponse';
export type DeliveryStatus = 'au bureau' | 'en préparation' | 'assigné livreur' | 'en livraison' | 'livré';

export interface Order {
  id: string;
  jpCode: string; // e.g. "JP1"
  customerName: string;
  customerPhone: string;
  customerHandle: string; // Facebook Live / TikTok handle e.g. "@mialy_r"
  productId: string;
  productName: string;
  price: number;
  currency: string;
  orderTime: string; // hh:mm:ss
  status: OrderStatus;
  isPriority: boolean;
  chatStatus: ChatStatus;
  chatMessage: string;
  remindersCount: number; // Max 3 reminders (automatic follow-ups)
  deliveryStatus: DeliveryStatus;
  deliveryAddress: string;
  prefDeliveryDate: string; // Date préférée de livraison
  sentToDelivery: boolean;
  paymentType: 'À la livraison' | 'Mobile Money';
  isPaid: boolean;
  mobileMoneyScreenshot?: string; // Captured payment screenshot placeholder
  commentSnippet?: string; // Exact captured social media comment, e.g. "JP1 rouge XL je prends!"
  liveSessionId?: string; // Associated live session ID
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

export interface LiveSession {
  id: string;
  title: string;
  date: string;
  status: 'Créé' | 'En cours' | 'Terminé';
  connectedPages?: string[];
  selectedProductIds?: string[];
  assignedCollaborator?: string; // Name of collaborator
  totalOrders: number;
  revenue: number;
  orders: Order[];
}

