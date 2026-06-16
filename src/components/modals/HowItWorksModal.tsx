import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export default function HowItWorksModal({ onClose }: HowItWorksModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-100 shadow-2xl space-y-4"
        id="concept-overview-drawer"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Comment AZLive Révolutionne le Live
            </h3>
            <p className="text-xs text-slate-400 font-serif mt-0.5">
              Console de centralisation après-live pour Madagascar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-105 rounded text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-4 border border-slate-150 border-slate-100 rounded-2xl space-y-3.5 text-xs text-slate-700 leading-relaxed">
          <div>
            <h4 className="font-black text-slate-900 flex items-center gap-1">
              🏷️ 1. Dressing Virtuel & Codes JP
            </h4>
            <p className="pl-4 font-serif">
              Enregistrez vos vêtements ou accessoires dans le dressing (Taille, couleur, prix,
              stock). Le code (ex: JP1) sert de clé d'achat.
            </p>
          </div>

          <div>
            <h4 className="font-black text-slate-900 flex items-center gap-1">
              ⚡ 2. Capture Automatique des JP
            </h4>
            <p className="pl-4 font-serif">
              Pendant que vous filmez sur Facebook ou TikTok, les serveurs détectent
              instantanément les commentaires (ex: "JP1 rouge", "maka JP2 izaho") et trient les
              acheteurs à la milliseconde près !
            </p>
          </div>

          <div>
            <h4 className="font-black text-slate-900 flex items-center gap-1">
              💬 3. Relances Automates
            </h4>
            <p className="pl-4 font-serif">
              Le chatbot envoie de suite un questionnaire de livraison pré-rempli (nom, adresse,
              téléphone, date). Il effectue jusqu'à 3 relances automatiques en cas d'absence de
              réponse pour éviter de perdre l'article.
            </p>
          </div>

          <div>
            <h4 className="font-black text-slate-900 flex items-center gap-1">
              📦 4. Impression & Transmission AZExpress
            </h4>
            <p className="pl-4 font-serif">
              Imprimez vos étiquettes adhésives pour cartonnette de paquet puis transférez
              instantanément vos colis préparés à la logistique d'expédition d'AZExpress.
            </p>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase border-none cursor-pointer"
          >
            J'ai compris, merci !
          </button>
        </div>
      </motion.div>
    </div>
  );
}
