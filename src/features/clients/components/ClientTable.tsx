import React from 'react';
import { ClientProfile } from '../types';
import { playNotificationSound } from '../../../sound';
import { SearchInput, PaginationControls } from '../../../shared';

interface ClientTableProps {
  clientsList: ClientProfile[];
  filteredClients: ClientProfile[];
  selectedClient: ClientProfile | null;
  searchQuery: string;
  activeFilter: 'all' | 'femme' | 'homme' | 'best';
  currentPage: number;
  itemsPerPage: number;
  onSearchChange: (q: string) => void;
  onFilterChange: (f: 'all' | 'femme' | 'homme' | 'best') => void;
  onPageChange: (p: number) => void;
  onSelectClient: (client: ClientProfile) => void;
}

export default function ClientTable({
  clientsList,
  filteredClients,
  selectedClient,
  searchQuery,
  activeFilter,
  currentPage,
  itemsPerPage,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onSelectClient,
}: ClientTableProps) {
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const displayedClients = filteredClients.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-8">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 font-mono">Fiches Clients</h3>
          <p className="text-[10px] text-slate-400 font-serif">Abonnés du Dressing classés par segmentation d'achats live.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={(val) => { onSearchChange(val); onPageChange(1); }}
            placeholder="Rechercher nom..."
            className="w-full sm:w-60"
          />
          <select
            value={activeFilter}
            onChange={(e) => { onFilterChange(e.target.value as typeof activeFilter); onPageChange(1); playNotificationSound('click'); }}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm min-w-[150px]"
          >
            <option value="all">📁 Tout ({clientsList.length})</option>
            <option value="femme">👩 Femmes ({clientsList.filter((c) => c.gender === 'Femme').length})</option>
            <option value="homme">👨 Hommes ({clientsList.filter((c) => c.gender === 'Homme').length})</option>
            <option value="best">🔥 Meilleurs clients ({clientsList.filter((c) => c.ordersCount >= 2 || c.totalSpent >= 80000).length})</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-650">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
              <th className="py-3 px-5">Nom client</th>
              <th className="py-3 px-5">Téléphone</th>
              <th className="py-3 px-5">Adresse principale</th>
              <th className="py-3 px-5 text-center">Sessions</th>
              <th className="py-3 px-5 text-right">Montant validé</th>
              <th className="py-3 px-5 text-center">Fiche</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans text-xs">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                  Aucun client détecté dans la base pour l'instant.
                </td>
              </tr>
            ) : (
              displayedClients.map((client, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                    selectedClient?.phone === client.phone ? 'bg-indigo-50/20' : ''
                  }`}
                  onClick={() => onSelectClient(client)}
                >
                  <td className="py-3.5 px-5">
                    <div className="font-extrabold text-slate-900">{client.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{client.handle}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[11px] font-semibold text-slate-700">{client.phone}</td>
                  <td className="py-3.5 px-5 max-w-[180px] truncate font-serif text-slate-500">{client.address}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      client.ordersCount >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {client.ordersCount} cmd
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-black text-indigo-600 font-sans">
                    {client.totalSpent.toLocaleString()} Ar
                  </td>
                  <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectClient(client)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={activePage}
        totalItems={filteredClients.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        itemLabel="clients"
      />
    </div>
  );
}
