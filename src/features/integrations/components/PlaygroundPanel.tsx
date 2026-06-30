import React from 'react';
import { Send } from 'lucide-react';
import { ConnectedChannel } from '../types';

interface PlaygroundPanelProps {
  channels: ConnectedChannel[];
  testComment: {
    pageId: string;
    customerName: string;
    customerPhone: string;
    commentText: string;
    customCode: string;
  };
  setTestComment: React.Dispatch<
    React.SetStateAction<{
      pageId: string;
      customerName: string;
      customerPhone: string;
      commentText: string;
      customCode: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PlaygroundPanel({
  channels,
  testComment,
  setTestComment,
  onSubmit,
}: PlaygroundPanelProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
      <div>
        <span className="bg-indigo-50 text-indigo-700 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider">
          🧪 Simulateur Webhook Interactif
        </span>
        <h3 className="font-extrabold text-slate-900 text-base mt-2">Tester la Capture Live</h3>
        <p className="text-[11px] font-serif text-slate-400 leading-relaxed mt-0.5 text-left">
          Rédigez un faux commentaire au nom d'un client. Le simulateur enverra une requête POST à
          l'API de capture d'AZLive pour valider le traitement.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4.5 pt-1 text-xs text-left">
        <div>
          <label className="text-[9px] font-mono text-slate-400 block mb-1 uppercase font-bold">
            1. Canal de réception simulé
          </label>
          <select
            value={testComment.pageId}
            onChange={(e) =>
              setTestComment((prev) => ({ ...prev, pageId: e.target.value }))
            }
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-extrabold text-slate-705 text-slate-700 text-xs bg-white cursor-pointer"
          >
            {channels.map((chan) => (
              <option key={chan.id} value={chan.id}>
                {chan.platform === 'Facebook' ? '🔵 FB - ' : '🔮 TT - '} {chan.name}{' '}
                {chan.webhookActive ? '' : '(Désactivé !)'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-mono text-slate-400 block mb-1 uppercase font-bold">
            2. Nom de l'acheteur (Facebook / TikTok)
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Clara Ravelomanana"
            value={testComment.customerName}
            onChange={(e) =>
              setTestComment((prev) => ({ ...prev, customerName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-slate-250 border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-sans font-bold text-slate-800 text-xs"
          />
        </div>

        <div>
          <label className="text-[9px] font-mono text-slate-400 block mb-1 uppercase font-bold">
            3. Code Produit JP visé
          </label>
          <div className="flex gap-2">
            <select
              value={testComment.customCode}
              onChange={(e) => {
                const codeValue = e.target.value;
                setTestComment((prev) => ({
                  ...prev,
                  customCode: codeValue,
                  commentText: `Maka ${codeValue} mavo kely azafady ho any Antananarivo!`,
                }));
              }}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans font-extrabold text-slate-705 text-slate-700 text-xs bg-white cursor-pointer"
            >
              <option value="JP1">JP1 (Robe Cache-Cœur)</option>
              <option value="JP2">JP2 (Sac Banane)</option>
              <option value="JP3">JP3 (Blazer Velours)</option>
              <option value="JP4">JP4 (Lin Léger)</option>
              <option value="JP5">JP5 (Pull Mohair)</option>
            </select>
            <input
              type="text"
              placeholder="Autre"
              value={testComment.customCode}
              onChange={(e) =>
                setTestComment((prev) => ({
                  ...prev,
                  customCode: e.target.value.toUpperCase(),
                }))
              }
              className="w-16 text-center border border-slate-250 rounded-xl text-xs font-black uppercase font-mono text-indigo-650 text-indigo-600 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[9px] font-mono text-slate-400 block mb-1 uppercase font-bold">
            4. Texte exact écrit en direct (Commentaire)
          </label>
          <textarea
            required
            rows={3}
            placeholder={`Écrivez par exemple: "maka ${testComment.customCode} azafady"`}
            value={testComment.commentText}
            onChange={(e) =>
              setTestComment((prev) => ({ ...prev, commentText: e.target.value }))
            }
            className="w-full px-3 py-2 border border-slate-250 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-sans text-xs text-slate-700"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase cursor-pointer rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm border-none"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Simuler webhook d'achat</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] text-slate-400 font-serif block">
            💡 Le commentaire simulé injecte de suite une commande dans l'onglet{' '}
            <strong>Live shopping</strong> en temps réel !
          </span>
        </div>
      </form>
    </div>
  );
}
