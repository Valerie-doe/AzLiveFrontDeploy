import React from 'react';
import { Collaborator, LiveSession } from '../../../types';
import { X, Check, Sparkles } from 'lucide-react';
import { playNotificationSound } from '../../../sound';

interface LiveCreateFormProps {
  collaborators: Collaborator[];
  liveTitle: string;
  setLiveTitle: (val: string) => void;
  liveDate: string;
  setLiveDate: (val: string) => void;
  selectedPages: string[];
  setSelectedPages: (pages: string[]) => void;
  assignedCollabName: string;
  setAssignedCollabName: (val: string) => void;
  editingSessionId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function LiveCreateForm({
  collaborators,
  liveTitle,
  setLiveTitle,
  liveDate,
  setLiveDate,
  selectedPages,
  setSelectedPages,
  assignedCollabName,
  setAssignedCollabName,
  editingSessionId,
  onSubmit,
  onCancel,
}: LiveCreateFormProps) {
  const facebookPages = [
    'Boutique Chic Madagascar',
    'AZLive Fashion',
    'Tana Dressing Mada',
    'L\'armoire des Princesses',
  ];

  const handleTogglePageSelection = (page: string) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter((p) => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
    playNotificationSound('click');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md">
      <div className="flex justify-between items-center pb-4 border-b">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 uppercase font-mono text-indigo-600">
          <Sparkles className="h-4 w-4" />{' '}
          {editingSessionId ? 'Modification du Live Direct' : "Paramétrage d'un nouveau Live Direct"}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-6 pt-4 text-xs">
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">
              Nom / Titre du Direct
            </label>
            <input
              type="text"
              placeholder="Ex : Vente Flash Dressing D'Hiver Mada..."
              value={liveTitle}
              onChange={(e) => setLiveTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">
                Date et Heure de Diffusion
              </label>
              <input
                type="datetime-local"
                value={liveDate}
                onChange={(e) => setLiveDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white cursor-pointer font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">
                Commercial Principal Assigné
              </label>
              <select
                value={assignedCollabName}
                onChange={(e) => setAssignedCollabName(e.target.value)}
                className="w-full px-2 py-2.5 border border-slate-200 rounded-xl bg-white font-bold text-xs"
              >
                <option value="">Sélectionner un collaborateur...</option>
                {collaborators.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1.5 font-mono uppercase text-[9px] font-bold">
              Relier à vos pages Facebook
            </label>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
              {facebookPages.map((page) => {
                const isSelected = selectedPages.includes(page);
                return (
                  <div
                    key={page}
                    onClick={() => handleTogglePageSelection(page)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-400 text-indigo-900 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span className="truncate">{page}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 hover:bg-slate-50 border rounded-xl"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all"
          >
            {editingSessionId ? 'Enregistrer les modifications 💾' : 'Enregistrer & Créer le Live 📅'}
          </button>
        </div>
      </form>
    </div>
  );
}
