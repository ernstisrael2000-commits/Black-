import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, TrendingUp, Users, Eye, ArrowRight, AlertTriangle } from 'lucide-react';
import { getOrderStats } from '../../firebase/orders';
import { getProducts } from '../../firebase/products';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [orderStats, productsResult] = await Promise.all([
        getOrderStats(),
        getProducts({ sort: 'newest' }, undefined, 100),
      ]);
      setStats(orderStats);
      setLowStock(productsResult.products.filter((p) => p.stock <= 5));
      setLoading(false);
    };
    load().catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <p className="text-theme-mute text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Commandes totales', value: stats?.totalOrders || 0, icon: <ShoppingBag size={20} />, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Revenu total (HTG)', value: formatPrice(stats?.totalRevenue || 0, 'HTG'), icon: <TrendingUp size={20} />, color: 'text-[#C9A84C] bg-[#C9A84C]/10' },
    { label: 'En attente', value: stats?.pendingOrders || 0, icon: <Package size={20} />, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Commandes livrées', value: stats?.completedOrders || 0, icon: <Users size={20} />, color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-theme mb-1">Tableau de bord</h2>
        <p className="text-theme-mute text-sm">Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-theme-card border border-theme rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-theme mb-1">{card.value}</p>
            <p className="text-sm text-theme-mute">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-theme">
          <h3 className="font-semibold text-theme">Commandes récentes</h3>
          <Link to="/admin/commandes" className="text-sm text-[#C9A84C] hover:underline flex items-center gap-1">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        {!stats?.recentOrders?.length ? (
          <div className="p-8 text-center text-theme-mute text-sm">Aucune commande pour l'instant</div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-theme-hover transition-colors">
                <div>
                  <p className="text-sm font-semibold text-theme font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-theme-mute">{order.userEmail} — {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-sm font-bold text-[#C9A84C]">{formatPrice(order.total, order.currency)}</span>
                  <Link to={`/admin/commandes/${order.id}`} className="text-theme-mute hover:text-theme">
                    <Eye size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-theme-card border border-amber-500/20 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-theme">
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className="font-semibold text-theme">Stock faible ({lowStock.length})</h3>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {lowStock.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 hover:bg-theme-hover transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-theme-surface shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theme">{product.name}</p>
                    <p className="text-xs text-theme-mute capitalize">{product.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                  {product.stock === 0 ? 'Épuisé' : `${product.stock} restant${product.stock > 1 ? 's' : ''}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
