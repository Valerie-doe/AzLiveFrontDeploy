import React from 'react';
import { Radio, Trash2, AlertCircle } from 'lucide-react';
import { ConnectedChannel } from '../types';

interface ChannelsTabProps {
  channels: ConnectedChannel[];
  onToggleWebhook: (id: string) => void;
  onDisconnectChannel: (id: string, name: string) => void;
}

export default function ChannelsTab({
  channels,
  onToggleWebhook,
  onDisconnectChannel,
}: ChannelsTabProps) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-455 text-slate-400 uppercase font-bold tracking-wider mb-2">
        <span>Liste des Pages & Portails Approuvés</span>
        <span>Flux Actif</span>
      </div>

      <div className="space-y-3.5">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="p-4 border border-slate-150 rounded-2xl hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white text-xs"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-full text-white font-black flex items-center justify-center text-sm ${channel.avatarColor}`}
              >
                {channel.avatarInitial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">{channel.name}</h3>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-black border uppercase ${
                      channel.platform === 'Facebook'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    {channel.platform}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  {channel.handle} •{' '}
                  <span className="text-[10px] text-slate-500 font-sans font-medium">
                    {channel.followers}
                  </span>
                </p>
                <span className="text-[10px] font-serif text-slate-400 block mt-0.5">
                  {channel.tokenExpiry}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0">
              {/* Webhook toggle */}
              <div className="flex items-center gap-2 pr-3 border-r border-slate-100">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase cursor-pointer select-none">
                  Webhook {channel.webhookActive ? 'ON' : 'OFF'}
                </label>
                <button
                  onClick={() => onToggleWebhook(channel.id)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none relative cursor-pointer border-none ${
                    channel.webhookActive ? 'bg-indigo-600' : 'bg-slate-200 bg-slate-250'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                      channel.webhookActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Live Status indicator */}
              {channel.activeLive ? (
                <span className="bg-rose-50 border border-rose-200 text-rose-800 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wide flex items-center gap-1 shrink-0 animate-pulse">
                  <Radio className="h-3 w-3 animate-spin text-rose-600" />
                  Live en cours
                </span>
              ) : (
                <span className="bg-slate-50 border text-slate-400 border-slate-200 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase shrink-0">
                  Prêt pour live
                </span>
              )}

              <button
                onClick={() => onDisconnectChannel(channel.id, channel.name)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 border-none bg-transparent cursor-pointer"
                title="Dissocier ce canal"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        ))}

        {channels.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold font-mono text-slate-400 uppercase mt-2">
              Aucun canal social connecté
            </p>
            <p className="text-xs text-slate-400 font-serif mt-1">
              Veuillez associer vos pages de vente pour commencer la syncro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
