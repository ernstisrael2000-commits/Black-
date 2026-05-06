import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Edit2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { logout, updateUserProfile } from '../firebase/auth';
import { getUserOrders } from '../firebase/orders';
import { Order } from '../types';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/format';
import { useUIStore } from '../store/uiStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile', label: 'Profil', icon: <User size={16} /> },
  { id: 'orders', label: 'Commandes', icon: <Package size={16} /> },
  { id: 'settings', label: 'Paramètres', icon: <Settings size={16} /> },
];

export default function Account() {
  const navigate = useNavigate();
  const { firebaseUser, user, setUser } = useAuthStore();
  const currency = useUIStore((s) => s.currency);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editName, setEditName] = useState(firebaseUser?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!firebaseUser) { navigate('/connexion'); return; }
    if (activeTab === 'orders') {
      setOrdersLoading(true);
      getUserOrders(firebaseUser.uid).then(setOrders).finally(() => setOrdersLoading(false));
    }
  }, [firebaseUser, activeTab, navigate]);

  const handleSaveProfile = async () => {
    if (!firebaseUser) return;
    setSavingProfile(true);
    try {
      await updateUserProfile(firebaseUser.uid, { displayName: editName } as any);
      toast.success('Profil mis à jour !');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Déconnexion réussie');
  };

  if (!firebaseUser) return null;

  return (
    <div className="min-h-screen">
      <div className="bg-[#080808] border-b border-[#1F1F1F] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] text-2xl font-bold font-display">
              {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">
                {firebaseUser.displayName || 'Mon compte'}
              </h1>
              <p className="text-gray-500 text-sm">{firebaseUser.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-colors"
                data-testid="link-admin"
              >
                <Settings size={16} /> Administration
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/5 transition-colors"
              data-testid="button-logout"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
                  <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                    <User size={18} className="text-[#C9A84C]" /> Informations personnelles
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Nom complet"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      data-testid="input-display-name"
                    />
                    <Input
                      label="Email"
                      value={firebaseUser.email || ''}
                      disabled
                    />
                    <Button onClick={handleSaveProfile} loading={savingProfile} size="sm" data-testid="button-save-profile">
                      <Edit2 size={14} /> Sauvegarder
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-[#1F1F1F]">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                      <Package size={18} className="text-[#C9A84C]" /> Mes commandes
                    </h2>
                  </div>
                  {ordersLoading ? (
                    <div className="p-8 text-center text-gray-500">Chargement...</div>
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                      <Package size={40} className="text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-4">Vous n'avez pas encore de commandes</p>
                      <Link to="/boutique" className="text-[#C9A84C] hover:underline text-sm">
                        Commencer mes achats
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#1F1F1F]">
                      {orders.map((order) => (
                        <Link
                          key={order.id}
                          to={`/compte/commandes/${order.id}`}
                          className="flex items-center justify-between p-5 hover:bg-[#1A1A1A] transition-colors group"
                          data-testid={`order-${order.id}`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white mb-1">
                              Commande #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                            <div className="mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#C9A84C]">{formatPrice(order.total, order.currency)}</p>
                            <p className="text-xs text-gray-600 mt-1">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                            <ChevronRight size={16} className="text-gray-600 group-hover:text-[#C9A84C] transition-colors ml-auto mt-2" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
                  <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                    <Settings size={18} className="text-[#C9A84C]" /> Paramètres
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-[#1F1F1F]">
                      <div>
                        <p className="font-medium text-white text-sm">Notifications email</p>
                        <p className="text-xs text-gray-500">Confirmations de commandes</p>
                      </div>
                      <div className="w-10 h-6 bg-[#C9A84C] rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-white text-sm">Promotions & offres</p>
                        <p className="text-xs text-gray-500">Recevoir les bons plans</p>
                      </div>
                      <div className="w-10 h-6 bg-[#1A1A1A] border border-[#1F1F1F] rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-gray-600 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
