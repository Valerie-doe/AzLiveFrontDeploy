import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { playNotificationSound } from '../sound';

import OrdersToolbar from './orders/OrdersToolbar';
import OrdersTable from './orders/OrdersTable';
import UploadModal from './orders/UploadModal';
import DeliveryModal from './orders/DeliveryModal';

interface OrdersPageProps {
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onDeleteOrder: (id: string) => void;
  onSendToDelivery: (orderIds: string[]) => void;
}

export default function OrdersPage({
  orders,
  onUpdateOrder,
  onDeleteOrder,
  onSendToDelivery
}: OrdersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedUploadOrderId, setSelectedUploadOrderId] = useState<string | null>(null);

  // Filters (Global Search compatibility)
  const filteredOrders = orders.filter(o => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      o.customerName.toLowerCase().includes(query) ||
      o.customerPhone.includes(query) ||
      o.customerHandle.toLowerCase().includes(query) ||
      o.productName.toLowerCase().includes(query) ||
      o.jpCode.toLowerCase().includes(query) ||
      o.id.toLowerCase().includes(query)
    );
  });

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    onUpdateOrder(id, { 
      status: newStatus,
      ...(newStatus === 'en livraison' ? { sentToDelivery: true, deliveryStatus: 'en livraison' } : {}),
      ...(newStatus === 'livré' ? { deliveryStatus: 'livré' } : {})
    });
    playNotificationSound('confirm');
  };

  const handleToggleSelect = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter(i => i !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
    playNotificationSound('click');
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
    playNotificationSound('click');
  };

  const handleLaunchAZExpress = () => {
    if (selectedOrderIds.length === 0) {
      alert("Veuillez cocher au moins une commande à envoyer au livreur AZExpress.");
      return;
    }
    setShowDeliveryModal(true);
    playNotificationSound('click');
  };

  const handleConfirmAZExpressFulfillment = () => {
    onSendToDelivery(selectedOrderIds);
    selectedOrderIds.forEach(id => {
      onUpdateOrder(id, { 
        status: 'en livraison',
        sentToDelivery: true,
        deliveryStatus: 'en livraison'
      });
    });
    setShowDeliveryModal(false);
    setSelectedOrderIds([]);
    playNotificationSound('delivery');
  };

  const handleSimulateScreenshotUpload = (orderId: string, serviceName: string) => {
    const simulatedUrls = {
      'Mvola': 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=60',
      'Orange Money': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60',
      'Airtel Money': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=60'
    };
    
    onUpdateOrder(orderId, {
      paymentType: 'Mobile Money',
      isPaid: true,
      mobileMoneyScreenshot: simulatedUrls[serviceName as keyof typeof simulatedUrls],
      status: 'préparé' // Auto-advance to prepared/ready status
    });
    setSelectedUploadOrderId(null);
    playNotificationSound('confirm');
  };

  const handleMarkAsPaid = (orderId: string) => {
    onUpdateOrder(orderId, { isPaid: true, status: 'préparé' });
    playNotificationSound('confirm');
  };

  return (
    <div className="space-y-6" id="orders-lifecycle-hub">
      
      {/* PANEL TITLES */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 font-sans">Suivi des Commandes & Paiements</h2>
          <p className="text-sm text-slate-500 font-serif">
            Gérez facilement vos acheteurs, validez les reçus Mobile Money (Mvola / Orange / Airtel) et envoyez aux livreurs AZExpress.
          </p>
        </div>
      </div>

      <OrdersToolbar
        searchQuery={searchQuery}
        onSearchChange={(query) => { setSearchQuery(query); setCurrentPage(1); }}
        selectedCount={selectedOrderIds.length}
        onLaunchAZExpress={handleLaunchAZExpress}
      />

      <OrdersTable
        orders={filteredOrders}
        selectedOrderIds={selectedOrderIds}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
        onUpdateStatus={handleUpdateStatus}
        onDeleteOrder={onDeleteOrder}
        onPageChange={setCurrentPage}
        onOpenUploadModal={setSelectedUploadOrderId}
        onMarkAsPaid={handleMarkAsPaid}
      />

      <UploadModal
        orderId={selectedUploadOrderId}
        onClose={() => setSelectedUploadOrderId(null)}
        onSimulateUpload={handleSimulateScreenshotUpload}
      />

      <DeliveryModal
        isOpen={showDeliveryModal}
        selectedCount={selectedOrderIds.length}
        onClose={() => setShowDeliveryModal(false)}
        onConfirm={handleConfirmAZExpressFulfillment}
      />

    </div>
  );
}
