import React from 'react';
import { HelpCircle } from 'lucide-react';
import { playNotificationSound } from '../../sound';

interface AuthHeaderProps {
  onShowFaq: () => void;
}

export default function AuthHeader({ onShowFaq }: AuthHeaderProps) {
  return (
    <header className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-secondary relative z-10 bg-primary">
      <div className="flex items-center gap-3">
        <img src="/src/assets/logo/Logo.png" alt="AZLive" className="h-10 w-10 rounded-xl object-cover shadow-md shadow-secondary" />
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-secondary tracking-tight">AZLive Platform</span>
            <span className="bg-accent text-secondary text-[8px] px-1.5 py-0.2 rounded font-black border border-secondary">
              OFFICIEL
            </span>
          </div>
          <p className="text-[10px] text-secondary font-serif leading-none mt-0.5">Solution de Capture Après-Live Madagascar</p>
        </div>
      </div>

      <button 
        onClick={() => { playNotificationSound('click'); onShowFaq(); }}
        className="px-3.5 py-1.5 bg-primary border border-secondary hover:bg-accent rounded-xl text-xs font-bold text-secondary flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
      >
        <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
        <span>Comment ça marche ?</span>
      </button>
    </header>
  );
}
