import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FolderLock } from 'lucide-react';

interface ArchiveModalProps {
  isOpen: boolean;
  orderCount: number;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

export default function ArchiveModal({ isOpen, orderCount, onClose, onConfirm }: ArchiveModalProps) {
  const [archiveTitle, setArchiveTitle] = useState('');

  // Set default title when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const defaultTitle = `Live du ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}`;
      setArchiveTitle(defaultTitle);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(archiveTitle);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6.5 p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4"
            id="live-archive-modal-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base tracking-tight">Clôturer & Archiver la Session</h3>
                <p className="text-xs text-slate-400 font-serif mt-0.5">Sauvegarder les {orderCount} fiches et libérer l'écran pour un prochain Live</p>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-650"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">
                  Titre de la session de Live à enregistrer
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Live Dressing #15 - Robes de Dimanche"
                  value={archiveTitle}
                  onChange={(e) => setArchiveTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-serif leading-normal">
                  Toutes les ventes capturées seront stockées de manière permanente dans l'onglet <strong>"Historique des Lives"</strong>. Le tableau de bord principal sera réinitialisé pour accueillir un nouveau direct de vente.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-100"
                >
                  <FolderLock className="h-4 w-4" />
                  Confirmer l'archivage
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
