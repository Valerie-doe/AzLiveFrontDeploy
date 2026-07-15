import React from 'react';
import { ClientProfile } from '../types';
import { Phone, MapPin, DollarSign, Edit, X, Save, CheckCircle, MessageSquare, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { playNotificationSound } from '../../../sound';

interface ClientDetailPanelProps {
  selectedClient: ClientProfile | null;
  isEditing: boolean;
  editForm: { name: string; phone: string; handle: string; address: string; shippingType: 'Livraison' | 'Collecte' };
  successMessage: string;
  onClose: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (form: ClientDetailPanelProps['editForm']) => void;
}

export default function ClientDetailPanel({
  selectedClient,
  isEditing,
  editForm,
  successMessage,
  onClose,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
}: ClientDetailPanelProps) {
  const handleSimulateChatAlert = (phone: string, handle: string) => {
    alert(`Notification envoyée sur Messenger à ${handle} (${phone}) : "Bonjour ! Votre colis est en cours de préparation pour livraison sur Tana."`);
    playNotificationSound('confirm');
  };

  if (!selectedClient) {
    return (
      <div className="bg-slate-50 border border-slate-150 rounded-3xl border-dashed p-8 text-center text-slate-400 space-y-2">
        <Users className="h-8 w-8 text-slate-300 mx-auto" strokeWidth={1} />
        <h4 className="font-extrabold text-slate-750">Aucun profil sélectionné</h4>
        <p className="text-xs font-serif leading-relaxed">
          Cliquez sur n'importe quelle ligne de la liste à gauche pour voir les informations d'achats détaillées,
          son panier, et modifier ses adresses d'expédition.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex gap-1.5 items-center mt-1 flex-wrap">
            <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold uppercase">
              Fiche Client
            </span>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
              selectedClient.shippingType === 'Collecte'
                ? 'text-amber-800 bg-amber-50 border border-amber-200'
                : 'text-indigo-800 bg-indigo-50 border border-indigo-200'
            }`}>
              {selectedClient.shippingType === 'Collecte' ? 'Collecte' : 'Livraison'}
            </span>
          </div>
          <h3 className="font-black text-slate-900 text-base mt-1.5">{selectedClient.name}</h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedClient.handle}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-705 p-1 rounded-lg hover:bg-slate-50">
          <X className="h-4 w-4" />
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center gap-1.5 font-bold">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {!isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs">
              <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="font-mono text-slate-700">{selectedClient.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-xs leading-relaxed">
              <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="font-serif text-slate-500">{selectedClient.address}</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-2 gap-2 text-center py-2">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Chiffre d'Affaire</span>
              <span className="font-black text-xs text-indigo-600">{selectedClient.totalSpent.toLocaleString()} Ar</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Désistements</span>
              <span className="font-black text-xs text-rose-600">
                {selectedClient.ordersList.filter((o) => o.status === 'annulé').length} fiches
              </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h4 className="font-bold text-xs text-slate-900 mb-2">Historique d'Achats ({selectedClient.ordersList.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {selectedClient.ordersList.map((order, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded-xl text-xs border border-slate-100">
                  <div>
                    <span className="font-mono bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded text-[9px] font-bold mr-1.5">
                      {order.jpCode}
                    </span>
                    <span className="font-semibold text-slate-700">{order.productName}</span>
                  </div>
                  <span className="font-black text-slate-900">{order.price.toLocaleString()} Ar</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onStartEdit}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit className="h-3.5 w-3.5" /> Modifier Coordonnées
            </button>
            <button
              onClick={() => handleSimulateChatAlert(selectedClient.phone, selectedClient.handle)}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
              title="Relancer sur Messenger"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3.5 text-xs">
            {[
              { label: 'Nom Complet', key: 'name', type: 'text', className: 'font-semibold text-slate-800' },
              { label: 'Téléphone (Mvola / Orange / Airtel)', key: 'phone', type: 'text', className: 'font-mono text-slate-800' },
              { label: 'Pseudo Facebook', key: 'handle', type: 'text', className: 'font-semibold text-slate-800' },
            ].map(({ label, key, type, className }) => (
              <div key={key}>
                <label className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">{label}</label>
                <input
                  type={type}
                  value={editForm[key as keyof typeof editForm] as string}
                  onChange={(e) => onEditFormChange({ ...editForm, [key]: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs ${className}`}
                />
              </div>
            ))}
            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">Province / Adresse livraison</label>
              <textarea
                rows={2}
                value={editForm.address}
                onChange={(e) => onEditFormChange({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-serif text-slate-700 text-xs"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">Type d'expédition principale</label>
              <select
                value={editForm.shippingType}
                onChange={(e) => onEditFormChange({ ...editForm, shippingType: e.target.value as 'Livraison' | 'Collecte' })}
                className="w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs bg-white"
              >
                <option value="Livraison">Livraison (expédition)</option>
                <option value="Collecte">Collecte (bureau / magasin)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button onClick={onCancelEdit} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold">
              Fermer
            </button>
            <button
              onClick={onSaveEdit}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1"
            >
              <Save className="h-3.5 w-3.5" /> Enregistrer
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
