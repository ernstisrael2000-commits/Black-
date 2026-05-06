import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  promoCode: string;
  promoDiscount: number;
  currency: 'HTG' | 'USD';
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;
  setCurrency: (currency: 'HTG' | 'USD') => void;
  getSubtotal: () => number;
  getDeliveryFee: (type: 'standard' | 'express') => number;
  getTotal: (deliveryType: 'standard' | 'express') => number;
  itemCount: () => number;
}

const HTG_RATE = 132;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      promoDiscount: 0,
      currency: 'HTG',

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: '', promoDiscount: 0 }),

      applyPromo: (code, discount) => set({ promoCode: code, promoDiscount: discount }),
      removePromo: () => set({ promoCode: '', promoDiscount: 0 }),

      setCurrency: (currency) => set({ currency }),

      getSubtotal: () => {
        const { items, currency } = get();
        const rate = currency === 'HTG' ? HTG_RATE : 1;
        return items.reduce((sum, item) => {
          const price = currency === 'HTG' ? item.product.price : item.product.priceUSD;
          return sum + price * item.quantity;
        }, 0);
      },

      getDeliveryFee: (type) => {
        const { currency } = get();
        if (type === 'express') return currency === 'HTG' ? 1500 : 12;
        return currency === 'HTG' ? 500 : 4;
      },

      getTotal: (deliveryType) => {
        const { promoDiscount } = get();
        const subtotal = get().getSubtotal();
        const delivery = get().getDeliveryFee(deliveryType);
        return Math.max(0, subtotal + delivery - promoDiscount);
      },

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'black-store-cart',
    }
  )
);
