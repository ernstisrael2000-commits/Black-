import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface UIStore {
  currency: 'HTG' | 'USD';
  theme: Theme;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  setCurrency: (currency: 'HTG' | 'USD') => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  toggleCurrency: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      currency: 'HTG',
      theme: 'light',
      isSearchOpen: false,
      isMobileMenuOpen: false,
      isCartOpen: false,

      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const { theme } = get();
        set({ theme: theme === 'dark' ? 'light' : 'dark' });
      },
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      toggleCurrency: () => {
        const { currency } = get();
        set({ currency: currency === 'HTG' ? 'USD' : 'HTG' });
      },
    }),
    {
      name: 'black-store-ui',
      partialize: (state) => ({ currency: state.currency, theme: state.theme }),
    }
  )
);
