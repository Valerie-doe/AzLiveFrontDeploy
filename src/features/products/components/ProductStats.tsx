import React from 'react';
import { Product } from '../../../types';
import { Package, AlertTriangle, Layers } from 'lucide-react';
import { getProductDisplay, getProductStock, getProductStockValue } from '../utils/productUtils';

interface ProductStatsProps {
  products: Product[];
}

export default function ProductStats({ products }: ProductStatsProps) {
  // Calculate statistics
  const totalProductsCount = products.length;
  const outOfStockCount = products.filter((p) => getProductStock(p) === 0).length;
  const totalStockValue = products.reduce((sum, p) => sum + getProductStockValue(p), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Références de dressing</span>
          <span className="text-2xl font-black text-slate-900">{totalProductsCount} articles</span>
        </div>
        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <Package className="h-5 w-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Rupture de Stock</span>
          <span className="text-2xl font-black text-rose-600">{outOfStockCount} épuisé{outOfStockCount > 1 ? 's' : ''}</span>
        </div>
        <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Valeur théorique de Stock</span>
          <span className="text-2xl font-black text-indigo-600">{totalStockValue.toLocaleString()} Ar</span>
        </div>
        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <Layers className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
