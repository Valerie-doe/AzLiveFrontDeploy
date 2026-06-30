import React, { useState } from 'react';
import { LiveSession } from '../types';
import { Tv, Search, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import SessionCard from '../features/live-hub/components/SessionCard';
import SessionDetailView from '../features/live-hub/components/SessionDetailView';

interface LiveHistoryViewProps {
  liveSessions: LiveSession[];
  onDeleteSession?: (id: string) => void;
}

export default function LiveHistoryView({ liveSessions, onDeleteSession }: LiveHistoryViewProps) {
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter sessions
  const filteredSessions = liveSessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopySummary = (session: LiveSession) => {
    const lines = [
      `📊 RÉCAPITULATIF : ${session.title}`,
      `📅 Date : ${session.date}`,
      `📦 Commandes totales : ${session.totalOrders}`,
      `💰 Chiffre d'Affaires : ${session.revenue.toLocaleString()} Ar`,
      `---`,
      ...session.orders.map((o, idx) => 
        `${idx + 1}. [${o.jpCode}] ${o.customerName} - Tél: ${o.customerPhone || 'Non spécifié'} - Statut: ${o.status}`
      )
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedId(session.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (selectedSession) {
    return (
      <SessionDetailView
        session={selectedSession}
        onBack={() => {
          setSelectedSession(null);
          setSearchTerm('');
        }}
        copiedId={copiedId}
        onCopySummary={handleCopySummary}
      />
    );
  }

  return (
    <div className="space-y-6" id="history-dashboard-container">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Tv className="h-5.5 w-5.5 text-indigo-600" />
            Historique des Ventes Past-Live
          </h2>
          <p className="text-xs text-slate-400 font-serif mt-1">
            Recherchez et inspectez les données de vente de vos anciens livestreams Facebook & TikTok.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre de live, date..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHistoryPage(1);
            }}
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-105 p-12 text-center text-slate-400 max-w-lg mx-auto border-dashed">
          <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2 stroke-1" />
          <h3 className="font-extrabold text-slate-700">Aucun Live shopping archivé</h3>
          <p className="text-xs mt-1">
            Lancez un live, cumulez des captures de JP puis clôturez la session en cliquant sur le bouton d'archivage dans la cabine de pilotage !
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE);
              const activePage = Math.min(historyPage, Math.max(1, totalPages));
              const displayedSessions = filteredSessions.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

              return displayedSessions.map((session, idx) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  index={idx}
                  copiedId={copiedId}
                  onCopySummary={handleCopySummary}
                  onSelectSession={(s) => {
                    setSelectedSession(s);
                    setSearchTerm('');
                  }}
                />
              ));
            })()}
          </div>

          {/* PAGINATION CONTROLS FOR HISTORY SESSIONS GRID */}
          {filteredSessions.length > ITEMS_PER_PAGE && (
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 font-semibold">
                Sessions {((historyPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(historyPage * ITEMS_PER_PAGE, filteredSessions.length)} sur {filteredSessions.length} enregistrées
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={historyPage === 1}
                  onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
                  className="p-2 px-3.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Précédent
                </button>
                <span className="text-xs font-mono font-bold text-slate-800 px-3">
                  Page {historyPage} / {Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  disabled={historyPage === Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)}
                  onClick={() => setHistoryPage(prev => Math.min(Math.ceil(filteredSessions.length / ITEMS_PER_PAGE), prev + 1))}
                  className="p-2 px-3.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                >
                  Suivant <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
