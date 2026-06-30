import { useCallback, useEffect, useRef, useState } from 'react';
import { LiveBroadcastBridge } from '../../../types';
import { LiveBroadcastHandle, startWhipBroadcast } from '../services/whipPublisher';

interface UseLiveBroadcastResult {
  /** Vrai tant que la webcam est publiée vers Facebook via MediaMTX. */
  publishing: boolean;
  /** Flux local de la webcam (utile pour un éventuel aperçu). */
  stream: MediaStream | null;
  /**
   * Démarre la diffusion à partir du pont WebRTC renvoyé par le backend.
   * Ne fait rien (et renvoie false) si le pont n'est pas prêt (ex. mode démo).
   */
  startBroadcast: (bridge?: LiveBroadcastBridge | null) => Promise<boolean>;
  /** Arrête la diffusion et libère la caméra. */
  stopBroadcast: () => void;
}

/**
 * Gère le cycle de vie de la diffusion navigateur (caméra + WHIP) pour un live.
 * La logique WebRTC pure est déléguée à `whipPublisher` ; ce hook ne fait que
 * conserver le handle actif et exposer l'état à l'UI.
 */
export function useLiveBroadcast(): UseLiveBroadcastResult {
  const handleRef = useRef<LiveBroadcastHandle | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopBroadcast = useCallback(() => {
    if (handleRef.current) {
      handleRef.current.close();
      handleRef.current = null;
    }
    setStream(null);
    setPublishing(false);
  }, []);

  const startBroadcast = useCallback(
    async (bridge?: LiveBroadcastBridge | null): Promise<boolean> => {
      if (!bridge || bridge.status !== 'ready' || !bridge.whipUrl) {
        return false;
      }
      // On stoppe une éventuelle diffusion précédente avant d'en démarrer une nouvelle.
      if (handleRef.current) {
        handleRef.current.close();
        handleRef.current = null;
      }
      const handle = await startWhipBroadcast(bridge);
      handleRef.current = handle;
      setStream(handle.stream);
      setPublishing(true);
      return true;
    },
    [],
  );

  // Sécurité : on coupe la caméra si le composant est démonté pendant la diffusion.
  useEffect(() => {
    return () => {
      if (handleRef.current) {
        handleRef.current.close();
        handleRef.current = null;
      }
    };
  }, []);

  return { publishing, stream, startBroadcast, stopBroadcast };
}
