import { create } from 'zustand';

interface UIStore {
  currency: 'HTG' | 'USD';
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  setCurrency: (currency: 'HTG' | 'USD') => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  toggleCurrency: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  currency: 'HTG',
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isCartOpen: false,

  setCurrency: (currency) => set({ currency }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  toggleCurrency: () => {
    const { currency } = get();
    set({ currency: currency === 'HTG' ? 'USD' : 'HTG' });
  },
}));
