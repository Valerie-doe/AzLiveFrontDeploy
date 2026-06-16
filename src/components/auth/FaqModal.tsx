import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6.5 p-6 max-w-md w-full border border-slate-150 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base tracking-tight">Foire Aux Questions (FAQ)</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-serif font-serif">Aide rapide sur l'autorisation d'AZLive</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed max-h-[300px] overflow-y-auto pr-1">
              <div>
                <h4 className="font-extrabold text-slate-900">Est-ce que je risque de bloquer ma page réelle ?</h4>
                <p className="font-serif text-[11px] text-slate-500 pl-3">
                  Absolument pas. L'application utilise l'API de test (mode bac à sable). Vos véritables identifiants ne quittent jamais votre navigateur, éliminant tout risque opérationnel.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900">Que font les permissions demandées ?</h4>
                <p className="font-serif text-[11px] text-slate-500 pl-3">
                  Elles permettent au robot de lire en direct les commentaires du livestream contenant les mots-clés ("maka JP1", "JP2 kely") et de répondre par Messenger aux acheteurs pour les relancer.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900">Comment déconnecter ou changer de page ?</h4>
                <p className="font-serif text-[11px] text-slate-500 pl-3">
                  Une fois dans l'application, l'onglet "Canaux" (IntegrationsView) vous permet d'activer ou désactiver les webhooks d'achats individuels ou de vous déconnecter en un clic.
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
              >
                OK, Compris !
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
