import React from 'react';
import { Printer } from 'lucide-react';

interface PreparationChecklistProps {
  orderId: string;
  jpCode: string;
  checklist: { read: boolean; picked: boolean; packed: boolean };
  onToggleChecklist: (orderId: string, flag: 'read' | 'picked' | 'packed') => void;
  onMarkPrinted: (orderId: string) => void;
}

export default function PreparationChecklist({
  orderId,
  jpCode,
  checklist,
  onToggleChecklist,
  onMarkPrinted
}: PreparationChecklistProps) {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-4">
      <div>
        <h4 className="font-extrabold text-slate-900 text-sm">Contrôle de Préparation</h4>
        <p className="text-xs text-slate-400 font-serif leading-normal mt-1">
          Protocole de mise en sachet d'AZLive. Cochez les étapes physiques réalisées :
        </p>
      </div>

      <div className="space-y-3.5">
        
        {/* Step 1: Secretary Read */}
        <button
          type="button"
          onClick={() => onToggleChecklist(orderId, 'read')}
          className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
            checklist.read 
              ? 'bg-slate-90 rounded-xl bg-slate-900 border-slate-950 text-white' 
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="mt-0.5">
            <span className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] font-black ${
              checklist.read ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400 text-slate-400'
            }`}>
              {checklist.read ? '✓' : '1'}
            </span>
          </div>
          <div>
            <p className="font-bold text-xs">Le secrétaire lit le ticket</p>
            <p className={`text-[10px] leading-normal ${checklist.read ? 'text-slate-300' : 'text-slate-500'}`}>
              Validation des données clients et du bon d'enchère.
            </p>
          </div>
        </button>

        {/* Step 2: Picker Collected */}
        <button
          type="button"
          onClick={() => onToggleChecklist(orderId, 'picked')}
          className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
            checklist.picked 
              ? 'bg-slate-900 border-slate-950 text-white' 
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="mt-0.5">
            <span className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] font-black ${
              checklist.picked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400 text-slate-400'
            }`}>
              {checklist.picked ? '✓' : '2'}
            </span>
          </div>
          <div>
            <p className="font-bold text-xs">Le préparateur cherche l'article</p>
            <p className={`text-[10px] leading-normal ${checklist.picked ? 'text-slate-300' : 'text-slate-500'}`}>
              Aller chercher le produit physique (ex: <strong className="font-mono">{jpCode}</strong>) dans le portant.
            </p>
          </div>
        </button>

        {/* Step 3: Packed inside bag */}
        <button
          type="button"
          onClick={() => onToggleChecklist(orderId, 'packed')}
          className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
            checklist.packed 
              ? 'bg-slate-900 border-slate-950 text-white' 
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <div className="mt-0.5">
            <span className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] font-black ${
              checklist.packed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400 text-slate-400'
            }`}>
              {checklist.packed ? '✓' : '3'}
            </span>
          </div>
          <div>
            <p className="font-bold text-xs">Le ticket est agrafé/inséré</p>
            <p className={`text-[10px] leading-normal ${checklist.packed ? 'text-slate-300' : 'text-slate-500'}`}>
              Le ticket papier est glissé dans le packaging scellé avec l'étiquette JP collée dessus.
            </p>
          </div>
        </button>

      </div>

      {/* TRIGGER PRINT BUTTON */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <button
          onClick={() => onMarkPrinted(orderId)}
          className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
        >
          <Printer className="h-4.5 w-4.5" /> Imprimer le Ticket de Colis (80mm)
        </button>
        <p className="text-[10px] text-slate-400 font-serif text-center">
          Marque automatiquement le colis comme prêt à être expédié.
        </p>
      </div>

    </div>
  );
}
