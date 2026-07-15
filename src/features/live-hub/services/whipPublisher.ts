import { LiveBroadcastBridge } from '../../../types';

/**
 * Diffusion navigateur -> Facebook Live via MediaMTX (protocole WHIP).
 *
 * Le navigateur capte la webcam puis publie son flux WebRTC sur l'URL WHIP fournie
 * par le backend au démarrage du live. MediaMTX relaie ensuite vers Facebook (ffmpeg).
 * Aucune clé Facebook ne transite côté client : seul un token de publication temporaire.
 */

export interface LiveBroadcastHandle {
  stream: MediaStream;
  peerConnection: RTCPeerConnection;
  close: () => void;
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];

const ICE_GATHERING_TIMEOUT_MS = 2000;

/**
 * Erreur spécifique à l'accès caméra/micro refusé par l'utilisateur ou le navigateur.
 */
export class CameraPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CameraPermissionError';
  }
}

function waitForIceGathering(peerConnection: RTCPeerConnection): Promise<void> {
  if (peerConnection.iceGatheringState === 'complete') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const checkState = () => {
      if (peerConnection.iceGatheringState === 'complete') {
        peerConnection.removeEventListener('icegatheringstatechange', checkState);
        resolve();
      }
    };
    peerConnection.addEventListener('icegatheringstatechange', checkState);
    // Garde-fou : on n'attend pas indéfiniment la collecte des candidats ICE.
    setTimeout(resolve, ICE_GATHERING_TIMEOUT_MS);
  });
}

async function requestCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new CameraPermissionError(
      "La caméra n'est pas accessible (navigateur non compatible ou contexte non sécurisé).",
    );
  }
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true,
    });
  } catch {
    throw new CameraPermissionError(
      'Accès à la caméra et au micro refusé. Autorisez-les dans le navigateur pour diffuser le live.',
    );
  }
}

/**
 * Démarre la publication de la webcam vers MediaMTX en WHIP.
 * Renvoie un handle permettant d'arrêter proprement la diffusion.
 */
export async function startWhipBroadcast(bridge: LiveBroadcastBridge): Promise<LiveBroadcastHandle> {
  if (!bridge.whipUrl) {
    throw new Error('Pont de diffusion indisponible (URL WHIP manquante).');
  }

  const stream = await requestCameraStream();
  const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  const close = () => {
    try {
      peerConnection.close();
    } catch {
      /* noop */
    }
    stream.getTracks().forEach((track) => track.stop());
  };

  try {
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await waitForIceGathering(peerConnection);

    let response: Response;
    try {
      response = await fetch(bridge.whipUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          ...(bridge.publishToken ? { Authorization: `Bearer ${bridge.publishToken}` } : {}),
        },
        body: peerConnection.localDescription?.sdp ?? '',
      });
    } catch {
      throw new Error(
        'Impossible de joindre MediaMTX (Failed to fetch). '
          + 'Le service est souvent en 502 / redémarré. Vérifie les logs azlivemtxn '
          + 'et que MEDIAMTX_AUTH_URL pointe vers le backend joignable.',
      );
    }

    if (!response.ok) {
      throw new Error(`Le serveur de diffusion a refusé le flux (HTTP ${response.status}).`);
    }

    const answerSdp = await response.text();
    await peerConnection.setRemoteDescription({ type: 'answer', sdp: answerSdp });
  } catch (error) {
    close();
    throw error;
  }

  return { stream, peerConnection, close };
}
