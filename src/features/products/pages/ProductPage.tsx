import React, { useState } from 'react';
import { Product } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { Plus, Package } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

// Sub-components
import ProductStats from '../components/ProductStats';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import ProductDetail from '../components/ProductDetail';

interface ProductPageProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductPage({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}: ProductPageProps) {
  // Editing state variables
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Active selected product for detail / sticker rendering
  const [activeProductId, setActiveProductId] = useState<string | null>(
    products[0]?.id || null
  );

  const handleOpenAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    playNotificationSound('click');
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setIsAdding(false);
    playNotificationSound('click');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    playNotificationSound('click');
  };

  const handleSave = (payload: Omit<Product, 'id'>) => {
    if (editingId) {
      onEditProduct(editingId, payload);
    } else {
      onAddProduct(payload);
    }
    setIsAdding(false);
    setEditingId(null);
    playNotificationSound('confirm');
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cela libérera son code JP.")) {
      onDeleteProduct(id);
      playNotificationSound('click');
      if (activeProductId === id) {
        setActiveProductId(products.find((p) => p.id !== id)?.id || null);
      }
    }
  };

  const handleSelectProduct = (id: string) => {
    setActiveProductId(id);
    setIsAdding(false);
    setEditingId(null);
  };

  const selectedProduct = products.find((p) => p.id === activeProductId) || products[0];
  const productToEdit = editingId ? products.find((p) => p.id === editingId) || null : null;

  return (
    <div className="space-y-6" id="product-management-panel">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Le Dressing & Codes JP</h2>
          <p className="text-sm text-slate-500 font-serif">
            Liez vos mots-clés d'enchères en direct (ex: JP1, JP2) à vos produits réels et gérez votre stock d'articles.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleOpenAdd}
            className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer border-none"
          >
            <Plus className="h-4 w-4" /> Créer Produit JP
          </button>
        )}
      </div>

      {/* QUICK STATS */}
      <ProductStats products={products} />

      {/* MAIN TWO-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: Search and Tabular Product list (Master) */}
        <ProductTable
          products={products}
          selectedProductId={selectedProduct?.id || null}
          onSelectProduct={handleSelectProduct}
          onOpenEdit={handleOpenEdit}
        />

        {/* RIGHT COMPONENT: Focused Product Details / Sticker generator OR Edit-Create Form */}
        <div className="lg:col-span-4 font-sans">
          <AnimatePresence mode="wait">
            {isAdding || editingId ? (
              <ProductForm
                products={products}
                productToEdit={productToEdit}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            ) : selectedProduct ? (
              <ProductDetail
                selectedProduct={selectedProduct}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ) : (
              /* EMPTY / FALLBACK PLACEHOLDER */
              <div className="bg-slate-50 border border-slate-150 border-dashed rounded-3xl p-8 text-center text-slate-400 space-y-2">
                <Package className="h-8 w-8 text-slate-300 mx-auto" strokeWidth={1} />
                <h4 className="font-extrabold text-slate-700">Aucun produit</h4>
                <p className="text-xs font-serif leading-relaxed">
                  Cliquez sur n'importe quel ligne du dressing à gauche pour faire apparaître sa fiche d'étiquetage thermique, ou cliquez sur "Créer Produit JP".
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
