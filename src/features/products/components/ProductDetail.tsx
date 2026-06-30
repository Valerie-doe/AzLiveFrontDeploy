import React, { useEffect, useState } from 'react';
import { Product, ProductVariant } from '../../../types';
import { Printer, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getProductDisplay, formatPrixUnitaire, getProductImageUrls } from '../utils/productUtils';
import ProductImageCarousel from './ProductImageCarousel';

interface ProductDetailProps {
  selectedProduct: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductDetail({
  selectedProduct,
  onEdit,
  onDelete,
}: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const display = getProductDisplay(selectedProduct);
  const imageUrls = getProductImageUrls(selectedProduct);
  const variants = selectedProduct.variants || [];
  const selectedVariant: ProductVariant | null =
    variants.find((v) => v.id === selectedVariantId) ?? null;
  const facebookPageName =
    selectedProduct.vendeur?.facebookPageName ||
    selectedProduct.vendeur?.nom ||
    'Ma boutique';

  useEffect(() => {
    setSelectedVariantId(null);
  }, [selectedProduct.id]);

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  return (
    <motion.div
      key="product-details"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-5"
    >
      <div>
        <span className="font-mono text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-md font-bold uppercase select-none">
          Code : {display.jpCode}
        </span>
        <h3 className="font-black text-slate-900 text-base mt-1.5 leading-snug">{selectedProduct.name}</h3>
      </div>

      <ProductImageCarousel
        images={imageUrls}
        alt={selectedProduct.name}
        className="h-44 w-full"
      />

      <hr className="border-slate-100" />

      <div className="grid grid-cols-3 gap-2 py-1 text-center">
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
          <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Taille</span>
          <span className="font-extrabold text-slate-800">{display.size}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
          <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Couleur</span>
          <span className="font-extrabold text-slate-800 truncate block max-w-full">{display.color || 'Standard'}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
          <span className="text-[8px] font-mono uppercase text-slate-400 font-bold block">Stock Réel</span>
          <span className={`font-black uppercase truncate block max-w-full ${
            display.stock === 0
              ? 'text-rose-600'
              : display.stock <= 3
              ? 'text-amber-600'
              : 'text-emerald-600'
          }`}>
            {display.stock} Unité{display.stock > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 space-y-2">
          <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
            Détail de l'Inventaire par Variante ({variants.length})
          </span>
          <p className="text-[9px] text-slate-400 font-serif">
            Cliquez sur une variante pour prévisualiser son étiquette thermique.
          </p>
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white max-h-40 overflow-y-auto shadow-sm">
            <table className="w-full text-left text-[10px] text-slate-700">
              <thead className="bg-slate-50 text-[8px] font-mono uppercase font-bold text-slate-400 border-b border-slate-100 select-none">
                <tr>
                  <th className="py-1 px-2.5">Code JP</th>
                  <th className="py-1 px-2.5">Taille</th>
                  <th className="py-1 px-2.5">Couleur</th>
                  <th className="py-1 px-2.5 text-right">Prix unit.</th>
                  <th className="py-1 px-2.5 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {variants.map((v, idx) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <tr
                      key={v.id || idx}
                      onClick={() => handleSelectVariant(v.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/60 hover:bg-indigo-50/80'
                          : 'hover:bg-slate-50/20'
                      }`}
                    >
                      <td className="py-1.5 px-2.5 font-mono font-bold text-slate-800">{v.jpCode}</td>
                      <td className="py-1.5 px-2.5 font-mono font-bold text-slate-800">{v.size}</td>
                      <td className="py-1.5 px-2.5 text-slate-600">{v.color}</td>
                      <td className="py-1.5 px-2.5 text-right font-black text-indigo-600">{formatPrixUnitaire(v.prixUnitaire)}</td>
                      <td className="py-1.5 px-2.5 text-right">
                        <span className={`font-mono font-black ${
                          v.stock === 0 ? 'text-rose-500 font-bold' : v.stock <= 2 ? 'text-amber-500 font-bold' : 'text-emerald-600'
                        }`}>
                          {v.stock} pcs
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <hr className="border-slate-100" />

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Printer className="h-4.5 w-4.5 text-indigo-600" />
            Aperçu de l'Étiquette Thermique
          </h4>
          <p className="text-[10px] text-slate-400 font-serif leading-tight mt-0.5">
            Prêt à coller sur le colis pour l'identification en entrepôt.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-950 p-4 rounded-xl text-center flex flex-col items-center justify-center relative overflow-hidden select-all shadow-sm min-h-[140px]">
          {selectedVariant ? (
            <>
              <div className="absolute top-1 left-2 text-[7px] font-mono text-slate-400 uppercase max-w-[45%] truncate">
                {facebookPageName}
              </div>
              <div className="absolute top-1 right-2 text-[7px] font-mono text-slate-400 uppercase">
                AZLive
              </div>

              <div className="absolute left-0 right-0 top-3 border-t border-dotted border-slate-300" />

              <div className="my-2.5 text-slate-950">
                <div className="text-xl font-black font-mono tracking-tight uppercase">
                  {selectedVariant.jpCode} {selectedProduct.name}
                </div>
                <div className="text-sm font-bold font-sans text-indigo-600 mt-1 uppercase">
                  – {formatPrixUnitaire(selectedVariant.prixUnitaire)} –
                </div>
              </div>

              <div className="w-full mt-2.5 pt-2 border-t border-dashed border-slate-200 text-[9px] text-slate-500 font-mono">
                <span>Taille : {selectedVariant.size} • Couleur : {selectedVariant.color || 'Unique'}</span>
              </div>
            </>
          ) : (
            <p className="text-[10px] text-slate-400 font-serif px-4 py-6">
              Sélectionnez une variante dans le tableau ci-dessus pour afficher l'aperçu de l'étiquette.
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={() => {
            if (!selectedVariant) return;
            alert(
              `Action: Impression thermique d'étiquette lancée !\n\n` +
              `Page: ${facebookPageName}\n` +
              `Titre: ${selectedVariant.jpCode} ${selectedProduct.name} – ${formatPrixUnitaire(selectedVariant.prixUnitaire)}\n` +
              `Taille: ${selectedVariant.size} • Couleur: ${selectedVariant.color}\n` +
              `Format: Adhésif 50x30mm`
            );
          }}
          disabled={!selectedVariant}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase tracking-wider font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center border-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900"
        >
          <Printer className="h-4 w-4" /> Imprimer l'Étiquette
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(selectedProduct)}
            className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-770 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center border-none"
          >
            <Edit3 className="h-3.5 w-3.5" /> Modifier
          </button>
          <button
            onClick={() => onDelete(selectedProduct.id)}
            className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center border-none"
          >
            <Trash2 className="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      </div>
    </motion.div>
  );
}
