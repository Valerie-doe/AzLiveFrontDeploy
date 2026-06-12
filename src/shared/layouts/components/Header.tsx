import React from 'react';
import { HelpCircle, Menu, X } from 'lucide-react';
import { playNotificationSound } from '../../services/sound';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onShowGuide: () => void;
}

export default function Header({ isMobileMenuOpen, onToggleMobileMenu, onShowGuide }: HeaderProps) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 h-16 w-full px-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black tracking-tighter text-base">
          AZ
        </div>
        <div>
          <span className="font-black text-sm text-slate-955 block">AZLive</span>
          <span className="bg-emerald-50 text-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-extrabold ml-1.5 border border-emerald-250 border-emerald-200">
            MADA
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Quick info icon */}
        <button
          onClick={onShowGuide}
          className="p-2 text-slate-500 hover:text-slate-955 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        
        {/* Burger menu toggler */}
        <button
          onClick={() => {
            onToggleMobileMenu();
            playNotificationSound('click');
          }}
          className="p-2 text-slate-600 hover:text-slate-955 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
