import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Smartphone, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onStartAuth: (platform: 'Facebook' | 'TikTok') => void;
  onBypassAuth: () => void;
}

export default function WelcomeStep({ onStartAuth, onBypassAuth }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="p-6 md:p-8 space-y-6"
    >
      <div className="text-center space-y-2.5">
        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-black uppercase tracking-wider inline-block">
          🔐 Passerelle d'accès sécurisée
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Connectez vos comptes sociaux</h1>
        <p className="text-xs font-serif text-slate-500 leading-relaxed max-w-sm mx-auto">
          Afin d'accéder au Live Shopping Hub et de démarrer la capture automatique des codes JP, veuillez connecter une page Facebook ou un compte TikTok.
        </p>
      </div>

      {/* Simulated Authentication Platform Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => onStartAuth('Facebook')}
          className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-md shadow-blue-150 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Facebook className="h-5 w-5 fill-current" />
            <span>Se connecter avec Facebook Business</span>
          </div>
          <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onStartAuth('TikTok')}
          className="w-full py-3 px-5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-md shadow-slate-150 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5" />
            <span>Se connecter avec TikTok Creator Studio</span>
          </div>
          <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Quick/Demo Access Options */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider">Mode Démonstration</span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
        <div>
          <span className="font-extrabold text-xs text-slate-900 block">Accès rapide de démonstration</span>
          <p className="text-[10px] font-serif text-slate-400 mt-0.5">Permet d'explorer l'application avec 3 canaux pré-connectés.</p>
        </div>
        <button
          onClick={onBypassAuth}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 font-extrabold text-xs rounded-xl border border-indigo-200 shrink-0 cursor-pointer shadow-xs transition-all"
        >
          Entrer sans lier
        </button>
      </div>

      {/* Notice text */}
      <p className="text-[10px] font-serif text-center text-slate-450 text-slate-400 leading-normal">
        🔒 Vos données de connexion sont traitées via une interface sandbox isolée. Aucune information confidentielle de vos comptes réels n'est capturée.
      </p>
    </motion.div>
  );
}
