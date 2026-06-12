import React from 'react';
import { Printer, Plus } from 'lucide-react';
import { LiveSession, Order } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { SearchInput, PaginationControls } from '../../../shared';
import LiveOrderDetailPanel from './LiveOrderDetailPanel';

interface LiveOrdersTabProps {
  selectedSession: LiveSession;
  orders: Order[];
  sessionOrdersSearch: string;
  setSessionOrdersSearch: (val: string) => void;
  ordersPage: number;
  setOrdersPage: (page: number) => void;
  selectedCompletedOrderId: string | null;
  setSelectedCompletedOrderId: (id: string | null) => void;
  copiedOrderId: string | null;
  onCopySummary: (order: Order) => void;
  onPrintAll: () => void;
  onPrintSingle: (orderId: string) => void;
  onAddManualOrder: () => void;
}

export default function LiveOrdersTab({
  selectedSession,
  orders,
  sessionOrdersSearch,
  setSessionOrdersSearch,
  ordersPage,
  setOrdersPage,
  selectedCompletedOrderId,
  setSelectedCompletedOrderId,
  copiedOrderId,
  onCopySummary,
  onPrintAll,
  onPrintSingle,
  onAddManualOrder,
}: LiveOrdersTabProps) {
  const sessionOrders =
    selectedSession.status === 'En cours' || selectedSession.status === 'Créé'
      ? orders
      : selectedSession.orders || [];

  const filteredSessionOrders = sessionOrders.filter((ord) => {
    const q = sessionOrdersSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      ord.customerName.toLowerCase().includes(q) ||
      (ord.customerPhone && ord.customerPhone.includes(q)) ||
      (ord.customerHandle && ord.customerHandle.toLowerCase().includes(q)) ||
      ord.jpCode.toLowerCase().includes(q) ||
      ord.productName.toLowerCase().includes(q)
    );
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'livré':
        return 'bg-emerald-50 text-emerald-800 border-emerald-250';
      case 'annulé':
        return 'bg-rose-50 text-rose-800 border-rose-250';
      case 'confirmé':
        return 'bg-indigo-50 text-indigo-800 border-indigo-250';
      case 'en livraison':
        return 'bg-amber-50 text-amber-800 border-amber-250';
      case 'préparé':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredSessionOrders.length / ITEMS_PER_PAGE);
  const activePage = Math.min(ordersPage, Math.max(1, totalPages));
  const displayedOrders = filteredSessionOrders.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const selectedOrder =
    filteredSessionOrders.find((o) => o.id === selectedCompletedOrderId) ||
    filteredSessionOrders[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="completed-live-split-panel">
      {/* LEFT COLUMN: LIST OF COMMANDE CARDS AND SEARCH BAR (Master) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-8">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 font-mono">
              Commandes de ce direct ({sessionOrders.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                onPrintAll();
                playNotificationSound('click');
              }}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-850 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition-all border border-indigo-100 cursor-pointer whitespace-nowrap"
              title="Imprimer tous les tickets thermiques pour ce direct"
            >
              <Printer className="h-3 w-3" /> Imprimer tout
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {(selectedSession.status === 'En cours' || selectedSession.status === 'Terminé') && (
              <button
                type="button"
                onClick={() => {
                  onAddManualOrder();
                  playNotificationSound('click');
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-705 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-all whitespace-nowrap border-none"
              >
                <Plus className="h-3 w-3" /> Ajouter commande
              </button>
            )}

            <SearchInput
              value={sessionOrdersSearch}
              onChange={(val) => {
                setSessionOrdersSearch(val);
                setOrdersPage(1);
              }}
              className="min-w-[200px] sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-650 font-sans">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Code JP</th>
                <th className="py-3 px-5">Produit</th>
                <th className="py-3 px-5">Heure</th>
                <th className="py-3 px-5 text-center">Règlement</th>
                <th className="py-3 px-5 text-center">Statut Commande</th>
                <th className="py-3 px-5 text-right">Montant</th>
                <th className="py-3 px-5 text-center">Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSessionOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                    Aucune commande trouvée pour ce live.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-50/20 font-bold' : ''
                      }`}
                      onClick={() => {
                        setSelectedCompletedOrderId(ord.id);
                        playNotificationSound('click');
                      }}
                    >
                      <td className="py-3.5 px-5">
                        <div className="font-extrabold text-slate-900">{ord.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{ord.customerHandle}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                          {ord.jpCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 font-medium">{ord.productName}</td>
                      <td className="py-3.5 px-5 font-mono text-slate-500">{ord.orderTime}</td>
                      <td className="py-3.5 px-5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            ord.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ord.isPaid ? 'PAYÉ' : 'ATTENTE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span
                          className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-black text-indigo-600 font-sans">
                        {ord.price.toLocaleString()} Ar
                      </td>
                      <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            onPrintSingle(ord.id);
                            playNotificationSound('click');
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-indigo-700 hover:text-white hover:bg-indigo-650 hover:bg-indigo-600 rounded-lg border border-slate-200 transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                          title="Imprimer ce ticket thermique"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={activePage}
          totalItems={filteredSessionOrders.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setOrdersPage}
          itemLabel="fiches"
        />
      </div>

      {/* RIGHT COLUMN: DETAIL VIEWER WITH ALL FIELDS & ACTION SLIDERS */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm min-h-[580px] flex flex-col justify-between">
        <LiveOrderDetailPanel
          ord={selectedOrder}
          copiedOrderId={copiedOrderId}
          onCopySummary={onCopySummary}
          onPrintClick={onPrintSingle}
        />
      </div>
    </div>
  );
}
