import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Heart, User, Menu, X, ChevronDown,
  LogOut, Package, Shield, ArrowLeftRight, Sun, Moon
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { logout } from '../../firebase/auth';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Boutique', to: '/boutique' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Contact', to: '/contact' },
];

const categories = [
  { label: 'Électronique', slug: 'electronique' },
  { label: 'Mode & Vêtements', slug: 'mode' },
  { label: 'Beauté', slug: 'beaute' },
  { label: 'Informatique', slug: 'informatique' },
  { label: 'Maison', slug: 'maison' },
  { label: 'Sport', slug: 'sport' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user, firebaseUser } = useAuthStore();
  const { currency, toggleCurrency, theme, toggleTheme } = useUIStore();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-theme"
        style={{ background: 'var(--nav-bg)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="link-logo">
              <div className="w-8 h-8 bg-[#C9A84C] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg font-display">B</span>
              </div>
              <span className="font-display font-bold text-xl text-gold-gradient">
                Black Store
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                link.label === 'Boutique' ? (
                  <div key={link.to} className="relative"
                    onMouseEnter={() => setIsCategoryOpen(true)}
                    onMouseLeave={() => setIsCategoryOpen(false)}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                        location.pathname === link.to ? 'text-[#C9A84C]' : 'text-theme-sec hover:text-theme'
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-theme-card border border-theme rounded-xl shadow-2xl overflow-hidden"
                        >
                          {categories.map((cat) => (
                            <Link
                              key={cat.slug}
                              to={`/boutique?category=${cat.slug}`}
                              className="block px-4 py-2.5 text-sm text-theme-sec hover:bg-theme-hover hover:text-[#C9A84C] transition-colors"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.to ? 'text-[#C9A84C]' : 'text-theme-sec hover:text-theme'
                    }`}
                    data-testid={`link-nav-${link.label}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Currency toggle */}
              <button
                onClick={toggleCurrency}
                className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                data-testid="button-toggle-currency"
              >
                <ArrowLeftRight size={12} />
                {currency}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Search */}
              <button
                onClick={() => { setIsSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                data-testid="button-search"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link
                to="/favoris"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                data-testid="link-wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/panier"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                data-testid="link-cart"
              >
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User */}
              {firebaseUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 transition-colors"
                    data-testid="button-user-menu"
                  >
                    {firebaseUser.photoURL ? (
                      <img src={firebaseUser.photoURL} alt="avatar" className="w-7 h-7 rounded-lg object-cover" />
                    ) : (
                      <span className="text-[#C9A84C] font-bold text-sm">
                        {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-theme-card border border-theme rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-theme">
                          <p className="text-sm font-semibold text-theme truncate">
                            {firebaseUser.displayName || 'Utilisateur'}
                          </p>
                          <p className="text-xs text-theme-mute truncate">{firebaseUser.email}</p>
                        </div>
                        <Link to="/compte" className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-sec hover:bg-theme-hover hover:text-theme transition-colors">
                          <User size={15} /> Mon compte
                        </Link>
                        <Link to="/compte/commandes" className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-sec hover:bg-theme-hover hover:text-theme transition-colors">
                          <Package size={15} /> Mes commandes
                        </Link>
                        {user?.isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#C9A84C] hover:bg-theme-hover transition-colors">
                            <Shield size={15} /> Administration
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-theme-hover transition-colors border-t border-theme"
                          data-testid="button-logout"
                        >
                          <LogOut size={15} /> Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/connexion"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold btn-gold"
                  data-testid="link-login"
                >
                  <User size={15} />
                  Connexion
                </Link>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-theme bg-theme"
            >
              <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-mute" />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="input-dark w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                    data-testid="input-search"
                  />
                </div>
                <button type="submit" className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold">
                  Chercher
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="px-3 py-3 rounded-xl text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                >
                  <X size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-theme bg-theme"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-theme mt-2 pt-2">
                  <p className="px-4 py-2 text-xs text-theme-mute uppercase tracking-wider">Catégories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/boutique?category=${cat.slug}`}
                      className="px-4 py-2.5 rounded-xl text-sm text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors block"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
                {!firebaseUser && (
                  <Link
                    to="/connexion"
                    className="mt-2 btn-gold px-4 py-3 rounded-xl text-sm font-semibold text-center text-black"
                  >
                    Connexion / Inscription
                  </Link>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={toggleCurrency}
                    className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                  >
                    <ArrowLeftRight size={14} /> Devise: {currency}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-theme-sec hover:text-theme hover:bg-theme-hover transition-colors"
                  >
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    {theme === 'dark' ? 'Clair' : 'Sombre'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
