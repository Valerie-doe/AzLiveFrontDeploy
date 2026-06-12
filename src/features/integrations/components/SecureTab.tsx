import React from 'react';
import { Info } from 'lucide-react';

interface SecureTabProps {
  onCopyUrl: () => void;
}

export default function SecureTab({ onCopyUrl }: SecureTabProps) {
  return (
    <div className="p-5 space-y-4 text-xs">
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-xs font-serif leading-relaxed flex items-start gap-2.5">
        <Info className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-extrabold text-amber-950 font-sans mb-1 uppercase tracking-wider text-[10px]">
            Utilisation Réaliste en Production
          </h4>
          Ces clés de webhook securisent l'écoute de votre stream Mada. Toute interaction sur vos
          vidéos en direct Facebook est authentifiée par signature HMAC SHA-256 avec la clé secrète
          ci-dessous.
        </div>
      </div>

      <div className="space-y-4 pt-1">
        <div>
          <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">
            URL de Rappel Webhook (Callback URL)
          </label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value="https://api.azlive.mg/v1/webhook/facebook/mada-dressing"
              className="flex-1 px-3 py-2 border rounded-l-xl focus:outline-none font-mono text-xs bg-slate-50 text-slate-500 font-semibold"
            />
            <button
              onClick={onCopyUrl}
              className="px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-r-xl text-xs font-bold cursor-pointer border-none"
            >
              Copier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">
              Jeton de vérification (Meta Hub Verification)
            </label>
            <input
              type="password"
              readOnly
              value="azlive_secret_hub_verification_code_2026"
              className="w-full px-3 py-2 border rounded-xl focus:outline-none font-mono text-xs bg-slate-50 text-slate-500 font-semibold"
            />
          </div>
          <div>
            <label className="block text-[9px] font-mono uppercase text-slate-400 font-bold mb-1">
              Authentification Métier (Délai d'expiration)
            </label>
            <div className="px-3 py-2 border rounded-xl bg-slate-50 text-slate-500 font-mono text-xs font-bold">
              Jeton d'accès étendu : valide de l'Applet
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2">
          <h4 className="font-mono text-[9px] font-black uppercase tracking-wider text-slate-400">
            Tutoriel de Raccordement
          </h4>
          <p className="text-[11px] font-serif text-slate-300">
            Pour raccorder une véritable clé API sur l'environnement de production Meta Developer
            Portal :
            <br />• 1. Créez un projet tiers de type "Entreprise" sur developers.facebook.com
            <br />• 2. Ajoutez le produit "Webhooks" et abonnez-vous aux champs d'interaction{' '}
            <span className="font-mono text-indigo-300 font-semibold">feed</span>,{' '}
            <span className="font-mono text-indigo-300 font-semibold">live_videos_comments</span>
            <br />• 3. Liez l'authentification avec les Autorisations d'accès{' '}
            <span className="font-mono text-indigo-300 font-semibold">pages_messaging</span> pour
            permettre au chatbot d'envoyer l'Arborescence automatique.
          </p>
        </div>
      </div>
    </div>
  );
}
