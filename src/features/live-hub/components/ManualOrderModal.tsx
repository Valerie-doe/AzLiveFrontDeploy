import React from 'react';
import { motion } from 'motion/react';
import { PlusCircle, X, Check } from 'lucide-react';
import { Product, LiveSession, ChatStatus } from '../../../types';

interface ManualOrderModalProps {
  products: Product[];
  selectedSession: LiveSession;
  manualOrderJpCode: string;
  setManualOrderJpCode: (code: string) => void;
  manualOrderCustomerName: string;
  setManualOrderCustomerName: (name: string) => void;
  manualOrderChatStatus: ChatStatus;
  setManualOrderChatStatus: (status: ChatStatus) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ManualOrderModal({
  products,
  selectedSession,
  manualOrderJpCode,
  setManualOrderJpCode,
  manualOrderCustomerName,
  setManualOrderCustomerName,
  manualOrderChatStatus,
  setManualOrderChatStatus,
  onClose,
  onSubmit,
}: ManualOrderModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      id="manual-order-modal"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-md border border-slate-100 shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono">
              Saisie manuelle commande
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-slate-200 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Product code selector */}
          <div>
            <label className="block text-[10px] uppercase font-mono font-black text-slate-500 tracking-wider mb-1.5">
              Sélectionner l'Article (Code JP)
            </label>
            <select
              value={manualOrderJpCode}
              onChange={(e) => setManualOrderJpCode(e.target.value)}
              required
              className="w-full text-xs font-semibold px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50 border-slate-200"
            >
              <option value="">-- Choisir un code JP --</option>
              {(() => {
                const activeProds =
                  selectedSession.selectedProductIds &&
                  selectedSession.selectedProductIds.length > 0
                    ? products.filter(
                        (p) =>
                          selectedSession.selectedProductIds?.includes(p.id)
                      )
                    : products;
                return activeProds.map((p) => (
                  <option key={p.id} value={p.jpCode}>
                    {p.jpCode} - {p.name} ({p.price.toLocaleString()} Ar)
                  </option>
                ));
              })()}
            </select>
          </div>

          {/* Customer name */}
          <div>
            <label className="block text-[10px] uppercase font-mono font-black text-slate-500 tracking-wider mb-1.5">
              Nom Complet du Client
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Ranto Randria"
              value={manualOrderCustomerName}
              onChange={(e) => setManualOrderCustomerName(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white border-slate-200"
            />
          </div>

          {/* Customer handle (default is generated or auto-inferred) */}
          <div>
            <label className="block text-[10px] uppercase font-mono font-black text-slate-500 tracking-wider mb-1.5">
              Handle Facebook / Lien Profil
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-mono font-bold text-slate-400">
                @
              </span>
              <input
                type="text"
                placeholder={
                  manualOrderCustomerName
                    ? manualOrderCustomerName.toLowerCase().replace(/\s+/g, '_')
                    : 'nom_client'
                }
                className="w-full pl-7 text-xs font-semibold px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-100 border-slate-200"
                disabled
                title="Sera automatiquement généré d'après le nom complet du client"
              />
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">
              Le handle unique est déduit à la validation
            </span>
          </div>

          {/* Chat Status selection */}
          <div>
            <label className="block text-[10px] uppercase font-mono font-black text-slate-550 text-slate-550 text-slate-500 tracking-wider mb-1.5">
              Statut Interaction Directe
            </label>
            <select
              value={manualOrderChatStatus}
              onChange={(e) => setManualOrderChatStatus(e.target.value as ChatStatus)}
              className="w-full text-xs font-semibold px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white border-slate-200"
            >
              <option value="En attente">En attente – Nouveau commentaire de réservation</option>
              <option value="En cours">En cours – Envoi des détails par message privé</option>
              <option value="Terminé">Terminé – Coordonnées et livraison validées</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex justify-end gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-600 cursor-pointer border-none"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md shadow-emerald-100 cursor-pointer flex items-center gap-1.5 border-none"
            >
              <Check className="h-4 w-4" /> Enregistrer Commande
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
