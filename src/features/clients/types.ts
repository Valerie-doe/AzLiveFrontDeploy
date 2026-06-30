import { Order } from '../types';

export interface ClientProfile {
  name: string;
  phone: string;
  handle: string;
  address: string;
  /** Identifiant Facebook (PSID/ASID) du client, si capturé depuis un commentaire Live. */
  facebookId?: string;
  totalSpent: number;
  ordersCount: number;
  /** Nombre total d'articles commandés (somme des quantités, hors annulations). */
  itemsCount: number;
  lastOrderDate: string;
  /** Date/heure ISO de la dernière commande, pour un tri/affichage fiable. */
  lastOrderDateTime?: string;
  /** Titres des lives distincts auxquels le client a participé (affichage multi-lives). */
  liveTitles: string[];
  ordersList: Order[];
  gender: 'Femme' | 'Homme';
  shippingType: 'Livraison' | 'Collecte';
}
