import React from 'react';
import { Tv } from 'lucide-react';
import { LiveSession, Order, Product } from '../../../types';
import LiveSessionHeader from './LiveSessionHeader';
import LiveSessionStats from './LiveSessionStats';
import LiveSubTabs from './LiveSubTabs';
import LiveOrdersTab from './LiveOrdersTab';
import LiveProductsTab from './LiveProductsTab';
import LiveStockTab from './LiveStockTab';

interface LiveSessionDetailProps {
  selectedSession: LiveSession;
  orders: Order[];
  products: Product[];
  onBack: () => void;
  onStartLive: () => void;
  onCloseLive: () => void;
  onPrintTickets: () => void;
  sessionOrdersSearch: string;
  setSessionOrdersSearch: (val: string) => void;
  liveSubTab: 'orders' | 'products' | 'stock';
  setLiveSubTab: (tab: 'orders' | 'products' | 'stock') => void;
  selectedStockProductIds: string[];
  setSelectedStockProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  stockSearchQuery: string;
  setStockSearchQuery: (val: string) => void;
  onAddToDressing: (sessionId: string, productIds: string[]) => Promise<void>;
  onRemoveFromDressing: (productId: string) => Promise<void>;
  dressingSaving?: boolean;
  ordersPage: number;
  setOrdersPage: (page: number) => void;
  productsPage: number;
  setProductsPage: (page: number) => void;
  selectedCompletedOrderId: string | null;
  setSelectedCompletedOrderId: (id: string | null) => void;
  copiedOrderId: string | null;
  onCopySummary: (order: Order) => void;
  onPrintAllOrders: () => void;
  onPrintSingleOrder: (orderId: string) => void;
  onAddManualOrderClick: () => void;
  // products form states
  liveEditingProductId: string | null;
  setLiveEditingProductId: (id: string | null) => void;
  liveEditName: string;
  setLiveEditName: (val: string) => void;
  liveEditJpCode: string;
  setLiveEditJpCode: (val: string) => void;
  liveEditPrice: number;
  setLiveEditPrice: (val: number) => void;
  liveEditStock: number;
  setLiveEditStock: (val: number) => void;
  liveEditSize: string;
  setLiveEditSize: (val: string) => void;
  liveEditColor: string;
  setLiveEditColor: (val: string) => void;
  liveIsAddingProduct: boolean;
  setLiveIsAddingProduct: (val: boolean) => void;
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onEditProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onPrintProductClick: (jpCode: string) => void;
}

