import React from 'react';
import { Product } from '../../../types';
import { getProductDisplay, getProductStock, formatPrixUnitaire } from '../../products/utils/productUtils';

interface ProductDisplayCardProps {
  currentProduct?: Product;
}

export default function ProductDisplayCard({ currentProduct }: ProductDisplayCardProps) {
  const display = currentProduct ? getProductDisplay(currentProduct) : null;

  return (
    <>
      {/* ACTIVE PRODUCT LABEL PLACARD FOR SELLER (Point 3) */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-3xl border border-slate-800" id="live-presentation-aside">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Affiche Caméra Vendeur</span>
          <span className="bg-emerald-500 text-slate-950 font-mono font-bold text-[8px] px-1.5 py-0.2 rounded">ACTIF</span>
        </div>

        {currentProduct ? (
          <div className="bg-white text-slate-950 p-5 rounded-2xl text-center border-2 border-dashed border-slate-350 shadow-inner relative">
            <span className="text-[9px] font-bold font-mono text-slate-400 block border-b pb-1.5 mb-1.5">
              ★ FEUILLE DE PRESENTATION DIRECT ★
            </span>
            <h2 className="text-4xl font-black text-slate-950 font-mono tracking-tight">
              {display?.jpCode}
            </h2>
            <p className="text-xs text-slate-600 font-serif mt-1 font-semibold">
              {currentProduct.name}
            </p>
            <p className="text-2xl font-black text-indigo-650 text-indigo-600 font-sans mt-1.5">
              {display ? formatPrixUnitaire(display.prixUnitaire) : ''}
            </p>
            
            <div className="mt-4 flex justify-center">
              <span className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold py-1 px-3 rounded-full">
                Stock: {currentProduct ? getProductStock(currentProduct) : 0} restant
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center font-mono py-4">Sélectionnez un article pour l'allouer ici.</p>
        )}
      </div>

      {/* OPERATIONS MANUAL TIPS FOR STRESS REDUCTION */}
      <div className="bg-indigo-900/40 text-indigo-200 p-5 rounded-3xl border border-indigo-900/60 leading-relaxed text-xs space-y-2">
        <h4 className="font-extrabold text-white text-sm flex items-center gap-1">💡 Aide Secrétariat</h4>
        <p>
          Même si le stock est épuisé, AZLive accepte les JP suivants pour créer une liste d'attente (file secondaire en cas de désistement). 
        </p>
        <p className="font-semibold text-white">Le 1er client ayant validé par chat bloque le stock physique automatiquement.</p>
      </div>
    </>
  );
}
