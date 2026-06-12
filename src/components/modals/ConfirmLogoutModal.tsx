import React from 'react';
import { FolderLock } from 'lucide-react';
import { ConfirmModal } from '../../shared';

interface ConfirmLogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmLogoutModal({ onConfirm, onCancel }: ConfirmLogoutModalProps) {
  return (
    <ConfirmModal
      title="Voulez-vous vous déconnecter ?"
      message="Le système sera verrouillé et vous devrez vous authentifier à nouveau avec vos canaux de vente pour continuer."
      confirmText="Oui, déconnecter"
      cancelText="Annuler"
      onConfirm={onConfirm}
      onCancel={onCancel}
      icon={<FolderLock className="h-6 w-6" />}
      iconBgColor="bg-rose-50 text-rose-600 border-rose-100"
      confirmButtonColor="bg-rose-600 hover:bg-rose-700"
    />
  );
}
