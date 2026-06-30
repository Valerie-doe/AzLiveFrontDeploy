import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle, Copy, Eye } from 'lucide-react';
import { LiveSession } from '../../../types';

interface SessionCardProps {
  session: LiveSession;
  index: number;
  copiedId: string | null;
  onCopySummary: (session: LiveSession) => void;
  onSelectSession: (session: LiveSession) => void;
}

export default function SessionCard({
  session,
  index,
  copiedId,
  onCopySummary,
  onSelectSession
}: SessionCardProps) {
  const confirmedCount = session.orders.filter(o => o.status !== 'annulé').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Session Date badge & Code label */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 font-black px-2.5 py-1 rounded-lg">
            LIVE #{session.id.replace('live-', '')}
          </span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {session.date}
          </span>
        </div>

        {/* Title and stats preview */}
        <div>
          <h3 className="font-black text-slate-900 group-hover:text-indigo-600 text-sm leading-snug line-clamp-2">
            {session.title}
          </h3>
        </div>

        {/* Indicators grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-[9px] block uppercase font-mono text-slate-400 font-bold">CA Encaissé</span>
            <span className="font-extrabold text-slate-800">{session.revenue.toLocaleString()} Ar</span>
          </div>
          <div>
            <span className="text-[9px] block uppercase font-mono text-slate-400 font-bold">Securisés (JP)</span>
            <span className="font-extrabold text-slate-800">{confirmedCount} / {session.totalOrders}</span>
          </div>
        </div>
      </div>

      {/* Bottom interactive row */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
        <button
          onClick={() => onCopySummary(session)}
          className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 text-slate-400 rounded-xl transition-all cursor-pointer"
          title="Copier le récapitulatif pour les messages"
        >
          {copiedId === session.id ? (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={() => onSelectSession(session)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer border-none"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Jeter un oeil ({session.orders.length})</span>
        </button>
      </div>
    </motion.div>
  );
}
