import React from 'react';
import { ShoppingBag, ExternalLink, CheckCircle, Copy, Printer } from 'lucide-react';
import { Order } from '../../../types';

interface LiveOrderDetailPanelProps {
  ord: Order | undefined;
  copiedOrderId: string | null;
  onCopySummary: (order: Order) => void;
  onPrintClick: (orderId: string) => void;
}

export default function LiveOrderDetailPanel({
  ord,
  copiedOrderId,
  onCopySummary,
  onPrintClick,
}: LiveOrderDetailPanelProps) {
  if (!ord) {
    return (
      <div className="m-auto py-12 text-center text-slate-400 space-y-2">
        <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" strokeWidth={1} />
        <h4 className="font-black text-slate-700">Aucune commande choisie</h4>
        <p className="text-xs font-serif leading-relaxed">
          Sélectionnez une commande à gauche pour faire apparaître sa fiche d'achat Facebook,
          son reçu Mobile Money, et ses coordonnées d'expédition AZExpress.
        </p>
      </div>
    );
  }

  const sampleOperatorScreenshots = {
    Mvola: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=60',
    'Orange Money': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60',
    'Airtel Money': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=60',
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col justify-between">
      <div className="space-y-5">
        {/* Profile header bar */}
        <div className="flex justify-between items-start pb-4 border-b">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-indigo-600 text-white text-[9px] font-mono font-black px-2 py-0.5 rounded">
                {ord.jpCode}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">• {ord.customerHandle}</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mt-1.5">{ord.customerName}</h4>
            <p className="text-xs text-slate-500 font-semibold font-mono">{ord.customerPhone}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono block text-slate-400 leading-none mb-1.5">Heure</span>
            <span className="bg-slate-50 text-slate-800 px-2 py-0.5 rounded font-mono font-bold border text-[10px]">
              {ord.orderTime}
            </span>
          </div>
        </div>

        {/* Article detail card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[8px] uppercase font-mono text-slate-400 block font-bold">
              Produit réservé
            </span>
            <h5 className="font-extrabold text-slate-800 text-xs mt-0.5">{ord.productName}</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Code unique : {ord.jpCode}</p>
          </div>

          <div className="text-right">
            <span className="text-[8px] uppercase font-mono text-slate-400 block font-bold">
              Prix d'acquisition
            </span>
            <span className="font-sans font-black text-xs text-indigo-600">
              {ord.price.toLocaleString()} Ar
            </span>
          </div>
        </div>

        {/* Delivery, Address & Payments Proof details */}
        <div className="space-y-4">
          {/* expédition */}
          <div className="space-y-1.5 text-xs">
            <h5 className="font-bold text-slate-900 text-xs">Informations d'Expédition</h5>
            <div className="bg-slate-50 border p-3 rounded-2xl space-y-2">
              <div>
                <span className="text-[9px] text-slate-400 font-mono block font-bold">
                  Adresse de livraison
                </span>
                <span className="font-serif text-slate-600">
                  {ord.deliveryAddress || "Emporter à l'agence"}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-mono block font-bold">
                  Régime logistique
                </span>
                <span className="font-bold text-slate-900">
                  {ord.sentToDelivery ? 'AZExpress Expédié 🚴' : "En attente d'attribution"}
                </span>
              </div>
            </div>
          </div>

          {/* Validation Mobile Money */}
          <div className="space-y-1.5 text-xs">
            <h5 className="font-bold text-slate-900 text-xs">Validation Mobile Money Mada</h5>
            <div className="bg-slate-50 border p-3 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-mono font-bold block">
                  Status Règlement
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    ord.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {ord.isPaid ? 'PAYÉ ✅' : 'ATTENTE MOBILE MONEY ⏳'}
                </span>
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                {ord.mobileMoneyScreenshot || ord.isPaid ? (
                  <a
                    href={ord.mobileMoneyScreenshot || sampleOperatorScreenshots['Mvola']}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-600 font-black hover:underline flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Voir reçu de transaction
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400 font-serif italic">
                    Aucun reçu scanné
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Raw comment capture snippet */}
        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1.5 text-xs">
          <span className="text-[8px] font-mono text-amber-800 uppercase font-black tracking-wider block">
            Snippet détecté sur le direct :
          </span>
          <p className="text-xs font-serif font-semibold text-slate-700 italic leading-relaxed">
            "{ord.commentSnippet || `Saisie d'urgence sur le Dressing ${ord.jpCode}`}"
          </p>
        </div>
      </div>

      {/* ACTIONS SLIDER ROW */}
      <div className="pt-4 border-t flex flex-col gap-2">
        <button
          onClick={() => onCopySummary(ord)}
          className="w-full py-2 px-3 border hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors bg-white cursor-pointer"
        >
          {copiedOrderId === ord.id ? (
            <>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Copié !</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-400" />
              <span>Copier fiche pour Messenger</span>
            </>
          )}
        </button>

        <button
          onClick={() => onPrintClick(ord.id)}
          className="w-full py-2 px-4 bg-secondary border border-secondary hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs uppercase transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Printer className="h-4 w-4 text-indigo-400" />
          Imprimer ticket thermocollant
        </button>
      </div>
    </div>
  );
}
