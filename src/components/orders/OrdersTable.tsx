import React from 'react';
import { Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { playNotificationSound } from '../../sound';

interface OrdersTableProps {
  orders: Order[];
  selectedOrderIds: string[];
  currentPage: number;
  itemsPerPage: number;
  onSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  onPageChange: (page: number) => void;
  onOpenUploadModal: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
}

const statuses: OrderStatus[] = ['JP capturé', 'confirmé', 'préparé', 'en livraison', 'livré', 'annulé'];

const getStatusLabelSimple = (status: OrderStatus): string => {
  switch (status) {
    case 'JP capturé':
      return '1. Nouveau JP (En attente)';
    case 'confirmé':
      return '2. Coordonnées OK (Attente Paiement)';
    case 'préparé':
      return '3. Payé & Colis Préparé';
    case 'en livraison':
      return '4. Remis au livreur';
    case 'livré':
      return '5. Livré chez l\'acheteur ✅';
    case 'annulé':
      return '❌ Annulé (Non payé)';
    default:
      return status;
  }
};

export default function OrdersTable({
  orders,
  selectedOrderIds,
  currentPage,
  itemsPerPage,
  onSelectAll,
  onToggleSelect,
  onUpdateStatus,
  onDeleteOrder,
  onPageChange,
  onOpenUploadModal,
  onMarkAsPaid
}: OrdersTableProps) {
  
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const displayedOrders = orders.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
              <th className="py-4 px-5">
                <input
                  type="checkbox"
                  checked={selectedOrderIds.length === orders.length && orders.length > 0}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
                />
              </th>
              <th className="py-4 px-5 font-extrabold">Réf JP</th>
              <th className="py-4 px-5 font-extrabold">Acheteur / Contact</th>
              <th className="py-4 px-5 font-extrabold">Article commandé</th>
              <th className="py-4 px-5 font-extrabold">Prix d'acquisition</th>
              <th className="py-4 px-5 font-extrabold">Validation Chat</th>
              <th className="py-4 px-5 font-extrabold">Règlement</th>
              <th className="py-4 px-5 font-extrabold">Statut Actuel</th>
              <th className="py-4 px-5 text-center font-extrabold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 font-mono font-bold">
                  Aucune commande correspondante.
                </td>
              </tr>
            ) : (
              displayedOrders.map((ord) => (
                <tr 
                  key={ord.id} 
                  className={`hover:bg-slate-50/50 transition-colors ${
                    selectedOrderIds.includes(ord.id) ? 'bg-indigo-50/10' : ''
                  }`}
                >
                  <td className="py-4 px-5">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(ord.id)}
                      onChange={() => onToggleSelect(ord.id)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-5">
                    <span className="bg-slate-900 text-white px-2.5 py-0.5 rounded font-mono font-black">
                      {ord.jpCode}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-900">
                    <div>
                      <p>{ord.customerName}</p>
                      <p className="text-slate-400 font-mono text-[10px] mt-0.5">
                        {ord.customerHandle} • {ord.customerPhone}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-slate-700">
                    {ord.productName}
                  </td>
                  <td className="py-4 px-5 font-black text-indigo-600 font-sans">
                    {ord.price.toLocaleString()} Ar
                  </td>
                  <td className="py-4 px-5 font-bold">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] ${
                      ord.chatStatus === 'Confirmé' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.chatStatus}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        ord.isPaid 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ord.isPaid ? 'PAYÉ par Mobile Money ✅' : 'En attente Mobile Money ⏳'}
                      </span>
                      <div className="flex gap-1.5 items-center mt-1 flex-wrap">
                        {ord.mobileMoneyScreenshot && (
                          <a 
                            href={ord.mobileMoneyScreenshot} 
                            target="_blank"  
                            rel="noreferrer"
                            className="text-[9px] text-indigo-600 font-bold hover:underline"
                          >
                            Voir reçu image
                          </a>
                        )}
                        {!ord.isPaid && (
                          <>
                            <button
                              onClick={() => onOpenUploadModal(ord.id)}
                              className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[9px] font-bold rounded cursor-pointer"
                            >
                              Enregistrer reçu
                            </button>
                            <button
                              onClick={() => onMarkAsPaid(ord.id)}
                              className="px-1.5 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[9px] font-black rounded cursor-pointer"
                            >
                              Tout validé & payé
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateStatus(ord.id, e.target.value as OrderStatus)}
                      className="px-2 py-1 text-[11px] border rounded-lg bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      {statuses.map(st => (
                        <option key={st} value={st}>{getStatusLabelSimple(st)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() => onDeleteOrder(ord.id)}
                      className="text-slate-450 hover:text-rose-600 p-1.5 rounded transition-colors cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {orders.length > itemsPerPage && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Affichage {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, orders.length)} sur {orders.length} fiches
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3 w-3" /> Précédent
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 px-3">
              Page {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              Suivant <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
