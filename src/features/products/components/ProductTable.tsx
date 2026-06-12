import React, { useState } from 'react';
import { Product } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { Search, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  onOpenEdit: (p: Product) => void;
}

export default function ProductTable({
  products,
  selectedProductId,
  onSelectProduct,
  onOpenEdit
}: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filter products based on query
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.jpCode.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const displayedProds = filteredProducts.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-8">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 font-mono">Dressing et codes Enchères</h3>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher code, nom, taille, couleur..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-650">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
              <th className="py-3 px-5">Produit / Description</th>
              <th className="py-3 px-5">Code JP</th>
              <th className="py-3 px-5">Taille / Couleur</th>
              <th className="py-3 px-5 text-center">Stock</th>
              <th className="py-3 px-5 text-right">Prix Enchère</th>
              <th className="py-3 px-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans text-xs">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                  Aucun produit ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              displayedProds.map((p) => {
                const isSelected = selectedProductId === p.id;
                return (
                  <tr 
                    key={p.id} 
                    className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-50/20' : ''
                    }`}
                    onClick={() => {
                      onSelectProduct(p.id);
                      playNotificationSound('click');
                    }}
                  >
                    <td className="py-3 px-5 flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 border border-slate-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {p.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                        {p.jpCode}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-500 font-mono">
                      {p.size} {p.color ? `• ${p.color}` : ''}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        p.stock === 0 
                          ? 'bg-rose-100 text-rose-800' 
                          : p.stock <= 3 
                          ? 'bg-amber-100 text-amber-800 animate-pulse' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} restant{p.stock > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right font-black text-indigo-600 font-sans">
                      {p.price.toLocaleString()} Ar
                    </td>
                    <td className="py-3 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          onOpenEdit(p);
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-extrabold mx-auto block cursor-pointer transition-colors"
                      >
                        Éditer
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {filteredProducts.length > ITEMS_PER_PAGE && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Affichage {((activePage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(activePage * ITEMS_PER_PAGE, filteredProducts.length)} sur {filteredProducts.length} produits
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={activePage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3 w-3" /> Précédent
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 px-3">
              Page {activePage} / {totalPages}
            </span>
            <button
              disabled={activePage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              Suivant <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
