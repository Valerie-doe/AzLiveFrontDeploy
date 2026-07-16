import React, { useState } from 'react';
import { ShoppingBag, Award } from 'lucide-react';
import { ProductLeaderboardItem } from '../hooks/useDashboard';
import { PaginationControls } from '../../../shared';

interface ProductLeaderboardProps {
  items: ProductLeaderboardItem[];
}

const ITEMS_PER_PAGE = 10;

export default function ProductLeaderboard({ items }: ProductLeaderboardProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const displayedList = items.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 font-sans">
            <Award className="h-5 w-5 text-indigo-600 shrink-0" />
            <span>Meilleurs produits</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-400 font-serif mt-0.5">
            Classement par unités vendues en live.
          </p>
        </div>
        <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold self-start">
          Performance Live
        </span>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-slate-100">
        {items.length === 0 ? (
          <p className="py-10 text-center text-slate-400 font-mono text-xs px-4">
            Aucune vente enregistrée pour alimenter le classement.
          </p>
        ) : (
          displayedList.map((item, idx) => {
            const actualRank = (activePage - 1) * ITEMS_PER_PAGE + idx + 1;
            return (
              <div key={`${item.name}-${actualRank}`} className="p-4 flex gap-3 items-start">
                <div className="shrink-0 pt-1">
                  {actualRank <= 3 ? (
                    <span className="text-base">{actualRank === 1 ? '🥇' : actualRank === 2 ? '🥈' : '🥉'}</span>
                  ) : (
                    <span className="text-slate-400 font-mono text-xs">#{actualRank}</span>
                  )}
                </div>
                <div className="h-11 w-11 bg-slate-100 border rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ShoppingBag className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="font-extrabold text-slate-900 text-xs truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.code} · {item.size} · {item.color}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                    <span className="font-semibold text-slate-700">{item.count} vendu{item.count > 1 ? 's' : ''}</span>
                    <span className="text-slate-500">{item.stock} en stock</span>
                    <span className="font-black text-indigo-600">{item.value.toLocaleString()} Ar</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
              <th className="py-3 px-5 text-center w-14">Rang</th>
              <th className="py-3 px-5">Produit</th>
              <th className="py-3 px-5">Code JP</th>
              <th className="py-3 px-5 text-right">Prix Unitaire</th>
              <th className="py-3 px-5 text-center">Unités Vendues</th>
              <th className="py-3 px-5 text-center">Stock restant</th>
              <th className="py-3 px-5 text-right pr-6">Revenus cumulés</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans text-xs">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-mono">
                  Aucune vente enregistrée pour alimenter le classement de performance.
                </td>
              </tr>
            ) : (
              displayedList.map((item, idx) => {
                const actualRank = (activePage - 1) * ITEMS_PER_PAGE + idx + 1;
                return (
                  <tr key={`${item.name}-${actualRank}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 text-center font-bold">
                      {actualRank === 1 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black border border-amber-200">🥇</span>
                      ) : actualRank === 2 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black border border-slate-200">🥈</span>
                      ) : actualRank === 3 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-800 text-[11px] font-black border border-orange-200">🥉</span>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">#{actualRank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 bg-slate-100 border rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <ShoppingBag className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-slate-900 block leading-tight truncate">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-serif">
                            Taille: {item.size} • Couleur: {item.color}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black tracking-tight">
                        {item.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-semibold text-slate-700">
                      {item.price.toLocaleString()} Ar
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="font-black text-slate-900 text-xs">{item.count}</span>
                        <span className="text-[10px] text-slate-400">ex.</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          item.stock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : item.stock <= 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.stock} dispo{item.stock > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right pr-6 font-black text-indigo-600 font-sans">
                      {item.value.toLocaleString()} Ar
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
        totalItems={items.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="produits"
      />
    </div>
  );
}
