import { useState } from 'react';
import { ChatStatus } from '../../../types';

export function useLiveHub() {
  // Session routing states
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
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
  const [assignedCollabName, setAssignedCollabName] = useState('');

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
    setAssignedCollabName('');
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
    assignedCollabName, setAssignedCollabName,
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
