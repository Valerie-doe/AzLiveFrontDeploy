import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { playNotificationSound } from '../../sound';
import AuthHeader from './AuthHeader';
import SelectPagesStep from './SelectPagesStep';
import FaqModal from './FaqModal';
import {
  FacebookAuthSession,
  FacebookPageOption,
  PendingFacebookAuth,
} from '../../features/auth/types/facebookAuth.types';
import {
  buildFacebookSession,
  resolvePageAccessToken,
} from '../../features/auth/services/facebookAuth.service';
import {
  clearPendingFacebookAuth,
  getPendingFacebookAuth,
  saveFacebookSession,
} from '../../features/auth/services/authStorage';

interface FacebookPagesSelectionPageProps {
  onLoginSuccess: (session: FacebookAuthSession) => void;
}

export default function FacebookPagesSelectionPage({
  onLoginSuccess,
}: FacebookPagesSelectionPageProps) {
  const [pendingAuth, setPendingAuth] = useState<PendingFacebookAuth | null>(null);
  const [selectedPageNames, setSelectedPageNames] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  useEffect(() => {
    const pending = getPendingFacebookAuth();
    if (!pending) {
      setErrorMessage('Session Facebook expirée ou invalide. Veuillez vous reconnecter.');
      return;
    }

    if (pending.pages.length === 0) {
      setErrorMessage('Aucune page Facebook disponible pour ce compte.');
      return;
    }

    setPendingAuth(pending);
    // Pré-cochage de toutes les pages : l'utilisateur peut décocher celles à exclure.
    setSelectedPageNames(pending.pages.map((page) => page.nom));
  }, []);

  const handleTogglePage = (pageName: string) => {
    playNotificationSound('click');
    setSelectedPageNames((prev) =>
      prev.includes(pageName) ? prev.filter((name) => name !== pageName) : [...prev, pageName],
    );
  };

  const handleConfirmSelection = () => {
    if (!pendingAuth || selectedPageNames.length === 0) return;

    const selectedPages: FacebookPageOption[] = pendingAuth.pages
      .filter((page) => selectedPageNames.includes(page.nom))
      .map((page) => ({
        ...page,
        pageAccessToken: resolvePageAccessToken(page, pendingAuth.pages),
      }));

    if (selectedPages.length === 0) {
      setErrorMessage('Pages sélectionnées introuvables. Veuillez réessayer.');
      return;
    }

    setIsSaving(true);

    const session = buildFacebookSession(pendingAuth, selectedPages);
    saveFacebookSession(session);
    clearPendingFacebookAuth();

    playNotificationSound('confirm');
    window.history.replaceState({}, '', '/');
    onLoginSuccess(session);
  };

  const pageNames = pendingAuth?.pages.map((page) => page.nom) ?? [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 md:p-8 selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-100 rounded-full blur-[120px] opacity-40 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-pink-100 rounded-full blur-[100px] opacity-30 translate-y-1/3 pointer-events-none" />

      <AuthHeader onShowFaq={() => setShowFaq(true)} />

      <main className="flex-1 flex items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          <div className="h-1 bg-slate-100 flex">
            <div className="h-full bg-indigo-600 transition-all duration-300 w-2/3" />
          </div>

          <AnimatePresence mode="wait">
            {errorMessage ? (
              <div className="p-8 text-center space-y-4">
                <p className="text-rose-600 text-xs font-bold">{errorMessage}</p>
                <button
                  onClick={() => {
                    clearPendingFacebookAuth();
                    window.history.replaceState({}, '', '/');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : !pendingAuth ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chargement de vos pages Facebook...
              </div>
            ) : (
              <SelectPagesStep
                selectedPlatform="Facebook"
                availablePages={pageNames}
                selectedPages={selectedPageNames}
                onTogglePage={handleTogglePage}
                confirmLabel={isSaving ? 'Connexion en cours...' : 'Confirmer et accéder à l\'application'}
                onBack={() => {
                  clearPendingFacebookAuth();
                  window.history.replaceState({}, '', '/');
                  window.location.reload();
                }}
                onConfirm={handleConfirmSelection}
                confirmDisabled={selectedPageNames.length === 0 || isSaving}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-400 py-4 border-t border-slate-100 select-none relative z-10">
        <p className="font-medium">🛡️ Authentification sécurisée de niveau Sandbox • AZLive Corporation Madagascar</p>
      </footer>

      <FaqModal isOpen={showFaq} onClose={() => setShowFaq(false)} />
    </div>
  );
}
