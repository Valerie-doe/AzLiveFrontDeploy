import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Smartphone, ShieldCheck } from 'lucide-react';
import { playNotificationSound } from '../../sound';

interface PermissionsStepProps {
  selectedPlatform: 'Facebook' | 'TikTok';
  onBack: () => void;
  onAccept: () => void;
}

export default function PermissionsStep({ selectedPlatform, onBack, onAccept }: PermissionsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 md:p-8 space-y-5"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white ${
          selectedPlatform === 'Facebook' ? 'bg-blue-600' : 'bg-black'
        }`}>
          {selectedPlatform === 'Facebook' ? <Facebook className="h-5 w-5 fill-current" /> : <Smartphone className="h-5 w-5" />}
        </div>
        <div>
          <h2 className="font-extrabold text-slate-900 text-sm">Demande d'autorisation de l'API {selectedPlatform}</h2>
          <p className="text-[10px] text-indigo-600 font-mono font-bold uppercase mt-0.5">Demande d'accès par AZLive Platform</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-slate-600 leading-relaxed font-serif">
          Pour que le système de messagerie automatique puisse lire vos commentaires de live et envoyer des relances personnalisées aux clients de Madagascar, vous devez approuver l'accès aux permissions suivantes :
        </p>

        <div className="bg-slate-50 p-4 border rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-emerald-100 text-emerald-600 rounded-lg mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-800 block">Accès aux commentaires live</span>
              <p className="text-[10px] text-slate-400 leading-normal font-serif">
                Permet de scanner les commentaires des vidéos diffusées en direct (ex: les codes JP1, JP4).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 bg-emerald-100 text-emerald-600 rounded-lg mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-800 block">Gestion de la boîte de messagerie (Inbox)</span>
              <p className="text-[10px] text-slate-400 leading-normal font-serif">
                Permet d'envoyer instantanément le questionnaire de livraison ainsi que le coupon de confirmation aux acheteurs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1 bg-emerald-100 text-emerald-600 rounded-lg mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-800 block">Accès à la liste de vos pages approuvées</span>
              <p className="text-[10px] text-slate-400 leading-normal font-serif">
                Permet d'afficher et de sélectionner vos boutiques d'achat en toute simplicité.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom button controls */}
      <div className="flex items-center gap-2 pt-3 border-t">
        <button
          onClick={() => { playNotificationSound('click'); onBack(); }}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
        >
          Retour
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer text-center"
        >
          Accepter et continuer
        </button>
      </div>
    </motion.div>
  );
}
