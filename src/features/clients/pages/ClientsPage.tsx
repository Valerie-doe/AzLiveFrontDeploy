import React, { useMemo, useState } from 'react';
import { LiveSession } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { useClients } from '../hooks/useClients';
import { ALL_LIVES, LiveFilterValue, useClientOrders } from '../hooks/useClientOrders';
import { useOwnedLiveSessions } from '../../live-hub/hooks/useOwnedLiveSessions';
import ClientStats from '../components/ClientStats';
import ClientTable from '../components/ClientTable';
import ClientDetailPanel from '../components/ClientDetailPanel';

interface ClientsPageProps {
  liveSessions: LiveSession[];
  onUpdateClientInOrders?: (
    oldPhone: string,
    newDetails: { name: string; phone: string; handle: string; address: string }
  ) => void;
}

export default function ClientsPage({ liveSessions, onUpdateClientInOrders }: ClientsPageProps) {
  const [selectedLiveId, setSelectedLiveId] = useState<LiveFilterValue>(ALL_LIVES);

  // Lives accessibles à l'utilisateur connecté (même règle que le Live Hub).
  const ownedLiveSessions = useOwnedLiveSessions(liveSessions);

  // Commandes backend selon le live sélectionné (« Tous les lives » ou un live précis).
  const { orders, loading, error } = useClientOrders(selectedLiveId);

  const isMultiLive = selectedLiveId === ALL_LIVES;

  const {
    searchQuery, setSearchQuery,
    currentPage, setCurrentPage,
    activeFilter, setActiveFilter,
    selectedClient, setSelectedClient,
    isEditing, setIsEditing,
    editForm, setEditForm,
    successMessage,
    clientsList,
    filteredClients,
    totalClients,
    activeLoyalClients,
    fidelityPercentage,
    averageSpentPerOrder,
    handleOpenClient,
    handleSaveEdit,
    ITEMS_PER_PAGE,
  } = useClients(orders, onUpdateClientInOrders);

  const liveOptions = useMemo(
    () =>
      [...ownedLiveSessions].sort((a, b) => (b.date || '').localeCompare(a.date || '')),
    [ownedLiveSessions],
  );

  const handleLiveChange = (value: LiveFilterValue) => {
    setSelectedLiveId(value);
    setCurrentPage(1);
    setSelectedClient(null);
    playNotificationSound('click');
  };

  return (
    <div className="space-y-6" id="client-management-portal">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight font-sans">Répertoire & Fidélité Clients</h2>
          <p className="text-sm text-slate-500 font-serif">
            Retrouvez les fiches d'achat automatisées, les numéros Airtel/Orange/Telma de vos acheteurs fidèles et
            simplifiez les contacts.
          </p>
        </div>

        {/* FILTRE PAR LIVE */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="client-live-filter"
            className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold"
          >
            Filtrer par live
          </label>
          <select
            id="client-live-filter"
            value={selectedLiveId}
            onChange={(e) => handleLiveChange(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm min-w-[220px]"
          >
            <option value={ALL_LIVES}>Tous les Lives</option>
            {liveOptions.map((live) => (
              <option key={live.id} value={live.id}>
                {live.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* METRIC ACCENTS */}
      <ClientStats
        totalClients={totalClients}
        averageSpentPerOrder={averageSpentPerOrder}
        fidelityPercentage={fidelityPercentage}
        activeLoyalClients={activeLoyalClients}
      />

      {error && (
        <div className="bg-white border border-rose-100 rounded-2xl p-4 text-xs text-rose-600">
          {error}
        </div>
      )}

      {/* MAIN SPLIT BOARD VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ClientTable
          clientsList={clientsList}
          filteredClients={filteredClients}
          selectedClient={selectedClient}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          loading={loading}
          showLiveColumn={isMultiLive}
          onSearchChange={setSearchQuery}
          onFilterChange={setActiveFilter}
          onPageChange={setCurrentPage}
          onSelectClient={handleOpenClient}
        />

        <div className="lg:col-span-4">
          <ClientDetailPanel
            selectedClient={selectedClient}
            isEditing={isEditing}
            editForm={editForm}
            successMessage={successMessage}
            onClose={() => setSelectedClient(null)}
            onStartEdit={() => setIsEditing(true)}
            onCancelEdit={() => setIsEditing(false)}
            onSaveEdit={handleSaveEdit}
            onEditFormChange={setEditForm}
          />
        </div>
      </div>
    </div>
  );
}
