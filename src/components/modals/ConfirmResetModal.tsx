import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { ConfirmModal } from '../../shared';

interface ConfirmResetModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmResetModal({ onConfirm, onCancel }: ConfirmResetModalProps) {
  return (
    <ConfirmModal
      title="Réinitialiser la base de données ?"
      message="Cela va restaurer toutes les valeurs de stock d'origine et effacer les commandes du live stock en cours. Cette action est irréversible."
      confirmText="Confirmer le reset"
      cancelText="Annuler"
      onConfirm={onConfirm}
      onCancel={onCancel}
      icon={<RefreshCcw className="h-6 w-6 text-amber-500" />}
      iconBgColor="bg-amber-50 text-amber-600 border-amber-100"
      confirmButtonColor="bg-slate-900 hover:bg-slate-800"
    />
  );
}
