import React from 'react';
import { AnimatePresence } from 'motion/react';
import { PlusCircle } from 'lucide-react';
import { LiveSession, Order, Product, Collaborator, ChatStatus } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { useLiveHub } from '../hooks/useLiveHub';
import { useOwnedLiveSessions } from '../hooks/useOwnedLiveSessions';
import { useLiveOrders } from '../hooks/useLiveOrders';
import { useLiveBroadcast } from '../hooks/useLiveBroadcast';
import { convertToInputValue } from '../utils/dateUtils';
import LiveSessionList from '../components/LiveSessionList';
import LiveCreateForm from '../components/LiveCreateForm';
import LiveSessionDetail from '../components/LiveSessionDetail';
import PrintTicketsModal from '../components/PrintTicketsModal';
import ManualOrderModal from '../components/ManualOrderModal';

interface LiveShoppingHubPageProps {
  orders: Order[];
  products: Product[];
  productsLoading?: boolean;
  collaborators: Collaborator[];
  liveSessions: LiveSession[];
  facebookPages: string[];
  livesLoading?: boolean;
  livesError?: string | null;
  livesSaving?: boolean;
  onCreateLiveSession: (params: {
    title: string;
    dateLive: string;
    operateurId?: number | null;
    pages: string[];
    productIds?: string[];
  }) => Promise<LiveSession>;
  onUpdateLiveSession: (
    sessionId: string,
    params: {
      title?: string;
      dateLive?: string;
      operateurId?: number | null;
      pages?: string[];
      productIds?: string[];
    },
  ) => Promise<LiveSession>;
  onUpdateLiveDressing: (sessionId: string, productIds: string[]) => Promise<LiveSession>;
  onStartLiveSession: (sessionId: string) => Promise<LiveSession>;
  onCloseLiveSession: (sessionId: string) => Promise<LiveSession>;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onDeleteOrder: (id: string) => void;
  onSendToDelivery: (orderIds: string[]) => void;
  onAddManualOrder: (
    jpCode: string,
    customerName: string,
    chatStatus: ChatStatus,
    sessionId?: string,
  ) => void;
  onAddProduct: (prod: Omit<Product, 'id'>) => void | Promise<void>;
  onEditProduct: (id: string, updates: Partial<Product>) => void | Promise<void>;
  onDeleteProduct: (id: string) => void | Promise<void>;
  simulationActive: boolean;
  setSimulationActive: (active: boolean) => void;
}

