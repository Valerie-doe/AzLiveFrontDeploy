import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Printer, Link2, Check, Loader2, Radio, RadioTower } from 'lucide-react';
import { LiveSession } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { formatLiveDate } from '../utils/dateUtils';
import {
  CaptureJpStatus,
  fetchCaptureJpStatus,
  startCaptureJp,
  stopCaptureJp,
} from '../../../api/lives.api';

interface LiveSessionHeaderProps {
  selectedSession: LiveSession;
  onBack: () => void;
  onStartLive: () => void;
  onCloseLive: () => void;
  onPrintTickets: () => void;
  /** true pendant lancer / clôturer / dressing — feedback visuel immédiat au clic. */
  busy?: boolean;
}

export default function LiveSessionHeader({
  selectedSession,
  onBack,
  onStartLive,
  onCloseLive,
  onPrintTickets,
  busy = false,
}: LiveSessionHeaderProps) {
  const handleBackClick = () => {
    if (busy) return;
    onBack();
    playNotificationSound('click');
  };

  const handleStartClick = () => {
    if (busy) return;
    playNotificationSound('click');
    onStartLive();
  };

  const handleCloseClick = () => {
    if (busy) return;
    playNotificationSound('click');
    onCloseLive();
  };

  const handlePrintClick = () => {
    onPrintTickets();
    playNotificationSound('click');
  };

  const [linkCopied, setLinkCopied] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<CaptureJpStatus | null>(null);
  const [captureBusy, setCaptureBusy] = useState(false);
  const [captureMsg, setCaptureMsg] = useState<string | null>(null);

  const orderFormUrl =
    selectedSession.confirmationLink ||
    `${window.location.origin}/commander/${selectedSession.id}`;

  const refreshCapture = useCallback(async () => {
    if (selectedSession.status !== 'En cours') {
      setCaptureStatus(null);
      return;
    }
    try {
      const status = await fetchCaptureJpStatus(selectedSession.id);
      setCaptureStatus(status);
    } catch {
      // silencieux : bouton reste utilisable
    }
  }, [selectedSession.id, selectedSession.status]);

  useEffect(() => {
    refreshCapture();
    if (selectedSession.status !== 'En cours') return undefined;
    const timer = window.setInterval(refreshCapture, 8000);
    return () => window.clearInterval(timer);
  }, [refreshCapture, selectedSession.status]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(orderFormUrl);
    } catch {
      const temp = document.createElement('textarea');
      temp.value = orderFormUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    setLinkCopied(true);
    playNotificationSound('click');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleToggleCapture = async () => {
    if (captureBusy || busy) return;
    setCaptureBusy(true);
    setCaptureMsg(null);
    playNotificationSound('click');
    try {
      const active = captureStatus?.capture_active || captureStatus?.queued;
      const result = active
        ? await stopCaptureJp(selectedSession.id)
        : await startCaptureJp(selectedSession.id);
      setCaptureStatus(result.status);
      setCaptureMsg(result.detail);
    } catch (err: unknown) {
      setCaptureMsg(err instanceof Error ? err.message : 'Action capture JP impossible.');
    } finally {
      setCaptureBusy(false);
    }
  };

  const captureActive = Boolean(captureStatus?.capture_active);
  const captureQueued = Boolean(captureStatus?.queued);
  const poolLabel = captureStatus
    ? `${captureStatus.pool.active}/${captureStatus.pool.max}`
    : null;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border text-slate-650 rounded-xl transition-colors cursor-pointer"
            title="Retour à l'Espace Commercial"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                  selectedSession.status === 'En cours'
                    ? 'bg-red-100 text-red-800 animate-pulse'
                    : selectedSession.status === 'Créé'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-100 text-slate-705'
                }`}
              >
                {selectedSession.status === 'En cours'
                  ? 'Direct En Cours 📡'
                  : selectedSession.status === 'Créé'
                  ? 'Direct Créé / Non lancé 📅'
                  : 'Direct Terminé 📁'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-serif font-medium">
                {formatLiveDate(selectedSession.date)}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-base md:text-lg mt-1">
              {selectedSession.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedSession.status !== 'Terminé' && (
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copier le lien de confirmation"
              className={`max-w-full px-3 py-2 rounded-xl text-[11px] font-mono transition-all cursor-pointer flex items-center gap-2 border ${
                linkCopied
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {linkCopied ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Link2 className="h-3.5 w-3.5 shrink-0" />}
              <span className="truncate max-w-[220px] sm:max-w-[320px]">
                {linkCopied ? 'Lien copié !' : orderFormUrl}
              </span>
            </button>
          )}

          {selectedSession.status === 'Créé' && (
            <button
              type="button"
              onClick={handleStartClick}
              disabled={busy}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-black uppercase transition-all cursor-pointer shadow-md border-none disabled:opacity-70 disabled:cursor-wait inline-flex items-center gap-2"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Lancement…
                </>
              ) : (
                'Lancer le Live'
              )}
            </button>
          )}

          {selectedSession.status === 'En cours' && (
            <>
              <button
                type="button"
                onClick={handleToggleCapture}
                disabled={busy || captureBusy}
                title={
                  captureActive
                    ? 'Arrêter l’écoute des commentaires JP TikTok'
                    : 'Ouvrir un WebSocket TikTools pour capturer les JP'
                }
                className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer inline-flex items-center gap-2 border disabled:opacity-70 disabled:cursor-wait ${
                  captureActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : captureQueued
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 shadow-sm'
                }`}
              >
                {captureBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : captureActive ? (
                  <RadioTower className="h-3.5 w-3.5" />
                ) : (
                  <Radio className="h-3.5 w-3.5" />
                )}
                {captureActive
                  ? 'Capture JP active'
                  : captureQueued
                  ? `En file (#${captureStatus?.queue_position})`
                  : 'Activer capture JP'}
              </button>

              <button
                type="button"
                onClick={handleCloseClick}
                disabled={busy}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer border-2 border-red-700 shadow-md shadow-red-200 inline-flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Clôture…
                  </>
                ) : (
                  'Clôturer le Live'
                )}
              </button>
            </>
          )}

          {selectedSession.status === 'Terminé' && (
            <button
              onClick={handlePrintClick}
              className="px-5 py-2.5 bg-secondary bg-indigo-600 hover:bg-indigo-705 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-2 shadow-sm border-none"
            >
              <Printer className="h-4 w-4" /> Imprimer tickets produits
            </button>
          )}
        </div>
      </div>

      {selectedSession.status === 'En cours' && (captureMsg || captureStatus) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 px-1">
          {poolLabel && (
            <span className="font-mono font-bold text-slate-600">
              Pool WS {poolLabel}
              {captureStatus?.pool.pending ? ` · file ${captureStatus.pool.pending}` : ''}
            </span>
          )}
          {captureStatus?.ws_rate_limited && (
            <span className="text-amber-700 font-semibold">
              Quota TikTools en pause (~
              {Math.ceil((captureStatus.ws_rate_limit_remaining_seconds || 0) / 60)} min)
            </span>
          )}
          {captureMsg && <span className="font-serif text-slate-600">{captureMsg}</span>}
        </div>
      )}
    </div>
  );
}
