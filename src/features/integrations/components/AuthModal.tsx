import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, CheckCircle, Lock, X } from 'lucide-react';
import { AuthModalState } from '../hooks/useIntegrationsState';

interface AuthModalProps {
  authModal: AuthModalState;
  onClose: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onTogglePageChoice: (page: string) => void;
  onCompleteIntegration: () => void;
}

const FACEBOOK_PAGES = ['Fripe Chic Antsirabe', 'Tana Dressing Hub', 'Dressing de Riana', "Dressing d'Hiver Antananarivo"];
const TIKTOK_PAGES = ['@mialy_mada', '@fianar_vip_style', '@fripes_chic_mada'];

export default function AuthModal({
  authModal,
  onClose,
  onNextStep,
  onPrevStep,
  onTogglePageChoice,
  onCompleteIntegration
}: AuthModalProps) {
  if (!authModal.isOpen || !authModal.platform) return null;

  const platform = authModal.platform;
  const pages = platform === 'Facebook' ? FACEBOOK_PAGES : TIKTOK_PAGES;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-55">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-100 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {/* Header */}
          <div className={`p-4 text-white flex justify-between items-center ${platform === 'Facebook' ? 'bg-blue-600' : 'bg-black'}`}>
            <div className="flex items-center gap-2">
              <Facebook className="h-4.5 w-4.5 fill-current" />
              <span className="font-bold text-xs">
                {platform === 'Facebook' ? 'Meta Pages Authorization Wizard' : 'TikTok Creators API Auth'}
              </span>
            </div>
            <button onClick={onClose} className="text-white opacity-80 hover:opacity-100 p-1 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step 1: Permissions */}
          {authModal.step === 1 && (
            <div className="p-6 space-y-5 bg-white">
              <div className="text-center space-y-2">
                <div className={`h-12 w-12 mx-auto rounded-2xl flex items-center justify-center text-white ${platform === 'Facebook' ? 'bg-blue-600' : 'bg-black'}`}>
                  <span className="font-extrabold text-lg">AZ</span>
                </div>
                <h3 className="text-slate-900 font-extrabold text-base tracking-tight">
                  Lier l'application <strong className="text-indigo-600">AZLive</strong> ?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-serif">
                  {platform === 'Facebook'
                    ? "AZLive souhaite avoir l'accès à la capture des commentaires d'achats live et à vos boîtes de messagerie de page pour répondre automatiquement."
                    : "TikTok Integration demande l'autorisation de lister vos streams en direct existants."}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-[11px] text-slate-600">
                <p className="font-bold font-mono text-[9px] uppercase text-slate-400">Autorisations demandées :</p>
                {[
                  ['pages_read_engagement', 'Lire vos posts et streams'],
                  ['pages_messaging', 'Clapet d\'autoguide des relances'],
                  ['pages_show_list', 'Lister vos pages disponibles']
                ].map(([perm, desc]) => (
                  <div key={perm} className="flex items-start gap-2">
                    <Lock className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>{perm}</strong> : {desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button onClick={onClose} className="flex-1 py-2.5 border text-slate-550 border-slate-200 text-xs font-bold rounded-xl bg-white hover:bg-slate-50">
                  Annuler
                </button>
                <button
                  onClick={onNextStep}
                  className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl cursor-pointer ${platform === 'Facebook' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                >
                  Continuer en tant qu'administrateur
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Pages */}
          {authModal.step === 2 && (
            <div className="p-6 space-y-5 bg-white">
              <div>
                <h4 className="text-slate-900 font-extrabold text-sm tracking-tight">Choisissez les pages à associer</h4>
                <p className="text-[11px] text-slate-500 font-serif">
                  Sélectionnez une ou plusieurs pages de mode pour synchroniser le live shopping.
                </p>
              </div>

              <div className="space-y-2">
                {pages.map((page) => {
                  const isChecked = authModal.selectedPageChoice.includes(page);
                  return (
                    <div
                      key={page}
                      onClick={() => onTogglePageChoice(page)}
                      className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isChecked ? 'bg-indigo-50/70 border-indigo-400' : 'border-slate-150 hover:bg-slate-50'}`}
                    >
                      <span className={`text-xs font-bold text-slate-800 ${platform === 'TikTok' ? 'font-mono' : ''}`}>{page}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={onPrevStep}
                  className="py-2.5 px-4 border text-slate-550 border-slate-200 text-xs font-bold rounded-xl bg-white hover:bg-slate-50"
                >
                  Retour
                </button>
                <button
                  onClick={onNextStep}
                  disabled={authModal.selectedPageChoice.length === 0}
                  className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                    authModal.selectedPageChoice.length === 0
                      ? 'bg-slate-300 cursor-not-allowed opacity-50'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Suivant ({authModal.selectedPageChoice.length} page(s))
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmed */}
          {authModal.step === 3 && (
            <div className="p-6 space-y-5 bg-white text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-900 font-extrabold text-base">Configuration Webhook Activée !</h4>
                <p className="text-xs text-slate-500 font-serif leading-relaxed px-2">
                  Les autorisations ont été accordées avec succès. Les serveurs de réception d'AZLive écoutent désormais vos ventes directes en temps réel.
                </p>
              </div>

              <button
                onClick={onCompleteIntegration}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Fermer la fenêtre et synchroniser ({authModal.selectedPageChoice.length})
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
