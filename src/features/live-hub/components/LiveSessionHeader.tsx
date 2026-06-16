import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { LiveSession } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { formatLiveDate } from '../utils/dateUtils';

interface LiveSessionHeaderProps {
  selectedSession: LiveSession;
  onBack: () => void;
  onStartLive: () => void;
  onCloseLive: () => void;
  onPrintTickets: () => void;
}

export default function LiveSessionHeader({
  selectedSession,
  onBack,
  onStartLive,
  onCloseLive,
  onPrintTickets,
}: LiveSessionHeaderProps) {
  const handleBackClick = () => {
    onBack();
    playNotificationSound('click');
  };

  const handleStartClick = () => {
    onStartLive();
  };

  const handleCloseClick = () => {
    onCloseLive();
  };

  const handlePrintClick = () => {
    onPrintTickets();
    playNotificationSound('click');
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackClick}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border text-slate-650 rounded-xl transition-colors cursor-pointer"
          title="Retour à l'Espace Commercial"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                selectedSession.status === 'En cours'
                  ? 'bg-red-100 text-red-800 animate-pulse'
                  : selectedSession.status === 'Créé'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-slate-100 text-slate-705'
              }`}
            >
              {selectedSession.status === 'En cours'
                ? 'Direct En Cours 📡'
                : selectedSession.status === 'Créé'
                ? 'Direct Créé / Non lancé 📅'
                : 'Direct Terminé 📁'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-serif font-medium">
              {formatLiveDate(selectedSession.date)}
            </span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-base md:text-lg mt-1">
            {selectedSession.title}
          </h3>
        </div>
      </div>

      {/* Action buttons depending on live state */}
      {selectedSession.status === 'Créé' && (
        <button
          onClick={handleStartClick}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white rounded-xl text-xs font-black uppercase transition-all cursor-pointer shadow-md border-none"
        >
          Lancer le Live 🚀
        </button>
      )}

      {selectedSession.status === 'En cours' && (
        <button
          onClick={handleCloseClick}
          className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase transition-all cursor-pointer border-none"
        >
          Clôturer le Live & Archiver Ventes
        </button>
      )}

      {selectedSession.status === 'Terminé' && (
        <button
          onClick={handlePrintClick}
          className="px-5 py-2.5 bg-indigo-605 bg-indigo-600 hover:bg-indigo-705 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-2 shadow-sm border-none"
        >
          <Printer className="h-4 w-4" /> Imprimer tickets produits
        </button>
      )}
    </div>
  );
}
