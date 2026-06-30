import React, { useEffect, useState } from 'react';
import { useTikTokAuth } from '../../features/auth/hooks/useTikTokAuth';
import { parseTikTokCallbackParams } from '../../api/tiktokAuth.api';
import { parseTikTokErrorMessage } from '../../features/auth/services/tiktokAuth.service';
import { savePendingTikTokAuth } from '../../features/auth/services/authStorage';

export default function TikTokCallbackPage() {
  const tiktokAuth = useTikTokAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const { token, created, error } = parseTikTokCallbackParams(window.location.search);

      if (error) {
        setErrorMessage(parseTikTokErrorMessage(error));
        return;
      }

      if (!token) {
        setErrorMessage('Token d\'authentification manquant. Veuillez réessayer la connexion TikTok.');
        return;
      }

      try {
        const pending = await tiktokAuth.loadTikTokAccountAfterAuth(token, created);
        savePendingTikTokAuth(pending);
        window.location.replace('/auth/tiktok/confirm');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erreur lors de la finalisation de la connexion TikTok.';
        setErrorMessage(message);
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center text-xs space-y-3">
        {errorMessage ? (
          <>
            <p className="text-rose-600 font-bold">{errorMessage}</p>
            <button
              onClick={() => {
                window.history.replaceState({}, '', '/');
                window.location.reload();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
            >
              Retour à l'accueil
            </button>
          </>
        ) : (
          <>
            <p className="text-slate-600 font-bold">Authentification TikTok réussie</p>
            <p className="text-slate-400 font-serif">Redirection vers la confirmation de votre compte TikTok...</p>
          </>
        )}
      </div>
    </div>
  );
}
