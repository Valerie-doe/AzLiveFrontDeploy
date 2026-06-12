import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessStepProps {
  selectedPlatform: 'Facebook' | 'TikTok';
  selectedPages: string[];
  onFinalEnter: () => void;
}

export default function SuccessStep({ selectedPlatform, selectedPages, onFinalEnter }: SuccessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 md:p-8 text-center space-y-5"
    >
      <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-200 shadow-xs">
        <CheckCircle className="h-8 w-8 text-emerald-500" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-slate-900 font-extrabold text-lg">Connexion Réussie !</h3>
        <p className="text-xs text-slate-500 font-serif leading-relaxed px-2">
          Votre passerelle est initialisée. {selectedPages.length} canal/canaux d'interaction de {selectedPlatform} écoutent activement vos livestreams en temps réel.
        </p>
      </div>

      {/* Preview chosen pages */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200 text-left max-w-sm mx-auto">
        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-1">Boutiques raccordées :</span>
        <div className="space-y-1">
          {selectedPages.map(page => (
            <span key={page} className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-bold font-mono text-[9.5px] mr-1.5 select-none">
              🟢 {page}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onFinalEnter}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all pt-2.5"
      >
        <span>Entrer dans l'Application AZLive</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
