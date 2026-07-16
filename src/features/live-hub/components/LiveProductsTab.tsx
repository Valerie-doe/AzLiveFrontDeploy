import React, { useState } from 'react';
import { Printer, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { LiveSession, Product, Order } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { PaginationControls } from '../../../shared';
import { getProductDisplay, getNextJpCode, getProductStock, formatPrixUnitaire } from '../../products/utils/productUtils';

interface LiveProductsTabProps {
  selectedSession: LiveSession;
  products: Product[];
  sessionOrders: Order[];
  productsPage: number;
  setProductsPage: (page: number) => void;
  liveEditingProductId: string | null;
  setLiveEditingProductId: (id: string | null) => void;
  liveEditName: string;
  setLiveEditName: (val: string) => void;
  liveEditJpCode: string;
  setLiveEditJpCode: (val: string) => void;
  liveEditPrice: number;
  setLiveEditPrice: (val: number) => void;
  liveEditStock: number;
  setLiveEditStock: (val: number) => void;
  liveEditSize: string;
  setLiveEditSize: (val: string) => void;
  liveEditColor: string;
  setLiveEditColor: (val: string) => void;
  liveIsAddingProduct: boolean;
  setLiveIsAddingProduct: (val: boolean) => void;
  onAddProduct: (prod: Omit<Product, 'id'>) => void | Promise<void>;
  onEditProduct: (id: string, updates: Partial<Product>) => void | Promise<void>;
  onRemoveFromDressing: (productId: string) => void | Promise<void>;
  onPrintProductClick: (jpCode: string) => void;
  onPrintAll: () => void;
}

export default function LiveProductsTab({
  selectedSession,
  products,
  sessionOrders,
  productsPage,
  setProductsPage,
  liveEditingProductId,
  setLiveEditingProductId,
  liveEditName,
  setLiveEditName,
  liveEditJpCode,
  setLiveEditJpCode,
  liveEditPrice,
  setLiveEditPrice,
  liveEditStock,
  setLiveEditStock,
  liveEditSize,
  setLiveEditSize,
  liveEditColor,
  setLiveEditColor,
  liveIsAddingProduct,
  setLiveIsAddingProduct,
  onAddProduct,
  onEditProduct,
  onRemoveFromDressing,
  onPrintProductClick,
  onPrintAll,
}: LiveProductsTabProps) {
  const [formBusy, setFormBusy] = useState(false);
  // Live terminé : consultation et impression autorisées, mais aucune modification du dressing.
  const isTerminated = selectedSession.status === 'Terminé';

  const activeProds = products.filter((p) =>
    selectedSession.selectedProductIds?.includes(p.id)
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(activeProds.length / ITEMS_PER_PAGE);
  const activePage = Math.min(productsPage, Math.max(1, totalPages));
  const displayedProds = activeProds.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const handleStartAdding = () => {
    if (isTerminated) return;
    setLiveIsAddingProduct(true);
    setLiveEditingProductId(null);
    setLiveEditName('');
    setLiveEditJpCode(getNextJpCode(products));
    setLiveEditPrice(35000);
    setLiveEditStock(12);
    setLiveEditSize('Freesize');
    setLiveEditColor('Noir');
    playNotificationSound('click');
  };

  const handleRowClick = (p: Product) => {
    if (isTerminated) return;
    const display = getProductDisplay(p);
    const firstVariant = p.variants[0];
    setLiveIsAddingProduct(false);
    setLiveEditingProductId(p.id);
    setLiveEditName(p.name);
    setLiveEditJpCode(firstVariant?.jpCode || display.jpCode);
    setLiveEditPrice(firstVariant?.prixUnitaire || display.prixUnitaire);
    setLiveEditStock(firstVariant?.stock ?? getProductStock(p));
    setLiveEditSize(firstVariant?.size || display.size);
    setLiveEditColor(firstVariant?.color || display.color || '');
    playNotificationSound('click');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formBusy) return;
    if (!liveEditName.trim() || !liveEditJpCode.trim() || liveEditPrice <= 0) {
      alert("Veuillez remplir le nom, le code JP et définir un prix positif.");
      return;
    }
    setFormBusy(true);
    try {
      if (liveIsAddingProduct) {
        await onAddProduct({
          name: liveEditName.trim(),
          variants: [{
            id: `var-${Date.now()}`,
            jpCode: liveEditJpCode.trim().toUpperCase(),
            size: liveEditSize.trim() || 'Freesize',
            color: liveEditColor.trim() || 'Unique',
            prixUnitaire: Number(liveEditPrice),
            stock: Number(liveEditStock),
          }],
        });
        setLiveIsAddingProduct(false);
      } else if (liveEditingProductId) {
        const existing = products.find((p) => p.id === liveEditingProductId);
        const firstVariant = existing?.variants[0];
        await onEditProduct(liveEditingProductId, {
          name: liveEditName.trim(),
          variants: [{
            id: firstVariant?.id || `var-${Date.now()}`,
            jpCode: liveEditJpCode.trim().toUpperCase(),
            size: liveEditSize.trim() || 'Freesize',
            color: liveEditColor.trim() || 'Unique',
            prixUnitaire: Number(liveEditPrice),
            stock: Number(liveEditStock),
          }, ...(existing?.variants.slice(1) || [])],
        });
        setLiveEditingProductId(null);
      }
      playNotificationSound('confirm');
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setFormBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-none" id="live-products-split-panel">
      {/* Left Column: Products table inside active live session view */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-8">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 font-mono">
              Dressing / Articles du Direct
            </h3>
            <p className="text-[10px] text-slate-400 font-serif">
              Modifiez ou supprimez les articles d'ici pendant le Direct de vente.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              onClick={() => {
                onPrintAll();
                playNotificationSound('click');
              }}
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-850 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 transition-all border border-indigo-100 cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" /> Imprimer tout
            </button>

            {!isTerminated && (
              <button
                type="button"
                onClick={handleStartAdding}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-sm border-none"
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter un Article en Direct
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-650 font-sans">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                <th className="py-3 px-5">Code unique</th>
                <th className="py-3 px-5">Nom d'article / Description</th>
                <th className="py-3 px-5 text-center">Stock restant</th>
                <th className="py-3 px-5 text-right">Prix Enchère</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {activeProds.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-mono">
                    Aucun article n'est lié à ce livestream.
                  </td>
                </tr>
              ) : (
                displayedProds.map((p) => {
                  const isSelected = liveEditingProductId === p.id;
                  const display = getProductDisplay(p);
                  const primaryJp = p.variants[0]?.jpCode || display.jpCode;
                  const countOrders = sessionOrders.filter(
                    (ord) => p.variants.some((v) => v.jpCode === ord.jpCode) && ord.status !== 'annulé'
                  ).length;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-50/20 font-bold' : ''
                      }`}
                      onClick={() => handleRowClick(p)}
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                          {display.jpCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-extrabold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {display.size} {display.color ? `• ${display.color}` : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            getProductStock(p) === 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {getProductStock(p)} restant{getProductStock(p) > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-black text-indigo-600 font-sans">
                        {formatPrixUnitaire(display.prixUnitaire)}
                      </td>
                      <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          {!isTerminated && (
                            <button
                              type="button"
                              onClick={() => handleRowClick(p)}
                              className="px-2 py-1 bg-slate-50 border hover:bg-slate-100 text-slate-700 font-bold rounded text-[10px] cursor-pointer"
                            >
                              Modifier
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={countOrders === 0}
                            onClick={() => {
                              onPrintProductClick(primaryJp);
                              playNotificationSound('click');
                            }}
                            className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 font-bold transition-all border ${
                              countOrders === 0
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-indigo-50 hover:bg-indigo-650 border-indigo-150 hover:border-indigo-650 text-indigo-700 hover:text-white cursor-pointer'
                            }`}
                          >
                            Tickets ({countOrders})
                          </button>
                          {selectedSession.status === 'En cours' && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (
                                  confirm(
                                    `Voulez-vous retirer l'article ${primaryJp} du dressing ?`
                                  )
                                ) {
                                  await onRemoveFromDressing(p.id);
                                  if (liveEditingProductId === p.id) {
                                    setLiveEditingProductId(null);
                                  }
                                }
                              }}
                              className="px-2 py-1 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 font-bold rounded text-[10px] cursor-pointer"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={activePage}
          totalItems={activeProds.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setProductsPage}
          itemLabel="articles"
        />
      </div>

      {/* RIGHT COLUMN: DETAIL FORM FOR LIVE EDITING/ADDING PRODUCT */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm min-h-[450px]">
        {liveIsAddingProduct || liveEditingProductId ? (
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-mono text-indigo-600">
                  {liveIsAddingProduct ? 'Ajouter un Produit Direct' : `Modifier ${liveEditJpCode}`}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setLiveIsAddingProduct(false);
                    setLiveEditingProductId(null);
                    playNotificationSound('click');
                  }}
                  className="text-slate-400 hover:text-slate-650 hover:text-slate-600 font-bold border-none bg-transparent cursor-pointer"
                >
                  Annuler
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">
                    Code JP*
                  </label>
                  <input
                    type="text"
                    required
                    value={liveEditJpCode}
                    onChange={(e) => setLiveEditJpCode(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono font-black uppercase text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">
                    Nom complet du produit*
                  </label>
                  <input
                    type="text"
                    required
                    value={liveEditName}
                    onChange={(e) => setLiveEditName(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">
                      Prix d'Enchère*
                    </label>
                    <input
                      type="number"
                      required
                      value={liveEditPrice || ''}
                      onChange={(e) => setLiveEditPrice(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded-lg font-sans font-black text-indigo-650 text-indigo-650 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">
                      Quantité Stock*
                    </label>
                    <input
                      type="number"
                      required
                      value={liveEditStock}
                      onChange={(e) => setLiveEditStock(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border rounded-lg font-sans font-black focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">
                      Taille
                    </label>
                    <input
                      type="text"
                      value={liveEditSize}
                      onChange={(e) => setLiveEditSize(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">
                      Couleur / Détail
                    </label>
                    <input
                      type="text"
                      value={liveEditColor}
                      onChange={(e) => setLiveEditColor(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setLiveIsAddingProduct(false);
                  setLiveEditingProductId(null);
                  playNotificationSound('click');
                }}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-205 hover:bg-slate-200 rounded-lg text-slate-700 font-bold border-none cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={formBusy}
                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black rounded-lg border-none cursor-pointer disabled:opacity-70 disabled:cursor-wait inline-flex items-center justify-center gap-1.5"
              >
                {formBusy ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Enregistrement…
                  </>
                ) : liveIsAddingProduct ? (
                  'Ajouter'
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2 lg:mt-16">
            <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" strokeWidth={1} />
            <h4 className="font-black text-slate-700 text-xs">Ajustement du Dressing</h4>
            <p className="text-[11px] font-serif leading-relaxed">
              Pendant le live direct de vente, cliquez sur "Ajouter un Article" pour insérer des
              pièces de dernière minute reçues par les vendeuses ou cliquez sur "Modifier/Supprimer"
              pour modifier instantanément les données d'Enchère d'un article.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
