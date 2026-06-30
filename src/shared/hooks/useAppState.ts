import { useState, useEffect } from 'react';
import { Product, Order, ChatStatus, LiveSession, Collaborator } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  POTENTIAL_SIMULATED_CUSTOMERS,
  CAPTURE_PHRASES,
  INITIAL_LIVE_SESSIONS,
  INITIAL_COLLABORATORS,
} from '../constants/data';
import { playNotificationSound } from '../services/sound';
import {
  clearSession,
  getConnectedPageNames,
  getStoredVendeurId,
  isAuthenticated as isStoredAuthenticated,
  saveDemoSession,
} from '../../features/auth/services/authStorage';
import { FacebookAuthSession } from '../../features/auth/types/facebookAuth.types';
import { TikTokAuthSession } from '../../features/auth/types/tiktokAuth.types';
import { formatTikTokAccountLabel } from '../../features/auth/services/tiktokAuth.service';
import {
  findProductByJpCode,
  findVariantByJpCode,
  getProductDisplay,
} from '../../features/products/utils/productUtils';

export function useAppState() {
  const [activeTabState, setActiveTabState] = useState<
    'dashboard' | 'live_hub' | 'products' | 'clients' | 'collaborators' | 'search'
  >(() => {
    const stored = localStorage.getItem('azlive_active_tab') as
      | 'dashboard'
      | 'live_hub'
      | 'products'
      | 'clients'
      | 'collaborators'
      | 'search'
      | null;
    return stored || 'live_hub';
  });

  const setActiveTab = (tab: 'dashboard' | 'live_hub' | 'products' | 'clients' | 'collaborators' | 'search') => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('azlive_active_tab', tab);
    } catch (e) {
      // ignore write errors (e.g., storage disabled)
    }
  };
  const activeTab = activeTabState;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isStoredAuthenticated());
  const [connectedPagesList, setConnectedPagesList] = useState<string[]>(() => {
    const stored = getConnectedPageNames();
    return stored.length > 0
      ? stored
      : ['AZLive Fashion', 'Boutique Chic Madagascar', 'Tana Dressing Hub'];
  });

  // DB persistent states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(INITIAL_LIVE_SESSIONS);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);

  // Real-time comments simulator auto-inject loop
  const [simulationOn, setSimulationOn] = useState(true);

  // UI Drawer / modal states
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Auto comments injector loop representing raw comment stream capture
  useEffect(() => {
    if (!simulationOn) return;
    // Vendeur réel connecté : les vraies commandes (capture JP backend) prennent
    // le relais, on n'injecte donc pas de commentaires simulés.
    if (getStoredVendeurId() != null) return;

    const interval = setInterval(() => {
      const client =
        POTENTIAL_SIMULATED_CUSTOMERS[
          Math.floor(Math.random() * POTENTIAL_SIMULATED_CUSTOMERS.length)
        ];

      if (products.length === 0) return;
      const activeLiveSession = liveSessions.find((s) => s.status === 'En cours');
      const allowedProducts =
        activeLiveSession && activeLiveSession.selectedProductIds
          ? products.filter((p) => activeLiveSession.selectedProductIds?.includes(p.id))
          : products;
      if (allowedProducts.length === 0) return;
      const product = allowedProducts[Math.floor(Math.random() * allowedProducts.length)];

      let variant = product.variants[0] ?? null;
      let sizeText = variant?.size || 'Unique';
      let colorText = variant?.color || 'Unique';
      let customComment = '';

      if (product.variants && product.variants.length > 0) {
        const availableVariants = product.variants.filter((v) => v.stock > 0);
        if (availableVariants.length > 0) {
          variant = availableVariants[Math.floor(Math.random() * availableVariants.length)];
          sizeText = variant.size;
          colorText = variant.color;
        }
      }

      const jpCode = variant?.jpCode || product.variants[0]?.jpCode || 'JP';
      const prix = variant?.prixUnitaire || product.variants[0]?.prixUnitaire || 0;

      if (variant) {
        const commentTemplates = [
          `${jpCode} ${sizeText} ${colorText} s'il vous plaît!`,
          `${jpCode} en ${colorText} taille ${sizeText} je prends`,
          `Manao commande de ${jpCode} (${sizeText} - ${colorText})`,
          `${jpCode} kely ${colorText} size ${sizeText} band`,
          `Afaka mahazo ${jpCode} kosa ve, taille ${sizeText} ${colorText}?`,
        ];
        customComment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      } else {
        const keywordSample = CAPTURE_PHRASES[Math.floor(Math.random() * CAPTURE_PHRASES.length)];
        customComment = keywordSample
          .replace('JP1', jpCode)
          .replace('JP2', jpCode)
          .replace('JP3', jpCode)
          .replace('JP4', jpCode)
          .replace('JP5', jpCode);
      }

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const simulatedClaim: Order = {
        id: `sim-${Date.now()}`,
        jpCode,
        customerName: client.name,
        customerPhone: client.phone,
        customerHandle: client.handle,
        productId: product.id,
        productName: product.name,
        price: prix,
        currency: 'Ar',
        orderTime: timeStr,
        status: 'JP capturé',
        isPriority: Math.random() > 0.8,
        chatStatus: 'En attente',
        chatMessage: `Bonjour 👋 Vous avez écrit "${customComment}". Votre article ${
          product.name
        } (${
          jpCode
        }) est réservé pour ${prix.toLocaleString()} Ar. Merci de nous envoyer votre NOM, TÉLÉPHONE, ADRESSE et d'effectuer le transfert par Mobile Money (Mvola, Orange Money ou Airtel) pour valider !`,
        remindersCount: 0,
        deliveryStatus: 'au bureau',
        deliveryAddress: client.address,
        prefDeliveryDate: '',
        sentToDelivery: false,
        paymentType: 'Mobile Money',
        isPaid: false,
        commentSnippet: customComment,
      };

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === product.id && variant) {
            const updatedVariants = p.variants.map((v) =>
              v.id === variant.id ? { ...v, stock: Math.max(0, v.stock - 1) } : v
            );
            return { ...p, variants: updatedVariants };
          }
          return p;
        })
      );

      setOrders((prev) => [simulatedClaim, ...prev]);
      playNotificationSound('order');
    }, 14000);

    return () => clearInterval(interval);
  }, [simulationOn, products, liveSessions]);

  // Reset database to original records
  const handleResetDatabase = () => {
    setShowResetConfirm(true);
    playNotificationSound('click');
  };

  const handleConfirmReset = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setLiveSessions(INITIAL_LIVE_SESSIONS);
    setSimulationOn(true);
    setShowResetConfirm(false);
    playNotificationSound('delivery');
  };

  // Clôturer le Live en cours et l'archiver dans l'historique
  const handleArchiveCurrentLive = (title: string): boolean => {
    if (orders.length === 0) {
      alert("Il n'y a aucune vente active à clotûrer dans la file d'attente.");
      return false;
    }

    const revenue = orders
      .filter(
        (o) =>
          o.status === 'confirmé' ||
          o.status === 'préparé' ||
          o.status === 'en livraison' ||
          o.status === 'livré'
      )
      .reduce((sum, current) => sum + current.price, 0);

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' à ' +
      now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newSession: LiveSession = {
      id: `live-${Date.now()}`,
      title: title.trim() || `Live improvisé du ${now.toLocaleDateString('fr-FR')}`,
      date: formattedDate,
      status: 'Terminé',
      connectedPages: ['AZLive Fashion'],
      selectedProductIds: products.map((p) => p.id),
      assignedCollaborator: 'Responsable Ventes',
      totalOrders: orders.length,
      revenue,
      orders: [...orders],
    };

    setLiveSessions((prev) => [newSession, ...prev]);
    setOrders([]); // clear active queue

    // replenish sizing stock for a fresh cycle
    setProducts(
      INITIAL_PRODUCTS.map((p) => ({
        ...p,
        variants: p.variants.map((v) => ({
          ...v,
          stock: 5 + Math.floor(Math.random() * 8),
        })),
      }))
    );

    playNotificationSound('delivery');
    return true;
  };

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSendToDelivery = (orderIds: string[]) => {
    setOrders((prev) =>
      prev.map((o) =>
        orderIds.includes(o.id)
          ? { ...o, sentToDelivery: true, status: 'en livraison', deliveryStatus: 'au bureau' }
          : o
      )
    );
  };

  const handleAddManualOrder = (
    jpCode: string,
    customerName: string,
    chatStatus: ChatStatus,
    sessionId?: string
  ) => {
    const product = findProductByJpCode(products, jpCode);
    const variant = findVariantByJpCode(products, jpCode);
    if (!product || !variant) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const manualClaim: Order = {
      id: `manual-${Date.now()}`,
      jpCode,
      customerName,
      customerPhone:
        '034 ' +
        Math.floor(10 + Math.random() * 89) +
        ' ' +
        Math.floor(100 + Math.random() * 899) +
        ' ' +
        Math.floor(10 + Math.random() * 89),
      customerHandle: `@${customerName.toLowerCase().replace(/\s+/g, '_')}`,
      productId: product.id,
      productName: product.name,
      price: variant.prixUnitaire,
      currency: 'Ar',
      orderTime: timeStr,
      status: 'JP capturé',
      isPriority: true,
      chatStatus,
      chatMessage: `Bonjour 👋 Votre commande pour ${
        product.name
      } (${jpCode}) est réservée pour ${variant.prixUnitaire.toLocaleString()} Ar. Merci d'envoyer votre reçu de paiement Mobile Money pour valider !`,
      remindersCount: 0,
      deliveryStatus: 'au bureau',
      deliveryAddress: 'Lot II M 40 Bis, Antananarivo',
      prefDeliveryDate: '',
      sentToDelivery: false,
      paymentType: 'Mobile Money',
      isPaid: false,
      commentSnippet: `Saisie d'urgence par le secrétariat sur le code ${jpCode}`,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          const updatedVariants = p.variants.map((v) =>
            v.jpCode === jpCode ? { ...v, stock: Math.max(0, v.stock - 1) } : v
          );
          return { ...p, variants: updatedVariants };
        }
        return p;
      })
    );

    if (sessionId) {
      const tgtSession = liveSessions.find((s) => s.id === sessionId);
      if (tgtSession) {
        if (tgtSession.status === 'En cours') {
          setOrders((prev) => [manualClaim, ...prev]);
        } else {
          setLiveSessions((prev) =>
            prev.map((s) => {
              if (s.id === sessionId) {
                const sessionOrders = s.orders || [];
                const updatedOrders = [manualClaim, ...sessionOrders];
                const revenue = updatedOrders
                  .filter((o) => o.status !== 'annulé')
                  .reduce((sum, current) => sum + current.price, 0);
                return {
                  ...s,
                  orders: updatedOrders,
                  totalOrders: updatedOrders.length,
                  revenue,
                };
              }
              return s;
            })
          );
        }
      } else {
        setOrders((prev) => [manualClaim, ...prev]);
      }
    } else {
      setOrders((prev) => [manualClaim, ...prev]);
    }
  };

  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const p: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      variants: newProd.variants || [],
    };
    setProducts((prev) => [...prev, p]);
  };

  const handleEditProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddCollaborator = (
    newCollab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>
  ) => {
    const c: Collaborator = {
      ...newCollab,
      id: `col-${Date.now()}`,
      stats: { claimsInputs: 0, validatedPayments: 0, ticketsPrinted: 0 },
      isActive: true,
    };
    setCollaborators((prev) => [...prev, c]);
  };

  const handleToggleCollabStatus = (id: string) => {
    setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const handleDeleteCollaborator = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateClientInOrders = (
    oldPhone: string,
    newDetails: { name: string; phone: string; handle: string; address: string }
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.customerPhone === oldPhone
          ? {
              ...o,
              customerName: newDetails.name,
              customerPhone: newDetails.phone,
              customerHandle: newDetails.handle,
              deliveryAddress: newDetails.address,
            }
          : o
      )
    );
  };

  const handleAddNewLive = (newSession: LiveSession) => {
    setLiveSessions((prev) => [newSession, ...prev]);
  };

  const handleUpdateLiveSession = (sessionId: string, updates: Partial<LiveSession>) => {
    setLiveSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, ...updates } : s)));
  };

  const handleStartLiveSession = (sessionId: string) => {
    setLiveSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'En cours' as const } : s))
    );
    setOrders([]); // clear active queue
    playNotificationSound('confirm');
  };

  const handleCloseLiveSession = (sessionId: string) => {
    setLiveSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const revenue = orders
            .filter((o) => o.status !== 'annulé')
            .reduce((sum, current) => sum + current.price, 0);
          return {
            ...s,
            status: 'Terminé',
            orders: [...orders],
            totalOrders: orders.length,
            revenue,
          };
        }
        return s;
      })
    );
    setOrders([]); // clear active queue

    setProducts(
      INITIAL_PRODUCTS.map((p) => ({
        ...p,
        variants: p.variants.map((v) => ({
          ...v,
          stock: 5 + Math.floor(Math.random() * 8),
        })),
      }))
    );

    playNotificationSound('delivery');
  };

  const handleLoginSuccess = (pages: string[], platform: 'Facebook' | 'TikTok' = 'Facebook') => {
    saveDemoSession(pages, platform);
    setConnectedPagesList(pages);
    setIsAuthenticated(true);
    setActiveTab('live_hub');
  };

  const handleFacebookLoginSuccess = (session: FacebookAuthSession) => {
    const pageNames = session.selectedPages?.length
      ? session.selectedPages.map((page) => page.nom)
      : [session.selectedPage.nom];
    setConnectedPagesList(pageNames);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleTikTokLoginSuccess = (session: TikTokAuthSession) => {
    setConnectedPagesList([formatTikTokAccountLabel(session.profile)]);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    playNotificationSound('click');
  };

  const handleConfirmLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setShowLogoutConfirm(false);
    playNotificationSound('delivery');
  };

  return {
    activeTab,
    setActiveTab,
    isAuthenticated,
    setIsAuthenticated,
    connectedPagesList,
    products,
    orders,
    liveSessions,
    collaborators,
    simulationOn,
    setSimulationOn,
    showHowItWorks,
    setShowHowItWorks,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    showLogoutConfirm,
    setShowLogoutConfirm,
    showResetConfirm,
    setShowResetConfirm,
    handleResetDatabase,
    handleConfirmReset,
    handleArchiveCurrentLive,
    handleUpdateOrder,
    handleDeleteOrder,
    handleSendToDelivery,
    handleAddManualOrder,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleAddCollaborator,
    handleToggleCollabStatus,
    handleDeleteCollaborator,
    handleUpdateClientInOrders,
    handleAddNewLive,
    handleUpdateLiveSession,
    handleStartLiveSession,
    handleCloseLiveSession,
    handleLoginSuccess,
    handleFacebookLoginSuccess,
    handleTikTokLoginSuccess,
    handleLogout,
    handleConfirmLogout,
  };
}
