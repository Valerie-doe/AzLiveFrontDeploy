import { Product, ProductVariant } from "../types";
import { mapImagesToApi, mapVariantToApi } from "../features/products/utils/productUtils";
import { getAuthHeaders, getJsonHeaders } from "./client";
import { getStoredVendeurId } from "../features/auth/services/authStorage";

const API_URL = import.meta.env.VITE_URL_BACKEND;

function buildProductPayload(product: Omit<Product, "id"> | Partial<Product>) {
  const variantes = (product.variants || []).map((v) => mapVariantToApi(v));
  const images = mapImagesToApi(product.images || []);

  return {
    nom: product.name,
    images,
    photo: product.image,
    vendeur_id: product.vendeur_id ?? getStoredVendeurId() ?? 1,
    variantes,
  };
}

function buildProductFormData(product: Omit<Product, "id"> | Partial<Product>, imageFiles: File[]) {
  const formData = new FormData();
  const payload = buildProductPayload(product);

  formData.append("nom", payload.nom || "");
  formData.append("vendeur_id", String(payload.vendeur_id));
  formData.append("variantes", JSON.stringify(payload.variantes));

  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}

export async function fetchProducts() {
  const res = await fetch(`${API_URL}produits/`, {
    method: "GET",
    headers: getJsonHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur chargement produits");
  }

  return res.json();
}

export async function createProduct(
  product: Omit<Product, "id">,
  imageFiles?: File[],
) {
  if (imageFiles?.length) {
    const res = await fetch(`${API_URL}produits/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: buildProductFormData(product, imageFiles),
    });

    if (!res.ok) {
      throw new Error("Erreur création produit");
    }

    return res.json();
  }

  const res = await fetch(`${API_URL}produits/`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(buildProductPayload(product)),
  });

  if (!res.ok) {
    throw new Error("Erreur création produit");
  }

  return res.json();
}

export async function updateProduct(
  id: string,
  product: Partial<Product>,
  imageFiles?: File[],
) {
  if (imageFiles?.length) {
    const res = await fetch(`${API_URL}produits/${id}/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: buildProductFormData(product, imageFiles),
    });

    if (!res.ok) {
      throw new Error("Erreur modification produit");
    }

    return res.json();
  }

  const res = await fetch(`${API_URL}produits/${id}/`, {
    method: "PATCH",
    headers: getJsonHeaders(),
    body: JSON.stringify(buildProductPayload(product)),
  });

  if (!res.ok) {
    throw new Error("Erreur modification produit");
  }

  return res.json();
}

export async function deleteProductApi(id: string) {
  const res = await fetch(`${API_URL}produits/${id}/`, {
    method: "DELETE",
    headers: getJsonHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur suppression produit");
  }

  return true;
}

export async function deleteProductImageApi(imageId: string) {
  const res = await fetch(`${API_URL}produits/images/${imageId}/`, {
    method: "DELETE",
    headers: getJsonHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur suppression image produit");
  }

  return true;
}

export async function createVariant(produitId: string, variant: Omit<ProductVariant, "id">) {
  const res = await fetch(`${API_URL}produits/variants/`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify({
      produit: Number(produitId),
      ...mapVariantToApi(variant),
    }),
  });

  if (!res.ok) {
    throw new Error("Erreur création variante");
  }

  return res.json();
}
