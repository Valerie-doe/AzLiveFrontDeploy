import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Order, Product, ChatStatus } from '../types';
import { playNotificationSound } from '../sound';

import LiveStreamBar from '../live-hub/components/LiveStreamBar';
import LiveMetricsRow from '../live-hub/components/LiveMetricsRow';
import OrderQueue from '../live-hub/components/OrderQueue';
import ManualOrderForm from '../live-hub/components/ManualOrderForm';
import ProductDisplayCard from '../live-hub/components/ProductDisplayCard';
import ArchiveModal from '../live-hub/components/ArchiveModal';

interface LiveDashboardProps {
  orders: Order[];
  products: Product[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onAddManualOrder: (jpCode: string, customerName: string, chatStatus: ChatStatus, sessionId?: string) => void;
  simulationActive: boolean;
  setSimulationActive: (active: boolean) => void;
  onArchiveCurrentLive: (title: string) => boolean;
}

export default function LiveDashboard({
  orders,
  products,
  onUpdateOrder,
  onAddManualOrder,
  simulationActive,
  setSimulationActive,
  onArchiveCurrentLive
}: LiveDashboardProps) {
  const [playSound, setPlaySound] = useState<boolean>(true);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  // Basic KPI computations
  const totalJPClaims = orders.length;
  const autoConfirmedCount = orders.filter(o => o.status === 'confirmé').length;
  const confirmationRate = totalJPClaims > 0 ? Math.round((autoConfirmedCount / totalJPClaims) * 100) : 0;
  
  // Total Revenue counting only confirmed orders
  const revenue = orders
    .filter(o => o.status === 'confirmé' || o.status === 'préparé' || o.status === 'en livraison' || o.status === 'livré')
    .reduce((sum, current) => sum + current.price, 0);

  const handleTogglePriority = (id: string, current: boolean) => {
    onUpdateOrder(id, { isPriority: !current });
    if (playSound) playNotificationSound('click');
  };

  const handleTriggerManualReminder = (ord: Order) => {
    if (ord.remindersCount >= 3) {
      setErrorToast("Limite de 3 relances automatiques atteinte pour cette commande !");
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    const nextCount = ord.remindersCount + 1;
    let nextStatus: ChatStatus = 'Relancé x1';
    if (nextCount === 2) nextStatus = 'Relancé x2';
    if (nextCount === 3) nextStatus = 'Relancé x3';

    onUpdateOrder(ord.id, {
      remindersCount: nextCount,
      chatStatus: nextStatus,
      chatMessage: `RAPPEL #${nextCount} 🚨 Bonjour ${ord.customerName}, nous attendons toujours vos coordonnées de livraison pour sécuriser l'article ${ord.productName} (${ord.jpCode}). Répondez vite !`
    });

    if (playSound) playNotificationSound('order');
  };

  const handleUpdateChatStatus = (id: string, nextStatus: ChatStatus) => {
    onUpdateOrder(id, { 
      chatStatus: nextStatus,
      status: nextStatus === 'Confirmé' ? 'confirmé' : 'JP capturé'
    });
    if (playSound) playNotificationSound('confirm');
  };

  const handleSubmitManualOrder = (jpCode: string, customerName: string) => {
    const prod = products.find(p => p.jpCode === jpCode);
    if (!prod) return;

    if (prod.stock <= 0) {
      setErrorToast(`Stock critique épuisé pour ${jpCode} ! Le JP a quand même été enregistré sur liste d'attente.`);
      setTimeout(() => setErrorToast(null), 4050);
    }

    onAddManualOrder(jpCode, customerName, 'En attente');
    if (playSound) playNotificationSound('order');
  };

  const handleConfirmArchive = (title: string) => {
    if (orders.length === 0) {
      setErrorToast("Aucune vente active dans le direct à clore ! Lancez le flux pour capturer des ventes.");
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }
    const succ = onArchiveCurrentLive(title);
    if (succ) {
      setShowArchiveDialog(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dev-live-dashboard">
      
      <div className="lg:col-span-12">
        <LiveStreamBar
          playSound={playSound}
          setPlaySound={setPlaySound}
          simulationActive={simulationActive}
          setSimulationActive={setSimulationActive}
          onOpenArchive={() => setShowArchiveDialog(true)}
        />
      </div>

      {errorToast && (
        <div className="lg:col-span-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2"
          >
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0" />
            <span className="font-semibold">{errorToast}</span>
          </motion.div>
        </div>
      )}

      <div className="lg:col-span-12">
        <LiveMetricsRow
          orders={orders}
          totalJPClaims={totalJPClaims}
          confirmationRate={confirmationRate}
          revenue={revenue}
        />
      </div>

      <div className="lg:col-span-8">
        <OrderQueue
          orders={orders}
          products={products}
          simulationActive={simulationActive}
          onTogglePriority={handleTogglePriority}
          onUpdateChatStatus={handleUpdateChatStatus}
          onTriggerManualReminder={handleTriggerManualReminder}
        />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <ManualOrderForm
          products={products}
          onSubmit={handleSubmitManualOrder}
        />
        <ProductDisplayCard />
      </div>

      <ArchiveModal
        isOpen={showArchiveDialog}
        orderCount={orders.length}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleConfirmArchive}
      />
    </div>
  );
}
