import React from 'react';
import { Search, AlertCircle, Compass, Loader2 } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import SearchResultCard from '../components/SearchResultCard';

export default function SearchPage() {
  const { query, setQuery, cleanQuery, searchResults, loading, error } = useSearch();

  return (
    <div className="space-y-6" id="azlive-global-search">

      {/* HEADER TITLE */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-secondary">Moteur de Recherche Globale</h2>
        <p className="text-sm text-slate-500 font-serif">
          Saisissez instantanément un nom, un téléphone, un produit ou un numéro de colis pour suivre sa position
          physique à Madagascar (Point 14).
        </p>
      </div>

      <div className="bg-primary p-6 rounded-3xl border border-secondary shadow-sm space-y-4">
        {/* BIG SEARCH BAR */}
        <div className="relative max-w-2xl">
          <span className="absolute left-4 top-3.5 text-secondary/70">
            <Search className="h-5 w-5 text-secondary" />
          </span>
          <input
            type="text"
            placeholder="Saisissez par exemple: Mialy, 034, Sac Raphia, ord1..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-secondary rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-accent focus:border-secondary text-sm"
            id="global-search-input"
          />
        </div>

        {/* STATS COUNT */}
        {cleanQuery && !loading && !error && (
            <div className="text-xs text-secondary font-mono">
            {searchResults.length} colis correspondant{searchResults.length > 1 ? 's' : ''} trouvé
            {searchResults.length > 1 ? 's' : ''} pour:{' '}
            <strong className="text-accent">"{query}"</strong>
          </div>
        )}
      </div>

      {/* SEARCH RESULTS FEED */}
      {error ? (
        <div className="bg-white p-8 rounded-3xl border text-center text-slate-500">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
          <p className="font-bold text-slate-800">La recherche a échoué</p>
          <p className="text-xs max-w-sm mx-auto mt-1">{error}</p>
        </div>
      ) : loading ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed p-12 rounded-3xl text-center text-slate-400">
          <Loader2 className="h-10 w-10 mx-auto text-indigo-400 mb-2 animate-spin" />
          <p className="text-xs max-w-sm mx-auto mt-1 font-mono">Recherche en cours…</p>
        </div>
      ) : cleanQuery === '' ? (
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
