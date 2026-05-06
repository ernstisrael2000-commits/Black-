import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, ExternalLink, Star, Truck, RotateCcw,
  ShieldCheck, Minus, Plus, ChevronRight, Share2, AlertTriangle
} from 'lucide-react';
import { useProduct, useSimilarProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { getProductReviews, addReview, hasUserReviewed } from '../firebase/reviews';
import { Review } from '../types';
import { formatPrice, formatDate } from '../utils/format';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const { data: similar } = useSimilarProducts(product?.category || '', id || '');
  const { addItem } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const currency = useUIStore((s) => s.currency);
  const { firebaseUser, user } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    if (id) {
      getProductReviews(id).then(setReviews).catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    if (id && firebaseUser) {
      hasUserReviewed(id, firebaseUser.uid).then(setAlreadyReviewed);
    }
  }, [id, firebaseUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square skeleton rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 skeleton rounded-xl w-3/4" />
            <div className="h-6 skeleton rounded-xl w-1/2" />
            <div className="h-10 skeleton rounded-xl w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-gray-500 mb-4">Produit introuvable</p>
        <Link to="/boutique" className="text-[#C9A84C] hover:underline">Retour à la boutique</Link>
      </div>
    );
  }

  const price = currency === 'HTG' ? product.price : product.priceUSD;
  const originalPrice = product.originalPrice
    ? (currency === 'HTG' ? product.originalPrice : Math.round(product.originalPrice / 132))
    : null;

  const handleAddToCart = () => {
    if (product.isAffiliate && product.affiliateLink) {
      window.open(product.affiliateLink, '_blank');
      return;
    }
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} ajouté au panier !`);
  };

  const handleSubmitReview = async () => {
    if (!firebaseUser || !user) {
      toast.error('Connectez-vous pour laisser un avis');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Veuillez écrire un commentaire');
      return;
    }
    setSubmittingReview(true);
    try {
      await addReview({
        productId: id!,
        userId: firebaseUser.uid,
        userName: firebaseUser.displayName || 'Utilisateur',
        rating: userRating,
        comment: reviewComment,
      });
      const updated = await getProductReviews(id!);
      setReviews(updated);
      setShowReviewForm(false);
      setReviewComment('');
      setAlreadyReviewed(true);
      toast.success('Avis publié avec succès !');
    } catch (err) {
      toast.error('Erreur lors de la publication');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[#1F1F1F] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link to="/boutique" className="hover:text-white transition-colors">Boutique</Link>
          <ChevronRight size={14} />
          <span className="text-gray-400 truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              className="relative aspect-square rounded-3xl overflow-hidden bg-[#111] border border-[#1F1F1F] mb-4"
              data-testid="img-product-main"
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && product.discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="red">-{product.discount}%</Badge>
                </div>
              )}
              {product.isAffiliate && (
                <div className="absolute top-4 right-4">
                  <Badge variant="affiliate">
                    <ExternalLink size={10} /> Produit partenaire
                  </Badge>
                </div>
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-[#C9A84C]' : 'border-[#1F1F1F]'
                    }`}
                  >
                    <img src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-2">
              <span className="text-sm text-gray-500 capitalize">{product.category}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} showValue count={product.reviewCount} />
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-sm text-[#C9A84C] hover:underline"
              >
                Laisser un avis
              </button>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-[#C9A84C]">
                {formatPrice(price, currency)}
              </span>
              {originalPrice && (
                <span className="text-lg text-gray-500 line-through mb-0.5">
                  {formatPrice(originalPrice, currency)}
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="text-sm font-semibold text-red-400 mb-1">
                  Économisez {product.discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm text-green-400">
                    {product.stock <= 5 ? `Plus que ${product.stock} en stock !` : 'En stock'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm text-red-400">Rupture de stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Quantity + Add to cart */}
            {!product.isAffiliate && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-[#1F1F1F] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    data-testid="button-quantity-minus"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-semibold text-white" data-testid="text-quantity">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    data-testid="button-quantity-plus"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
                fullWidth
                data-testid="button-add-to-cart"
              >
                {product.isAffiliate ? (
                  <><ExternalLink size={18} /> Voir sur le site partenaire</>
                ) : (
                  <><ShoppingCart size={18} /> Ajouter au panier</>
                )}
              </Button>
              <button
                onClick={() => { toggle(product); toast.success(isInWishlist(product.id) ? 'Retiré des favoris' : 'Ajouté aux favoris'); }}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-[#1F1F1F] text-gray-400 hover:border-red-500/40 hover:text-red-400'
                }`}
                data-testid="button-wishlist"
              >
                <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-[#1F1F1F]">
              {[
                { icon: <Truck size={16} />, text: 'Livraison rapide' },
                { icon: <RotateCcw size={16} />, text: 'Retour 30 jours' },
                { icon: <ShieldCheck size={16} />, text: 'Garanti authentique' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-[#C9A84C]">{item.icon}</span>
                  <span className="text-xs text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[#1A1A1A] rounded-full text-xs text-gray-500">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Avis clients ({reviews.length})
            </h2>
            {firebaseUser && !alreadyReviewed && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)} variant="outline" size="sm">
                <Star size={14} /> Écrire un avis
              </Button>
            )}
          </div>

          {/* Review form */}
          {showReviewForm && firebaseUser && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 mb-6"
            >
              <h3 className="font-semibold text-white mb-4">Votre avis</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Note :</p>
                <StarRating
                  rating={userRating}
                  interactive
                  size={24}
                  onRate={setUserRating}
                />
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Décrivez votre expérience avec ce produit..."
                rows={4}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm resize-none mb-4"
                data-testid="input-review-comment"
              />
              <div className="flex gap-3">
                <Button onClick={handleSubmitReview} loading={submittingReview} size="sm">
                  Publier l'avis
                </Button>
                <Button onClick={() => setShowReviewForm(false)} variant="outline" size="sm">
                  Annuler
                </Button>
              </div>
            </motion.div>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              Aucun avis pour l'instant. Soyez le premier à évaluer ce produit !
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white text-sm">{review.userName}</p>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <span className="text-xs text-gray-600">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar products */}
        {similar && similar.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-white mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {similar.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
