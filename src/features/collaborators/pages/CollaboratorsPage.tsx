import React, { useState } from 'react';
import { Collaborator } from '../../../types';
import { UserPlus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { playNotificationSound } from '../../../sound';
import CollaboratorCard from '../components/CollaboratorCard';
import CollaboratorForm from '../components/CollaboratorForm';

interface CollaboratorsPageProps {
  collaborators: Collaborator[];
  loading?: boolean;
  error?: string | null;
  onAddCollaborator: (
    collab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>,
  ) => Promise<Collaborator>;
  onToggleStatus: (id: string) => void;
  onDeleteCollaborator: (id: string) => Promise<void>;
}

export default function CollaboratorsPage({
  collaborators,
  loading = false,
  error = null,
  onAddCollaborator,
  onToggleStatus,
  onDeleteCollaborator,
}: CollaboratorsPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddCollaborator = async (
    collab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>,
  ) => {
    setSaving(true);
    try {
      await onAddCollaborator(collab);
      setShowAddForm(false);
    } catch {
      // error shown via prop
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteCollaborator(id);
    } catch {
      // error shown via prop
    }
  };

  return (
    <div className="space-y-6" id="collab-central-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight font-sans">Gestion des Collaborateurs</h2>
          <p className="text-sm text-slate-500 font-serif">
            Affectez vos commerciaux de secrétariat à des pages Facebook et suivez leur performance de saisie et de
            validation.
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); playNotificationSound('click'); }}
          className="px-5 py-3 bg-secondary hover:bg-accent text-primary rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-secondary transition-all border-none"
        >
          <UserPlus className="h-4.5 w-4.5" /> Recruter un opérateur
        </button>
      </div>

      {loading && (
        <div className="bg-white border rounded-3xl p-8 text-center text-slate-400 border-dashed text-xs">
          Chargement des collaborateurs...
        </div>
      )}

      {error && (
        <div className="bg-white border border-rose-100 rounded-3xl p-4 text-center text-rose-600 text-xs">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborators.length === 0 ? (
            <div className="col-span-full bg-white border rounded-3xl p-8 text-center text-slate-400 border-dashed text-xs">
              Aucun collaborateur enregistré. Cliquez sur « Recruter un opérateur » pour en ajouter.
            </div>
          ) : (
            collaborators.map((col) => (
              <CollaboratorCard
                key={col.id}
                collaborator={col}
                onToggleStatus={onToggleStatus}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <CollaboratorForm
            onSubmit={handleAddCollaborator}
            onClose={() => setShowAddForm(false)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
