import React from 'react';
import { HelpCircle } from 'lucide-react';
import { playNotificationSound } from '../../sound';

interface AuthHeaderProps {
  onShowFaq: () => void;
}

export default function AuthHeader({ onShowFaq }: AuthHeaderProps) {
  return (
    <header className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-100 relative z-10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black tracking-tighter text-lg shadow-md shadow-indigo-100">
          AZ
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">AZLive Platform</span>
            <span className="bg-emerald-50 text-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-black border border-emerald-250 border-emerald-200">
              OFFICIEL
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-serif leading-none mt-0.5">Solution de Capture Après-Live Madagascar</p>
        </div>
      </div>

      <button 
        onClick={() => { playNotificationSound('click'); onShowFaq(); }}
        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
      >
        <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
        <span>Comment ça marche ?</span>
      </button>
    </header>
  );
}
