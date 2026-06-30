import { useState } from 'react';
import { Order } from '../../../types';
import { ClientProfile } from '../types';
import { playNotificationSound } from '../../../sound';

const ITEMS_PER_PAGE = 10;

const MALE_NAME_HINTS = [
  'jean', 'hery', 'andry', 'mamy', 'eric', 'mr', 'monsieur',
  'michel', 'thierry', 'andrian', 'toky', 'hary', 'solofo',
];

/** Compare deux dates de commande (ISO de préférence, sinon heure brute) pour le tri « plus récent ». */
function isMoreRecent(candidate: Order, current: { lastOrderDateTime?: string; lastOrderDate: string }): boolean {
  const a = candidate.orderDateTime || candidate.orderTime || '';
  const b = current.lastOrderDateTime || current.lastOrderDate || '';
  return a.localeCompare(b) > 0;
}

function buildClientProfiles(orders: Order[]): ClientProfile[] {
  const clientMap = new Map<string, ClientProfile>();

  orders.forEach((o) => {
    // Clé d'identité : on privilégie l'ID Facebook (client Live), puis téléphone / handle / nom.
    const key =
      (o.facebookId && o.facebookId.trim()) ||
      o.customerPhone.trim() ||
      o.customerHandle.trim() ||
      o.customerName.trim();
    if (!key) return;

    if (!clientMap.has(key)) {
      const nameLower = o.customerName.toLowerCase();
      const gender: 'Femme' | 'Homme' = MALE_NAME_HINTS.some((hint) => nameLower.includes(hint))
        ? 'Homme'
        : 'Femme';

      const addressLower = (o.deliveryAddress || '').toLowerCase();
      const isCollecte =
        addressLower.includes('collecte') ||
        addressLower.includes('bureau') ||
        addressLower.includes('sur place') ||
        addressLower.includes('agence') ||
        addressLower.includes('récup') ||
        o.deliveryStatus === 'au bureau';

      clientMap.set(key, {
        name: o.customerName,
        phone: o.customerPhone || 'N/A',
        handle: o.customerHandle || '@anonyme',
        address: o.deliveryAddress || 'Non communiquée',
        facebookId: o.facebookId || undefined,
        totalSpent: 0,
        ordersCount: 0,
        itemsCount: 0,
        lastOrderDate: o.orderTime,
        lastOrderDateTime: o.orderDateTime,
        liveTitles: [],
        ordersList: [],
        gender,
        shippingType: isCollecte ? 'Collecte' : 'Livraison',
      });
    }

    const profile = clientMap.get(key)!;
    profile.ordersCount += 1;
    profile.ordersList.push(o);
    if (o.status !== 'annulé') {
      profile.totalSpent += o.price;
      profile.itemsCount += o.quantity ?? 1;
    }
    if (!profile.facebookId && o.facebookId) profile.facebookId = o.facebookId;
    if (o.liveTitle && !profile.liveTitles.includes(o.liveTitle)) {
      profile.liveTitles.push(o.liveTitle);
    }
    if (isMoreRecent(o, profile)) {
      profile.lastOrderDate = o.orderTime;
      profile.lastOrderDateTime = o.orderDateTime;
    }
  });

  return Array.from(clientMap.values());
}

export function useClients(
  orders: Order[],
  onUpdateClientInOrders?: (
    oldPhone: string,
    newDetails: { name: string; phone: string; handle: string; address: string }
  ) => void
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'femme' | 'homme' | 'best'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    handle: '',
    address: '',
    shippingType: 'Livraison' as 'Livraison' | 'Collecte',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const clientsList = buildClientProfiles(orders);

  const filteredClients = clientsList.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query
      ? true
      : c.name.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        c.handle.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (activeFilter === 'femme') return c.gender === 'Femme';
    if (activeFilter === 'homme') return c.gender === 'Homme';
    if (activeFilter === 'best') return c.ordersCount >= 2 || c.totalSpent >= 80000;
    return true;
  });

  // Metrics
  const totalClients = clientsList.length;
  const activeLoyalClients = clientsList.filter((c) => c.ordersCount >= 2).length;
  const fidelityPercentage = totalClients > 0 ? Math.round((activeLoyalClients / totalClients) * 100) : 0;
  const totalRevenue = clientsList.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalValidOrders = orders.filter((o) => o.status !== 'annulé').length;
  const averageSpentPerOrder = totalValidOrders > 0 ? Math.round(totalRevenue / totalValidOrders) : 0;

  const handleOpenClient = (client: ClientProfile) => {
    setSelectedClient(client);
    setIsEditing(false);
    setEditForm({
      name: client.name,
      phone: client.phone,
      handle: client.handle,
      address: client.address,
      shippingType: client.shippingType || 'Livraison',
    });
    playNotificationSound('click');
  };

  const handleSaveEdit = () => {
    if (!selectedClient) return;
    if (onUpdateClientInOrders) {
      onUpdateClientInOrders(selectedClient.phone, editForm);
    }
    selectedClient.name = editForm.name;
    selectedClient.phone = editForm.phone;
    selectedClient.handle = editForm.handle;
    selectedClient.address = editForm.address;
    selectedClient.shippingType = editForm.shippingType;
    setSuccessMessage('Coordonnées client mises à jour avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
    setIsEditing(false);
    playNotificationSound('confirm');
  };

  return {
    // State
    searchQuery, setSearchQuery,
    currentPage, setCurrentPage,
    activeFilter, setActiveFilter,
    selectedClient, setSelectedClient,
    isEditing, setIsEditing,
    editForm, setEditForm,
    successMessage,
    // Derived data
    clientsList,
    filteredClients,
    // Metrics
    totalClients, activeLoyalClients, fidelityPercentage, averageSpentPerOrder,
    // Handlers
    handleOpenClient,
    handleSaveEdit,
    ITEMS_PER_PAGE,
  };
}
