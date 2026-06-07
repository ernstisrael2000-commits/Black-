import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, ArrowLeft, Shield, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const NAV_ITEMS = [
  { label: 'Tableau de bord', to: '/admin', icon: <LayoutDashboard size={18} />, exact: true },
  { label: 'Produits', to: '/admin/produits', icon: <Package size={18} /> },
  { label: 'Commandes', to: '/admin/commandes', icon: <ShoppingBag size={18} /> },
  { label: 'Codes promo', to: '/admin/promos', icon: <Tag size={18} /> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, firebaseUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        navigate('/connexion');
      } else if (!user?.isAdmin) {
        navigate('/');
      }
    }
  }, [user, loading, firebaseUser, navigate]);

  if (loading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <p className="text-theme-mute text-sm">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-theme">
      {/* Sidebar */}
      <div className="w-60 bg-theme-card border-r border-theme flex flex-col fixed left-0 top-0 bottom-0 z-30">
        {/* Header */}
        <div className="p-5 border-b border-theme">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#C9A84C]" />
              <span className="font-display font-bold text-[#C9A84C]">Administration</span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-theme-mute hover:text-theme hover:bg-theme-hover transition-colors"
              title="Changer le thème"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
          <p className="text-xs text-theme-mute">Black Store</p>
        </div>

        {/* User info */}
        {firebaseUser && (
          <div className="px-5 py-3 border-b border-theme flex items-center gap-3">
            {firebaseUser.photoURL ? (
              <img src={firebaseUser.photoURL} alt="avatar" className="w-8 h-8 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                <span className="text-[#C9A84C] font-bold text-sm">
                  {(firebaseUser.displayName || firebaseUser.email || 'A')[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-theme truncate">
                {firebaseUser.displayName || 'Admin'}
              </p>
              <p className="text-[11px] text-theme-mute truncate">{firebaseUser.email}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20'
                    : 'text-theme-sec hover:text-theme hover:bg-theme-hover'
                }`}
                data-testid={`admin-nav-${item.label}`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-theme">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-theme-mute hover:text-theme hover:bg-theme-hover transition-colors"
          >
            <ArrowLeft size={16} /> Retour au site
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 ml-60 bg-theme min-h-screen">
        {children}
      </div>
    </div>
  );
}
