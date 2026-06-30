import React, { useState } from 'react';
import { Order, DeliveryStatus } from '../types';
import { playNotificationSound } from '../sound';

import DeliveryTimeline from './tracking/DeliveryTimeline';
import CallSimulatorModal from './tracking/CallSimulatorModal';
import TrackingCallControls from './tracking/TrackingCallControls';
import ParcelList from './tracking/ParcelList';

interface TrackingPageProps {
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

export default function TrackingPage({
  orders,
  onUpdateOrder
}: TrackingPageProps) {
  // Filter active delivery orders
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Call simulation modal states
  const [activeCallSim, setActiveCallSim] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientRole: 'Acheteur' | 'Livreur AZExpress' | 'Vendeur (Boutique)';
    phoneNumber: string;
  } | null>(null);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Advance dispatch milestone logic (Point 12 status flow)
  const handleAdvanceDeliveryStep = (ordId: string, currentStep: DeliveryStatus) => {
    let nextStep: DeliveryStatus = 'au bureau';
    let nextOrderStatus = selectedOrder?.status || 'préparé';

    if (currentStep === 'au bureau') {
      nextStep = 'en préparation';
      nextOrderStatus = 'préparé';
    } else if (currentStep === 'en préparation') {
      nextStep = 'assigné livreur';
      nextOrderStatus = 'en livraison';
    } else if (currentStep === 'assigné livreur') {
      nextStep = 'en livraison';
      nextOrderStatus = 'en livraison';
    } else if (currentStep === 'en livraison') {
      nextStep = 'livré';
      nextOrderStatus = 'livré';
    } else {
      nextStep = 'au bureau';
      nextOrderStatus = 'confirmé';
    }

    onUpdateOrder(ordId, { 
      deliveryStatus: nextStep,
      status: nextOrderStatus as any
    });
    playNotificationSound('confirm');
  };

  const handleToggleSentToDelivery = (ordId: string, current: boolean) => {
    onUpdateOrder(ordId, { 
      sentToDelivery: !current,
      // Default to "au bureau" on dispatch
      deliveryStatus: current ? 'au bureau' : 'au bureau'
    });
    playNotificationSound('click');
  };

  // Launch simulated phone call modal representing GSM audio connection (Point 12)
  const handleTriggerSimulatedCall = (name: string, role: typeof activeCallSim['recipientRole'], phone: string) => {
    setActiveCallSim({
      isOpen: true,
      recipientName: name,
      recipientRole: role,
      phoneNumber: phone
    });
    playNotificationSound('click');
  };

  // Milestones helper in French
  const steps: { label: DeliveryStatus; title: string; desc: string }[] = [
    { label: 'au bureau', title: 'Colis enregistré (au bureau)', desc: 'Le secrétaire a spoolé le manifeste digital' },
    { label: 'en préparation', title: 'En cours de préparation', desc: 'Sachet scellé et étiquette JP solidement scotchée' },
    { label: 'assigné livreur', title: 'Coursier assigné', desc: 'Rider AZExpress dépêché à l\'entrepôt central' },
    { label: 'en livraison', title: 'En cours de livraison', desc: 'Motocyclette en transit dans les rues de Tana' },
    { label: 'livré', title: 'Colis livré & Encaissé', desc: 'Arrivé à destination. Liquide perçu ou Mobile Money validé' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="tracking-system-panel">
      
      <ParcelList
        orders={orders}
        selectedOrderId={selectedOrderId}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        onSelectOrder={setSelectedOrderId}
        onToggleSentToDelivery={handleToggleSentToDelivery}
        onPageChange={setCurrentPage}
      />

      {/* RIGHT PANEL: CHRONOLOGY AND QUICK CALLS PHONE TRIGGERS (Point 12) */}
      <div className="lg:col-span-7">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
          📍 Terminal de Tracking GPS de la Flotte
        </h3>

        {selectedOrder ? (
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            
            {/* Courier specs & calling tools */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-slate-50 p-4 rounded-2xl gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-black block">Numéro de récépissé</span>
                <span className="font-bold text-base text-slate-950 font-mono">
                  MADA-AZ-{selectedOrder.id.toUpperCase()}
                </span>
                <p className="text-xs text-slate-500 mt-1 font-serif">
                  Acheteur : <strong className="text-slate-800 font-sans font-extrabold">{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone || 'Pas de numéro'})
                </p>
                <div className="mt-2 text-[10px] text-slate-500">
                  Adresse de livraison: <span className="font-semibold text-slate-800">{selectedOrder.deliveryAddress}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-left md:text-right flex flex-col items-start md:items-end justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-black block">Status Colis</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-sans font-bold bg-amber-100 text-amber-900">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span> 
                  {selectedOrder.deliveryStatus}
                </span>
              </div>
            </div>

            <TrackingCallControls
              onCallVendor={() => handleTriggerSimulatedCall('Secrétaire Live AZLive', 'Vendeur (Boutique)', '034 99 123 00')}
              onCallRider={() => handleTriggerSimulatedCall('Rino (Coursier AZExpress Tana)', 'Livreur AZExpress', '032 55 987 65')}
              onCallCustomer={() => handleTriggerSimulatedCall(selectedOrder.customerName, 'Acheteur', selectedOrder.customerPhone || '033 11 222 33')}
              isCustomerPhoneAvailable={!!selectedOrder.customerPhone}
            />

            <DeliveryTimeline order={selectedOrder} steps={steps} />

            {/* GPS Telemetry manual step advancer */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-slate-450 font-serif">
                *Simulateur : Avancez manuellement les coordonnées GPS pour tester la synchronisation d'AZExpress.
              </span>
              <button
                type="button"
                onClick={() => handleAdvanceDeliveryStep(selectedOrder.id, selectedOrder.deliveryStatus)}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 border border-indigo-200 transition-all self-end cursor-pointer"
              >
                Étape Suivante Coursier ➔
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed rounded-3xl text-slate-400 text-xs">
            Aucun traçage de colis actif. Assignez un expéditeur pour afficher son cockpit.
          </div>
        )}
      </div>

      <CallSimulatorModal
        isOpen={activeCallSim?.isOpen || false}
        recipientName={activeCallSim?.recipientName || ''}
        recipientRole={activeCallSim?.recipientRole || ''}
        phoneNumber={activeCallSim?.phoneNumber || ''}
        onClose={() => setActiveCallSim(null)}
      />

    </div>
  );
}
