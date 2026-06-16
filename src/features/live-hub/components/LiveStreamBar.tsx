import React from 'react';
import { Volume2, VolumeX, Sparkles, FolderLock } from 'lucide-react';
import { playNotificationSound } from '../../../sound';

interface LiveStreamBarProps {
  playSound: boolean;
  setPlaySound: (val: boolean) => void;
  simulationActive: boolean;
  setSimulationActive: (val: boolean) => void;
  onOpenArchive: () => void;
}

export default function LiveStreamBar({
  playSound,
  setPlaySound,
  simulationActive,
  setSimulationActive,
  onOpenArchive
}: LiveStreamBarProps) {
  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <span className="absolute inline-flex h-4.5 w-4.5 rounded-full bg-red-500 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg md:text-xl font-bold tracking-tight">Flux Facebook Live en cours</h2>
            <span className="bg-red-500/10 text-red-500 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-red-500/20 uppercase tracking-widest animate-pulse">
              Direct Tana
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-serif">
            Scan intelligent de commentaires Facebook & TikTok. Capture des mots clés "JP" et "Je prends".
          </p>
        </div>
      </div>

      {/* SOUND AND SIMULATION ALGORITHMS */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
        <button
          onClick={() => {
            setPlaySound(!playSound);
            playNotificationSound('click');
          }}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            playSound 
              ? 'bg-slate-900 border-indigo-500/30 text-indigo-400 hover:bg-slate-800' 
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
          }`}
          title={playSound ? "Bip d'alerte activé" : "Muet d'alerte"}
          id="control-notification-bip"
        >
          {playSound ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>

        <button
          onClick={() => {
            setSimulationActive(!simulationActive);
            playNotificationSound('click');
          }}
          className={`px-4 py-2.5 rounded-xl border font-extrabold text-xs tracking-wide uppercase flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
            simulationActive 
              ? 'bg-red-950/20 border-red-500/30 text-red-500' 
              : 'bg-slate-900 border-slate-850 border-slate-800 text-slate-400'
          }`}
          id="control-live-simulation-toggle"
        >
          <Sparkles className="h-4 w-4" />
          {simulationActive ? 'Flux simulation actif' : 'Démarrer Flux'}
        </button>

        <button
          onClick={onOpenArchive}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs tracking-wider uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-lg select-none cursor-pointer"
          id="control-cloturer-live"
          title="Terminer le direct actuel et archiver les fiches de vente"
        >
          <FolderLock className="h-4 w-4" />
          Clôturer le Live
        </button>
      </div>
    </div>
  );
}
