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
    <div className="lg:hidden sticky top-0 z-40 bg-primary border-b border-secondary h-16 w-full px-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <img src="https://res.cloudinary.com/dj9qwddts/image/upload/v1784121065/Logo_gmt4mc.png" alt="AZLive" className="h-9 w-9 rounded-xl object-cover shadow-xs" />
        <div>
          <span className="font-black text-sm text-secondary block">AZLive</span>
          <span className="bg-accent text-secondary text-[8px] px-1.5 py-0.2 rounded font-extrabold ml-1.5 border border-secondary">
            MADA
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Quick info icon */}
        <button
          onClick={onShowGuide}
          className="p-2 text-secondary hover:text-primary hover:bg-accent rounded-lg transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        
        {/* Burger menu toggler */}
        <button
          onClick={() => {
            onToggleMobileMenu();
            playNotificationSound('click');
          }}
          className="p-2 text-secondary hover:text-primary hover:bg-accent rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
