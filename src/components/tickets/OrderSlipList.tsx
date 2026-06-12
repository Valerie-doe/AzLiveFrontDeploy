import React from 'react';
import { Order } from '../../types';
import { playNotificationSound } from '../../sound';

interface OrderSlipListProps {
  orders: Order[];
  selectedOrderId: string | null;
  printedStatusMap: Record<string, boolean>;
  prepChecklists: Record<string, { read: boolean; picked: boolean; packed: boolean }>;
  onSelectOrder: (id: string) => void;
}

export default function OrderSlipList({
  orders,
  selectedOrderId,
  printedStatusMap,
  prepChecklists,
  onSelectOrder
}: OrderSlipListProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <div>
        <h2 className="text-xl font-black text-slate-900">Spool des Tickets Thermiques</h2>
        <p className="text-xs text-slate-500 mt-1 font-serif">
          Pilotez l'impression des fiches longues "Secrétariat". Découpez puis insérez directement dans l'emballage colis de vos cyber-acheteurs.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-2 max-h-[500px] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            Aucune commande enregistrée pour l'impression de ticket.
          </div>
        ) : (
          orders.map(o => {
            const isPrinted = printedStatusMap[o.id] || false;
            const chk = prepChecklists[o.id] || { read: false, picked: false, packed: false };
            const isFullyPrepared = chk.read && chk.picked && chk.packed;

            return (
              <div
                key={o.id}
                onClick={() => {
                  onSelectOrder(o.id);
                  playNotificationSound('click');
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  selectedOrderId === o.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-mono text-[10px] font-black px-1.5 py-0.2 rounded ${
                      selectedOrderId === o.id ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
                    }`}>
                      {o.jpCode}
                    </span>
                    <span className="font-extrabold truncate text-xs">
                      {o.customerName}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-80 mt-1 truncate">
                    {o.productName} • {o.price.toLocaleString()} Ar
                  </p>
                </div>

                <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
                  {isFullyPrepared ? (
                    <span className="text-[9px] bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded uppercase">
                      Prêt Colis
                    </span>
                  ) : isPrinted ? (
                    <span className="text-[9px] bg-indigo-500 text-white font-mono font-bold px-2 py-0.5 rounded uppercase">
                      Imprimé
                    </span>
                  ) : (
                    <span className="text-[9px] bg-amber-500 text-white font-mono font-bold px-2 py-0.5 rounded uppercase animate-pulse">
                      En attente
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
