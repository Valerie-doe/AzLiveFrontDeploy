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

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    loadProducts();
  }, [enabled, loadProducts]);

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const created = await createProduct(product);
      const newProduct = mapProductFromApi(created);
      setProducts((prev) => [...prev, newProduct]);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const editProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const existing = products.find((p) => p.id === id);
      const payload = {
        ...existing,
        ...updates,
        variants: updates.variants ?? existing?.variants ?? [],
      };
      const updated = await updateProduct(id, payload);
      const mapped = mapProductFromApi(updated);

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? mapped : p))
      );
    } catch (e: any) {
      console.error(e.message);
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
