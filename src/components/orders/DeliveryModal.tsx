import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, AlertCircle } from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeliveryModal({ isOpen, selectedCount, onClose, onConfirm }: DeliveryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4"
          id="delivery-confirm-modal"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 flex-shrink-0">
              <Truck className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Transmission Digitale : AZExpress</h3>
              <p className="text-xs text-slate-500 font-serif mt-0.5">
                Transférez automatiquement ces commandes préparées à la flotte de livraison d'AZExpress Madagascar.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-700">
            <div className="flex justify-between font-mono font-bold">
              <span>Nombre de Colis :</span>
              <span>{selectedCount} Colis au Total</span>
            </div>
            <div className="flex justify-between">
              <span>Affectation Flotte :</span>
              <span className="font-bold text-slate-900">Motocyclettes Tana Hub</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-150 text-[11px] text-indigo-800 flex items-start gap-2 leading-relaxed">
            <AlertCircle className="h-4.5 w-4.5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span>
              Cette action crée des bordereaux de tracking en temps réel et notifie les acheteurs des statuts d'expédition.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
              id="btn-confirm-delivery-modal"
            >
              Expédier par AZExpress
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
