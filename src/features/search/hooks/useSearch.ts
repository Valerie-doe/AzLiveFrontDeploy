import { useEffect, useState } from 'react';
import { Order } from '../../types';
import { searchCommandes } from '../../../api/commandes.api';
import { mapOrderFromApi } from '../../live-hub/utils/orderMappers';
import { getStoredVendeurId } from '../../auth/services/authStorage';

/** Longueur minimale avant déclenchement (évite des requêtes inutiles). */
const MIN_QUERY_LENGTH = 2;
/** Anti-rebond : on attend une pause de saisie avant d'interroger le backend. */
const DEBOUNCE_MS = 350;

interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  cleanQuery: string;
  searchResults: Order[];
  loading: boolean;
  error: string | null;
}

/**
 * Recherche globale côté serveur (`commandes/search/`), mappée vers `Order`.
 * Les résultats sont restreints au vendeur connecté (même règle que le reste de
 * l'application via `getStoredVendeurId`) puisque l'endpoint n'est pas scopé.
 */
export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanQuery = query.toLowerCase().trim();

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSearchResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const handle = setTimeout(async () => {
      try {
        setError(null);
        const data = await searchCommandes(trimmed);
        if (!active) return;

        const vendeurId = getStoredVendeurId();
        const scoped =
          vendeurId == null
            ? data
            : data.filter((c) => !c.produit.vendeur || c.produit.vendeur.id === vendeurId);

        setSearchResults(scoped.map(mapOrderFromApi));
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
          setSearchResults([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [query]);

  return { query, setQuery, cleanQuery, searchResults, loading, error };
}
