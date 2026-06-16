import React from 'react';
import { AnimatePresence } from 'motion/react';
import { PlusCircle } from 'lucide-react';
import { LiveSession, Order, Product, Collaborator, ChatStatus } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { useLiveHub } from '../hooks/useLiveHub';
import { convertToInputValue } from '../utils/dateUtils';
import LiveSessionList from '../components/LiveSessionList';
import LiveCreateForm from '../components/LiveCreateForm';
import LiveSessionDetail from '../components/LiveSessionDetail';
import PrintTicketsModal from '../components/PrintTicketsModal';
import ManualOrderModal from '../components/ManualOrderModal';

interface LiveShoppingHubPageProps {
  orders: Order[];
  products: Product[];
  collaborators: Collaborator[];
  liveSessions: LiveSession[];
  onAddNewLive: (newSession: LiveSession) => void;
  onUpdateLiveSession: (sessionId: string, updates: Partial<LiveSession>) => void;
  onStartLiveSession: (sessionId: string) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onDeleteOrder: (id: string) => void;
  onSendToDelivery: (orderIds: string[]) => void;
  onAddManualOrder: (
    jpCode: string,
    customerName: string,
    chatStatus: ChatStatus,
    sessionId?: string
  ) => void;
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onEditProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  simulationActive: boolean;
  setSimulationActive: (active: boolean) => void;
  onCloseLiveSession: (sessionId: string) => void;
}

export default function LiveShoppingHubPage({
  orders,
  products,
  collaborators,
  liveSessions,
  onAddNewLive,
  onUpdateLiveSession,
  onStartLiveSession,
  onAddManualOrder,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onCloseLiveSession,
}: LiveShoppingHubPageProps) {
  const hub = useLiveHub();

  const selectedSession = liveSessions.find((s) => s.id === hub.selectedSessionId);
  const activeAndCreatedSessions = liveSessions.filter(
    (s) => s.status === 'En cours' || s.status === 'Créé'
  );
  const completedSessions = liveSessions.filter((s) => s.status === 'Terminé');

  const handleCreateLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hub.liveTitle.trim()) {
      alert("S'il vous plaît, spécifiez un titre pour le direct.");
      return;
    }

    const now = new Date();
    const formattedDate =
      hub.liveDate ||
      now.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
        ' à ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (hub.editingSessionId) {
      onUpdateLiveSession(hub.editingSessionId, {
        title: hub.liveTitle.trim(),
        date: formattedDate,
        connectedPages: hub.selectedPages.length > 0 ? hub.selectedPages : ['AZLive Fashion'],
        assignedCollaborator:
          hub.assignedCollabName || collaborators[0]?.name || 'Responsable Ventes',
        selectedProductIds: hub.selectedProductIds,
      });
      hub.setEditingSessionId(null);
    } else {
      const newSession: LiveSession = {
        id: `live-${Date.now()}`,
        title: hub.liveTitle.trim(),
        date: formattedDate,
        status: 'Créé',
        connectedPages: hub.selectedPages.length > 0 ? hub.selectedPages : ['AZLive Fashion'],
        selectedProductIds: hub.selectedProductIds.length > 0 ? hub.selectedProductIds : [],
        assignedCollaborator:
          hub.assignedCollabName || collaborators[0]?.name || 'Responsable Ventes',
        totalOrders: 0,
        revenue: 0,
        orders: [],
      };
      onAddNewLive(newSession);
    }

    hub.setShowCreateForm(false);
    hub.resetCreateForm();
    playNotificationSound('confirm');
  };

  const handleEditSession = (session: LiveSession) => {
    hub.setEditingSessionId(session.id);
    hub.setLiveTitle(session.title);
    hub.setLiveDate(convertToInputValue(session.date));
    hub.setSelectedPages(session.connectedPages || []);
    hub.setAssignedCollabName(session.assignedCollaborator || '');
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
      hub.selectedSessionId || undefined
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

  const handleCloseSession = () => {
    if (!hub.selectedSessionId) return;
    onCloseLiveSession(hub.selectedSessionId);
    hub.setSelectedSessionId(null);
  };

  return (
    <div className="space-y-6" id="live-shopping-hub-root">
      {!selectedSession ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
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
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-755 hover:to-indigo-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition-all border-none cursor-pointer"
            >
              <PlusCircle className="h-4.5 w-4.5" /> Planifier / Lancer un Live ⚡
            </button>
          </div>

          <AnimatePresence>
            {hub.showCreateForm && (
              <LiveCreateForm
                collaborators={collaborators}
                liveTitle={hub.liveTitle}
                setLiveTitle={hub.setLiveTitle}
                liveDate={hub.liveDate}
                setLiveDate={hub.setLiveDate}
                selectedPages={hub.selectedPages}
                setSelectedPages={hub.setSelectedPages}
                assignedCollabName={hub.assignedCollabName}
                setAssignedCollabName={hub.setAssignedCollabName}
                editingSessionId={hub.editingSessionId}
                onSubmit={handleCreateLive}
                onCancel={hub.resetCreateForm}
              />
            )}
          </AnimatePresence>

          <LiveSessionList
            activeAndCreatedSessions={activeAndCreatedSessions}
            completedSessions={completedSessions}
            orders={orders}
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
          orders={orders}
          products={products}
          onBack={() => {
            hub.setSelectedSessionId(null);
            hub.setSelectedCompletedOrderId(null);
          }}
          onStartLive={() => onStartLiveSession(selectedSession.id)}
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
          onUpdateLiveSession={onUpdateLiveSession}
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

      <AnimatePresence>
        {hub.showPrintModal && selectedSession && (
          <PrintTicketsModal
            selectedSession={selectedSession}
            orders={orders}
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
