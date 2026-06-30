import React, { useEffect, useState } from 'react';
import { useFacebookAuth } from '../../features/auth/hooks/useFacebookAuth';
import { parseFacebookCallbackParams } from '../../api/facebookAuth.api';
import {
  parseFacebookErrorMessage,
} from '../../features/auth/services/facebookAuth.service';
import { savePendingFacebookAuth } from '../../features/auth/services/authStorage';

export default function FacebookCallbackPage() {
  const facebookAuth = useFacebookAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const { token, created, error } = parseFacebookCallbackParams(window.location.search);

      if (error) {
        setErrorMessage(parseFacebookErrorMessage(error));
        return;
      }

      if (!token) {
        setErrorMessage('Token d\'authentification manquant. Veuillez réessayer la connexion Facebook.');
        return;
      }

      try {
        const pending = await facebookAuth.loadFacebookPagesAfterAuth(token);
        savePendingFacebookAuth({ ...pending, created });

        if (pending.pages.length === 0) {
          setErrorMessage(
            'Connexion réussie, mais aucune page Facebook n\'a été trouvée. Vérifiez les permissions de votre compte.',
          );
          return;
        }

        window.location.replace('/auth/facebook/pages');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erreur lors de la finalisation de la connexion Facebook.';
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
            <p className="text-slate-600 font-bold">Authentification Facebook réussie</p>
            <p className="text-slate-400 font-serif">Redirection vers la sélection de votre page Facebook...</p>
          </>
        )}
      </div>
    </div>
  );
}
