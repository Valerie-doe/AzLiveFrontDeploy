import React, { useState } from 'react';
import { Collaborator } from '../../../types';
import { UserPlus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { playNotificationSound } from '../../../sound';
import CollaboratorCard from '../components/CollaboratorCard';
import CollaboratorForm from '../components/CollaboratorForm';

interface CollaboratorsPageProps {
  collaborators: Collaborator[];
  onAddCollaborator: (collab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>) => void;
  onToggleStatus: (id: string) => void;
  onDeleteCollaborator: (id: string) => void;
}

export default function CollaboratorsPage({
  collaborators,
  onAddCollaborator,
  onToggleStatus,
  onDeleteCollaborator,
}: CollaboratorsPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCollaborator = (collab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>) => {
    onAddCollaborator(collab);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="collab-central-view">
      {/* PANEL INTRO TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Gestion des Collaborateurs</h2>
          <p className="text-sm text-slate-500 font-serif">
            Affectez vos commerciaux de secrétariat à des pages Facebook et suivez leur performance de saisie et de
            validation.
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); playNotificationSound('click'); }}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition-all border-none"
        >
          <UserPlus className="h-4.5 w-4.5" /> Recruter un opérateur
        </button>
      </div>

      {/* COLLABORATORS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.map((col) => (
          <CollaboratorCard
            key={col.id}
            collaborator={col}
            onToggleStatus={onToggleStatus}
            onDelete={onDeleteCollaborator}
          />
        ))}
      </div>

      {/* RECRUITMENT MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <CollaboratorForm
            onSubmit={handleAddCollaborator}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
