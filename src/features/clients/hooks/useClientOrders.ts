import { useEffect, useState } from 'react';
import { Order } from '../../../types';
import {
  fetchCommandesByLive,
  fetchCommandesByVendeur,
} from '../../../api/commandes.api';
import { mapOrderFromApi } from '../../live-hub/utils/orderMappers';
import { getStoredVendeurId } from '../../auth/services/authStorage';

/** Valeur du sélecteur de live correspondant à « Tous les Lives ». */
export const ALL_LIVES = 'all' as const;

export type LiveFilterValue = string;

interface UseClientOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

/**
 * Charge les commandes servant à construire les fiches clients.
 *
 * - `ALL_LIVES` : toutes les commandes du vendeur connecté (`?vendeur_id=`).
 * - un id de live : uniquement les commandes du live (`?live_id=`).
 *
 * Réutilise les services API existants (`commandes.api`) et le mapper partagé
 * (`mapOrderFromApi`). Recharge automatiquement quand le live sélectionné change.
 */
export function useClientOrders(selectedLiveId: LiveFilterValue): UseClientOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (selectedLiveId === ALL_LIVES) {
          const vendeurId = getStoredVendeurId();
          data = vendeurId == null ? [] : await fetchCommandesByVendeur(vendeurId);
        } else {
          data = await fetchCommandesByLive(selectedLiveId);
        }

        if (active) setOrders(data.map(mapOrderFromApi));
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Erreur chargement des clients');
          setOrders([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [selectedLiveId]);

  return { orders, loading, error };
}
