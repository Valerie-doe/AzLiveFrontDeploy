import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Hooks
import { useAppState } from './hooks/useAppState';

// Extracted Modals
import HowItWorksModal from './components/modals/HowItWorksModal';
import ConfirmLogoutModal from './components/modals/ConfirmLogoutModal';
import ConfirmResetModal from './components/modals/ConfirmResetModal';

// Presentation Gateways & Subpages
import LoginAuthGateway from './components/LoginAuthGateway';
import LiveShoppingHub from './features/live-hub';
import ProductManagement from './features/products';
import ClientsView from './features/clients';
import CollaboratorsView from './features/collaborators';
import DashboardView from './features/dashboard';
import GlobalSearchView from './features/search';

// Layout components
import { Sidebar, Header, MobileMenu } from './shared/layouts';

export default function App() {
  const state = useAppState();

  if (!state.isAuthenticated) {
    return <LoginAuthGateway onLoginSuccess={state.handleLoginSuccess} />;
  }

  const liveHubBadgeCount = state.orders.filter((o) => o.status === 'JP capturé').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white flex flex-col lg:flex-row">
      {/* MOBILE HEADER BAR */}
      <Header
        isMobileMenuOpen={state.isMobileMenuOpen}
        onToggleMobileMenu={() => state.setIsMobileMenuOpen((prev) => !prev)}
        onShowGuide={() => state.setShowHowItWorks(true)}
      />

      {/* MOBILE NAV MENU SLIDE DRAWER */}
      <MobileMenu
        isOpen={state.isMobileMenuOpen}
        onClose={() => state.setIsMobileMenuOpen(false)}
        activeTab={state.activeTab}
        setActiveTab={state.setActiveTab}
        liveHubBadgeCount={liveHubBadgeCount}
        onShowGuide={() => state.setShowHowItWorks(true)}
        onLogout={state.handleLogout}
      />

      {/* DESKTOP PERMANENT LATERAL SIDEBAR */}
      <Sidebar
        activeTab={state.activeTab}
        setActiveTab={state.setActiveTab}
        liveHubBadgeCount={liveHubBadgeCount}
        onShowGuide={() => state.setShowHowItWorks(true)}
        onLogout={state.handleLogout}
      />

      {/* CORE WORKSPACE PORTAL CONTAINER adjacent to sidebar */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* CORE WORKSPACE PORTAL CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1" id="azlive-core-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              {state.activeTab === 'live_hub' && (
                <LiveShoppingHub
                  orders={state.orders}
                  products={state.products}
                  collaborators={state.collaborators}
                  liveSessions={state.liveSessions}
                  onAddNewLive={state.handleAddNewLive}
                  onUpdateLiveSession={state.handleUpdateLiveSession}
                  onStartLiveSession={state.handleStartLiveSession}
                  onUpdateOrder={state.handleUpdateOrder}
                  onDeleteOrder={state.handleDeleteOrder}
                  onSendToDelivery={state.handleSendToDelivery}
                  onAddManualOrder={state.handleAddManualOrder}
                  onAddProduct={state.handleAddProduct}
                  onEditProduct={state.handleEditProduct}
                  onDeleteProduct={state.handleDeleteProduct}
                  simulationActive={state.simulationOn}
                  setSimulationActive={state.setSimulationOn}
                  onCloseLiveSession={state.handleCloseLiveSession}
                />
              )}

              {state.activeTab === 'products' && (
                <ProductManagement
                  products={state.products}
                  onAddProduct={state.handleAddProduct}
                  onEditProduct={state.handleEditProduct}
                  onDeleteProduct={state.handleDeleteProduct}
                />
              )}

              {state.activeTab === 'clients' && (
                <ClientsView
                  orders={state.orders}
                  onUpdateClientInOrders={state.handleUpdateClientInOrders}
                />
              )}

              {state.activeTab === 'collaborators' && (
                <CollaboratorsView
                  collaborators={state.collaborators}
                  onAddCollaborator={state.handleAddCollaborator}
                  onToggleStatus={state.handleToggleCollabStatus}
                  onDeleteCollaborator={state.handleDeleteCollaborator}
                />
              )}

              {state.activeTab === 'dashboard' && (
                <DashboardView
                  orders={state.orders}
                  products={state.products}
                  liveSessions={state.liveSessions}
                />
              )}

              {state.activeTab === 'search' && (
                <GlobalSearchView orders={state.orders} products={state.products} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* FOOTER */}
        <footer className="mt-20 border-t border-slate-100 py-8 text-center text-xs text-slate-400 select-none">
          <p className="font-medium">
            © 2026 AZLive Technologies Madagascar • Structurer et accélérer le live-shopping local
          </p>
          <p className="text-[10px] font-mono mt-1.5 text-slate-300">
            Port 3000 • Solutions Cloud Run Sandbox
          </p>
        </footer>
      </div>

      {/* HOW IT WORKS / PROTCOLE AZLIVE MODAL */}
      <AnimatePresence>
        {state.showHowItWorks && (
          <HowItWorksModal onClose={() => state.setShowHowItWorks(false)} />
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRMATION MODALS */}
      <AnimatePresence>
        {state.showLogoutConfirm && (
          <ConfirmLogoutModal
            onConfirm={state.handleConfirmLogout}
            onCancel={() => state.setShowLogoutConfirm(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.showResetConfirm && (
          <ConfirmResetModal
            onConfirm={state.handleConfirmReset}
            onCancel={() => state.setShowResetConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
