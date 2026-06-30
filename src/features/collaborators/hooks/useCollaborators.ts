import { useCallback, useEffect, useState } from 'react';
import {
  createCollaborateur,
  deleteCollaborateur,
  fetchCollaborateurs,
} from '../../../api/collaborateurs.api';
import { Collaborator } from '../../../types';
import {
  buildCollaboratorPayload,
  mapCollaboratorFromApi,
} from '../../live-hub/utils/liveMappers';
import { getStoredVendeurId } from '../../auth/services/authStorage';

/**
 * @param enabled  Charge (et recharge) les collaborateurs uniquement quand l'utilisateur est
 *                 authentifié, afin d'afficher les données dès la connexion sans refresh manuel.
 */
export function useCollaborators(enabled = true) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCollaborators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCollaborateurs();
      const vendeurId = getStoredVendeurId();
      const ownedData =
        vendeurId == null ? data : data.filter((c) => c.vendeur === vendeurId);
      setCollaborators(ownedData.map(mapCollaboratorFromApi));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement collaborateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    loadCollaborators();
  }, [enabled, loadCollaborators]);

  const addCollaborator = useCallback(
    async (collab: Omit<Collaborator, 'id' | 'stats' | 'isActive'>) => {
      setError(null);
      try {
        const created = await createCollaborateur(
          buildCollaboratorPayload(collab, getStoredVendeurId() ?? undefined),
        );
        const mapped = mapCollaboratorFromApi(created);
        setCollaborators((prev) => [...prev, mapped]);
        return mapped;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur création collaborateur';
        setError(message);
        throw err;
      }
    },
    [],
  );

  const toggleCollaboratorStatus = useCallback((id: string) => {
    setCollaborators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    );
  }, []);

  const removeCollaborator = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteCollaborateur(id);
      setCollaborators((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur suppression collaborateur';
      setError(message);
      throw err;
    }
  }, []);

  return {
    collaborators,
    loading,
    error,
    loadCollaborators,
    addCollaborator,
    toggleCollaboratorStatus,
    removeCollaborator,
  };
}
