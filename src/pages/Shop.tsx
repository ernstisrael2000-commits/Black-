import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { getProducts } from '../firebase/products';
import { Product, FilterState } from '../types';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

const CATEGORIES = [
  { label: 'Tout', value: 'all' },
  { label: 'Électronique', value: 'electronique' },
  { label: 'Mode', value: 'mode' },
  { label: 'Beauté', value: 'beaute' },
  { label: 'Informatique', value: 'informatique' },
  { label: 'Maison', value: 'maison' },
  { label: 'Sport', value: 'sport' },
];

const SORTS = [
  { label: 'Nouveautés', value: 'newest' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
  { label: 'Popularité', value: 'popular' },
  { label: 'Mieux notés', value: 'rating' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || 'all',
    minPrice: 0,
    maxPrice: 500000,
    sort: (searchParams.get('sort') as any) || 'newest',
    search: searchParams.get('search') || '',
  });

  const loadProducts = useCallback(async (reset = true) => {
    setLoading(true);
    try {
      const result = await getProducts(
        {
          ...filters,
          category: filters.category === 'all' ? undefined : filters.category,
          search: filters.search || undefined,
        },
        reset ? undefined : lastDoc
      );
      setProducts(reset ? result.products : (prev) => [...prev, ...result.products]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts(true);
  }, [filters]);

  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search') || '';
    setFilters((f) => ({ ...f, category, sort: sort as any, search }));
  }, [searchParams]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#080808] border-b border-[#1F1F1F] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold text-white mb-1">Boutique</h1>
          <p className="text-gray-500 text-sm">
            {filters.search ? `Résultats pour "${filters.search}"` : 'Découvrez nos produits premium'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateFilter('category', cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filters.category === cat.value
                  ? 'bg-[#C9A84C] text-black'
                  : 'bg-[#111] border border-[#1F1F1F] text-gray-400 hover:text-white hover:border-[#C9A84C]/30'
              }`}
              data-testid={`filter-category-${cat.value}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111] border border-[#1F1F1F] text-sm text-gray-400 hover:text-white hover:border-[#C9A84C]/30 transition-colors"
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal size={16} />
              Filtres
            </button>
            <span className="text-sm text-gray-600">
              {products.length} produit{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">Trier :</span>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value as any)}
              className="input-dark px-3 py-2 rounded-xl text-sm"
              data-testid="select-sort"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Filtres avancés</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Prix minimum (HTG)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                      className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                      data-testid="input-min-price"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Prix maximum (HTG)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                      className="input-dark w-full px-3 py-2.5 rounded-xl text-sm"
                      data-testid="input-max-price"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={() => {
                      setFilters({ category: 'all', minPrice: 0, maxPrice: 500000, sort: 'newest', search: '' });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters */}
        {(filters.search || filters.category !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full text-xs text-[#C9A84C]">
                Recherche: {filters.search}
                <button onClick={() => updateFilter('search', '')}><X size={12} /></button>
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-full text-xs text-[#C9A84C]">
                {CATEGORIES.find((c) => c.value === filters.category)?.label}
                <button onClick={() => updateFilter('category', 'all')}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Products grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-4 bg-[#111] space-y-2">
                  <div className="h-4 skeleton rounded-lg" />
                  <div className="h-3 skeleton rounded-lg w-2/3" />
                  <div className="h-5 skeleton rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 mb-6">Essayez d'autres filtres ou catégories</p>
            <Button onClick={() => setFilters({ category: 'all', minPrice: 0, maxPrice: 500000, sort: 'newest', search: '' })}>
              Voir tous les produits
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-10">
                <Button
                  onClick={() => loadProducts(false)}
                  variant="outline"
                  loading={loading}
                  size="lg"
                  data-testid="button-load-more"
                >
                  Charger plus de produits
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
