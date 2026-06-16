import React from 'react';
import { motion } from 'motion/react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: React.ReactNode;
  iconBgColor?: string;
  confirmButtonColor?: string;
}

export default function ConfirmModal({
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  icon,
  iconBgColor = 'bg-rose-50 text-rose-600 border-rose-100',
  confirmButtonColor = 'bg-rose-600 hover:bg-rose-700',
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-55 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4"
      >
        <div className="text-center space-y-2">
          {icon && (
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto text-xl border ${iconBgColor}`}
            >
              {icon}
            </div>
          )}
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-serif leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border-none"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs border-none ${confirmButtonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
