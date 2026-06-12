import React from 'react';
import { AnimatePresence } from 'motion/react';
import { Tv, Loader } from 'lucide-react';
import { Order, Product, ChatStatus } from '../../../types';
import OrderCard from './OrderCard';

interface OrderQueueProps {
  orders: Order[];
  products: Product[];
  simulationActive: boolean;
  onTogglePriority: (id: string, current: boolean) => void;
  onUpdateChatStatus: (id: string, nextStatus: ChatStatus) => void;
  onTriggerManualReminder: (ord: Order) => void;
}

export default function OrderQueue({
  orders,
  products,
  simulationActive,
  onTogglePriority,
  onUpdateChatStatus,
  onTriggerManualReminder
}: OrderQueueProps) {
  // Group orders by JP code to monitor stock and priority queue positions
  const jpMap = new Map<string, Order[]>();
  orders.forEach(ord => {
    if (!jpMap.has(ord.jpCode)) {
      jpMap.set(ord.jpCode, []);
    }
    jpMap.get(ord.jpCode)!.push(ord);
  });

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-1.5">
            <Tv className="h-5 w-5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
            Capture en Direct & File d'Attente
          </h3>
          <p className="text-xs text-slate-400 font-serif">Association intelligente du client par ordre de commentaire.</p>
        </div>
        {simulationActive && (
          <span className="bg-rose-150 inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono px-3 py-1 rounded-full font-bold">
            <Loader className="h-3 w-3 animate-spin text-rose-600" /> RECHERCHE EN DIRECT...
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
          <Tv className="h-14 w-14 text-slate-300 stroke-1 mb-2 animate-bounce" />
          <h4 className="font-extrabold text-slate-700">Aucun commentaire de JP capturé</h4>
          <p className="text-xs max-w-sm mt-1">
            Activez la simulation de vente en haut à droite pour voir les cyber-acheteurs malgaches commenter "JP1" ou "Je prends JP2" et s'insérer automatiquement !
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {orders.map((ord) => {
              const sameKeyJPList = jpMap.get(ord.jpCode) || [];
              const positionInQueue = sameKeyJPList.findIndex(x => x.id === ord.id) + 1;
              const jpProduct = products.find(p => p.jpCode === ord.jpCode);
              const isOutOfStock = jpProduct ? (jpProduct.stock < positionInQueue) : false;

              return (
                <OrderCard
                  key={ord.id}
                  ord={ord}
                  positionInQueue={positionInQueue}
                  isOutOfStock={isOutOfStock}
                  onTogglePriority={onTogglePriority}
                  onUpdateChatStatus={onUpdateChatStatus}
                  onTriggerManualReminder={onTriggerManualReminder}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
