import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'éléments',
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems <= itemsPerPage) return null;

  return (
    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
      <span className="text-[11px] font-mono text-slate-500">
        Affichage {start} - {end} sur {totalItems} {itemLabel}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="h-3 w-3" /> Précédent
        </button>
        <span className="text-xs font-mono font-bold text-slate-700 px-3">
          Page {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="p-1 px-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
        >
          Suivant <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
