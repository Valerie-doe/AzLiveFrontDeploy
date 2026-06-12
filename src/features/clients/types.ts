import { Order } from '../types';

export interface ClientProfile {
  name: string;
  phone: string;
  handle: string;
  address: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  ordersList: Order[];
  gender: 'Femme' | 'Homme';
  shippingType: 'Livraison' | 'Collecte';
}
