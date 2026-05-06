import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { validatePromoCode } from '../firebase/promos';
import { formatPrice } from '../utils/format';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getTotal, applyPromo, removePromo, promoCode, promoDiscount } = useCartStore();
  const currency = useUIStore((s) => s.currency);
  const { firebaseUser } = useAuthStore();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee(deliveryType);
  const total = getTotal(deliveryType);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const result = await validatePromoCode(promoInput, subtotal);
      if (result.valid) {
        applyPromo(promoInput, result.discount);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Erreur lors de la validation');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!firebaseUser) {
      toast.error('Connectez-vous pour commander');
      navigate('/connexion');
      return;
    }
    navigate('/paiement');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-[#111] border border-[#1F1F1F] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-gray-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Votre panier est vide</h2>
          <p className="text-gray-500 mb-8">Ajoutez des produits pour commencer vos achats</p>
          <Link to="/boutique" className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2 text-black">
            Découvrir la boutique <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-[#080808] border-b border-[#1F1F1F] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold text-white">
            Mon panier <span className="text-[#C9A84C]">({items.length})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const price = currency === 'HTG' ? item.product.price : item.product.priceUSD;
                return (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 flex gap-4"
                    data-testid={`cart-item-${item.product.id}`}
                  >
                    <Link to={`/produit/${item.product.id}`} className="shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#141414]">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5 capitalize">{item.product.category}</p>
                          <Link
                            to={`/produit/${item.product.id}`}
                            className="font-semibold text-white text-sm hover:text-[#C9A84C] transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => { removeItem(item.product.id); toast.success('Article retiré du panier'); }}
                          className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
                          data-testid={`remove-cart-item-${item.product.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#1F1F1F] rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="font-bold text-[#C9A84C]">
                          {formatPrice(price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Promo code */}
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Tag size={16} className="text-[#C9A84C]" /> Code promo
              </h3>
              {promoCode ? (
                <div className="flex items-center justify-between bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl px-4 py-2.5">
                  <span className="text-[#C9A84C] font-semibold text-sm">{promoCode}</span>
                  <button onClick={removePromo} className="text-gray-500 hover:text-red-400 transition-colors text-xs">
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Entrez votre code"
                    className="input-dark flex-1 px-3 py-2.5 rounded-xl text-sm"
                    data-testid="input-promo-code"
                  />
                  <Button onClick={handleApplyPromo} loading={promoLoading} size="sm">
                    OK
                  </Button>
                </div>
              )}
            </div>

            {/* Delivery type */}
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3">Mode de livraison</h3>
              <div className="space-y-2">
                {[
                  { type: 'standard' as const, label: 'Standard (3-5 jours)', price: getDeliveryFee('standard') },
                  { type: 'express' as const, label: 'Express (24h)', price: getDeliveryFee('express') },
                ].map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => setDeliveryType(opt.type)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors ${
                      deliveryType === opt.type
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white'
                        : 'border-[#1F1F1F] text-gray-400 hover:border-[#C9A84C]/30'
                    }`}
                    data-testid={`delivery-${opt.type}`}
                  >
                    <span>{opt.label}</span>
                    <span className="font-semibold text-[#C9A84C]">{formatPrice(opt.price, currency)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Récapitulatif</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Livraison</span>
                  <span>{formatPrice(delivery, currency)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Réduction</span>
                    <span>-{formatPrice(promoDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-base border-t border-[#1F1F1F] pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-[#C9A84C]">{formatPrice(total, currency)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                fullWidth
                size="lg"
                className="mt-5"
                data-testid="button-checkout"
              >
                Passer la commande <ArrowRight size={18} />
              </Button>
              <Link
                to="/boutique"
                className="block text-center text-sm text-gray-500 hover:text-gray-300 mt-3 transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
