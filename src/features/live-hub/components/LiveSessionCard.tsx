import React from 'react';
import { LiveSession, Order } from '../../../types';
import { ChevronRight } from 'lucide-react';
import { playNotificationSound } from '../../../sound';
import { formatLiveDate } from '../utils/dateUtils';

interface LiveSessionCardProps {
  session: LiveSession;
  activeOrders: Order[];
  onConsult: (sessionId: string, firstOrderId?: string) => void;
  onEdit: (session: LiveSession) => void;
}

export default function LiveSessionCard({ session, activeOrders, onConsult, onEdit }: LiveSessionCardProps) {
  const isActive = session.status === 'En cours';
  const isCompleted = session.status === 'Terminé';

  if (isCompleted) {
    const ordersCount = session.totalOrders ?? session.orders?.length ?? 0;
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                LIVE ARCHIVÉ #{session.id}
              </span>
              <h4 className="font-black text-slate-950 mt-2 text-sm leading-snug">{session.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatLiveDate(session.date)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-[8px] block uppercase font-mono text-slate-400 font-bold">Chiffre d'Affaires</span>
              <span className="font-black text-slate-855 font-sans text-indigo-600">{session.revenue.toLocaleString()} Ar</span>
            </div>
            <div>
              <span className="text-[8px] block uppercase font-mono text-slate-400 font-bold">Fiches d'achats</span>
              <span className="font-black text-slate-850 font-sans">{ordersCount} fiches</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
          <span className="text-[10px] text-slate-400 font-serif lowercase italic">Par {session.assignedCollaborator}</span>
          <button
            onClick={() => {
              const firstOrderId = session.orders?.[0]?.id;
              onConsult(session.id, firstOrderId);
              playNotificationSound('click');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase flex items-center gap-1 cursor-pointer transition-colors border"
          >
            Consulter <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border transition-all p-5 relative overflow-hidden ${
      isActive ? 'border-rose-100 hover:border-red-500 shadow-sm' : 'border-indigo-100 hover:border-indigo-500 shadow-sm'
    }`}>
      {isActive ? (
        <div className="absolute top-0 right-0 h-1 md:h-1.5 w-full bg-gradient-to-r from-red-500 to-amber-500 animate-pulse"></div>
      ) : (
        <div className="absolute top-0 right-0 h-1 md:h-1.5 w-full bg-gradient-to-r from-indigo-500 to-indigo-300"></div>
      )}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
              isActive ? 'bg-red-100 text-red-800' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {isActive ? 'DÉTECTION ACTIVE Direct' : 'PROGRAMMÉ / CRÉÉ 📅'}
            </span>
            <h4 className="font-black text-slate-950 mt-2 text-sm leading-snug">{session.title}</h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatLiveDate(session.date)}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[8px] uppercase font-mono text-slate-400 block font-bold">Opérateur</span>
            <span className="font-extrabold text-slate-800">{session.assignedCollaborator}</span>
          </div>
          <div>
            <span className="text-[8px] uppercase font-mono text-slate-400 block font-bold">
              {isActive ? 'Commandes Capturées' : 'Ventes'}
            </span>
            <span className={`font-extrabold font-sans ${isActive ? 'text-indigo-650' : 'text-slate-500 text-[11px]'}`}>
              {isActive ? `${activeOrders.length} ventes` : 'Pas encore lancé'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => { onEdit(session); playNotificationSound('click'); }}
            className="px-3.5 py-2 hover:bg-slate-100 text-indigo-600 hover:text-indigo-700 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 bg-indigo-50/40"
          >
            Modifier 📝
          </button>
          <button
            onClick={() => {
              const firstOrderId = isActive && activeOrders.length > 0 ? activeOrders[0].id : undefined;
              onConsult(session.id, firstOrderId);
              playNotificationSound('click');
            }}
            className={`px-4.5 py-2.5 border rounded-xl text-xs font-black uppercase flex items-center gap-1 cursor-pointer transition-colors ${
              isActive
                ? 'bg-slate-900 border border-slate-900 hover:bg-slate-850 text-white'
                : 'bg-indigo-600 border border-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Consulter le Live <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
