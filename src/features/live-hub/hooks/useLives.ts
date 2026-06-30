import { useCallback, useEffect, useState } from 'react';
import {
  arreterLive,
  createLive,
  demarrerLive,
  fetchLiveById,
  fetchLives,
  updateLive,
} from '../../../api/lives.api';
import { fetchFacebookPages } from '../../../api/facebookPages.api';
import { enableVendeurDemoMode } from '../../../api/vendeurs.api';
import { LiveSession } from '../../../types';
import { getConnectedPageNames, getStoredVendeurId } from '../../auth/services/authStorage';
import {
  buildDressingPayload,
  buildLiveCreatePayload,
  buildLiveUpdatePayload,
  mapLiveFromApi,
} from '../utils/liveMappers';

/**
 * Détecte l'erreur de permissions Facebook (#200) renvoyée par le backend quand
 * le vendeur n'est pas en mode démo et que les scopes Pages manquent.
 */
function isFacebookPermissionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  return (
    message.includes('#200') ||
    message.includes('permission') ||
    message.includes('live facebook')
  );
}

/**
 * @param enabled  Charge (et recharge) les lives/pages uniquement quand l'utilisateur est
 *                 authentifié. Le passage `false → true` après connexion déclenche le fetch,
 *                 évitant d'avoir à actualiser manuellement la page pour voir les données.
 */
export function useLives(enabled = true) {
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [facebookPages, setFacebookPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLives();
      setLiveSessions(data.map(mapLiveFromApi));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement des lives');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFacebookPages = useCallback(async () => {
    try {
      const vendeurId = getStoredVendeurId();
      const pages = await fetchFacebookPages(vendeurId ?? undefined);
      const names = pages.map((p) => p.nom).filter(Boolean);
      setFacebookPages(names.length > 0 ? names : getConnectedPageNames());
    } catch {
      setFacebookPages(getConnectedPageNames());
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    loadLives();
    loadFacebookPages();
  }, [enabled, loadLives, loadFacebookPages]);

  const refreshLive = useCallback(async (id: string): Promise<LiveSession | null> => {
    try {
      const data = await fetchLiveById(id);
      const mapped = mapLiveFromApi(data);
      setLiveSessions((prev) => {
        const exists = prev.some((live) => live.id === mapped.id);
        return exists
          ? prev.map((live) => (live.id === mapped.id ? mapped : live))
          : [mapped, ...prev];
      });
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement du live');
      return null;
    }
  }, []);

  const createLiveSession = useCallback(
    async (params: {
      title: string;
      dateLive: string;
      operateurId?: number | null;
      pages: string[];
      productIds?: string[];
    }) => {
      setSaving(true);
      setError(null);
      try {
        const created = await createLive(
          buildLiveCreatePayload({ ...params, vendeurId: getStoredVendeurId() ?? undefined }),
        );
        const mapped = mapLiveFromApi(created);
        setLiveSessions((prev) => [mapped, ...prev]);
        return mapped;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur création du live';
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const updateLiveSession = useCallback(
    async (
      id: string,
      params: {
        title?: string;
        dateLive?: string;
        operateurId?: number | null;
        pages?: string[];
        productIds?: string[];
      },
    ) => {
      setSaving(true);
      setError(null);
      try {
        const updated = await updateLive(id, buildLiveUpdatePayload(params));
        const mapped = mapLiveFromApi(updated);
        setLiveSessions((prev) => prev.map((live) => (live.id === id ? mapped : live)));
        return mapped;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur mise à jour du live';
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const updateLiveDressing = useCallback(async (id: string, productIds: string[]) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateLive(id, buildDressingPayload(productIds));
      const mapped = mapLiveFromApi(updated);
      setLiveSessions((prev) => prev.map((live) => (live.id === id ? mapped : live)));
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur mise à jour du dressing';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const startLiveSession = useCallback(async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      let updated;
      try {
        updated = await demarrerLive(id);
      } catch (err) {
        // Pas encore de vrai test Facebook : si le backend refuse à cause des
        // permissions Pages (#200), on bascule le vendeur sur le flux de test
        // (mode démo, diffusions simulées) puis on relance le démarrage.
        const vendeurId = getStoredVendeurId();
        if (vendeurId != null && isFacebookPermissionError(err)) {
          await enableVendeurDemoMode(vendeurId);
          updated = await demarrerLive(id);
        } else {
          throw err;
        }
      }
      const mapped = mapLiveFromApi(updated);
      setLiveSessions((prev) => prev.map((live) => (live.id === id ? mapped : live)));
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur démarrage du live';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const closeLiveSession = useCallback(async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await arreterLive(id);
      const mapped = mapLiveFromApi(updated);
      setLiveSessions((prev) => prev.map((live) => (live.id === id ? mapped : live)));
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur clôture du live';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    liveSessions,
    facebookPages,
    loading,
    saving,
    error,
    loadLives,
    refreshLive,
    createLiveSession,
    updateLiveSession,
    updateLiveDressing,
    startLiveSession,
    closeLiveSession,
  };
}
