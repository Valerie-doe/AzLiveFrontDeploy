import React from 'react';
import { motion } from 'motion/react';
import { playNotificationSound } from '../../sound';

interface SelectPagesStepProps {
  selectedPlatform: 'Facebook' | 'TikTok';
  availablePages: string[];
  selectedPages: string[];
  onTogglePage: (page: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export default function SelectPagesStep({
  selectedPlatform,
  availablePages,
  selectedPages,
  onTogglePage,
  onBack,
  onConfirm
}: SelectPagesStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 md:p-8 space-y-5"
    >
      <div>
        <h2 className="font-black text-slate-900 text-lg">Sélectionnez vos pages de vente</h2>
        <p className="text-xs text-slate-400 font-serif mt-0.5">
          Sélectionnez les pages qui diffuseront vos livestreams. AZLive écoutera les commentaires sur ces canaux.
        </p>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {availablePages.map((page) => {
          const isChecked = selectedPages.includes(page);
          return (
            <div
              key={page}
              onClick={() => onTogglePage(page)}
              className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                isChecked 
                  ? 'bg-indigo-50/75 border-indigo-400 shadow-xs' 
                  : 'border-slate-150 hover:bg-slate-50 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs text-white ${
                  selectedPlatform === 'Facebook' ? 'bg-blue-600' : 'bg-black'
                }`}>
                  {page.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{page}</span>
                  <span className="text-[10px] font-mono text-slate-400">Canal {selectedPlatform} • Prêt !</span>
                </div>
              </div>

              <input 
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // handled by click container
                className="h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer border-slate-300"
              />
            </div>
          );
        })}
      </div>

      {/* Bottom navigation buttons */}
      <div className="flex items-center gap-2 pt-3 border-t">
        <button
          onClick={() => { playNotificationSound('click'); onBack(); }}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
        >
          Retour
        </button>
        <button
          onClick={onConfirm}
          disabled={selectedPages.length === 0}
          className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl text-center shadow-md transition-all ${
            selectedPages.length === 0
              ? 'bg-slate-300 shadow-none cursor-not-allowed opacity-55'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 cursor-pointer'
          }`}
        >
          Valider {selectedPages.length} canal/canaux
        </button>
      </div>
    </motion.div>
  );
}
