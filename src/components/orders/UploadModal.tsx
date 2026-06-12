import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, X } from 'lucide-react';

interface UploadModalProps {
  orderId: string | null;
  onClose: () => void;
  onSimulateUpload: (orderId: string, serviceName: string) => void;
}

export default function UploadModal({ orderId, onClose, onSimulateUpload }: UploadModalProps) {
  if (!orderId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4"
        >
          <div className="flex justify-between items-center pb-2 border-b">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              Simuler la Capture Mobile Money
            </h4>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400 font-serif leading-relaxed">
            Madagascar utilise principalement 3 services Mobile Money. Sélectionnez l'opérateur pour générer un reçu de virement automatique sécurisé :
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              { name: 'Mvola', color: 'bg-emerald-600 hover:bg-emerald-700', text: 'Mvola (Telma Madagascar)' },
              { name: 'Orange Money', color: 'bg-orange-500 hover:bg-orange-600', text: 'Orange Money Madagascar' },
              { name: 'Airtel Money', color: 'bg-red-600 hover:bg-red-700', text: 'Airtel Money Madagascar' }
            ].map((operator) => (
              <button
                key={operator.name}
                onClick={() => onSimulateUpload(orderId, operator.name)}
                className={`w-full py-2.5 text-white text-xs font-bold rounded-xl transition-all cursor-pointer ${operator.color}`}
              >
                Sélectionner {operator.text}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
