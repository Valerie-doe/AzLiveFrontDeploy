import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from '../../types';
import { playNotificationSound } from '../../sound';

interface ParcelListProps {
  orders: Order[];
  selectedOrderId: string | null;
  currentPage: number;
  itemsPerPage: number;
  onSelectOrder: (id: string) => void;
  onToggleSentToDelivery: (id: string, current: boolean) => void;
  onPageChange: (page: number) => void;
}

export default function ParcelList({
  orders,
  selectedOrderId,
  currentPage,
  itemsPerPage,
  onSelectOrder,
  onToggleSentToDelivery,
  onPageChange
}: ParcelListProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <div>
        <h2 className="text-xl font-black text-slate-900">Suivi Descentes AZExpress</h2>
        <p className="text-xs text-slate-500 mt-1 font-serif">
          Suivez en temps réel les colis confiés aux livreurs à Antananarivo (Itaosy, Ivato, Analakely, Ankorondrano).
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-slate-400 font-mono text-xs">Aucun colis enregistré.</p>
        ) : (
          (() => {
            const totalPages = Math.ceil(orders.length / itemsPerPage);
            const activePage = Math.min(currentPage, Math.max(1, totalPages));
            const displayedOrders = orders.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

            return displayedOrders.map(o => {
              const isActiveTransit = o.sentToDelivery;
              return (
                <div
                  key={o.id}
                  onClick={() => {
                    onSelectOrder(o.id);
                    playNotificationSound('click');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col gap-2.5 ${
                    selectedOrderId === o.id
                      ? 'border-indigo-600 bg-indigo-50/10'
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-200 px-2 py-0.5 rounded">
                      Ref: {o.jpCode}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black ${
                      isActiveTransit 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-650'
                    }`}>
                      {isActiveTransit ? '🚀 AZExpress' : '🏠 Attente dressing'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{o.customerName}</h4>
                    <span className="text-[10px] text-slate-400 truncate block mt-0.5">Dest: {o.deliveryAddress || 'Adresse en cours de saisie'}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                      Étape : {o.deliveryStatus}
                    </span>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSentToDelivery(o.id, o.sentToDelivery);
                      }}
                      className="text-[10px] bg-white border border-slate-200 shadow-xs px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 font-extrabold cursor-pointer"
                    >
                      {o.sentToDelivery ? "Retirer d'AZ" : "Expédier AZExpress"}
                    </button>
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {orders.length > itemsPerPage && (
        <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            colis {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, orders.length)} / {orders.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-0.5"
            >
              <ChevronLeft className="h-3 w-3" /> Précédent
            </button>
            <button
              disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}
              onClick={() => onPageChange(Math.min(Math.ceil(orders.length / itemsPerPage), currentPage + 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-0.5"
            >
              Suivant <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
