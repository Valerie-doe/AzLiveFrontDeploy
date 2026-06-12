import React, { useState } from 'react';
import { Collaborator } from '../../../types';
import { Shield, X, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { playNotificationSound } from '../../../sound';

interface CollaboratorFormProps {
  onSubmit: (collab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>) => void;
  onClose: () => void;
}

export default function CollaboratorForm({ onSubmit, onClose }: CollaboratorFormProps) {
  const [newCollab, setNewCollab] = useState({
    name: '',
    role: 'Commercial' as Collaborator['role'],
    phone: '',
    connectedPages: [] as string[],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });
  const [inputTextPage, setInputTextPage] = useState('');

  const handleAddPage = () => {
    if (inputTextPage.trim()) {
      setNewCollab((prev) => ({
        ...prev,
        connectedPages: [...prev.connectedPages, inputTextPage.trim()],
      }));
      setInputTextPage('');
      playNotificationSound('click');
    }
  };

  const handleRemovePage = (p: string) => {
    setNewCollab((prev) => ({
      ...prev,
      connectedPages: prev.connectedPages.filter((x) => x !== p),
    }));
    playNotificationSound('click');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollab.name.trim()) {
      alert("S'il vous plaît, renseignez le nom du collaborateur.");
      return;
    }
    onSubmit(newCollab);
    playNotificationSound('confirm');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 transition-all" id="recruitment-modal">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={() => { onClose(); playNotificationSound('click'); }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-5 overflow-y-auto max-h-[90vh] z-10"
      >
        {/* Close button X */}
        <button
          onClick={() => { onClose(); playNotificationSound('click'); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer border-none"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex gap-2.5 items-center">
          <div className="h-9 w-9 bg-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight">Poste d'Opérateur Live</h3>
            <p className="text-[10px] text-indigo-200 font-serif mt-0.5">Saisie et secrétariat des flux d'achats</p>
          </div>
        </div>

        <p className="text-xs text-indigo-150 font-serif leading-relaxed">
          Configurez un profil d'agent. L'agent possède des permissions modulaires pour saisir les commandes et archiver les fiches d'achats mada.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-indigo-200 block mb-1 font-mono uppercase text-[9px] font-bold">Nom de l'agent</label>
            <input
              type="text"
              required
              placeholder="Ex : Mialy Rakotobe"
              value={newCollab.name}
              onChange={(e) => setNewCollab({ ...newCollab, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-850/80 border border-slate-700 rounded-xl focus:ring-1 focus:ring-indigo-500 text-white font-semibold text-xs placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-indigo-200 block mb-1 font-mono uppercase text-[9px] font-bold">Rôle principal</label>
              <select
                value={newCollab.role}
                onChange={(e) => setNewCollab({ ...newCollab, role: e.target.value as Collaborator['role'] })}
                className="w-full px-2 py-2.5 bg-slate-850/80 border border-slate-700 rounded-xl text-white font-bold cursor-pointer"
              >
                <option value="Commercial">Commercial</option>
                <option value="Modérateur">Modérateur</option>
                <option value="Secrétaire">Secrétaire</option>
                <option value="Superviseur">Superviseur</option>
              </select>
            </div>
            <div>
              <label className="text-indigo-200 block mb-1 font-mono uppercase text-[9px] font-bold">Contact Téléphone</label>
              <input
                type="text"
                placeholder="034 15 221 00"
                value={newCollab.phone}
                onChange={(e) => setNewCollab({ ...newCollab, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-850/80 border border-slate-700 rounded-xl focus:ring-1 focus:ring-indigo-500 text-white font-mono text-xs placeholder-slate-500"
              />
            </div>
          </div>

          {/* Connected Facebook Pages */}
          <div>
            <label className="text-indigo-200 block mb-1 font-mono uppercase text-[9px] font-bold">Affectation Pages Facebook</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Boutique Chic Mada..."
                value={inputTextPage}
                onChange={(e) => setInputTextPage(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-850/80 border border-slate-700 rounded-xl text-white font-semibold text-xs placeholder-slate-500"
              />
              <button
                type="button"
                onClick={handleAddPage}
                className="px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-bold text-xs cursor-pointer"
              >
                Ajouter
              </button>
            </div>
            {newCollab.connectedPages.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                {newCollab.connectedPages.map((p, idx) => (
                  <span key={idx} className="bg-indigo-900/50 text-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                    {p}
                    <button onClick={() => handleRemovePage(p)} className="text-indigo-400 hover:text-white cursor-pointer" type="button">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => { onClose(); playNotificationSound('click'); }}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer border-none"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> Intégrer l'agent au secrétariat
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
