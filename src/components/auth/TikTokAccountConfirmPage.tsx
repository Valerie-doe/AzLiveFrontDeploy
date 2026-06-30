import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { playNotificationSound } from '../../sound';
import AuthHeader from './AuthHeader';
import SelectPagesStep from './SelectPagesStep';
import FaqModal from './FaqModal';
import { TikTokAuthSession, PendingTikTokAuth } from '../../features/auth/types/tiktokAuth.types';
import {
  buildTikTokSession,
  formatTikTokAccountLabel,
} from '../../features/auth/services/tiktokAuth.service';
import {
  clearPendingTikTokAuth,
  getPendingTikTokAuth,
  saveTikTokSession,
} from '../../features/auth/services/authStorage';

interface TikTokAccountConfirmPageProps {
  onLoginSuccess: (session: TikTokAuthSession) => void;
}

export default function TikTokAccountConfirmPage({
  onLoginSuccess,
}: TikTokAccountConfirmPageProps) {
  const [pendingAuth, setPendingAuth] = useState<PendingTikTokAuth | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  useEffect(() => {
    const pending = getPendingTikTokAuth();
    if (!pending) {
      setErrorMessage('Session TikTok expirée ou invalide. Veuillez vous reconnecter.');
      return;
    }

    if (!pending.profile.username) {
      setErrorMessage('Aucun compte TikTok n\'a pu être récupéré pour cette session.');
      return;
    }

    const accountLabel = formatTikTokAccountLabel(pending.profile);
    setPendingAuth(pending);
    setSelectedAccount(accountLabel);
  }, []);

  const handleConfirmSelection = () => {
    if (!pendingAuth || !selectedAccount) return;

    setIsSaving(true);

    const session = buildTikTokSession(pendingAuth);
    saveTikTokSession(session);
    clearPendingTikTokAuth();

    playNotificationSound('confirm');
    window.history.replaceState({}, '', '/');
    onLoginSuccess(session);
  };

  const accountLabel = pendingAuth ? formatTikTokAccountLabel(pendingAuth.profile) : null;

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
                    clearPendingTikTokAuth();
                    window.history.replaceState({}, '', '/');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : !pendingAuth || !accountLabel ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chargement de votre compte TikTok...
              </div>
            ) : (
              <SelectPagesStep
                selectedPlatform="TikTok"
                availablePages={[accountLabel]}
                selectedPages={selectedAccount ? [selectedAccount] : []}
                onTogglePage={(account) => {
                  playNotificationSound('click');
                  setSelectedAccount(account);
                }}
                singleSelect
                confirmLabel={isSaving ? 'Connexion en cours...' : 'Confirmer et accéder à l\'application'}
                onBack={() => {
                  clearPendingTikTokAuth();
                  window.history.replaceState({}, '', '/');
                  window.location.reload();
                }}
                onConfirm={handleConfirmSelection}
                confirmDisabled={!selectedAccount || isSaving}
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
