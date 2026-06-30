import { Product, Order, LiveSession, Collaborator } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Robe Fleurie d\'Eté',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    vendeur: { id: 1, nom: 'AZLive Fashion', facebookPageName: 'AZLive Fashion' },
    images: [
      { id: 'p1_img1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      { id: 'p1_img2', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ],
    variants: [
      { id: 'v1_1', size: 'M', color: 'Rouge Corail', stock: 5, prixUnitaire: 45000, jpCode: 'JP1' },
      { id: 'v1_2', size: 'M', color: 'Bleu Ciel', stock: 4, prixUnitaire: 45000, jpCode: 'JP1V2' },
      { id: 'v1_3', size: 'L', color: 'Rouge Corail', stock: 4, prixUnitaire: 45000, jpCode: 'JP1V3' },
      { id: 'v1_4', size: 'L', color: 'Bleu Ciel', stock: 2, prixUnitaire: 45000, jpCode: 'JP1V4' }
    ]
  },
  {
    id: 'p2',
    name: 'Sac artisanal en Raphia',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    vendeur: { id: 1, nom: 'Boutique Chic Madagascar', facebookPageName: 'Boutique Chic Madagascar' },
    images: [
      { id: 'p2_img1', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ],
    variants: [
      { id: 'v2_1', size: 'Unique', color: 'Naturel beige', stock: 5, prixUnitaire: 35000, jpCode: 'JP2' },
      { id: 'v2_2', size: 'Unique', color: 'Café', stock: 3, prixUnitaire: 35000, jpCode: 'JP2V2' }
    ]
  },
  {
    id: 'p3',
    name: 'Bracelet d\'Ambre de Madagascar',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    vendeur: { id: 1, nom: 'Tana Dressing Hub', facebookPageName: 'Tana Dressing Hub' },
    images: [
      { id: 'p3_img1', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ],
    variants: [
      { id: 'v3_1', size: 'Ajustable', color: 'Miel Doré', stock: 12, prixUnitaire: 60000, jpCode: 'JP3' },
      { id: 'v3_2', size: 'Ajustable', color: 'Cognac', stock: 8, prixUnitaire: 60000, jpCode: 'JP3V2' }
    ]
  },
  {
    id: 'p4',
    name: 'Ensemble Lin Léger',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    vendeur: { id: 1, nom: 'AZLive Fashion', facebookPageName: 'AZLive Fashion' },
    images: [
      { id: 'p4_img1', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ],
    variants: [
      { id: 'v4_1', size: 'L', color: 'Bleu Marine', stock: 2, prixUnitaire: 75000, jpCode: 'JP4' },
      { id: 'v4_2', size: 'L', color: 'Blanc Sable', stock: 1, prixUnitaire: 75000, jpCode: 'JP4V2' },
      { id: 'v4_3', size: 'XL', color: 'Bleu Marine', stock: 2, prixUnitaire: 75000, jpCode: 'JP4V3' }
    ]
  },
  {
    id: 'p5',
    name: 'Sandales en Cuir d\'Antsirabe',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    vendeur: { id: 1, nom: 'Boutique Chic Madagascar', facebookPageName: 'Boutique Chic Madagascar' },
    images: [
      { id: 'p5_img1', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ],
    variants: [
      { id: 'v5_1', size: '37', color: 'Brun Tan', stock: 3, prixUnitaire: 40000, jpCode: 'JP5' },
      { id: 'v5_2', size: '38', color: 'Brun Tan', stock: 5, prixUnitaire: 40000, jpCode: 'JP5V2' },
      { id: 'v5_3', size: '38', color: 'Noir', stock: 2, prixUnitaire: 40000, jpCode: 'JP5V3' },
      { id: 'v5_4', size: '39', color: 'Brun Tan', stock: 2, prixUnitaire: 40000, jpCode: 'JP5V4' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord1',
    jpCode: 'JP1',
    customerName: 'Mialy Randrianarisoa',
    customerPhone: '034 15 234 56',
    customerHandle: '@mialy_r',
    productId: 'p1',
    productName: 'Robe Fleurie d\'Eté',
    price: 45000,
    currency: 'Ar',
    orderTime: '09:42:01',
    status: 'JP capturé',
    isPriority: true,
    chatStatus: 'Confirmé',
    chatMessage: 'Bonjour 👋 Vous avez sélectionné Robe Fleurie d\'Eté (JP1) pour 45 000 Ar. Répondez avec votre NOM, TÉLÉPHONE, ADRESSE et DATE DE LIVRAISON préférée pour bloquer votre commande !',
    remindersCount: 0,
    deliveryStatus: 'au bureau',
    deliveryAddress: 'Logement 524, Itaosy, Antananarivo',
    prefDeliveryDate: '2026-05-22',
    sentToDelivery: false,
    paymentType: 'À la livraison',
    isPaid: false,
    commentSnippet: 'JP1 Robe rouge s\'il vous plait ! @vendeur'
  },
  {
    id: 'ord2',
    jpCode: 'JP3',
    customerName: 'Sitraka Rakotomalala',
    customerPhone: '032 44 987 12',
    customerHandle: '@sitraka_rak',
    productId: 'p3',
    productName: 'Bracelet d\'Ambre de Madagascar',
    price: 60050,
    currency: 'Ar',
    orderTime: '09:38:15',
    status: 'confirmé',
    isPriority: false,
    chatStatus: 'Confirmé',
    chatMessage: 'Bonjour 👋 Vous avez sélectionné Bracelet d\'Ambre (JP3) pour 60 000 Ar. Répondez avec vos coordonnées...',
    remindersCount: 1,
    deliveryStatus: 'en préparation',
    deliveryAddress: 'Lot II M 40 Bis Ankorondrano, Antananarivo',
    prefDeliveryDate: '2026-05-23',
    sentToDelivery: true,
    paymentType: 'Mobile Money',
    isPaid: true,
    mobileMoneyScreenshot: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=60', // Fake image placeholder representing mobile money screenshot proof
    commentSnippet: 'Maka iray JP3 azafady'
  },
  {
    id: 'ord3',
    jpCode: 'JP2',
    customerName: 'Fitiavana Heriniaina',
    customerPhone: '033 12 456 78',
    customerHandle: '@fitia_love',
    productId: 'p2',
    productName: 'Sac artisanal en Raphia',
    price: 35000,
    currency: 'Ar',
    orderTime: '09:35:10',
    status: 'JP capturé',
    isPriority: false,
    chatStatus: 'Relancé x1',
    chatMessage: 'RAPPEL #1 👋 Pas de réponse de votre part. Confirmez votre Sac artisanal en Raphia (JP2) avant expiration !',
    remindersCount: 1,
    deliveryStatus: 'au bureau',
    deliveryAddress: 'Villa 14, Ivato Aéroport, Antananarivo',
    prefDeliveryDate: '2026-05-22',
    sentToDelivery: false,
    paymentType: 'À la livraison',
    isPaid: false,
    commentSnippet: 'Mety ve ny JP2 amin\'ny sabotsy?'
  },
  {
    id: 'ord4',
    jpCode: 'JP4',
    customerName: 'Aina Rabemananjara',
    customerPhone: '034 50 111 22',
    customerHandle: '@aina_rab',
    productId: 'p4',
    productName: 'Ensemble Lin Léger',
    price: 75000,
    currency: 'Ar',
    orderTime: '09:22:40',
    status: 'préparé',
    isPriority: false,
    chatStatus: 'Confirmé',
    chatMessage: 'Bonjour 👋 Confirmez votre Ensemble Lin Léger (JP4)...',
    remindersCount: 0,
    deliveryStatus: 'en préparation',
    deliveryAddress: 'Lot III T 12 Analakely, Antananarivo',
    prefDeliveryDate: '2026-05-24',
    sentToDelivery: true,
    paymentType: 'Mobile Money',
    isPaid: true,
    mobileMoneyScreenshot: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60',
    commentSnippet: 'JP4 xl ho ahy tompoko'
  }
];

export const POTENTIAL_SIMULATED_CUSTOMERS = [
  { name: 'Mialy Andriantsilavo', phone: '034 55 123 45', handle: '@mialy_tsilavo', address: 'Lot IV G 12 Ambohipo, Antananarivo' },
  { name: 'Herizo Razafindrakoto', phone: '032 67 444 88', handle: '@herizo_riza', address: 'Près de l\'église Analakely, Antananarivo' },
  { name: 'Nantenaina Solofoniaina', phone: '033 99 876 54', handle: '@solofon_nante', address: 'Lot II B 35 Talatamaty' },
  { name: 'Faratiana Rabe', phone: '034 22 555 66', handle: '@fara_rabe', address: 'Ambohimanarina face pharmacie' },
  { name: 'Haja Raharolahy', phone: '032 10 321 09', handle: '@haja_rahar', address: 'Appartement 5, Ampefiloha, Antananarivo' },
  { name: 'Sariaka Rakotonirina', phone: '034 77 333 44', handle: '@sariaka_r', address: '67Ha Sud, Antananarivo' }
];

export const CAPTURE_PHRASES = [
  "JP1 rano kely",
  "Je prends JP2 azafady",
  "JP3 ambre tena tsara",
  "Maka JP4 izaho",
  "JP5 handramana kely",
  "Mety ve ny JP1 amin'ny sabotsy?",
  "JP2 ho an'i mamanay"
];

export const INITIAL_LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'live-14',
    title: "Dressing d'Hiver Premium Antsirabe",
    date: "20 Mai 2026 - 15:30",
    status: 'Terminé',
    connectedPages: ['Boutique Chic Madagascar'],
    selectedProductIds: ['p1', 'p2', 'p4', 'p5'],
    assignedCollaborator: 'Clara Michel',
    totalOrders: 5,
    revenue: 235000,
    orders: [
      {
        id: 'past-14-1',
        jpCode: 'JP4',
        customerName: 'Fanja Harisoa',
        customerPhone: '034 45 612 89',
        customerHandle: '@fanja_hari',
        productId: 'p4',
        productName: 'Ensemble Lin Léger',
        price: 75000,
        currency: 'Ar',
        orderTime: '15:42:10',
        status: 'livré',
        isPriority: true,
        chatStatus: 'Confirmé',
        chatMessage: 'Livreur en route...',
        remindersCount: 0,
        deliveryStatus: 'livré',
        deliveryAddress: 'Lot A-106 Ambohitrarahaba, Antananarivo',
        prefDeliveryDate: '2026-05-21',
        sentToDelivery: true,
        paymentType: 'À la livraison',
        isPaid: true,
        commentSnippet: 'Maka JP4 XL bleu marine azafady'
      },
      {
        id: 'past-14-2',
        jpCode: 'JP1',
        customerName: 'Voahangy Rabesandratana',
        customerPhone: '032 14 555 60',
        customerHandle: '@voahangy_r',
        productId: 'p1',
        productName: "Robe Fleurie d'Eté",
        price: 45000,
        currency: 'Ar',
        orderTime: '15:46:22',
        status: 'livré',
        isPriority: false,
        chatStatus: 'Confirmé',
        chatMessage: 'Validé',
        remindersCount: 0,
        deliveryStatus: 'livré',
        deliveryAddress: 'Logement 114 Cité Ampefiloha',
        prefDeliveryDate: '2026-05-21',
        sentToDelivery: true,
        paymentType: 'Mobile Money',
        isPaid: true,
        commentSnippet: 'JP1 rouge marina kely'
      },
      {
        id: 'past-14-3',
        jpCode: 'JP2',
        customerName: 'Niry Rakotobe',
        customerPhone: '033 78 412 00',
        customerHandle: '@niry_rb',
        productId: 'p2',
        productName: 'Sac artisanal en Raphia',
        price: 35000,
        currency: 'Ar',
        orderTime: '15:49:15',
        status: 'livré',
        isPriority: false,
        chatStatus: 'Confirmé',
        chatMessage: 'OK',
        remindersCount: 0,
        deliveryStatus: 'livré',
        deliveryAddress: 'Face Escalier Ambohimanarina',
        prefDeliveryDate: '2026-05-21',
        sentToDelivery: true,
        paymentType: 'À la livraison',
        isPaid: true,
        commentSnippet: 'JP2 sac raphia'
      },
      {
        id: 'past-14-4',
        jpCode: 'JP5',
        customerName: 'Lova Randriambola',
        customerPhone: '034 96 112 03',
        customerHandle: '@lova_randria',
        productId: 'p5',
        productName: "Sandales en Cuir d'Antsirabe",
        price: 40000,
        currency: 'Ar',
        orderTime: '15:53:01',
        status: 'livré',
        isPriority: false,
        chatStatus: 'Confirmé',
        chatMessage: 'Validé',
        remindersCount: 0,
        deliveryStatus: 'livré',
        deliveryAddress: 'Lot IV R 75 Ambohipo',
        prefDeliveryDate: '2026-05-21',
        sentToDelivery: true,
        paymentType: 'À la livraison',
        isPaid: true,
        commentSnippet: 'JP5 size 38'
      },
      {
        id: 'past-14-5',
        jpCode: 'JP5',
        customerName: 'Sariaka Rajaonah',
        customerPhone: '034 12 777 88',
        customerHandle: '@sariaka_raj',
        productId: 'p5',
        productName: "Sandales en Cuir d'Antsirabe",
        price: 40000,
        currency: 'Ar',
        orderTime: '15:56:45',
        status: 'annulé',
        isPriority: false,
        chatStatus: 'Pas de réponse',
        chatMessage: 'Relance restée vaine',
        remindersCount: 3,
        deliveryStatus: 'au bureau',
        deliveryAddress: 'Ankatso II Tananarive',
        prefDeliveryDate: '2026-05-21',
        sentToDelivery: false,
        paymentType: 'À la livraison',
        isPaid: false,
        commentSnippet: 'JP5 kely'
      }
    ]
  },
  {
    id: 'live-13',
    title: "Sacs de Marque & Accessoires Chic",
    date: "17 Mai 2026 - 19:00",
    status: 'Terminé',
    connectedPages: ['Tana Dressing', 'AZLive Fashion'],
    selectedProductIds: ['p2', 'p3'],
    assignedCollaborator: 'Faly Rakotonirina',
    totalOrders: 3,
    revenue: 135000,
    orders: [
      {
        id: 'past-13-1',
        jpCode: 'JP2',
        customerName: 'Mialy Rakotoarimanana',
        customerPhone: '032 55 111 22',
        customerHandle: '@mialy_rk',
        productId: 'p2',
        productName: 'Sac artisanal en Raphia',
        price: 35000,
        currency: 'Ar',
        orderTime: '19:15:30',
        status: 'livré',
        isPriority: true,
        chatStatus: 'Confirmé',
        chatMessage: 'Livré avec succès!',
        remindersCount: 0,
        deliveryStatus: 'livré',
        deliveryAddress: 'Lot VI O 14 Ankorondrano, Antananarivo',
        prefDeliveryDate: '2026-05-18',
        sentToDelivery: true,
        paymentType: 'Mobile Money',
        isPaid: true,
        commentSnippet: 'Maka JP2 i mialy sady mahafinaritra'
      },
      {
        id: 'past-13-2',
        jpCode: 'JP3',
        customerName: 'Fenitra Ravelo',
        customerPhone: '033 44 888 99',
        customerHandle: '@fenitra_rv',
        productId: 'p3',
        productName: "Bracelet d'Ambre de Madagascar",
        price: 60000,
        currency: 'Ar',
        orderTime: '19:28:11',
        status: 'livré',
        isPriority: false,
        chatStatus: 'Confirmé',
        chatMessage: 'Livré!',
        remindersCount: 0,
        deliveryStatus: 'livré',
        deliveryAddress: '67Ha Nord Rez-de-chaussée',
        prefDeliveryDate: '2026-05-18',
        sentToDelivery: true,
        paymentType: 'À la livraison',
        isPaid: true,
        commentSnippet: 'Mba mangataka JP3 rano kely'
      },
      {
        id: 'past-13-3',
        jpCode: 'JP2',
        customerName: 'Holy Nirina',
        customerPhone: '034 77 112 34',
        customerHandle: '@holy_nir',
        productId: 'p2',
        productName: 'Sac artisanal en Raphia',
        price: 35000,
        currency: 'Ar',
        orderTime: '19:35:42',
        status: 'annulé',
        isPriority: false,
        chatStatus: 'Pas de réponse',
        chatMessage: 'Désistement après appel téléphonique',
        remindersCount: 1,
        deliveryStatus: 'au bureau',
        deliveryAddress: 'Itaosy Cité',
        prefDeliveryDate: '2026-05-18',
        sentToDelivery: false,
        paymentType: 'À la livraison',
        isPaid: false,
        commentSnippet: 'Mety ve JP2'
      }
    ]
  }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'col-1',
    name: 'Clara Michel',
    role: 'Commercial',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '034 50 112 00',
    connectedPages: ['Boutique Chic Madagascar', 'AZLive Fashion'],
    stats: { claimsInputs: 45, validatedPayments: 38, ticketsPrinted: 35 },
    isActive: true
  },
  {
    id: 'col-2',
    name: 'Faly Rakotonirina',
    role: 'Modérateur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '032 67 221 11',
    connectedPages: ['AZLive Fashion', 'Tana Dressing'],
    stats: { claimsInputs: 82, validatedPayments: 71, ticketsPrinted: 0 },
    isActive: true
  },
  {
    id: 'col-3',
    name: 'Masy Randrianasolo',
    role: 'Secrétaire',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    phone: '033 89 543 21',
    connectedPages: ['Boutique Chic Madagascar', 'Tana Dressing'],
    stats: { claimsInputs: 12, validatedPayments: 54, ticketsPrinted: 48 },
    isActive: true
  }
];


