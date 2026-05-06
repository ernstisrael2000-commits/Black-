import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, ArrowLeft, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { label: 'Tableau de bord', to: '/admin', icon: <LayoutDashboard size={18} />, exact: true },
  { label: 'Produits', to: '/admin/produits', icon: <Package size={18} /> },
  { label: 'Commandes', to: '/admin/commandes', icon: <ShoppingBag size={18} /> },
  { label: 'Codes promo', to: '/admin/promos', icon: <Tag size={18} /> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Vérification des accès...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-60 bg-[#080808] border-r border-[#1F1F1F] flex flex-col fixed left-0 top-0 bottom-0 z-30">
        <div className="p-5 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-[#C9A84C]" />
            <span className="font-display font-bold text-[#C9A84C]">Admin</span>
          </div>
          <p className="text-xs text-gray-600">Black Store</p>
        </div>
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
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                data-testid={`admin-nav-${item.label}`}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#1F1F1F]">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={16} /> Retour au site
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 ml-60">
        {children}
      </div>
    </div>
  );
}
