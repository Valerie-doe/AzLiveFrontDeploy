import { useCallback, useState } from 'react';
import { ChatStatus } from '../../../types';

/** Clé de query-string utilisée pour conserver le live consulté après un refresh. */
const LIVE_URL_PARAM = 'live';

function readLiveIdFromUrl(): string | null {
  try {
    return new URLSearchParams(window.location.search).get(LIVE_URL_PARAM);
  } catch {
    return null;
  }
}

function writeLiveIdToUrl(id: string | null): void {
  try {
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set(LIVE_URL_PARAM, id);
    } else {
      url.searchParams.delete(LIVE_URL_PARAM);
    }
    window.history.replaceState(window.history.state, '', url.toString());
  } catch {
    // Environnement sans History API : on ignore, l'état React reste la source de vérité.
  }
}

export function useLiveHub() {
  // Session routing states
  // Initialisé depuis l'URL pour rester sur le Live consulté après actualisation du navigateur.
  const [selectedSessionId, setSelectedSessionIdState] = useState<string | null>(() =>
    readLiveIdFromUrl(),
  );

  // Toute sélection de Live est répercutée dans l'URL (et inversement au refresh).
  const setSelectedSessionId = useCallback((id: string | null) => {
    setSelectedSessionIdState(id);
    writeLiveIdToUrl(id);
  }, []);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sessionOrdersSearch, setSessionOrdersSearch] = useState('');
  const [liveSubTab, setLiveSubTab] = useState<'orders' | 'products' | 'stock'>('stock');
  const [selectedStockProductIds, setSelectedStockProductIds] = useState<string[]>([]);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);

  // Product editing and adding during live session state
  const [liveEditingProductId, setLiveEditingProductId] = useState<string | null>(null);
  const [liveEditName, setLiveEditName] = useState('');
  const [liveEditJpCode, setLiveEditJpCode] = useState('');
  const [liveEditPrice, setLiveEditPrice] = useState(0);
  const [liveEditStock, setLiveEditStock] = useState(10);
  const [liveEditSize, setLiveEditSize] = useState('Freesize');
  const [liveEditColor, setLiveEditColor] = useState('');
  const [liveIsAddingProduct, setLiveIsAddingProduct] = useState(false);

  // Create live form inputs
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDate, setLiveDate] = useState('');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [assignedCollabId, setAssignedCollabId] = useState('');

  // Quick product add inside create form
  const [showQuickAddProd, setShowQuickAddProd] = useState(false);
  const [quickProd, setQuickProd] = useState({
    name: '', jpCode: '', size: 'M / L', color: 'Noir', price: 35000, stock: 12,
  });

  // Completed lives split detail selection
  const [selectedCompletedOrderId, setSelectedCompletedOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Manual order adding states
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [manualOrderJpCode, setManualOrderJpCode] = useState('');
  const [manualOrderCustomerName, setManualOrderCustomerName] = useState('');
  const [manualOrderChatStatus, setManualOrderChatStatus] = useState<ChatStatus>('En attente');

  // Print filters
  const [printProductFilter, setPrintProductFilter] = useState<string | null>(null);
  const [printOrderFilter, setPrintOrderFilter] = useState<string | null>(null);

  // Pagination states for sub-tables
  const [ordersPage, setOrdersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const resetCreateForm = () => {
    setLiveTitle('');
    setLiveDate('');
    setSelectedPages([]);
    setSelectedProductIds([]);
    setAssignedCollabId('');
    setEditingSessionId(null);
  };

  return {
    selectedSessionId, setSelectedSessionId,
    showCreateForm, setShowCreateForm,
    sessionOrdersSearch, setSessionOrdersSearch,
    liveSubTab, setLiveSubTab,
    selectedStockProductIds, setSelectedStockProductIds,
    stockSearchQuery, setStockSearchQuery,
    editingSessionId, setEditingSessionId,
    liveEditingProductId, setLiveEditingProductId,
    liveEditName, setLiveEditName,
    liveEditJpCode, setLiveEditJpCode,
    liveEditPrice, setLiveEditPrice,
    liveEditStock, setLiveEditStock,
    liveEditSize, setLiveEditSize,
    liveEditColor, setLiveEditColor,
    liveIsAddingProduct, setLiveIsAddingProduct,
    liveTitle, setLiveTitle,
    liveDate, setLiveDate,
    selectedPages, setSelectedPages,
    selectedProductIds, setSelectedProductIds,
    assignedCollabId, setAssignedCollabId,
    showQuickAddProd, setShowQuickAddProd,
    quickProd, setQuickProd,
    selectedCompletedOrderId, setSelectedCompletedOrderId,
    copiedOrderId, setCopiedOrderId,
    showPrintModal, setShowPrintModal,
    showManualOrderModal, setShowManualOrderModal,
    manualOrderJpCode, setManualOrderJpCode,
    manualOrderCustomerName, setManualOrderCustomerName,
    manualOrderChatStatus, setManualOrderChatStatus,
    printProductFilter, setPrintProductFilter,
    printOrderFilter, setPrintOrderFilter,
    ordersPage, setOrdersPage,
    productsPage, setProductsPage,
    ITEMS_PER_PAGE,
    resetCreateForm,
  };
}
