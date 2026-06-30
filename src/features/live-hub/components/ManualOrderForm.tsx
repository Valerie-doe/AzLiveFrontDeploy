import React, { useState } from 'react';
import { PlusCircle, Send } from 'lucide-react';
import { Product } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { findProductByJpCode, findVariantByJpCode, formatPrixUnitaire } from '../../products/utils/productUtils';

interface ManualOrderFormProps {
  products: Product[];
  onSubmit: (jpCode: string, customerName: string) => void;
}

export default function ManualOrderForm({ products, onSubmit }: ManualOrderFormProps) {
  const [selectedJpCode, setSelectedJpCode] = useState<string>(products[0]?.variants[0]?.jpCode || 'JP1');
  const [manualCustomer, setManualCustomer] = useState<string>('');

  const currentProduct = findProductByJpCode(products, selectedJpCode);
  const currentVariant = findVariantByJpCode(products, selectedJpCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomer.trim()) return;
    
    onSubmit(selectedJpCode, manualCustomer.trim());
    setManualCustomer('');
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm" id="manual-claims-capture-sidepanel">
      <h3 className="font-extrabold text-slate-900 mb-1 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-indigo-600" />
        Saisie Manuelle d'Urgence
      </h3>
      <p className="text-xs text-slate-400 font-serif mb-4">
        Pour les clients qui buggent sur le live, tapez le code et l'identifiant pour forcer l'acquisition !
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Code JP assigné</label>
          <div className="grid grid-cols-4 gap-1">
            {products.map((p) => {
              const jpCode = p.variants[0]?.jpCode || 'JP';
              return (
              <button
                type="button"
                key={p.id}
                onClick={() => {
                  setSelectedJpCode(jpCode);
                  playNotificationSound('click');
                }}
                className={`p-2 rounded-xl font-black font-sans text-xs transition-all border ${
                  selectedJpCode === jpCode
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {jpCode}
              </button>
            )})}
          </div>
          {currentProduct && currentVariant && (
            <div className="mt-2 text-[11px] bg-slate-50 p-2.5 rounded-lg text-slate-600 flex justify-between">
              <span className="font-bold">{currentProduct.name}</span>
              <span className="font-mono text-indigo-600 font-extrabold">{formatPrixUnitaire(currentVariant.prixUnitaire)}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="customer-live-name" className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Compte Facebook / Petit nom</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">@</span>
            <input
              id="customer-live-name"
              type="text"
              required
              placeholder="e.g. mialy_randria"
              value={manualCustomer}
              onChange={(e) => setManualCustomer(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-550 text-slate-900 font-semibold"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!manualCustomer.trim()}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-555 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100"
        >
          <Send className="h-4 w-4" /> Injecter & Bloquer JP
        </button>
      </form>
    </div>
  );
}
