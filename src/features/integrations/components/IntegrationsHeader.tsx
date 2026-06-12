import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Facebook, Smartphone } from 'lucide-react';
import { playNotificationSound } from '../../sound';

interface IntegrationsHeaderProps {
  channelsCount: number;
  webhookAlert: string | null;
  onConnectFacebook: () => void;
  onConnectTikTok: () => void;
}

export default function IntegrationsHeader({
  channelsCount: _channelsCount,
  webhookAlert,
  onConnectFacebook,
  onConnectTikTok
}: IntegrationsHeaderProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
            ⚙️ Canaux & API Webhooks
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">Intégrations Sociales</h2>
          <p className="text-xs font-serif text-slate-500 mt-0.5">
            Connectez vos pages de live-selling et testez la détection d'achat instantanée en direct.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { onConnectFacebook(); playNotificationSound('click'); }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Facebook className="h-4 w-4 fill-current" />
            <span>Connecter Facebook</span>
          </button>

          <button
            onClick={() => { onConnectTikTok(); playNotificationSound('click'); }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Smartphone className="h-4 w-4" />
            <span>Connecter TikTok</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {webhookAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md border ${
              webhookAlert.includes('🟢') || webhookAlert.includes('Succès')
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}
          >
            <Sparkles className="h-4 w-4 animate-bounce text-emerald-600 flex-shrink-0" />
            <span>{webhookAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
