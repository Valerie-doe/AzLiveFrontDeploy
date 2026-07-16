import { useEffect, useState } from 'react';
import { LiveSession, Order } from '../../../types';
import { fetchCommandesByLive } from '../../../api/commandes.api';
import { mapOrderFromApi } from '../utils/orderMappers';

const POLL_INTERVAL_MS = 15000;

/** Un live réel (créé côté backend) possède un id numérique ; les lives locaux/démo ont un id textuel. */
function isBackendLive(liveId: string | null): boolean {
  return liveId != null && /^\d+$/.test(liveId);
}

interface UseLiveOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  /** true quand on alimente la vue avec les vraies commandes du backend. */
  enabled: boolean;
}

/**
 * Récupère et rafraîchit (polling) les commandes réellement capturées pour le
 * live sélectionné, tant qu'il est « En cours » et qu'il s'agit d'un live réel
 * (créé côté backend, id numérique). Pour un live local/démo, `enabled` est
 * false et l'appelant conserve sa source de commandes existante.
 */
export function useLiveOrders(session: LiveSession | undefined): UseLiveOrdersResult {
  const liveId = session?.id ?? null;
  const isRunning = session?.status === 'En cours';
  const isTerminated = session?.status === 'Terminé';
  // On alimente la vue avec les vraies commandes du backend dès qu'il s'agit d'un live
  // réel (id numérique), qu'il soit « En cours » OU « Terminé » : l'historique complet
  // (commandes en attente et confirmées) doit rester consultable après la fin du live.
  const enabled = Boolean(liveId && (isRunning || isTerminated) && isBackendLive(liveId));

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !liveId) {
      setOrders([]);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setError(null);
        const data = await fetchCommandesByLive(liveId);
        if (active) setOrders(data.map(mapOrderFromApi));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erreur chargement des commandes');
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    load();

    // Polling actif tant que la session est consultée, y compris pour un live terminé :
    // une commande en attente peut encore être confirmée après la fin du live (réponse
    // client traitée côté backend), et la transition « en attente → confirmée » doit se
    // refléter dans l'UI sans rechargement manuel.
    const interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [enabled, liveId]);

  return { orders, loading, error, enabled };
}
