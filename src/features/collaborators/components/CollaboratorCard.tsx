import React from 'react';
import { Collaborator } from '../../../types';
import { Phone, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { playNotificationSound } from '../../../sound';

interface CollaboratorCardProps {
  collaborator: Collaborator;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const getRoleClass = (role: Collaborator['role']): string => {
  switch (role) {
    case 'Superviseur':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Commercial':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Modérateur':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Secrétaire':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function CollaboratorCard({ collaborator: col, onToggleStatus, onDelete }: CollaboratorCardProps) {
  return (
    <motion.div
      layout
      className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Photo & Role block */}
        <div className="flex items-start gap-3">
          <img
            src={col.avatar}
            alt={col.name}
            referrerPolicy="no-referrer"
            className="h-11 w-11 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
          />
          <div>
            <h3 className="font-extrabold text-slate-950 text-sm">{col.name}</h3>
            <div className="flex gap-1.5 items-center mt-1 flex-wrap">
              <span className={`px-2 py-0.2 rounded-md text-[9px] font-black border uppercase tracking-wider ${getRoleClass(col.role)}`}>
                {col.role}
              </span>
              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold font-mono ${
                col.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'
              }`}>
                {col.isActive ? '● En Ligne' : 'Hors-ligne'}
              </span>
            </div>
          </div>
        </div>

        {/* Telecoms and pages info */}
        <div className="text-xs space-y-2 pt-1 font-sans">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Phone className="h-3.5 w-3.5" /> {col.phone}
          </div>
          {col.connectedPages.length > 0 ? (
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-slate-400 font-bold block mr-1">Pages :</span>
              {col.connectedPages.map((page, pIdx) => (
                <span key={pIdx} className="bg-slate-50 text-slate-900 border text-[10px] px-1.5 py-0.2 rounded font-semibold font-sans">
                  {page}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 font-serif italic">
              Aucune page Facebook affectée pour le moment.
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Score stats list */}
      <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 grid grid-cols-3 gap-1 text-center">
        <div>
          <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Saisies</span>
          <span className="font-black text-slate-900 text-sm">{col.stats.claimsInputs} JP</span>
        </div>
        <div>
          <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Paiements</span>
          <span className="font-black text-slate-900 text-sm">{col.stats.validatedPayments} ok</span>
        </div>
        <div>
          <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Bordereaux</span>
          <span className="font-black text-slate-900 text-sm">{col.stats.ticketsPrinted} étq</span>
        </div>
      </div>

      {/* Quick actions bar */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => { onToggleStatus(col.id); playNotificationSound('click'); }}
          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border cursor-pointer ${
            col.isActive
              ? 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
          }`}
        >
          {col.isActive ? "Désactiver l'accès" : "Activer l'opérateur"}
        </button>

        <button
          onClick={() => {
            if (confirm(`Voulez-vous supprimer l'opérateur ${col.name} ?`)) {
              onDelete(col.id);
              playNotificationSound('click');
            }
          }}
          className="p-2 text-slate-400 hover:text-rose-600 rounded transition-colors"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
