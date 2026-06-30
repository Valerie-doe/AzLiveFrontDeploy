import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { useAppState } from './hooks/useAppState';
import { useProducts } from './features/products/hooks/useProducts';
import { useLives } from './features/live-hub/hooks/useLives';
import { useCollaborators } from './features/collaborators/hooks/useCollaborators';
import { fetchAuthMe } from './api/auth.api';
import {
  clearSession,
  getAuthToken,
  hasRealAuthToken,
  isAuthenticated as isStoredAuthenticated,
} from './features/auth/services/authStorage';

import HowItWorksModal from './components/modals/HowItWorksModal';
import ConfirmLogoutModal from './components/modals/ConfirmLogoutModal';
import ConfirmResetModal from './components/modals/ConfirmResetModal';

import LoginAuthGateway from './components/LoginAuthGateway';
import FacebookCallbackPage from './components/auth/FacebookCallbackPage';
import FacebookPagesSelectionPage from './components/auth/FacebookPagesSelectionPage';
import TikTokCallbackPage from './components/auth/TikTokCallbackPage';
import TikTokAccountConfirmPage from './components/auth/TikTokAccountConfirmPage';
import LiveShoppingHub from './features/live-hub';
import ProductManagement from './features/products';
import ClientsView from './features/clients';
import CollaboratorsView from './features/collaborators';
import DashboardView from './features/dashboard';
import GlobalSearchView from './features/search';
import { Sidebar, Header, MobileMenu, PromoAlert } from './shared/layouts';

function getAuthRoute(): 'facebook-callback' | 'facebook-pages' | 'tiktok-callback' | 'tiktok-confirm' | null {
  const path = window.location.pathname.replace(/\/$/, '');
  if (path === '/auth/facebook/success') return 'facebook-callback';
  if (path === '/auth/facebook/pages') return 'facebook-pages';
  if (path === '/auth/tiktok/success') return 'tiktok-callback';
  if (path === '/auth/tiktok/confirm') return 'tiktok-confirm';
  return null;
}

export default function App() {
  const state = useAppState();
  // Les données métier ne sont chargées qu'une fois authentifié : la bascule
  // `false → true` après connexion déclenche automatiquement le fetch (produits,
  // lives, pages Facebook, collaborateurs) sans actualisation manuelle.
  const productState = useProducts(state.isAuthenticated);
  const liveState = useLives(state.isAuthenticated);
  const collaboratorState = useCollaborators(state.isAuthenticated);
  const authRoute = getAuthRoute();

  useEffect(() => {
    if (!isStoredAuthenticated() || !hasRealAuthToken()) return;

    fetchAuthMe(getAuthToken())
      .then(() => undefined)
      .catch(() => {
        clearSession();
        state.setIsAuthenticated(false);
      });
  }, [state.setIsAuthenticated]);

  if (authRoute === 'facebook-callback') {
    return <FacebookCallbackPage />;
  }

  if (authRoute === 'facebook-pages') {
    return <FacebookPagesSelectionPage onLoginSuccess={state.handleFacebookLoginSuccess} />;
  }

  if (authRoute === 'tiktok-callback') {
    return <TikTokCallbackPage />;
  }

  if (authRoute === 'tiktok-confirm') {
    return <TikTokAccountConfirmPage onLoginSuccess={state.handleTikTokLoginSuccess} />;
  }

  if (!state.isAuthenticated) {
    return (
      <LoginAuthGateway
        onLoginSuccess={state.handleLoginSuccess}
        onFacebookLoginSuccess={state.handleFacebookLoginSuccess}
        onTikTokLoginSuccess={state.handleTikTokLoginSuccess}
      />
    );
  }

  const liveHubBadgeCount = state.orders.filter((o) => o.status === 'JP capturé').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white flex flex-col lg:flex-row">
      <Header
        isMobileMenuOpen={state.isMobileMenuOpen}
        onToggleMobileMenu={() => state.setIsMobileMenuOpen((prev) => !prev)}
        onShowGuide={() => state.setShowHowItWorks(true)}
      />

      <MobileMenu
        isOpen={state.isMobileMenuOpen}
        onClose={() => state.setIsMobileMenuOpen(false)}
        activeTab={state.activeTab}
        setActiveTab={state.setActiveTab}
        liveHubBadgeCount={liveHubBadgeCount}
        onShowGuide={() => state.setShowHowItWorks(true)}
        onLogout={state.handleLogout}
      />

      <Sidebar
        activeTab={state.activeTab}
        setActiveTab={state.setActiveTab}
        liveHubBadgeCount={liveHubBadgeCount}
        onShowGuide={() => state.setShowHowItWorks(true)}
        onLogout={state.handleLogout}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <PromoAlert onShowGuide={() => state.setShowHowItWorks(true)} />

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
    products={productState.products}
    productsLoading={productState.loading}

    collaborators={collaboratorState.collaborators}

    liveSessions={liveState.liveSessions}
    facebookPages={liveState.facebookPages}

    livesLoading={liveState.loading}
    livesError={liveState.error}
    livesSaving={liveState.saving}

    onCreateLiveSession={liveState.createLiveSession}
    onUpdateLiveSession={liveState.updateLiveSession}
    onUpdateLiveDressing={liveState.updateLiveDressing}

    onStartLiveSession={liveState.startLiveSession}
    onCloseLiveSession={liveState.closeLiveSession}

    onUpdateOrder={state.handleUpdateOrder}
    onDeleteOrder={state.handleDeleteOrder}
    onSendToDelivery={state.handleSendToDelivery}
    onAddManualOrder={state.handleAddManualOrder}

    onAddProduct={productState.addProduct}
    onEditProduct={productState.editProduct}
    onDeleteProduct={productState.deleteProduct}

    simulationActive={state.simulationOn}
    setSimulationActive={state.setSimulationOn}
  />
)}
              {state.activeTab === 'products' && (
                <ProductManagement
                  products={productState.products}
                  onAddProduct={productState.addProduct}
                  onEditProduct={productState.editProduct}
                  onDeleteProduct={productState.deleteProduct}
                />
              )}

              {state.activeTab === 'clients' && (
                <ClientsView
                  liveSessions={liveState.liveSessions}
                  onUpdateClientInOrders={state.handleUpdateClientInOrders}
                />
              )}

              {state.activeTab === 'collaborators' && (
                <CollaboratorsView
                  collaborators={collaboratorState.collaborators}
                  loading={collaboratorState.loading}
                  error={collaboratorState.error}
                  onAddCollaborator={collaboratorState.addCollaborator}
                  onToggleStatus={collaboratorState.toggleCollaboratorStatus}
                  onDeleteCollaborator={collaboratorState.removeCollaborator}
                />
              )}

              {state.activeTab === 'dashboard' && (
                <DashboardView products={productState.products} />
              )}

              {state.activeTab === 'search' && <GlobalSearchView />}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-20 border-t border-slate-100 py-8 text-center text-xs text-slate-400 select-none">
          <p className="font-medium">
            © 2026 AZLive Technologies Madagascar • Structurer et accélérer le live-shopping local
          </p>
          <p className="text-[10px] font-mono mt-1.5 text-slate-300">
            Port 3000 • Solutions Cloud Run Sandbox
          </p>
        </footer>
      </div>

      <AnimatePresence>
        {state.showHowItWorks && (
          <HowItWorksModal onClose={() => state.setShowHowItWorks(false)} />
        )}
      </AnimatePresence>

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
