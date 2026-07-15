import { useCallback, useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProductApi,
} from "../../../api/products.api";
import { Product } from "../../../types";
import { mapProductFromApi } from "../utils/productUtils";
import { getStoredVendeurId } from "../../auth/services/authStorage";

/**
 * @param enabled  Charge (et recharge) les produits uniquement quand l'utilisateur est
 *                 authentifié. Le passage `false → true` après connexion déclenche le fetch
 *                 pour un affichage immédiat sans actualisation manuelle.
 */
export function useProducts(enabled = true) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = Boolean(opts?.silent);
    try {
      if (!silent) setLoading(true);
      setError(null);

      const response = await fetchProducts();
      const vendeurId = getStoredVendeurId();
      const data = (response.results as unknown[])
        .map(mapProductFromApi)
        .filter((p) => vendeurId == null || p.vendeur_id === vendeurId);

      setProducts(data);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    loadProducts();
    // Pas de polling : charge au montage / après mutative (add/update/delete).
  }, [enabled, loadProducts]);

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const created = await createProduct(product);
      const newProduct = mapProductFromApi(created);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (e: any) {
      const message = e?.message || "Erreur création produit";
      setError(message);
      throw e instanceof Error ? e : new Error(message);
    }
  };

  const editProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const existing = products.find((p) => p.id === id);
      const payload: Partial<Product> = {
        name: updates.name ?? existing?.name,
        image: updates.image ?? existing?.image,
        images: updates.images ?? existing?.images ?? [],
        vendeur_id: updates.vendeur_id ?? existing?.vendeur_id,
        variants: updates.variants ?? existing?.variants ?? [],
      };
      const updated = await updateProduct(id, payload);
      const mapped = mapProductFromApi(updated);

      setProducts((prev) => prev.map((p) => (p.id === id ? mapped : p)));
      return mapped;
    } catch (e: any) {
      const message = e?.message || "Erreur modification produit";
      setError(message);
      console.error(message);
      throw e instanceof Error ? e : new Error(message);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    editProduct,
    deleteProduct,
    reload: loadProducts,
  };
}
