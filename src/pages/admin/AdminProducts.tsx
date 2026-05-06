import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Search, X, Image } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../firebase/products';
import { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const EMPTY_PRODUCT = {
  name: '', description: '', price: 0, priceUSD: 0, originalPrice: undefined,
  images: [''], category: 'electronique', stock: 0, rating: 0, reviewCount: 0,
  isAffiliate: false, affiliateLink: '', isActive: true, tags: [], featured: false, discount: 0,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const result = await getProducts({ sort: 'newest' }, undefined, 50);
    setProducts(result.products);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditingProduct({ ...EMPTY_PRODUCT }); setShowModal(true); };
  const openEdit = (p: Product) => { setEditingProduct({ ...p }); setShowModal(true); };

  const handleSave = async () => {
    if (!editingProduct?.name || !editingProduct.price) {
      toast.error('Nom et prix requis');
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...editingProduct,
        tags: editingProduct.tags || [],
        images: editingProduct.images?.filter(Boolean) || [''],
      };
      if (editingProduct.id) {
        await updateProduct(editingProduct.id, data);
        toast.success('Produit mis à jour !');
      } else {
        await createProduct(data as any);
        toast.success('Produit créé !');
      }
      setShowModal(false);
      await load();
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await deleteProduct(id);
    toast.success('Produit supprimé');
    await load();
  };

  const handleToggle = async (product: Product) => {
    await updateProduct(product.id, { isActive: !product.isActive });
    toast.success(product.isActive ? 'Produit désactivé' : 'Produit activé');
    await load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Produits</h2>
          <p className="text-gray-500 text-sm">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate} size="sm" data-testid="button-create-product">
          <Plus size={16} /> Nouveau produit
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
          data-testid="input-search-products"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun produit trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1A1A1A] transition-colors" data-testid={`product-row-${product.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#141414] shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <Image size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm line-clamp-1">{product.name}</p>
                          {product.isAffiliate && <span className="text-xs text-blue-400">Affilié</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 capitalize">{product.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#C9A84C]">{formatPrice(product.price, 'HTG')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-400' : product.stock <= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(product)} className="text-gray-500 hover:text-[#C9A84C] transition-colors">
                        {product.isActive
                          ? <ToggleRight size={24} className="text-green-400" />
                          : <ToggleLeft size={24} className="text-gray-600" />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="text-gray-500 hover:text-[#C9A84C] transition-colors"
                          data-testid={`edit-product-${product.id}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                          data-testid={`delete-product-${product.id}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-[#1F1F1F] rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white text-lg">
                  {editingProduct.id ? 'Modifier le produit' : 'Nouveau produit'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nom du produit"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  data-testid="input-product-name"
                />
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Description</label>
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                    className="input-dark w-full rounded-xl px-4 py-3 text-sm resize-none"
                    data-testid="textarea-product-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Prix (HTG)"
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    data-testid="input-product-price"
                  />
                  <Input
                    label="Prix (USD)"
                    type="number"
                    value={editingProduct.priceUSD || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceUSD: Number(e.target.value) })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Stock"
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    data-testid="input-product-stock"
                  />
                  <Input
                    label="Réduction (%)"
                    type="number"
                    value={editingProduct.discount || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Catégorie</label>
                  <select
                    value={editingProduct.category || 'electronique'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                    data-testid="select-product-category"
                  >
                    {['electronique', 'mode', 'beaute', 'informatique', 'maison', 'sport'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="URL image principale"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value, ...(editingProduct.images?.slice(1) || [])] })}
                  placeholder="https://..."
                  data-testid="input-product-image"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isAffiliate || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isAffiliate: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-sm text-gray-300">Produit affilié</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-sm text-gray-300">Vedette</span>
                  </label>
                </div>
                {editingProduct.isAffiliate && (
                  <Input
                    label="Lien affilié"
                    value={editingProduct.affiliateLink || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, affiliateLink: e.target.value })}
                    placeholder="https://amzn.to/..."
                  />
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} loading={saving} fullWidth data-testid="button-save-product">
                  {editingProduct.id ? 'Sauvegarder' : 'Créer le produit'}
                </Button>
                <Button onClick={() => setShowModal(false)} variant="outline" fullWidth>
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
