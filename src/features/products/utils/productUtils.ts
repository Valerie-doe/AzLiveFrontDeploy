import { Product, ProductImage, ProductVariant } from '../types';

const API_BASE = (import.meta.env.VITE_URL_BACKEND || '').replace(/\/api\/?$/, '');

export function resolveProductImageUrl(image?: string | null): string | undefined {
  if (!image) return undefined;
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  if (!API_BASE) return image;
  return `${API_BASE}${image.startsWith('/') ? image : `/${image}`}`;
}

export function mapProductImageFromApi(item: any): ProductImage {
  const rawUrl = item.image_url || item.image;
  return {
    id: item.id?.toString() ?? '',
    url: resolveProductImageUrl(rawUrl) || rawUrl || '',
    createdAt: item.created_at,
  };
}

export function mapVariantFromApi(item: any): ProductVariant {
  return {
    id: item.id?.toString() ?? '',
    size: item.taille,
    color: item.couleur,
    stock: item.stock,
    prixUnitaire: parseFloat(item.prix_unitaire),
    jpCode: item.code_jp,
  };
}

export function mapProductFromApi(item: any): Product {
  const variants = (item.variantes || []).map(mapVariantFromApi);
  const images = (item.images || []).map(mapProductImageFromApi);
  const rawImage = item.photo_url || item.photo;
  const fallbackImage = resolveProductImageUrl(rawImage);
  const primaryImage = images[0]?.url || fallbackImage;

  return {
    id: item.id.toString(),
    name: item.nom,
    image: primaryImage,
    images: images.length > 0
      ? images
      : primaryImage
        ? [{ id: 'legacy', url: primaryImage }]
        : [],
    vendeur_id: item.vendeur?.id,
    vendeur: item.vendeur
      ? {
          id: item.vendeur.id,
          nom: item.vendeur.nom,
          facebookPageName: item.vendeur.facebook_page_name || undefined,
        }
      : undefined,
    variants,
  };
}

export function getProductImageUrls(product: Product): string[] {
  if (product.images?.length) {
    return product.images
      .map((img) => resolveProductImageUrl(img.url) || img.url)
      .filter(Boolean);
  }
  if (product.image) {
    const resolved = resolveProductImageUrl(product.image);
    return resolved ? [resolved] : [];
  }
  return [];
}

export function mapImagesToApi(images: ProductImage[] = []) {
  return images.map((img) => {
    const numericId = Number(img.id);
    if (img.id && !Number.isNaN(numericId) && !img.id.startsWith('temp') && !img.id.startsWith('legacy')) {
      return { id: numericId, image: img.url };
    }
    return img.url;
  });
}

export function mapVariantToApi(variant: Partial<ProductVariant>) {
  return {
    ...(variant.id && !variant.id.startsWith('var-') ? { id: Number(variant.id) } : {}),
    taille: variant.size,
    couleur: variant.color,
    stock: variant.stock,
    prix_unitaire: variant.prixUnitaire,
    code_jp: variant.jpCode,
  };
}

export function getProductDisplay(product: Product) {
  const variants = product.variants || [];
  if (variants.length === 0) {
    return {
      jpCode: '-',
      size: '-',
      color: '-',
      prixUnitaire: 0,
      stock: 0,
    };
  }

  if (variants.length === 1) {
    const v = variants[0];
    return {
      jpCode: v.jpCode,
      size: v.size,
      color: v.color,
      prixUnitaire: v.prixUnitaire,
      stock: v.stock,
    };
  }

  return {
    jpCode: variants.map((v) => v.jpCode).join(', '),
    size: Array.from(new Set(variants.map((v) => v.size))).join(', '),
    color: Array.from(new Set(variants.map((v) => v.color))).join(', '),
    prixUnitaire: variants[0].prixUnitaire,
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
  };
}

export function getAllJpCodes(products: Product[]): string[] {
  return products.flatMap((p) => p.variants.map((v) => v.jpCode));
}

export function getNextJpCode(products: Product[]): string {
  const maxJP = getAllJpCodes(products).reduce((acc, code) => {
    const num = parseInt(code.replace(/[^0-9]/g, ''), 10);
    return !isNaN(num) && num > acc ? num : acc;
  }, 0);
  return `JP${maxJP + 1}`;
}

export function findVariantByJpCode(products: Product[], jpCode: string): ProductVariant | undefined {
  for (const product of products) {
    const match = product.variants.find((v) => v.jpCode.toLowerCase() === jpCode.toLowerCase());
    if (match) return match;
  }
  return undefined;
}

export function findProductByJpCode(products: Product[], jpCode: string): Product | undefined {
  return products.find((p) => p.variants.some((v) => v.jpCode.toLowerCase() === jpCode.toLowerCase()));
}

export function getProductStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function getProductStockValue(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.prixUnitaire * v.stock, 0);
}

export function formatPrixUnitaire(value: number): string {
  return `${value.toLocaleString()} Ar`;
}
