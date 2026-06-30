import React from 'react';
import { playNotificationSound } from '../../../sound';

interface LiveSubTabsProps {
  activeTab: 'orders' | 'products' | 'stock';
  ordersCount: number;
  productsCount: number;
  allProductsCount: number;
  onTabChange: (tab: 'orders' | 'products' | 'stock') => void;
  onStockReset?: () => void;
}

export default function LiveSubTabs({
  activeTab,
  ordersCount,
  productsCount,
  allProductsCount,
  onTabChange,
  onStockReset,
}: LiveSubTabsProps) {
  const tabClass = (tab: typeof activeTab) =>
    `px-6 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
      activeTab === tab
        ? 'border-accent text-accent font-extrabold'
        : 'border-transparent text-slate-500 hover:text-slate-850'
    }`;

  return (
    <div className="flex border-b border-slate-200" id="live-session-management-tabs">
      <button
        onClick={() => {
          onStockReset?.();
          onTabChange('stock');
          playNotificationSound('click');
        }}
        className={tabClass('stock')}
      >
        Stock / Tous les articles ({allProductsCount})
      </button>
      <button
        onClick={() => { onTabChange('products'); playNotificationSound('click'); }}
        className={tabClass('products')}
      >
        Articles / Dressing du Live ({productsCount})
      </button>
      <button
        onClick={() => { onTabChange('orders'); playNotificationSound('click'); }}
        className={tabClass('orders')}
      >
        Commandes du Direct ({ordersCount})
      </button>
    </div>
  );
}
