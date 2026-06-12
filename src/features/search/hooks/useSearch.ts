import { useState } from 'react';
import { Order, Product } from '../../types';

export function useSearch(orders: Order[], _products: Product[]) {
  const [query, setQuery] = useState('');

  const cleanQuery = query.toLowerCase().trim();

  const searchResults = orders.filter((o) => {
    if (!cleanQuery) return false;
    return (
      o.customerName.toLowerCase().includes(cleanQuery) ||
      o.customerPhone.includes(cleanQuery) ||
      o.customerHandle.toLowerCase().includes(cleanQuery) ||
      o.productName.toLowerCase().includes(cleanQuery) ||
      o.jpCode.toLowerCase().includes(cleanQuery) ||
      o.id.toLowerCase().includes(cleanQuery)
    );
  });

  return { query, setQuery, cleanQuery, searchResults };
}
