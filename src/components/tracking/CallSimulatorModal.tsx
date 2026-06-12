import React from 'react';
import { motion } from 'motion/react';
import { X, PhoneCall } from 'lucide-react';

interface CallSimulatorModalProps {
  isOpen: boolean;
  recipientName: string;
  recipientRole: string;
  phoneNumber: string;
  onClose: () => void;
}

export default function CallSimulatorModal({
  isOpen,
  recipientName,
  recipientRole,
  phoneNumber,
  onClose
}: CallSimulatorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full text-center space-y-6 relative overflow-hidden shadow-2xl"
      >
        {/* Visual calling soundwave elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-64 h-64 bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] uppercase font-mono tracking-widest font-bold">Appel VoIP Securisé (AZLive GSM)</span>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="h-20 w-20 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto text-3xl font-bold font-sans shadow-lg shadow-emerald-500/20 animate-pulse">
            <PhoneCall className="h-8 w-8 text-neutral-900" />
          </div>

          <div>
            <h3 className="text-lg font-black">{recipientName}</h3>
            <span className="text-xs text-indigo-400 font-mono font-bold bg-indigo-950 px-2.5 py-0.5 rounded-full">
              {recipientRole}
            </span>
          </div>
          <p className="text-xl font-black font-sans text-slate-200 mt-2 tracking-widest">
            {phoneNumber}
          </p>
        </div>

        <div className="pt-2 bg-slate-950/50 p-4 rounded-2xl flex items-center gap-2.5 text-xs text-slate-400 text-left justify-center">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span>Connexion établie via réseau Airtel/Telma...</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-red-650 hover:bg-red-700 bg-red-650 text-white rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Raccrocher
        </button>
      </motion.div>
    </div>
  );
}
