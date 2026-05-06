import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, ChevronRight, ShieldCheck, Lock } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { createOrder } from '../firebase/orders';
import { updateStock } from '../firebase/products';
import { usePromoCode } from '../firebase/promos';
import { formatPrice } from '../utils/format';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'mastercard', label: 'MasterCard / Visa', icon: <CreditCard size={20} />, color: 'text-blue-400' },
  { id: 'paypal', label: 'PayPal', icon: <span className="font-bold text-blue-500">P</span>, color: 'text-blue-500' },
  { id: 'moncash', label: 'MonCash', icon: <Smartphone size={20} />, color: 'text-yellow-400' },
  { id: 'natcash', label: 'NatCash', icon: <Smartphone size={20} />, color: 'text-green-400' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getSubtotal, getDeliveryFee, getTotal, promoCode, promoDiscount, clearCart } = useCartStore();
  const currency = useUIStore((s) => s.currency);
  const { firebaseUser, user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState('mastercard');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: user?.displayName || firebaseUser?.displayName || '',
    phone: '',
    street: '',
    city: '',
    country: 'Haïti',
  });

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee(deliveryType);
  const total = getTotal(deliveryType);

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.street || !address.city) {
      toast.error('Veuillez remplir tous les champs de livraison');
      return;
    }
    if (!firebaseUser) return;

    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.images[0],
        price: currency === 'HTG' ? i.product.price : i.product.priceUSD,
        quantity: i.quantity,
      }));

      const orderId = await createOrder({
        userId: firebaseUser.uid,
        userEmail: firebaseUser.email || '',
        userName: firebaseUser.displayName || '',
        items: orderItems,
        subtotal,
        deliveryFee: delivery,
        discount: promoDiscount,
        total,
        currency,
        status: 'en_attente',
        paymentMethod,
        paymentStatus: 'en_attente',
        address: { id: 'default', isDefault: true, ...address },
        promoCode: promoCode || undefined,
        deliveryType,
        trackingNumber: `BS-${Date.now()}`,
      });

      // Update stock
      for (const item of items) {
        if (!item.product.isAffiliate) {
          await updateStock(item.product.id, -item.quantity);
        }
      }

      if (promoCode) await usePromoCode(promoCode);

      clearCart();
      toast.success('Commande passée avec succès !');
      navigate(`/compte/commandes/${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-[#080808] border-b border-[#1F1F1F] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold text-white mb-4">Paiement</h1>
          {/* Steps */}
          <div className="flex items-center gap-2 text-sm">
            {[
              { num: 1, label: 'Livraison' },
              { num: 2, label: 'Paiement' },
              { num: 3, label: 'Confirmation' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${step >= s.num ? 'text-[#C9A84C]' : 'text-gray-600'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > s.num ? 'bg-[#C9A84C] text-black' :
                    step === s.num ? 'border-2 border-[#C9A84C]' :
                    'border-2 border-gray-700 text-gray-700'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </span>
                  {s.label}
                </div>
                {i < 2 && <ChevronRight size={14} className="text-gray-700" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
                  <h2 className="font-semibold text-white mb-5">Adresse de livraison</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Nom complet"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      placeholder="Jean Dupont"
                      data-testid="input-name"
                    />
                    <Input
                      label="Téléphone"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+509 3000-0000"
                      data-testid="input-phone"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Adresse"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Rue principale, numéro..."
                        data-testid="input-street"
                      />
                    </div>
                    <Input
                      label="Ville"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Port-au-Prince"
                      data-testid="input-city"
                    />
                    <Input
                      label="Pays"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      placeholder="Haïti"
                      data-testid="input-country"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="font-semibold text-white mb-3">Mode de livraison</h3>
                    <div className="space-y-2">
                      {[
                        { type: 'standard' as const, label: 'Standard (3-5 jours)', fee: getDeliveryFee('standard') },
                        { type: 'express' as const, label: 'Express (24h)', fee: getDeliveryFee('express') },
                      ].map((opt) => (
                        <button
                          key={opt.type}
                          onClick={() => setDeliveryType(opt.type)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors ${
                            deliveryType === opt.type
                              ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white'
                              : 'border-[#1F1F1F] text-gray-400'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="font-semibold text-[#C9A84C]">{formatPrice(opt.fee, currency)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setStep(2)} fullWidth size="lg" className="mt-4" data-testid="button-next-step">
                  Continuer vers le paiement <ChevronRight size={18} />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
                  <h2 className="font-semibold text-white mb-5">Mode de paiement</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border text-sm transition-colors ${
                          paymentMethod === method.id
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                            : 'border-[#1F1F1F] hover:border-[#C9A84C]/30'
                        }`}
                        data-testid={`payment-method-${method.id}`}
                      >
                        <span className={method.color}>{method.icon}</span>
                        <span className="font-medium text-white">{method.label}</span>
                        <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id ? 'border-[#C9A84C]' : 'border-gray-600'
                        }`}>
                          {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Lock size={12} /> Paiement 100% sécurisé et chiffré
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => setStep(1)} variant="outline" size="lg" className="flex-1">
                    Retour
                  </Button>
                  <Button onClick={() => setStep(3)} size="lg" className="flex-1" data-testid="button-confirm-payment">
                    Confirmer <ChevronRight size={18} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
                  <h2 className="font-semibold text-white mb-5">Confirmation de commande</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Livraison</span>
                      <span className="text-white">{address.name} — {address.city}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Paiement</span>
                      <span className="text-white">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Délai</span>
                      <span className="text-white">{deliveryType === 'express' ? 'Express (24h)' : 'Standard (3-5 jours)'}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-400/5 border border-green-400/10 rounded-xl px-4 py-3">
                    <ShieldCheck size={14} /> Commande protégée par notre garantie de satisfaction
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => setStep(2)} variant="outline" size="lg" className="flex-1">
                    Retour
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    loading={loading}
                    size="lg"
                    className="flex-1"
                    data-testid="button-place-order"
                  >
                    Passer la commande
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5 h-fit">
            <h3 className="font-semibold text-white mb-4">Votre commande</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const price = currency === 'HTG' ? item.product.price : item.product.priceUSD;
                return (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#141414] shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#C9A84C] shrink-0">
                      {formatPrice(price * item.quantity, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#1F1F1F] pt-4 space-y-2 text-sm">
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
              <div className="flex justify-between text-white font-bold text-base border-t border-[#1F1F1F] pt-3">
                <span>Total</span>
                <span className="text-[#C9A84C]">{formatPrice(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
