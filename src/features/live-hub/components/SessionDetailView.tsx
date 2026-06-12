import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Copy, ShoppingBag, DollarSign, AlertTriangle, Search } from 'lucide-react';
import { LiveSession } from '../../../types';
import SessionOrdersTable from './SessionOrdersTable';

interface SessionDetailViewProps {
  session: LiveSession;
  onBack: () => void;
  copiedId: string | null;
  onCopySummary: (session: LiveSession) => void;
}

export default function SessionDetailView({
  session,
  onBack,
  copiedId,
  onCopySummary
}: SessionDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sessionDetailsPage, setSessionDetailsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const sessionOrdersFiltered = session.orders.filter(ord => {
    const matchSearch = 
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.jpCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeSessionRevenue = session.orders
    .filter(o => o.status !== 'annulé')
    .reduce((sum, current) => sum + current.price, 0);

  return (
    <div className="space-y-6" id="session-detail-view">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border text-slate-650 cursor-pointer"
            title="Retour à l'historique"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold uppercase">
                Session Archivée #{session.id.replace('live-', '')}
              </span>
              <span className="text-xs text-slate-400">• {session.date}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">{session.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopySummary(session)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedId === session.id ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span>Copier le récapitulatif</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mini stats cards for this session */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Détail des JP vendus</span>
            <span className="text-xl font-black text-slate-900">{session.orders.length} articles</span>
          </div>
          <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white p-4.5 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">CA Livré & Sécurisé</span>
            <span className="text-xl font-black text-indigo-600">
              {activeSessionRevenue.toLocaleString()} Ar
            </span>
          </div>
          <div className="h-9 w-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white p-4.5 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Taux de Livraison</span>
            <span className="text-xl font-black text-emerald-600">
              {session.orders.length > 0 
                ? Math.round((session.orders.filter(o => o.status === 'livré').length / session.orders.length) * 100) 
                : 0}%
            </span>
          </div>
          <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white p-4.5 p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Retours / Annulés</span>
            <span className="text-xl font-black text-rose-600">
              {session.orders.filter(o => o.status === 'annulé').length} fiches
            </span>
          </div>
          <div className="h-9 w-9 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm">Liste des ventes de ce Live</h3>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher acheteur, JP..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSessionDetailsPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setSessionDetailsPage(1);
              }}
              className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="JP capturé">JP capturés</option>
              <option value="confirmé">Confirmés</option>
              <option value="en livraison">En livraison</option>
              <option value="livré">Livré</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        <SessionOrdersTable
          orders={sessionOrdersFiltered}
          currentPage={sessionDetailsPage}
          onPageChange={setSessionDetailsPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}
