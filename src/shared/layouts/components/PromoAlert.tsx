import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromoAlertProps {
  onShowGuide: () => void;
}

export default function PromoAlert({ onShowGuide }: PromoAlertProps) {
  return (
    <div className="bg-indigo-900 text-indigo-100 text-[11px] font-sans md:text-xs py-2 px-4 text-center flex items-center justify-center gap-2 border-b border-indigo-950 font-medium w-full">
      <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
      <span>Solution AZLive Madagascar • Capture intelligente des commentaires d'achats live Facebook.</span>
      <button 
        onClick={onShowGuide}
        className="underline font-bold text-white hover:text-amber-300 ml-1.5"
      >
        Guide
      </button>
    </div>
  );
}
