import { useMemo } from 'react';
import { LiveSession } from '../../../types';
import { getStoredVendeurId } from '../../auth/services/authStorage';

/**
 * Restreint la liste des lives à ceux appartenant au vendeur actuellement connecté.
 *
 * L'identité provient de la même source que le reste de l'application
 * (`getStoredVendeurId`), afin de ne pas dupliquer la logique d'authentification.
 * Lorsque l'identité vendeur est absente (mode démo / token de secours), on
 * conserve le comportement existant en renvoyant la liste complète, comme le
 * fait déjà `useProducts`.
 */
export function useOwnedLiveSessions(liveSessions: LiveSession[]): LiveSession[] {
  return useMemo(() => {
    const vendeurId = getStoredVendeurId();
    if (vendeurId == null) return liveSessions;
    return liveSessions.filter((session) => session.vendeurId === vendeurId);
  }, [liveSessions]);
}