export default function LiveShoppingHubPage({
  orders,
  products,
  productsLoading = false,
  collaborators,
  liveSessions,
  facebookPages,
  livesLoading = false,
  livesError = null,
  livesSaving = false,
  onCreateLiveSession,
  onUpdateLiveSession,
  onUpdateLiveDressing,
  onStartLiveSession,
  onAddManualOrder,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onCloseLiveSession,
}: LiveShoppingHubPageProps) {
  const hub = useLiveHub();
  const broadcast = useLiveBroadcast();

  const ownedLiveSessions = useOwnedLiveSessions(liveSessions);

  const selectedSession = ownedLiveSessions.find((s) => s.id === hub.selectedSessionId);
  const activeAndCreatedSessions = ownedLiveSessions.filter(
    (s) => s.status === 'En cours' || s.status === 'Créé',
  );
  const completedSessions = ownedLiveSessions.filter((s) => s.status === 'Terminé');

  // Capture JP automatique : commandes réelles du live en cours (polling backend).
  // Si indisponible (mode démo / live non lancé), on garde la file existante.
  const liveOrders = useLiveOrders(selectedSession);
  const detailOrders = liveOrders.enabled ? liveOrders.orders : orders;

  // Restauration du Live après actualisation : `selectedSessionId` est lu depuis l'URL,
  // mais la liste des lives arrive de façon asynchrone. Tant que le chargement n'est pas
  // terminé, on affiche un état de transition au lieu de retomber sur la liste des lives.
  const livesFetchStarted = React.useRef(false);
  React.useEffect(() => {
    if (livesLoading) livesFetchStarted.current = true;
  }, [livesLoading]);

  const isRestoringLive =
    Boolean(hub.selectedSessionId) &&
    !selectedSession &&
    (livesLoading || !livesFetchStarted.current);

  // Si l'ID présent dans l'URL ne correspond à aucun live accessible une fois le
  // chargement terminé, on nettoie le paramètre pour revenir proprement à la liste.
  React.useEffect(() => {
    if (
      livesFetchStarted.current &&
      !livesLoading &&
      hub.selectedSessionId &&
      !selectedSession
    ) {
      hub.setSelectedSessionId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livesLoading, hub.selectedSessionId, selectedSession]);

  const resolvePages = (): string[] => {
    if (hub.selectedPages.length > 0) return hub.selectedPages;
    if (facebookPages.length > 0) return [facebookPages[0]];
    return [];
  };

  const handleCreateLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hub.liveTitle.trim()) {
      alert("S'il vous plaît, spécifiez un titre pour le direct.");
      return;
    }

    const pages = resolvePages();
    if (pages.length === 0) {
      alert('Veuillez sélectionner au moins une page Facebook.');
      return;
    }

    const operateurId = hub.assignedCollabId ? Number(hub.assignedCollabId) : null;

    try {
      if (hub.editingSessionId) {
        await onUpdateLiveSession(hub.editingSessionId, {
          title: hub.liveTitle.trim(),
          dateLive: hub.liveDate,
          operateurId,
          pages,
        });
        hub.setEditingSessionId(null);
      } else {
        await onCreateLiveSession({
          title: hub.liveTitle.trim(),
          dateLive: hub.liveDate,
          operateurId,
          pages,
          productIds: hub.selectedProductIds,
        });
      }

      hub.setShowCreateForm(false);
      hub.resetCreateForm();
      playNotificationSound('confirm');
    } catch {
      // error state handled by useLives
    }
  };

  const handleEditSession = (session: LiveSession) => {
    hub.setEditingSessionId(session.id);
    hub.setLiveTitle(session.title);
    hub.setLiveDate(convertToInputValue(session.date));
    hub.setSelectedPages(session.connectedPages || []);
    hub.setAssignedCollabId(session.operateurId ? String(session.operateurId) : '');
    hub.setSelectedProductIds(session.selectedProductIds || []);
    hub.setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hub.manualOrderJpCode || !hub.manualOrderCustomerName.trim()) {
      alert('Veuillez sélectionner un code JP et entrer un nom de client.');
      return;
    }
    onAddManualOrder(
      hub.manualOrderJpCode,
      hub.manualOrderCustomerName.trim(),
      hub.manualOrderChatStatus,
      hub.selectedSessionId || undefined,
    );
    hub.setManualOrderCustomerName('');
    hub.setShowManualOrderModal(false);
    playNotificationSound('order');
  };

  const handleCopyOrderSummary = (order: Order) => {
    const summary = `📦 COMMANDE MADAGASCAR ${
      order.jpCode
    }\n👤 Acheteur : ${order.customerName} (${order.customerHandle})\n📞 Tél : ${
      order.customerPhone
    }\n📍 Adresse : ${order.deliveryAddress}\n💰 Total : ${order.price.toLocaleString()} Ar`;
    navigator.clipboard.writeText(summary);
    hub.setCopiedOrderId(order.id);
    setTimeout(() => hub.setCopiedOrderId(null), 2500);
    playNotificationSound('click');
  };

  const handleCloseSession = async () => {
    if (!hub.selectedSessionId) return;
    try {
      await onCloseLiveSession(hub.selectedSessionId);
      broadcast.stopBroadcast();
      hub.setSelectedSessionId(null);
      playNotificationSound('delivery');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la clôture du live.');
    }
  };

  const handleStartLive = async () => {
    if (!selectedSession) return;
    try {
      const startedSession = await onStartLiveSession(selectedSession.id);
      playNotificationSound('confirm');

      // Diffusion navigateur : si le backend a provisionné le pont WebRTC (live réel),
      // on demande l'autorisation caméra et on publie le flux vers Facebook via MediaMTX.
      try {
        await broadcast.startBroadcast(startedSession.broadcast);
      } catch (broadcastErr) {
        alert(
          broadcastErr instanceof Error
            ? broadcastErr.message
            : "Le live a démarré mais la diffusion caméra n'a pas pu être lancée.",
        );
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du démarrage du live.');
    }
  };

  const handleAddToDressing = async (sessionId: string, productIds: string[]) => {
    const session = ownedLiveSessions.find((s) => s.id === sessionId);
    if (!session) return;
    const merged = [...new Set([...(session.selectedProductIds || []), ...productIds])];
    await onUpdateLiveDressing(sessionId, merged);
  };

  const handleRemoveFromDressing = async (productId: string) => {
    if (!selectedSession) return;
    const newIds = (selectedSession.selectedProductIds || []).filter((id) => id !== productId);
    await onUpdateLiveDressing(selectedSession.id, newIds);
  };

  return (
    <div className="space-y-6" id="live-shopping-hub-root">
      {livesError && !selectedSession && (
        <div className="bg-white border border-rose-100 rounded-2xl p-4 text-xs text-rose-600">
          {livesError}
        </div>
      )}

      {isRestoringLive ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-wider">Chargement du live…</p>
        </div>
      ) : !selectedSession ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-secondary tracking-tight font-sans">
                Espace Commercial • Live Shopping
              </h2>
              <p className="text-sm text-slate-500 font-serif">
                Lancez un nouveau livestream et centralisez la détection d'achats avec vos opérateurs à Antananarivo.
              </p>
            </div>

            <button
              onClick={() => {
                if (!hub.showCreateForm) {
                  hub.setLiveDate(convertToInputValue(''));
                }
                hub.setShowCreateForm(!hub.showCreateForm);
                playNotificationSound('click');
              }}
              className="px-5 py-3 bg-secondary hover:bg-accent text-primary rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-secondary transition-all border-none cursor-pointer"
            >
              <PlusCircle className="h-4.5 w-4.5" /> Planifier / Lancer un Live ⚡
            </button>
          </div>

          <AnimatePresence>
            {hub.showCreateForm && (
              <LiveCreateForm
                collaborators={collaborators}
                facebookPages={facebookPages}
                liveTitle={hub.liveTitle}
                setLiveTitle={hub.setLiveTitle}
                liveDate={hub.liveDate}
                setLiveDate={hub.setLiveDate}
                selectedPages={hub.selectedPages}
                setSelectedPages={hub.setSelectedPages}
                assignedCollabId={hub.assignedCollabId}
                setAssignedCollabId={hub.setAssignedCollabId}
                editingSessionId={hub.editingSessionId}
                saving={livesSaving}
                onSubmit={handleCreateLive}
                onCancel={() => {
                  hub.resetCreateForm();
                  hub.setShowCreateForm(false);
                }}
              />
            )}
          </AnimatePresence>

          <LiveSessionList
            activeAndCreatedSessions={activeAndCreatedSessions}
            completedSessions={completedSessions}
            orders={orders}
            loading={livesLoading}
            error={livesError}
            onConsult={(sessId, firstOrdId) => {
              hub.setSelectedSessionId(sessId);
              if (firstOrdId) hub.setSelectedCompletedOrderId(firstOrdId);
            }}
            onEdit={handleEditSession}
            onCreateClick={() => hub.setShowCreateForm(true)}
          />
        </div>
      ) : (
        <LiveSessionDetail
          selectedSession={selectedSession}
          orders={detailOrders}
          products={products}
          onBack={() => {
            hub.setSelectedSessionId(null);
            hub.setSelectedCompletedOrderId(null);
          }}
          onStartLive={handleStartLive}
          onCloseLive={handleCloseSession}
          onPrintTickets={() => {
            hub.setPrintProductFilter(null);
            hub.setPrintOrderFilter(null);
            hub.setShowPrintModal(true);
          }}
          sessionOrdersSearch={hub.sessionOrdersSearch}
          setSessionOrdersSearch={hub.setSessionOrdersSearch}
          liveSubTab={hub.liveSubTab}
          setLiveSubTab={hub.setLiveSubTab}
          selectedStockProductIds={hub.selectedStockProductIds}
          setSelectedStockProductIds={hub.setSelectedStockProductIds}
          stockSearchQuery={hub.stockSearchQuery}
          setStockSearchQuery={hub.setStockSearchQuery}
          onAddToDressing={handleAddToDressing}
          onRemoveFromDressing={handleRemoveFromDressing}
          dressingSaving={livesSaving}
          ordersPage={hub.ordersPage}
          setOrdersPage={hub.setOrdersPage}
          productsPage={hub.productsPage}
          setProductsPage={hub.setProductsPage}
          selectedCompletedOrderId={hub.selectedCompletedOrderId}
          setSelectedCompletedOrderId={hub.setSelectedCompletedOrderId}
          copiedOrderId={hub.copiedOrderId}
          onCopySummary={handleCopyOrderSummary}
          onPrintAllOrders={() => {
            hub.setPrintProductFilter(null);
            hub.setPrintOrderFilter(null);
            hub.setShowPrintModal(true);
          }}
          onPrintSingleOrder={(ordId) => {
            hub.setPrintProductFilter(null);
            hub.setPrintOrderFilter(ordId);
            hub.setShowPrintModal(true);
          }}
          onAddManualOrderClick={() => {
            hub.setManualOrderJpCode('');
            hub.setManualOrderCustomerName('');
            hub.setManualOrderChatStatus('En attente');
            hub.setShowManualOrderModal(true);
          }}
          liveEditingProductId={hub.liveEditingProductId}
          setLiveEditingProductId={hub.setLiveEditingProductId}
          liveEditName={hub.liveEditName}
          setLiveEditName={hub.setLiveEditName}
          liveEditJpCode={hub.liveEditJpCode}
          setLiveEditJpCode={hub.setLiveEditJpCode}
          liveEditPrice={hub.liveEditPrice}
          setLiveEditPrice={hub.setLiveEditPrice}
          liveEditStock={hub.liveEditStock}
          setLiveEditStock={hub.setLiveEditStock}
          liveEditSize={hub.liveEditSize}
          setLiveEditSize={hub.setLiveEditSize}
          liveEditColor={hub.liveEditColor}
          setLiveEditColor={hub.setLiveEditColor}
          liveIsAddingProduct={hub.liveIsAddingProduct}
          setLiveIsAddingProduct={hub.setLiveIsAddingProduct}
          onAddProduct={onAddProduct}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          onPrintProductClick={(jpCode) => {
            hub.setPrintOrderFilter(null);
            hub.setPrintProductFilter(jpCode);
            hub.setShowPrintModal(true);
          }}
        />
      )}

      {productsLoading && selectedSession && (
        <div className="text-center text-xs text-slate-400">Chargement du catalogue produits...</div>
      )}

      <AnimatePresence>
        {hub.showPrintModal && selectedSession && (
          <PrintTicketsModal
            selectedSession={selectedSession}
            orders={detailOrders}
            printProductFilter={hub.printProductFilter}
            printOrderFilter={hub.printOrderFilter}
            onClose={() => {
              hub.setShowPrintModal(false);
              hub.setPrintProductFilter(null);
              hub.setPrintOrderFilter(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hub.showManualOrderModal && selectedSession && (
          <ManualOrderModal
            products={products}
            selectedSession={selectedSession}
            manualOrderJpCode={hub.manualOrderJpCode}
            setManualOrderJpCode={hub.setManualOrderJpCode}
            manualOrderCustomerName={hub.manualOrderCustomerName}
            setManualOrderCustomerName={hub.setManualOrderCustomerName}
            manualOrderChatStatus={hub.manualOrderChatStatus}
            setManualOrderChatStatus={hub.setManualOrderChatStatus}
            onClose={() => hub.setShowManualOrderModal(false)}
            onSubmit={handleAddManualOrderSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
