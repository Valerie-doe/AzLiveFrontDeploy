import React, { useState, useEffect } from 'react';
import { Product, ProductImage } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { Tag, X, ImagePlus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { uploadToCloudinary } from "../../../api/upload.cloudinary";
import { getNextJpCode, resolveProductImageUrl } from '../utils/productUtils';
interface ProductFormProps {
  products: Product[];
  productToEdit: Product | null;
  onCancel: () => void;
  onSave: (payload: Omit<Product, 'id'>) => void | Promise<void>;
}

export default function ProductForm({
  products,
  productToEdit,
  onCancel,
  onSave
}: ProductFormProps) {
  // Form input fields
  const [name, setName] = useState('');
  const [jpCode, setJpCode] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [useVariants, setUseVariants] = useState(false);
  const [formVariants, setFormVariants] = useState<{ id: string; size: string; color: string; stock: number; jpCode: string; prixUnitaire: number }[]>([]);
  const [newVarSize, setNewVarSize] = useState('M');
  const [newVarColor, setNewVarColor] = useState('');
  const [newVarStock, setNewVarStock] = useState<number>(10);
  const [newVarPrixUnitaire, setNewVarPrixUnitaire] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  // Initialise le formulaire uniquement à l'ouverture / changement de produit édité.
  // Ne pas dépendre de `products` : le polling stock (~10s) recrée le tableau et
  // réinitialisait le nom / les variantes en cours de saisie.
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setExistingImages(
        productToEdit.images?.length
          ? productToEdit.images
          : productToEdit.image
            ? [{ id: 'legacy', url: resolveProductImageUrl(productToEdit.image) || productToEdit.image }]
            : []
      );
      setImageFiles([]);
      setNewImagePreviews([]);
      if (productToEdit.variants && productToEdit.variants.length > 0) {
        // Toujours afficher la gestion par variantes à l'édition (y compris 1 seule),
        // pour préserver les IDs backend et ajuster le stock correctement.
        setUseVariants(true);
        setFormVariants(productToEdit.variants.map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          jpCode: v.jpCode,
          prixUnitaire: v.prixUnitaire,
        })));
        const first = productToEdit.variants[0];
        setJpCode(first.jpCode);
        setPrixUnitaire(first.prixUnitaire);
        setSize(first.size);
        setColor(first.color);
        setStock(first.stock);
      } else {
        setUseVariants(false);
        setFormVariants([]);
        setJpCode('');
        setPrixUnitaire(0);
        setSize('Freesize');
        setColor('');
        setStock(10);
      }
    } else {
      setName('');
      const nextCode = getNextJpCode(products);
      setJpCode(nextCode);
      setSize('Freesize');
      setColor('');
      setPrixUnitaire(0);
      setStock(10);
      setImageFiles([]);
      setExistingImages([]);
      setNewImagePreviews([]);
      setUseVariants(true);
      setFormVariants([]);
    }
    setNewVarSize('M');
    setNewVarColor('');
    setNewVarStock(10);
    setNewVarPrixUnitaire(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init volontairement borné à l'id édité
  }, [productToEdit?.id]);
 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    e.target.value = '';
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    playNotificationSound('click');
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    playNotificationSound('click');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!name.trim()) {
      alert('Veuillez remplir le nom du produit.');
      return;
    }

    let finalVariants: { id: string; size: string; color: string; stock: number; jpCode: string; prixUnitaire: number }[] = [];

    if (useVariants) {
      if (formVariants.length === 0) {
        alert('Veuillez ajouter au moins une variante ou désactiver la gestion fine par variantes.');
        return;
      }
      finalVariants = formVariants;
    } else {
      if (!jpCode.trim() || prixUnitaire <= 0) {
        alert('Veuillez remplir un code JP valide (e.g. JP1) et un prix unitaire positif.');
        return;
      }
      // Préserver l'id de variante existante pour PATCH (sinon le backend
      // recrée/supprime et casse sur la contrainte taille+couleur).
      finalVariants = [{
        id: productToEdit?.variants?.[0]?.id || `var-${Date.now()}`,
        size: size.trim() || 'Freesize',
        color: color.trim() || 'Unique',
        stock: Number(stock),
        jpCode: jpCode.trim().toUpperCase(),
        prixUnitaire: Number(prixUnitaire),
      }];
    }

    setSaving(true);
    try {
      const uploadedUrls = imageFiles.length
        ? await Promise.all(imageFiles.map((file) => uploadToCloudinary(file)))
        : [];

      const finalImages: ProductImage[] = [
        ...existingImages,
        ...uploadedUrls.map((url, index) => ({
          id: `temp-${Date.now()}-${index}`,
          url,
        })),
      ];

      const payload = {
        name: name.trim(),
        image: finalImages[0]?.url || undefined,
        images: finalImages,
        variants: finalVariants.map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          jpCode: v.jpCode.trim().toUpperCase(),
          prixUnitaire: Number(v.prixUnitaire),
        })),
      };

      await onSave(payload);
    } catch {
      // Erreur déjà affichée par ProductPage / hook.
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      key="product-form"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-6"
    >
      <div className="flex justify-between items-center pb-3 border-b border-rose-50/50">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Tag className="h-4.5 w-4.5 text-indigo-600" />
          {!productToEdit ? 'Créer un Produit JP' : 'Attributs du Produit'}
        </h3>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="form-jpCode" className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">Code Référence Live (ex: JP1)*</label>
            <input
              id="form-jpCode"
              type="text"
              required
              placeholder="e.g. JP1"
              value={jpCode}
              onChange={(e) => setJpCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono text-slate-800 text-sm font-extrabold uppercase bg-white border-slate-200"
            />
          </div>

          <div>
            <label htmlFor="form-name" className="text-slate-400 block mb-1 font-mono uppercase text-[9px] font-bold">Nom du produit*</label>
            <input
              id="form-name"
              type="text"
              required
              placeholder="e.g. Robe Plissée Soie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs bg-white border-slate-200"
            />
          </div>

          {/* Toggle Sizing & Color Variations */}
          <div className="bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 text-xs block">Variantes de Stock (Tailles & Couleurs)</span>
                <span className="text-[10px] text-slate-400 font-serif leading-none">Gérer les stocks fins par taille et couleur</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useVariants}
                  onChange={(e) => {
                    setUseVariants(e.target.checked);
                    playNotificationSound('click');
                  }}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {useVariants ? (
              <div className="space-y-3 pt-0.5 animate-fadeIn">
                {/* Add Variant Widget */}
                <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[8px] font-bold">Taille</label>
                      <input
                        type="text"
                        placeholder="Ex: M"
                        value={newVarSize}
                        onChange={(e) => setNewVarSize(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-slate-800 text-[11px] bg-slate-50/30"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[8px] font-bold">Couleur/Motif</label>
                      <input
                        type="text"
                        placeholder="Rouge..."
                        value={newVarColor}
                        onChange={(e) => setNewVarColor(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-slate-800 text-[11px] bg-slate-50/30"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[8px] font-bold">Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={newVarStock}
                        onChange={(e) => setNewVarStock(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none font-black text-slate-800 text-[11px] bg-slate-50/30"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5 font-mono uppercase text-[8px] font-bold">Prix unitaire (Ar)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 45000"
                        value={newVarPrixUnitaire || ''}
                        onChange={(e) => setNewVarPrixUnitaire(Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none font-black text-slate-800 text-[11px] bg-slate-50/30"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newVarSize.trim()) {
                        alert('Spécifiez la taille (ex: M, L, XL)');
                        return;
                      }
                      if (!newVarColor.trim()) {
                        alert('Spécifiez la couleur (ex: Noir, Rouge)');
                        return;
                      }
                      if (!jpCode.trim()) {
                        alert('Spécifiez un code JP pour cette variante.');
                        return;
                      }
                      if (newVarPrixUnitaire <= 0) {
                        alert('Spécifiez un prix unitaire positif pour cette variante.');
                        return;
                      }
                      const matchIndex = formVariants.findIndex(
                        v => v.size.trim().toLowerCase() === newVarSize.trim().toLowerCase() &&
                          v.color.trim().toLowerCase() === newVarColor.trim().toLowerCase()
                      );
                      if (matchIndex !== -1) {
                        alert('Cette combinaison de Taille & Couleur existe déjà !');
                        return;
                      }
                      if (formVariants.some(v => v.jpCode.toLowerCase() === jpCode.trim().toLowerCase())) {
                        alert('Ce code JP est déjà utilisé dans ce formulaire !');
                        return;
                      }
                      const customVariant = {
                        id: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        size: newVarSize.toUpperCase().trim(),
                        color: newVarColor.trim(),
                        stock: Number(newVarStock),
                        jpCode: jpCode.trim().toUpperCase(),
                        prixUnitaire: Number(newVarPrixUnitaire),
                      };
                      setFormVariants([...formVariants, customVariant]);
                      setNewVarColor('');
                      setNewVarPrixUnitaire(0);
                      setJpCode(getNextJpCode([...products, {
                        id: 'temp',
                        name,
                        variants: [...formVariants, customVariant],
                      }]));
                      playNotificationSound('confirm');
                    }}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    + Ajouter cette variante
                  </button>
                </div>

                {/* List of current variants with stock adjustments */}
                {formVariants.length > 0 ? (
                  <div className="border border-slate-100 rounded-xl overflow-hidden max-h-40 overflow-y-auto bg-white shadow-inner">
                    <table className="w-full text-[11px] text-slate-700">
                      <thead className="bg-slate-50 font-mono text-[8.5px] uppercase text-slate-400 font-bold border-b border-slate-50 select-none">
                        <tr>
                          <th className="py-1 px-2 text-left">Code JP</th>
                          <th className="py-1 px-2 text-left">Taille</th>
                          <th className="py-1 px-2 text-left">Couleur</th>
                          <th className="py-1 px-2 text-right">Prix unit.</th>
                          <th className="py-1 px-2 text-center w-24">Stock</th>
                          <th className="py-1 px-1.5 text-center w-6"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {formVariants.map((v, idx) => (
                          <tr key={v.id || idx} className="hover:bg-slate-50/30">
                            <td className="py-1.5 px-2 font-mono font-bold text-slate-800 text-[10.5px]">{v.jpCode}</td>
                            <td className="py-1.5 px-2 font-mono font-bold text-slate-800 text-[10.5px]">{v.size}</td>
                            <td className="py-1.5 px-2 font-medium text-slate-600 text-[10.5px]">{v.color}</td>
                            <td className="py-1.5 px-2 text-right font-black text-indigo-600 text-[10.5px]">{v.prixUnitaire.toLocaleString()} Ar</td>
                            <td className="py-1 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormVariants(formVariants.map(fv => fv.id === v.id ? { ...fv, stock: Math.max(0, fv.stock - 1) } : fv));
                                    playNotificationSound('click');
                                  }}
                                  className="h-5 w-5 bg-slate-100 rounded hover:bg-slate-200 text-slate-650 font-extrabold flex items-center justify-center cursor-pointer text-[10px]"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={0}
                                  value={v.stock}
                                  onChange={(e) => {
                                    const next = Math.max(0, Number(e.target.value) || 0);
                                    setFormVariants(formVariants.map((fv) =>
                                      fv.id === v.id ? { ...fv, stock: next } : fv,
                                    ));
                                  }}
                                  className="w-12 h-6 text-center font-black text-slate-900 text-xs border border-slate-200 rounded bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormVariants(formVariants.map(fv => fv.id === v.id ? { ...fv, stock: fv.stock + 1 } : fv));
                                    playNotificationSound('click');
                                  }}
                                  className="h-5 w-5 bg-slate-100 rounded hover:bg-slate-200 text-slate-650 font-extrabold flex items-center justify-center cursor-pointer text-[10px]"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-1 px-1 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setFormVariants(formVariants.filter(fv => fv.id !== v.id));
                                  playNotificationSound('click');
                                }}
                                className="p-1 hover:bg-rose-50 rounded text-rose-500 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-2 px-1 bg-white border border-slate-150/40 border-dashed rounded-xl">
                    <p className="text-[10px] text-slate-400 font-serif leading-tight">
                      Aucune variante de stock ajoutée.<br />Utilisez le formulaire pour enregistrer des Tailles et Couleurs.
                    </p>
                  </div>
                )}

                {formVariants.length > 0 && (
                  <div className="flex justify-between items-center text-[9px] font-mono text-indigo-900 bg-indigo-50/30 px-2.5 py-1.5 rounded-lg border border-dotted border-indigo-100 select-none">
                    <span>Séries : <strong>{Array.from(new Set(formVariants.map(v => v.size))).length} tailles</strong></span>
                    <span>Stock global : <strong>{formVariants.reduce((sum, v) => sum + v.stock, 0)} pièces</strong></span>
                  </div>
                )}
              </div>
            ) : (
              /* Traditional input fields */
              <div className="space-y-2.5 pt-0.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="form-prix-unitaire" className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">Prix unitaire (Ar)*</label>
                    <input
                      id="form-prix-unitaire"
                      type="number"
                      min="0"
                      required={!useVariants}
                      placeholder="e.g. 45000"
                      value={prixUnitaire || ''}
                      onChange={(e) => setPrixUnitaire(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-black text-slate-800 text-xs bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-stock" className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">Stock Initial*</label>
                    <input
                      id="form-stock"
                      type="number"
                      required={!useVariants}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-black text-slate-800 text-xs bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-size" className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">Taille Unique</label>
                    <input
                      id="form-size"
                      type="text"
                      placeholder="Unique, Freesize..."
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs bg-white border-slate-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-color" className="text-slate-400 block mb-0.5 font-mono uppercase text-[9px] font-bold">Couleur / Motif Unique</label>
                    <input
                      id="form-color"
                      type="text"
                      placeholder="Standard, Corail..."
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

         <div className="space-y-2.5">
          <label
            htmlFor="form-images"
            className="flex flex-col items-center justify-center gap-2 px-4 py-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 hover:bg-indigo-50/30 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            <ImagePlus className="h-5 w-5 text-indigo-600" />
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 text-center">
              Ajouter des images produit
            </span>
            <span className="text-[9px] text-slate-400 font-serif">
              Sélection multiple — JPG, PNG, WEBP
            </span>
          </label>
          <input
            id="form-images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="sr-only"
          />

          {(existingImages.length > 0 || newImagePreviews.length > 0) && (
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt="Image produit existante"
                    className="w-full h-20 object-cover rounded-lg border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={preview}
                    alt="Nouvelle image produit"
                    className="w-full h-20 object-cover rounded-lg border border-indigo-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
                </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border-none disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-black transition-all cursor-pointer text-center border-none disabled:opacity-70 disabled:cursor-wait inline-flex items-center justify-center gap-1.5"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Enregistrement…
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
