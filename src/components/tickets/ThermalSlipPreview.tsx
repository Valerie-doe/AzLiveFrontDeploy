import React from 'react';
import { Scissors } from 'lucide-react';
import { Order } from '../../types';

interface ThermalSlipPreviewProps {
  order: Order;
  isPrinted: boolean;
}

export default function ThermalSlipPreview({ order, isPrinted }: ThermalSlipPreviewProps) {
  return (
    <div className="bg-stone-50 border-y-4 border-dashed border-stone-300 p-6 shadow-inner text-neutral-950 font-mono text-[11px] relative leading-relaxed max-w-sm mx-auto w-full" style={{ fontFamily: 'Courier, monospace' }}>
      
      {/* Scissors Line */}
      <div className="absolute -top-3 left-4 text-[10px] text-stone-500 font-sans flex items-center gap-1 bg-stone-50 px-1 select-none">
        <Scissors className="h-3 w-3 text-stone-400" /> REÇU THERMIQUE (80MM LONG)
      </div>

      {/* Status Watermark */}
      {isPrinted && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-dashed border-red-600 rounded text-red-600 font-black text-xl p-3 tracking-widest uppercase opacity-75 select-none -rotate-12">
          TICKET IMPRIMÉ
        </div>
      )}

      {/* HEADER DE LA COMMANDE */}
      <div className="text-center space-y-1 pb-4 border-b border-dashed border-neutral-400">
        <h4 className="font-extrabold text-xs uppercase">★★★ AZLIVE SOLUTIONS ★★★</h4>
        <p className="text-[9px]">Hub de Distribution Tana Nord</p>
        <p className="text-[9px]">Madagascar Live Auctions MVP</p>
        <div className="py-2.5">
          <span className="border-2 border-neutral-900 font-black text-sm px-5 py-1.5 bg-white rounded">
            CODE : {order.jpCode}
          </span>
        </div>
      </div>

      {/* CLIENT DETAILS */}
      <div className="py-4 space-y-1 border-b border-dashed border-neutral-400">
        <p className="font-extrabold text-[9px] uppercase text-neutral-500">COORDONNÉES CLIENT :</p>
        <p className="font-black text-xs">Nom : {order.customerName}</p>
        <p className="font-bold">Handle : {order.customerHandle}</p>
        <p>Tél : {order.customerPhone || 'Non renseigné'}</p>
        <p className="mt-2 text-[9px] leading-relaxed bg-stone-200/60 p-2 rounded">
          Adresse : {order.deliveryAddress || 'En attente de précision'}
        </p>
        <p className="text-[9px] text-emerald-800 font-bold">
          Date préférée : {order.prefDeliveryDate || 'Dès que possible'}
        </p>
      </div>

      {/* LISTE ARTICLE */}
      <div className="py-4 space-y-2 border-b border-dashed border-neutral-400">
        <p className="font-extrabold text-[9px] uppercase text-neutral-500">CONTENU DU PAQUET :</p>
        <div className="space-y-1">
          <div className="flex justify-between font-black text-xs">
            <span>1x {order.productName}</span>
            <span>1 Unit</span>
          </div>
          <p className="text-[9px] text-neutral-500 italic pl-1">ID Tracker : {order.id.toUpperCase()}</p>
        </div>
      </div>

      {/* FINANCES & PAIEMENTS */}
      <div className="py-4 space-y-1.5 text-right border-b border-dashed border-neutral-400">
        <div className="flex justify-between">
          <span>Montant de l'article :</span>
          <span>{order.price.toLocaleString()} Ar</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Mode de Règlement :</span>
          <span>{order.paymentType}</span>
        </div>
        <div className="flex justify-between text-[10px] text-neutral-600">
          <span>Livraison (AZExpress) :</span>
          <span>À la charge du vendeur</span>
        </div>
        <div className="flex justify-between text-base font-black text-neutral-950 pt-2 border-t">
          <span>TOTAL NET :</span>
          <span>{order.price.toLocaleString()} Ar</span>
        </div>
      </div>

      {/* PSEUDO BARCODE */}
      <div className="text-center pt-4 space-y-2">
        <p className="text-[9px] italic">Scannez pour valider le chargement du coursier.</p>
        <div className="flex flex-col items-center py-1.5 bg-neutral-100 rounded">
          <div className="h-8 w-40 bg-neutral-900 flex justify-center items-stretch gap-0.5">
            <div className="w-1.5 bg-white"></div>
            <div className="w-1 bg-white"></div>
            <div className="w-2 bg-white"></div>
            <div className="w-0.5 bg-white"></div>
            <div className="w-1 bg-white"></div>
            <div className="w-2.5 bg-white"></div>
            <div className="w-1 bg-white"></div>
            <div className="w-1.5 bg-white"></div>
          </div>
          <p className="text-[8px] mt-1 font-mono tracking-widest text-slate-500 font-bold">
            *MADA-{order.id.toUpperCase()}*
          </p>
        </div>
      </div>

    </div>
  );
}
