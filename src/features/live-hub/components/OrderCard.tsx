import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, MessageSquare, RefreshCw } from 'lucide-react';
import { Order, Product, ChatStatus } from '../../../types';

interface OrderCardProps {
  ord: Order;
  positionInQueue: number;
  isOutOfStock: boolean;
  onTogglePriority: (id: string, current: boolean) => void;
  onUpdateChatStatus: (id: string, nextStatus: ChatStatus) => void;
  onTriggerManualReminder: (ord: Order) => void;
}

export default function OrderCard({
  ord,
  positionInQueue,
  isOutOfStock,
  onTogglePriority,
  onUpdateChatStatus,
  onTriggerManualReminder
}: OrderCardProps) {
  return (
    <motion.div
      layoutId={ord.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-2xl border transition-all ${
        ord.isPriority 
          ? 'bg-amber-50/60 border-amber-350 border-amber-300 shadow-sm shadow-amber-50' 
          : 'bg-white hover:bg-slate-50 border-slate-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: position badge, user handle and item name */}
        <div className="flex items-start gap-3">
          <div className={`h-12 w-12 rounded-xl text-white font-mono flex flex-col items-center justify-center flex-shrink-0 relative ${
            isOutOfStock 
              ? 'bg-rose-650 bg-rose-600 shadow-md shadow-rose-200' 
              : positionInQueue === 1 
                ? 'bg-emerald-600 shadow-md shadow-emerald-250 shadow-emerald-200' 
                : 'bg-slate-700'
          }`}>
            <span className="text-[9px] font-bold uppercase leading-3 tracking-wide">
              {isOutOfStock ? 'Rupture' : `JP #${positionInQueue}`}
            </span>
            <span className="text-base font-black">{ord.jpCode}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-black text-slate-900 text-sm hover:text-indigo-650 transition-colors">
                {ord.customerName}
              </h4>
              <span className="text-slate-400 font-mono text-xs">{ord.customerHandle}</span>
              {ord.isPriority && (
                <span className="bg-amber-100 text-amber-800 font-bold text-[9px] px-1.5 py-0.2 rounded uppercase tracking-wider flex items-center gap-0.5">
                  ⭐ VIP
                </span>
              )}
            </div>

            {/* Raw scraped comment displaying capture efficiency */}
            <p className="text-[11px] text-slate-500 font-mono italic mt-1.5 bg-slate-100 rounded px-2 py-0.5 inline-block">
              Commentaire détecté: <strong className="text-indigo-600 font-semibold">"{ord.commentSnippet || `${ord.jpCode} je prends`}"</strong>
            </p>

            <div className="text-[11px] text-slate-400 mt-1">
              Article associé: <strong className="text-slate-700 font-semibold">{ord.productName}</strong> • {ord.currency}{ord.price.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Right: Actions, dates, confirmation state */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between border-t sm:border-0 pt-2 sm:pt-0">
          <div className="text-right mr-2 hidden md:block">
            <span className="text-[9px] block uppercase font-mono text-slate-400 font-bold">Chronomètre</span>
            <span className="text-xs font-mono font-bold text-slate-700">{ord.orderTime}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onTogglePriority(ord.id, ord.isPriority)}
              className="bg-slate-50 hover:bg-amber-100 border border-slate-200 p-1.5 rounded-lg text-xs transition-colors"
              title="Changer priorité acquéreur"
            >
              ⭐
            </button>

            <button
              onClick={() => onUpdateChatStatus(ord.id, 'Confirmé')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-250 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Valider
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE MESSENGERS AUTOMATED BOX */}
      <div className="mt-3.5 bg-slate-50 border border-slate-100/80 p-3.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs leading-relaxed">
        
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-1.5 text-slate-400 font-sans text-[10px] font-bold uppercase">
            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
            <span>Message de confirmation automatique expédié</span>
          </div>
          <p className="text-slate-600 font-serif italic text-[11px]">
            "{ord.chatMessage}"
          </p>
        </div>

        {/* Reminders level checker */}
        <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-0 pt-3 md:pt-0">
          <div className="text-right">
            <span className="text-[9px] font-bold block uppercase tracking-wider text-slate-400 font-mono">Relances (Max 3)</span>
            <div className="flex gap-0.5 mt-0.5">
              {[1, 2, 3].map((num) => (
                <span 
                  key={num}
                  className={`h-2 w-2 rounded-full ${
                    ord.remindersCount >= num 
                      ? 'bg-rose-500 animate-pulse' 
                      : 'bg-slate-200'
                  }`}
                  title={`Relance ${num}`}
                ></span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
              ord.chatStatus === 'Confirmé' 
                ? 'bg-emerald-105 bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {ord.chatStatus}
            </span>

            <button
              onClick={() => onTriggerManualReminder(ord)}
              className="bg-slate-200 hover:bg-slate-350 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded text-[11px] font-extrabold flex items-center gap-0.5 shadow-xs transition-all"
              title="Relancer automatiquement le client (Toutes les 30 min / Max 3 relances)"
              id={`reminder-btn-${ord.id}`}
            >
              <RefreshCw className="h-3 w-3" /> Relance Auto
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
