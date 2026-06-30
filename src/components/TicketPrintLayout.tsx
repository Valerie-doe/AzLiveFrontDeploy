import React, { useState } from 'react';
import { Order } from '../types';
import { playNotificationSound } from '../sound';

import OrderSlipList from './tickets/OrderSlipList';
import ThermalSlipPreview from './tickets/ThermalSlipPreview';
import PreparationChecklist from './tickets/PreparationChecklist';

interface TicketPrintLayoutProps {
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

export default function TicketPrintLayout({
  orders,
  onUpdateOrder
}: TicketPrintLayoutProps) {
  // Select which slip is active in thermal view
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);

  // Printed stamps
  const [printedStatusMap, setPrintedStatusMap] = useState<Record<string, boolean>>({});

  // Point 10 Checklist states per order (saved locally in UI state)
  const [prepChecklists, setPrepChecklists] = useState<Record<string, { read: boolean; picked: boolean; packed: boolean }>>({});

  const handleMarkPrinted = (id: string) => {
    setPrintedStatusMap(prev => ({ ...prev, [id]: true }));
    // Also mark the order itself as 'préparé' automatically if needed, or advanced
    onUpdateOrder(id, { status: 'préparé' });
    playNotificationSound('confirm');
  };

  const handleToggleChecklist = (orderId: string, flag: 'read' | 'picked' | 'packed') => {
    const current = prepChecklists[orderId] || { read: false, picked: false, packed: false };
    const next = { ...current, [flag]: !current[flag] };
    setPrepChecklists(prev => ({ ...prev, [orderId]: next }));
    playNotificationSound('click');

    // If fully packed, let's auto advance status to prepared
    if (next.read && next.picked && next.packed) {
      onUpdateOrder(orderId, { status: 'préparé' });
    }
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const selectedChecklist = selectedOrder ? (prepChecklists[selectedOrder.id] || { read: false, picked: false, packed: false }) : { read: false, picked: false, packed: false };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="ticket-print-panel">
      
      <OrderSlipList
        orders={orders}
        selectedOrderId={selectedOrderId}
        printedStatusMap={printedStatusMap}
        prepChecklists={prepChecklists}
        onSelectOrder={setSelectedOrderId}
      />

      {/* RIGHT PREVIEW SCREEN representing thermal slip paper (COL SPAN 7) */}
      <div className="lg:col-span-7 space-y-6" id="thermal-slips-previewer">
        
        {selectedOrder ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            <ThermalSlipPreview 
              order={selectedOrder}
              isPrinted={printedStatusMap[selectedOrder.id] || false}
            />

            <PreparationChecklist
              orderId={selectedOrder.id}
              jpCode={selectedOrder.jpCode}
              checklist={selectedChecklist}
              onToggleChecklist={handleToggleChecklist}
              onMarkPrinted={handleMarkPrinted}
            />

          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed rounded-3xl text-slate-400 text-xs">
            Sélectionnez une commande dans la liste à gauche pour émuler son ticket de caisse et sa fiche de préparation.
          </div>
        )}
      </div>

    </div>
  );
}
