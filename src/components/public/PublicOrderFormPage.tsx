import React, { useEffect, useRef, useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  AlertCircle,
  MessageCircle,
  XCircle,
} from 'lucide-react';
import {
  cancelPublicOrders,
  fetchPublicTikTokLoginUrl,
  lookupPublicOrders,
  submitPublicOrder,
  PublicOrderLookup,
  PublicOrderItem,
} from '../../api/public.api';

interface PublicOrderFormPageProps {
  liveId: number;
}

type Step = 'identifying' | 'no_orders' | 'form' | 'success' | 'waiting' | 'cancelled' | 'rupture';

const PLACEHOLDER_NAMES = ['Client Live', 'Client TikTok', 'Client Facebook'];

export default function PublicOrderFormPage({ liveId }: PublicOrderFormPageProps) {
  const [step, setStep] = useState<Step>('identifying');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lookup, setLookup] = useState<PublicOrderLookup | null>(null);
  const [ruptureMessages, setRuptureMessages] = useState<string[]>([]);
  const oauthStarted = useRef(false);

  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [dateLivraison, setDateLivraison] = useState('');
  const [heureLivraison, setHeureLivraison] = useState('');
  const [quantites, setQuantites] = useState<Record<number, number>>({});

  const applyLookupResult = (result: PublicOrderLookup, resolvedHandle: string) => {
    setLookup(result);
    setHandle(resolvedHandle);

    const aTraiter = result.commandes || [];
    const enAttente = result.commandes_liste_attente || [];

    if (aTraiter.length > 0) {
      setNom(
        result.client?.nom && !PLACEHOLDER_NAMES.includes(result.client.nom)
          ? result.client.nom
          : '',
      );
      setTelephone(result.client?.telephone || '');
      setAdresse(result.client?.adresse || '');
      setDateLivraison(result.client?.date_livraison || '');
      setHeureLivraison(result.client?.heure_livraison || '');
      const initialQty: Record<number, number> = {};
      aTraiter.forEach((c) => {
        const max =
          c.stock_disponible != null && c.stock_disponible > 0 ? c.stock_disponible : undefined;
        let q = c.quantite && c.quantite > 0 ? c.quantite : 1;
        if (q < 1) q = 1;
        if (max != null && q > max) q = max;
        initialQty[c.commande_id] = q;
      });
      setQuantites(initialQty);
      setStep('form');
      return;
    }

    // Déjà en liste d'attente (infos OK) → ne plus afficher le formulaire.
    if (enAttente.length > 0) {
      setNom(
        result.client?.nom && !PLACEHOLDER_NAMES.includes(result.client.nom)
          ? result.client.nom
          : '',
      );
      setStep('waiting');
      return;
    }

    setStep('no_orders');
  };

  const runLookup = async (resolvedHandle: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await lookupPublicOrders(liveId, resolvedHandle);
      applyLookupResult(result, resolvedHandle);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la vérification.';
      setError(message);
      setStep('no_orders');
    } finally {
      setLoading(false);
    }
  };

  const startTikTokIdentification = async () => {
    setLoading(true);
    setError(null);
    try {
      const { auth_url } = await fetchPublicTikTokLoginUrl(liveId);
      window.location.href = auth_url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connexion TikTok indisponible.';
      setError(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    const handleFromUrl = params.get('handle')?.trim();

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      setStep('no_orders');
      return;
    }

    if (handleFromUrl) {
      runLookup(handleFromUrl);
      return;
    }

    if (!oauthStarted.current) {
      oauthStarted.current = true;
      startTikTokIdentification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookup || !handle) return;
    if (!nom.trim() || !telephone.trim() || !adresse.trim() || !dateLivraison || !heureLivraison) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (lookup.commandes.length === 0) {
      setError('Aucune commande à confirmer.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Toujours envoyer TOUTES les commandes affichées.
      const items = lookup.commandes.map((c) => ({
        commande_id: c.commande_id,
        quantite: quantites[c.commande_id] || 1,
      }));

      const result = await submitPublicOrder(liveId, {
        handle: handle.trim(),
        nom: nom.trim(),
        telephone: telephone.trim(),
        adresse: adresse.trim(),
        date_livraison: dateLivraison,
        heure_livraison: heureLivraison,
        items,
      });

      const traitees = result.traitees || [];
      const erreurs = result.erreurs || [];
      const ruptures = erreurs.filter(
        (er) => er.rupture_stock || /rupture/i.test(er.detail || ''),
      );
      const confirmed = traitees.filter((t) => t.complet);
      const waiting = traitees.filter((t) => !t.complet);
      const expectedIds = new Set(items.map((i) => i.commande_id));
      const treatedIds = new Set(traitees.map((t) => t.commande_id));
      const allTreated = [...expectedIds].every((id) => treatedIds.has(id));

      if (traitees.length === 0 && ruptures.length > 0) {
        setRuptureMessages(ruptures.map((r) => r.detail));
        setStep('rupture');
        return;
      }

      if (traitees.length === 0 && erreurs.length > 0) {
        setError(erreurs.map((er) => er.detail).join(' • '));
        return;
      }

      if (!allTreated || erreurs.length > 0) {
        const missing = [...expectedIds].filter((id) => !treatedIds.has(id));
        const parts = [
          ...erreurs.map((er) => er.detail),
          missing.length
            ? `${missing.length} commande(s) n'ont pas pu être traitées.`
            : null,
        ].filter(Boolean);
        setError(parts.join(' • '));
        // Si au moins une a réussi, on informe mais on reste sur le formulaire
        // pour que l'utilisateur voie ce qui reste / les erreurs.
        if (traitees.length > 0) {
          const remaining = lookup.commandes.filter((c) => !treatedIds.has(c.commande_id));
          setLookup({ ...lookup, commandes: remaining });
        }
        return;
      }

      if (confirmed.length === 0 && waiting.length > 0) {
        setStep('waiting');
        return;
      }
      setStep('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'envoi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOne = async (commandeId: number, produitLabel: string) => {
    if (!lookup || !handle) return;
    const confirmed = window.confirm(
      `Annuler la commande « ${produitLabel} » ? Cette action est définitive.`,
    );
    if (!confirmed) return;

    setCancellingId(commandeId);
    setError(null);
    try {
      const result = await cancelPublicOrders(liveId, {
        handle: handle.trim(),
        commande_ids: [commandeId],
      });
      if (!result.annulees.length) {
        setError(
          (result.erreurs || []).map((e) => e.detail).join(' • ') ||
            "Impossible d'annuler cette commande.",
        );
        return;
      }

      const remaining = lookup.commandes.filter((c) => c.commande_id !== commandeId);
      setLookup({ ...lookup, commandes: remaining });
      setQuantites((prev) => {
        const next = { ...prev };
        delete next[commandeId];
        return next;
      });

      if (remaining.length === 0) {
        setStep('cancelled');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'annulation.";
      setError(message);
    } finally {
      setCancellingId(null);
    }
  };

  const maxQtyFor = (c: PublicOrderItem) => {
    if (c.stock_disponible != null && c.stock_disponible > 0) return c.stock_disponible;
    // Pas de stock dispo connu / liste d'attente : on garde au minimum 1.
    if (c.stock_disponible === 0) return 1;
    return undefined;
  };

  const setQty = (id: number, value: number, max?: number) => {
    let next = Number.isFinite(value) ? Math.floor(value) : 1;
    if (next < 1) next = 1;
    if (max != null && next > max) next = max;
    setQuantites((prev) => ({ ...prev, [id]: next }));
  };

  const liveTitle = lookup?.live?.titre;
  const vendeurName = lookup?.vendeur;
  const readyToConfirm =
    Boolean(lookup?.commandes?.length) &&
    lookup!.commandes.every((c) => c.pret_a_confirmer || c.infos_completes);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-8 font-sans">
      <div className="w-full max-w-md">
        {(liveTitle || vendeurName) && step !== 'identifying' && (
          <p className="text-center text-xs text-slate-500 font-medium mb-4">
            {liveTitle && (
              <>
                Live : <span className="font-bold text-slate-700">{liveTitle}</span>
              </>
            )}
            {vendeurName ? ` • ${vendeurName}` : ''}
          </p>
        )}

        {error && step !== 'identifying' && (
          <div className="mb-4 flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl p-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === 'identifying' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center space-y-4">
            <Loader2 className="h-10 w-10 text-secondary animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-800">Identification via TikTok…</p>
            <p className="text-xs text-slate-500 font-serif">
              Connexion à votre compte pour retrouver vos commandes de ce live.
            </p>
            {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
          </div>
        )}

        {step === 'no_orders' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-50 text-amber-600">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Aucune commande trouvée</h2>
            {handle && (
              <p className="text-xs text-slate-500">
                Compte : <span className="font-mono font-bold text-slate-700">@{handle}</span>
              </p>
            )}
            <p className="text-sm text-slate-600 font-serif leading-relaxed">
              Pour commander, commentez sur le <strong>live TikTok</strong> en tapant le{' '}
              <strong>code JP</strong> du produit (ex. <span className="font-mono">JP ROUGE</span>
              ), puis revenez sur cette page.
            </p>
            <button
              type="button"
              onClick={() => {
                oauthStarted.current = false;
                window.location.href = `/commander/${liveId}`;
              }}
              className="w-full py-3 bg-secondary hover:opacity-90 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              Réessayer
            </button>
          </div>
        )}

        {step === 'form' && lookup && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {handle && (
              <p className="text-center text-xs text-slate-500">
                Connecté en tant que{' '}
                <span className="font-mono font-bold text-secondary">@{handle}</span>
              </p>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-secondary" />
                {readyToConfirm ? 'Commande prête à confirmer' : 'Vos articles réservés'}
              </h2>
              {readyToConfirm && (
                <p className="text-[11px] text-emerald-700 font-semibold mb-3 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  Une place s&apos;est libérée. Vérifiez vos articles puis validez la confirmation.
                </p>
              )}
              <div className="space-y-2">
                {lookup.commandes.map((c: PublicOrderItem) => {
                  const qty = quantites[c.commande_id] || 1;
                  const maxQty = maxQtyFor(c);
                  const canDecrease = qty > 1;
                  const canIncrease = maxQty == null || qty < maxQty;
                  const noStock =
                    c.en_rupture || (c.stock_disponible != null && qty > c.stock_disponible);
                  const isCancellingThis = cancellingId === c.commande_id;
                  return (
                    <div
                      key={c.commande_id}
                      className={`rounded-xl p-3 space-y-2 ${
                        noStock ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{c.produit}</p>
                          <p className="text-[11px] text-slate-500">
                            <span className="font-mono font-bold text-secondary">
                              {c.code_jp || '—'}
                            </span>
                            {c.taille || c.couleur
                              ? ` • ${[c.taille, c.couleur].filter(Boolean).join(' / ')}`
                              : ''}
                            {c.prix_unitaire
                              ? ` • ${Number(c.prix_unitaire).toLocaleString()} Ar`
                              : ''}
                          </p>
                          {c.stock_disponible != null && (
                            <p
                              className={`text-[10px] font-bold mt-0.5 ${
                                noStock ? 'text-amber-600' : 'text-slate-400'
                              }`}
                            >
                              {noStock
                                ? 'Liste d’attente (stock déjà réservé)'
                                : `Stock dispo : ${c.stock_disponible}`}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={!canDecrease || loading || cancellingId != null}
                            onClick={() => setQty(c.commande_id, qty - 1, maxQty)}
                            className="h-8 w-8 rounded-lg bg-white border border-slate-200 font-black text-slate-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Diminuer la quantité"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={maxQty}
                            value={qty}
                            disabled={loading || cancellingId != null}
                            onChange={(e) => {
                              const raw = e.target.value;
                              if (raw === '') {
                                setQuantites((prev) => ({ ...prev, [c.commande_id]: 1 }));
                                return;
                              }
                              setQty(c.commande_id, Number(raw), maxQty);
                            }}
                            onBlur={() => setQty(c.commande_id, qty, maxQty)}
                            className="h-8 w-12 text-center font-black text-slate-900 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Quantité"
                          />
                          <button
                            type="button"
                            disabled={!canIncrease || loading || cancellingId != null}
                            onClick={() => setQty(c.commande_id, qty + 1, maxQty)}
                            className="h-8 w-8 rounded-lg bg-white border border-slate-200 font-black text-slate-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCancelOne(c.commande_id, c.produit)}
                        disabled={loading || cancellingId != null}
                        className="w-full py-2 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isCancellingThis ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        Annuler cette commande
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
              <h2 className="font-extrabold text-slate-900 text-sm">
                {readyToConfirm ? 'Vos informations enregistrées' : 'Informations de livraison'}
              </h2>

              <Field icon={<User className="h-4 w-4" />} label="Nom complet">
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex. Mialy Rakoto"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900 font-semibold"
                />
              </Field>

              <Field icon={<Phone className="h-4 w-4" />} label="Téléphone">
                <input
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="034 12 345 67"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900 font-semibold"
                />
              </Field>

              <Field icon={<MapPin className="h-4 w-4" />} label="Adresse de livraison">
                <textarea
                  required
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  rows={2}
                  placeholder="Quartier, ville, points de repère…"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900 font-semibold resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field icon={<Calendar className="h-4 w-4" />} label="Date livraison">
                  <input
                    type="date"
                    required
                    value={dateLivraison}
                    onChange={(e) => setDateLivraison(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900 font-semibold"
                  />
                </Field>
                <Field icon={<Clock className="h-4 w-4" />} label="Heure">
                  <input
                    type="time"
                    required
                    value={heureLivraison}
                    onChange={(e) => setHeureLivraison(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900 font-semibold"
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cancellingId != null || lookup.commandes.length === 0}
              className="w-full py-3.5 bg-secondary hover:opacity-90 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {readyToConfirm
                ? lookup.commandes.length > 1
                  ? `Valider et confirmer les ${lookup.commandes.length} commandes`
                  : 'Valider et confirmer ma commande'
                : lookup.commandes.length > 1
                  ? `Confirmer les ${lookup.commandes.length} commandes`
                  : 'Confirmer ma commande'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Commande enregistrée !</h2>
            <p className="text-sm text-slate-500 font-serif">
              Merci {nom || ''}. Toutes vos commandes et informations ont bien été transmises au
              vendeur. Vous serez contacté(e) pour la livraison.
            </p>
          </div>
        )}

        {step === 'waiting' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 text-amber-600">
              <Clock className="h-9 w-9" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Liste d&apos;attente</h2>
            {handle && (
              <p className="text-xs text-slate-500">
                Compte : <span className="font-mono font-bold text-slate-700">@{handle}</span>
              </p>
            )}
            <p className="text-sm text-slate-500 font-serif">
              Merci {nom || ''}. Vos informations sont enregistrées. Le stock est déjà réservé
              par d&apos;autres clients : vous n&apos;avez rien d&apos;autre à faire pour
              l&apos;instant.
            </p>
            <p className="text-xs text-slate-500 font-serif leading-relaxed">
              Si une place se libère (annulation d&apos;un JP avant le vôtre), rouvrez ce lien :
              le bouton de confirmation apparaîtra alors.
            </p>
            {(lookup?.commandes_liste_attente?.length ?? 0) > 0 && (
              <div className="text-left bg-amber-50 border border-amber-100 rounded-xl p-3 space-y-1.5">
                {lookup!.commandes_liste_attente!.map((c) => (
                  <p key={c.commande_id} className="text-xs font-semibold text-amber-800">
                    {c.produit}
                    {c.code_jp ? ` (${c.code_jp})` : ''}
                    {c.quantite ? ` × ${c.quantite}` : ''}
                  </p>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (handle) runLookup(handle);
              }}
              disabled={loading}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Vérifier si une place s&apos;est libérée
            </button>
          </div>
        )}

        {step === 'cancelled' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 text-rose-600">
              <XCircle className="h-9 w-9" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Commande annulée</h2>
            <p className="text-sm text-slate-500 font-serif">
              Votre commande a bien été annulée. Vous pouvez commander à nouveau en commentant un
              code JP sur le live.
            </p>
          </div>
        )}

        {step === 'rupture' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 text-amber-600">
              <AlertCircle className="h-9 w-9" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Produit en rupture de stock</h2>
            <div className="text-sm text-slate-600 font-serif space-y-1">
              {ruptureMessages.length > 0 ? (
                ruptureMessages.map((msg) => <p key={msg}>{msg}</p>)
              ) : (
                <p>Le produit n&apos;est plus disponible. La commande n&apos;a pas été confirmée.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('form');
                setRuptureMessages([]);
              }}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              Retour
            </button>
          </div>
        )}

        <p className="text-center text-[10px] text-slate-400 mt-6 font-mono">© 2026 AZLive Madagascar</p>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">
        <span className="text-secondary">{icon}</span> {label}
      </label>
      {children}
    </div>
  );
}
