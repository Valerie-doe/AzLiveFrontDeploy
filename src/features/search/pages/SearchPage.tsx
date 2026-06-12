import React from 'react';
import { Order, Product } from '../../types';
import { Search, AlertCircle, Compass } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import SearchResultCard from '../components/SearchResultCard';

interface SearchPageProps {
  orders: Order[];
  products: Product[];
}

export default function SearchPage({ orders, products }: SearchPageProps) {
  const { query, setQuery, cleanQuery, searchResults } = useSearch(orders, products);

  return (
    <div className="space-y-6" id="azlive-global-search">

      {/* HEADER TITLE */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Moteur de Recherche Globale</h2>
        <p className="text-sm text-slate-500 font-serif">
          Saisissez instantanément un nom, un téléphone, un produit ou un numéro de colis pour suivre sa position
          physique à Madagascar (Point 14).
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        {/* BIG SEARCH BAR */}
        <div className="relative max-w-2xl">
          <span className="absolute left-4 top-3.5 text-slate-400">
            <Search className="h-5 w-5 text-indigo-650" />
          </span>
          <input
            type="text"
            placeholder="Saisissez par exemple: Mialy, 034, Sac Raphia, ord1..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            id="global-search-input"
          />
        </div>

        {/* STATS COUNT */}
        {cleanQuery && (
          <div className="text-xs text-slate-500 font-mono">
            {searchResults.length} colis correspondant{searchResults.length > 1 ? 's' : ''} trouvé
            {searchResults.length > 1 ? 's' : ''} pour:{' '}
            <strong className="text-indigo-600">"{query}"</strong>
          </div>
        )}
      </div>

      {/* SEARCH RESULTS FEED */}
      {cleanQuery === '' ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed p-12 rounded-3xl text-center text-slate-400">
          <Compass
            className="h-14 w-14 mx-auto text-slate-300 stroke-1 mb-2 animate-spin"
            style={{ animationDuration: '12s' }}
          />
          <h4 className="font-extrabold text-slate-700">Moteur de Recherche Prêt</h4>
          <p className="text-xs max-w-sm mx-auto mt-1">
            Recherchez des clients comme "Mialy" ou "Sitraka", ou tapez un produit comme "Robe" pour cartographier le
            camion ou la moto de livraison AZExpress.
          </p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border text-center text-slate-500">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">Aucun enregistrement ne correspond à "{query}"</p>
          <p className="text-xs max-w-sm mx-auto mt-1">
            Vérifiez l'orthographe du nom ou du numéro de téléphone malgache (ex: "034" ou "032") pour relancer le
            moteur.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searchResults.map((ord) => (
            <SearchResultCard key={ord.id} order={ord} />
          ))}
        </div>
      )}
    </div>
  );
}
