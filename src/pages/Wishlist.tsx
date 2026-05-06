import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { formatPrice } from '../utils/format';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { items, removeItem, clear } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const currency = useUIStore((s) => s.currency);

  return (
    <div className="min-h-screen">
      <div className="bg-[#080808] border-b border-[#1F1F1F] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Mes favoris <span className="text-[#C9A84C]">({items.length})</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Les produits que vous avez sauvegardés</p>
          </div>
          {items.length > 0 && (
            <Button onClick={() => { clear(); toast.success('Favoris vidés'); }} variant="outline" size="sm">
              <Trash2 size={14} /> Tout supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-[#111] border border-[#1F1F1F] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-gray-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-3">Aucun favori</h2>
            <p className="text-gray-500 mb-8">Ajoutez des produits à vos favoris pour les retrouver ici</p>
            <Link to="/boutique" className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold inline-block text-black">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {items.map((product, i) => {
                const price = currency === 'HTG' ? product.price : product.priceUSD;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden group"
                    data-testid={`wishlist-item-${product.id}`}
                  >
                    <Link to={`/produit/${product.id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-[#141414] relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1 capitalize">{product.category}</p>
                      <Link to={`/produit/${product.id}`}>
                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-3 hover:text-[#C9A84C] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-[#C9A84C] font-bold">{formatPrice(price, currency)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { addToCart(product); toast.success('Ajouté au panier !'); }}
                            className="w-8 h-8 rounded-lg bg-[#C9A84C] text-black flex items-center justify-center hover:bg-[#E2C97E] transition-colors"
                            data-testid={`wishlist-add-cart-${product.id}`}
                          >
                            <ShoppingCart size={14} />
                          </button>
                          <button
                            onClick={() => { removeItem(product.id); toast.success('Retiré des favoris'); }}
                            className="w-8 h-8 rounded-lg border border-[#1F1F1F] text-gray-400 flex items-center justify-center hover:text-red-400 hover:border-red-500/30 transition-colors"
                            data-testid={`wishlist-remove-${product.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
