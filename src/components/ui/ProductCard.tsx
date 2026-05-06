import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ExternalLink, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUIStore } from '../../store/uiStore';
import { formatPrice } from '../../utils/format';
import StarRating from './StarRating';
import Badge from './Badge';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();
  const currency = useUIStore((s) => s.currency);
  const inWishlist = isInWishlist(product.id);

  const price = currency === 'HTG' ? product.price : product.priceUSD;
  const originalPrice = product.originalPrice
    ? (currency === 'HTG' ? product.originalPrice : Math.round(product.originalPrice / 132))
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.isAffiliate && product.affiliateLink) {
      window.open(product.affiliateLink, '_blank');
      return;
    }
    addItem(product);
    toast.success('Ajouté au panier !');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
    toast.success(inWishlist ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
      data-testid={`card-product-${product.id}`}
    >
      <Link to={`/produit/${product.id}`} className="block">
        <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden card-hover">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[#141414]">
            {!imgError ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <ShoppingCart size={48} />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.discount && product.discount > 0 && (
                <Badge variant="red" size="sm">-{product.discount}%</Badge>
              )}
              {product.isAffiliate && (
                <Badge variant="affiliate" size="sm">
                  <ExternalLink size={9} /> Partenaire
                </Badge>
              )}
              {product.stock <= 3 && product.stock > 0 && (
                <Badge variant="gold" size="sm">Derniers</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="gray" size="sm">Épuisé</Badge>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleWishlist}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors ${
                  inWishlist
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-black/60 border-white/10 text-white hover:bg-red-500 hover:border-red-500'
                }`}
                data-testid={`wishlist-${product.id}`}
              >
                <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Quick view hover overlay */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="bg-black/80 backdrop-blur-sm p-3 flex items-center justify-center gap-1.5 text-xs font-medium text-white">
                <Eye size={13} /> Voir le produit
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-1 capitalize">{product.category}</p>
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 leading-tight">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-3">
              <StarRating rating={product.rating} size={12} />
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[#C9A84C] font-bold text-base">
                  {formatPrice(price, currency)}
                </span>
                {originalPrice && (
                  <span className="text-gray-500 text-xs line-through ml-2">
                    {formatPrice(originalPrice, currency)}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-9 h-9 rounded-xl bg-[#C9A84C] hover:bg-[#E2C97E] text-black flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid={`add-to-cart-${product.id}`}
              >
                {product.isAffiliate ? <ExternalLink size={16} /> : <ShoppingCart size={16} />}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
