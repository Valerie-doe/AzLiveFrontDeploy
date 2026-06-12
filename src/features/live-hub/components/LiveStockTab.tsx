import React from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { LiveSession, Product } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { SearchInput } from '../../../shared';

interface LiveStockTabProps {
  selectedSession: LiveSession;
  products: Product[];
  selectedStockProductIds: string[];
  setSelectedStockProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  stockSearchQuery: string;
  setStockSearchQuery: (val: string) => void;
  onUpdateLiveSession: (sessionId: string, updates: Partial<LiveSession>) => void;
  onTabChange: (tab: 'orders' | 'products' | 'stock') => void;
}

export default function LiveStockTab({
  selectedSession,
  products,
  selectedStockProductIds,
  setSelectedStockProductIds,
  stockSearchQuery,
  setStockSearchQuery,
  onUpdateLiveSession,
  onTabChange,
}: LiveStockTabProps) {
  const filteredStock = products.filter((p) => {
    const q = stockSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.jpCode.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q) ||
      (p.color && p.color.toLowerCase().includes(q))
    );
  });

  const handleRowClick = (p: Product, isAlreadyInDressing: boolean) => {
    if (isAlreadyInDressing) return;
    const isChecked = selectedStockProductIds.includes(p.id);
    if (isChecked) {
      setSelectedStockProductIds((prev) => prev.filter((id) => id !== p.id));
    } else {
      setSelectedStockProductIds((prev) => [...prev, p.id]);
    }
    playNotificationSound('click');
  };

  const handleRemoveSelection = (id: string) => {
    setSelectedStockProductIds((prev) => prev.filter((pId) => pId !== id));
    playNotificationSound('click');
  };

  const handleAddToDressing = () => {
    const newProductIds = [
      ...(selectedSession.selectedProductIds || []),
      ...selectedStockProductIds,
    ];
    onUpdateLiveSession(selectedSession.id, { selectedProductIds: newProductIds });
    playNotificationSound('confirm');
    setSelectedStockProductIds([]);
    onTabChange('products'); // Switch back to see dressed products
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-none" id="live-stock-split-panel">
      {/* Left Column: All stock items table with search and checkboxes */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-8">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 font-mono">
              Stock Global / Tous les articles
            </h3>
            <p className="text-[10px] text-slate-400 font-serif">
              Consultez et cochez les articles de votre catalogue pour les lier à ce direct.
            </p>
          </div>
          <SearchInput
            value={stockSearchQuery}
            onChange={setStockSearchQuery}
            placeholder="Rechercher nom, taille, couleur, code..."
            className="w-full sm:w-72"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-650 font-sans">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider font-bold">
                <th className="py-3 px-5 text-center w-12">Cocher</th>
                <th className="py-3 px-5">Code unique</th>
                <th className="py-3 px-5">Nom d'article / Description</th>
                <th className="py-3 px-5 text-center">Stock restant</th>
                <th className="py-3 px-5 text-right">Prix Catalogue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-405 text-slate-400 font-mono">
                    Données de stock introuvables ou filtre inactif.
                  </td>
                </tr>
              ) : (
                filteredStock.map((p) => {
                  const isAlreadyInDressing =
                    selectedSession.selectedProductIds?.includes(p.id) || false;
                  const isChecked = selectedStockProductIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                        isChecked ? 'bg-indigo-50/10' : ''
                      } ${isAlreadyInDressing ? 'opacity-80 bg-slate-50/30' : ''}`}
                      onClick={() => handleRowClick(p, isAlreadyInDressing)}
                    >
                      <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        {isAlreadyInDressing ? (
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                            ✓
                          </span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleRowClick(p, isAlreadyInDressing)}
                            className="h-4 w-4 border-slate-355 border-slate-300 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                          {p.jpCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-extrabold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.size} {p.color ? `• ${p.color}` : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            p.stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} restant{p.stock > 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-black text-indigo-600 font-sans">
                        {p.price.toLocaleString()} Ar
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Collection Panel */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm min-h-[400px] flex flex-col justify-between">
        <div>
          <div className="border-b pb-3 mb-4">
            <h4 className="font-extrabold text-slate-950 text-xs">Action Dressing</h4>
            <p className="text-[10px] text-slate-400">Valider l'ajout des articles cochés.</p>
          </div>

          {selectedStockProductIds.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <CheckCircle className="h-10 w-10 text-slate-300 mx-auto animate-pulse" strokeWidth={1} />
              <p className="text-[11px] font-serif leading-relaxed px-4">
                Aucun article sélectionné. Cochez les cases correspondantes à gauche pour commencer
                l'intégration.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-bold text-indigo-650 text-indigo-600 uppercase font-mono tracking-wider">
                {selectedStockProductIds.length} Article{selectedStockProductIds.length > 1 ? 's' : ''}{' '}
                Sélectionné{selectedStockProductIds.length > 1 ? 's' : ''}
              </p>
              <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-150 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                {selectedStockProductIds.map((id) => {
                  const prod = products.find((p) => p.id === id);
                  if (!prod) return null;
                  return (
                    <div key={prod.id} className="py-2 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-black mr-2">
                          {prod.jpCode}
                        </span>
                        <span className="font-extrabold text-slate-800">{prod.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelection(id)}
                        className="text-[10px] text-rose-600 hover:underline font-bold px-1 border-none bg-transparent cursor-pointer"
                      >
                        Retirer
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="pt-5 border-t">
          <button
            type="button"
            disabled={selectedStockProductIds.length === 0}
            onClick={handleAddToDressing}
            className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wide transition-all text-center flex items-center justify-center gap-2 cursor-pointer border-none shadow-md ${
              selectedStockProductIds.length === 0
                ? 'bg-slate-100 text-slate-405 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-650 bg-indigo-600 hover:bg-indigo-705 hover:bg-indigo-700 text-white shadow-indigo-100 hover:-translate-y-0.5'
            }`}
          >
            <Plus className="h-4 w-4" /> Ajouter au Dressing ({selectedStockProductIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
