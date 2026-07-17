import React, { useEffect, useState } from 'react';
import { Settings, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  fetchPlatformSettings,
  updatePlatformSettings,
  PlatformSettings,
} from '../../api/parametres.api';

export default function SettingsView() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [timeoutMinutes, setTimeoutMinutes] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPlatformSettings()
      .then((data) => {
        if (cancelled) return;
        setSettings(data);
        setTimeoutMinutes(data.jp_turn_timeout_minutes || 5);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Impossible de charger les paramètres.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updatePlatformSettings({
        jp_turn_timeout_minutes: Math.max(1, Math.min(120, Number(timeoutMinutes) || 5)),
      });
      setSettings(updated);
      setTimeoutMinutes(updated.jp_turn_timeout_minutes);
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Paramètres</h1>
          <p className="text-sm text-slate-500 font-serif mt-0.5">
            Réglages de la file JP TikTok et de la confirmation.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-12 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement…
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm"
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
              <Clock className="h-3.5 w-3.5" />
              Timeout du tour (TikTok)
            </label>
            <p className="text-sm text-slate-500 font-serif leading-relaxed">
              Quand un client est 1er dans la file JP, il dispose de ce délai pour confirmer
              (quantité + infos). Passé ce temps, son JP expire et le suivant passe
              automatiquement.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="number"
                min={1}
                max={120}
                value={timeoutMinutes}
                onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                className="w-28 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
              <span className="text-sm font-semibold text-slate-600">minutes</span>
            </div>
            <p className="text-[11px] text-slate-400">Valeur entre 1 et 120. Défaut : 5 minutes.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Paramètres enregistrés.
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              {settings?.updated_at
                ? `Dernière mise à jour : ${new Date(settings.updated_at).toLocaleString('fr-FR')}`
                : ''}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
