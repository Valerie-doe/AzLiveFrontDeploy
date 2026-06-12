import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from '../../../types';

interface SessionOrdersTableProps {
  orders: Order[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export default function SessionOrdersTable({
  orders,
  currentPage,
  onPageChange,
  itemsPerPage
}: SessionOrdersTableProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'livré':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'annulé':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'confirmé':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'en livraison':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-755 border-slate-200';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        <p>Aucune transaction ne correspond à vos filtres de recherche.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const displayedOrders = orders.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-mono text-slate-400 font-bold uppercase border-b border-slate-100">
              <th className="py-3 px-4">Code JP</th>
              <th className="py-3 px-4">Acheteur</th>
              <th className="py-3 px-4">Téléphone</th>
              <th className="py-3 px-4">Article</th>
              <th className="py-3 px-4 text-right">Montant</th>
              <th className="py-3 px-4 text-center">Livraison</th>
              <th className="py-3 px-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {displayedOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-black text-slate-900">
                  <span className="bg-slate-100 text-slate-800 font-mono text-[10px] font-black px-2 py-0.5 rounded">
                    {ord.jpCode}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-extrabold text-slate-900">{ord.customerName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{ord.customerHandle}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px]">
                  {ord.customerPhone || 'N/A'}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-750">
                  {ord.productName}
                </td>
                <td className="py-3.5 px-4 text-right font-black text-slate-900 font-sans">
                  {ord.price.toLocaleString()} Ar
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="text-[10px] block font-semibold text-slate-500 max-w-[140px] truncate mx-auto" title={ord.deliveryAddress}>
                    {ord.deliveryAddress || 'Emporter'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`inline-block text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full border ${getStatusBadgeClass(ord.status)}`}>
                    {ord.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length > itemsPerPage && (
        <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] font-mono text-slate-500">
            Lignes {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, orders.length)} sur {orders.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-650 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3 w-3" /> Précédent
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 px-3">
              Page {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-655 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              Suivant <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
