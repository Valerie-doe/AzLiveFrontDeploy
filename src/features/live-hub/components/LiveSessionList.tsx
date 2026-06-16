import React from 'react';
import { LiveSession, Order } from '../../../types';
import { playNotificationSound } from '../../../sound';
import LiveSessionCard from './LiveSessionCard';

interface LiveSessionListProps {
  activeAndCreatedSessions: LiveSession[];
  completedSessions: LiveSession[];
  orders: Order[];
  onConsult: (sessionId: string, firstOrderId?: string) => void;
  onEdit: (session: LiveSession) => void;
  onCreateClick: () => void;
}

export default function LiveSessionList({
  activeAndCreatedSessions,
  completedSessions,
  orders,
  onConsult,
  onEdit,
  onCreateClick,
}: LiveSessionListProps) {
  return (
    <div className="space-y-10">
      {/* DIRECTS EN COURS */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-950 text-sm flex items-center gap-2 uppercase tracking-wide font-mono text-red-500">
          <span className="inline-block h-2 w-2 rounded-full bg-red-400 animate-ping"></span>
          Lives en cours ({activeAndCreatedSessions.length})
        </h3>

        {activeAndCreatedSessions.length === 0 ? (
          <div className="bg-white border rounded-3xl p-8 text-center text-slate-400 border-dashed text-xs">
            <p>Aucun livestream direct n'est en cours.</p>
            <button
              onClick={() => {
                onCreateClick();
                playNotificationSound('click');
              }}
              className="mt-3.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-indigo-700 rounded-lg font-bold transition-colors cursor-pointer border-none"
            >
              Créer un nouveau live 📅
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAndCreatedSessions.map((session) => (
              <LiveSessionCard
                key={session.id}
                session={session}
                activeOrders={orders}
                onConsult={onConsult}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* ARCHIVES TERMINES */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-950 text-sm flex items-center gap-2 uppercase tracking-wide font-mono text-slate-500">
          Archives Terminées ({completedSessions.length})
        </h3>

        {completedSessions.length === 0 ? (
          <div className="bg-white border rounded-3xl p-8 text-center text-slate-400 border-dashed text-xs">
            Aucun livestream n'a été clôturé ou archivé pour l'instant.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {completedSessions.map((session) => (
              <LiveSessionCard
                key={session.id}
                session={session}
                activeOrders={session.orders || []}
                onConsult={onConsult}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
