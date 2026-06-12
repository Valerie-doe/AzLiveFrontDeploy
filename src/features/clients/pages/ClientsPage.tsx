import React from 'react';
import { Order } from '../../../types';
import { useClients } from '../hooks/useClients';
import ClientStats from '../components/ClientStats';
import ClientTable from '../components/ClientTable';
import ClientDetailPanel from '../components/ClientDetailPanel';

interface ClientsPageProps {
  orders: Order[];
  onUpdateClientInOrders?: (
    oldPhone: string,
    newDetails: { name: string; phone: string; handle: string; address: string }
  ) => void;
}

export default function ClientsPage({ orders, onUpdateClientInOrders }: ClientsPageProps) {
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

  return (
    <div className="space-y-6" id="client-management-portal">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Répertoire & Fidélité Clients</h2>
        <p className="text-sm text-slate-500 font-serif">
          Retrouvez les fiches d'achat automatisées, les numéros Airtel/Orange/Telma de vos acheteurs fidèles et
          simplifiez les contacts.
        </p>
      </div>

      {/* METRIC ACCENTS */}
      <ClientStats
        totalClients={totalClients}
        averageSpentPerOrder={averageSpentPerOrder}
        fidelityPercentage={fidelityPercentage}
        activeLoyalClients={activeLoyalClients}
      />

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