export default function LiveSessionDetail({
  selectedSession,
  orders,
  products,
  onBack,
  onStartLive,
  onCloseLive,
  onPrintTickets,
  sessionOrdersSearch,
  setSessionOrdersSearch,
  liveSubTab,
  setLiveSubTab,
  selectedStockProductIds,
  setSelectedStockProductIds,
  stockSearchQuery,
  setStockSearchQuery,
  onAddToDressing,
  onRemoveFromDressing,
  dressingSaving = false,
  ordersPage,
  setOrdersPage,
  productsPage,
  setProductsPage,
  selectedCompletedOrderId,
  setSelectedCompletedOrderId,
  copiedOrderId,
  onCopySummary,
  onPrintAllOrders,
  onPrintSingleOrder,
  onAddManualOrderClick,
  liveEditingProductId,
  setLiveEditingProductId,
  liveEditName,
  setLiveEditName,
  liveEditJpCode,
  setLiveEditJpCode,
  liveEditPrice,
  setLiveEditPrice,
  liveEditStock,
  setLiveEditStock,
  liveEditSize,
  setLiveEditSize,
  liveEditColor,
  setLiveEditColor,
  liveIsAddingProduct,
  setLiveIsAddingProduct,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onPrintProductClick,
}: LiveSessionDetailProps) {
  // Les commandes réelles (backend) sont fournies via `orders` pour TOUS les statuts,
  // y compris « Terminé » : l'historique reste consultable après la fin du live.
  // `selectedSession.orders` (lives locaux/démo) sert de repli si aucune donnée backend.
  const sessionOrders = orders.length > 0 ? orders : selectedSession.orders || [];

  const activeProductsCount = products.filter((p) =>
    selectedSession.selectedProductIds?.includes(p.id)
  ).length;

  return (
    <div className="space-y-6">
      <LiveSessionHeader
        selectedSession={selectedSession}
        onBack={onBack}
        onStartLive={onStartLive}
        onCloseLive={onCloseLive}
        onPrintTickets={onPrintTickets}
      />

      <LiveSessionStats sessionOrders={sessionOrders} />

      <LiveSubTabs
        activeTab={liveSubTab}
        ordersCount={sessionOrders.length}
        productsCount={activeProductsCount}
        allProductsCount={products.length}
        onTabChange={setLiveSubTab}
      />

      {liveSubTab === 'orders' &&
        (selectedSession.status === 'Créé' ? (
          <div className="bg-white rounded-3xl border border-indigo-100 p-12 text-center shadow-sm">
            <div className="mx-auto w-16 h-16 bg-indigo-50/50 text-indigo-650 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Tv className="h-8 w-8 animate-pulse" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base mb-2">
              Le Live n'est pas encore lancé
            </h4>
            <p className="text-slate-500 text-xs max-w-md mx-auto mb-6 leading-relaxed">
              Ce livestream n'est pas actif actuellement. Dès que vous cliquez sur le bouton{' '}
              <span className="font-extrabold text-indigo-600">"Lancer le Live 🚀"</span>, le
              robot commencera à détecter les commentaires clients et à générer les fiches de
              commande en temps réel.
            </p>
            <button
              onClick={onStartLive}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-705 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer shadow-md inline-flex items-center gap-2 border-none"
            >
              Lancer le Live maintenant 🚀
            </button>
          </div>
        ) : (
          <LiveOrdersTab
            selectedSession={selectedSession}
            orders={orders}
            sessionOrdersSearch={sessionOrdersSearch}
            setSessionOrdersSearch={setSessionOrdersSearch}
            ordersPage={ordersPage}
            setOrdersPage={setOrdersPage}
            selectedCompletedOrderId={selectedCompletedOrderId}
            setSelectedCompletedOrderId={setSelectedCompletedOrderId}
            copiedOrderId={copiedOrderId}
            onCopySummary={onCopySummary}
            onPrintAll={onPrintAllOrders}
            onPrintSingle={onPrintSingleOrder}
            onAddManualOrder={onAddManualOrderClick}
          />
        ))}

      {liveSubTab === 'products' && (
        <LiveProductsTab
          selectedSession={selectedSession}
          products={products}
          sessionOrders={sessionOrders}
          productsPage={productsPage}
          setProductsPage={setProductsPage}
          liveEditingProductId={liveEditingProductId}
          setLiveEditingProductId={setLiveEditingProductId}
          liveEditName={liveEditName}
          setLiveEditName={setLiveEditName}
          liveEditJpCode={liveEditJpCode}
          setLiveEditJpCode={setLiveEditJpCode}
          liveEditPrice={liveEditPrice}
          setLiveEditPrice={setLiveEditPrice}
          liveEditStock={liveEditStock}
          setLiveEditStock={setLiveEditStock}
          liveEditSize={liveEditSize}
          setLiveEditSize={setLiveEditSize}
          liveEditColor={liveEditColor}
          setLiveEditColor={setLiveEditColor}
          liveIsAddingProduct={liveIsAddingProduct}
          setLiveIsAddingProduct={setLiveIsAddingProduct}
          onAddProduct={onAddProduct}
          onEditProduct={onEditProduct}
          onRemoveFromDressing={onRemoveFromDressing}
          onPrintProductClick={onPrintProductClick}
          onPrintAll={onPrintAllOrders}
        />
      )}

      {liveSubTab === 'stock' && (
        <LiveStockTab
          selectedSession={selectedSession}
          products={products}
          selectedStockProductIds={selectedStockProductIds}
          setSelectedStockProductIds={setSelectedStockProductIds}
          stockSearchQuery={stockSearchQuery}
          setStockSearchQuery={setStockSearchQuery}
          onAddToDressing={onAddToDressing}
          dressingSaving={dressingSaving}
          onTabChange={setLiveSubTab}
        />
      )}
    </div>
  );
}
