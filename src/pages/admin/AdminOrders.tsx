import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, RefreshCw, ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import { getAllOrders, getOrderById, updateOrderStatus } from '../../firebase/orders';
import { Order } from '../../types';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../../utils/format';
import toast from 'react-hot-toast';

const STATUSES: Order['status'][] = ['en_attente', 'confirme', 'en_cours', 'livre', 'annule'];

export default function AdminOrders() {
  const { id } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    if (id) {
      const order = await getOrderById(id);
      setSelectedOrder(order);
    } else {
      const all = await getAllOrders();
      setOrders(all);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    toast.success('Statut mis à jour');
    await load();
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  if (id && selectedOrder) {
    return (
      <div className="p-6 max-w-3xl">
        <Link to="/admin/commandes" className="inline-flex items-center gap-2 text-sm text-theme-sec hover:text-theme mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour aux commandes
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-theme">
              Commande #{selectedOrder.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-theme-mute text-sm mt-1">{formatDate(selectedOrder.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getStatusColor(selectedOrder.status)}`}>
              {getStatusLabel(selectedOrder.status)}
            </span>
            <select
              value={selectedOrder.status}
              onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
              className="input-dark text-sm px-3 py-2 rounded-xl"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{getStatusLabel(s)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5">
          {/* Client */}
          <div className="bg-theme-card border border-theme rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-[#C9A84C]" />
              <h3 className="font-semibold text-theme">Informations client</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-theme-mute">Nom :</span> <span className="text-theme font-medium">{selectedOrder.userName}</span></p>
              <p><span className="text-theme-mute">Email :</span> <span className="text-theme">{selectedOrder.userEmail}</span></p>
              <p><span className="text-theme-mute">Paiement :</span> <span className="text-theme capitalize">{selectedOrder.paymentMethod}</span></p>
              <p>
                <span className="text-theme-mute">Statut paiement : </span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.paymentStatus)}`}>
                  {getStatusLabel(selectedOrder.paymentStatus)}
                </span>
              </p>
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-theme-card border border-theme rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-[#C9A84C]" />
              <h3 className="font-semibold text-theme">Adresse de livraison</h3>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium text-theme">{selectedOrder.address?.name}</p>
              <p className="text-theme-sec">{selectedOrder.address?.phone}</p>
              <p className="text-theme-sec">{selectedOrder.address?.street}</p>
              <p className="text-theme-sec">{selectedOrder.address?.city}, {selectedOrder.address?.country}</p>
            </div>
          </div>

          {/* Articles */}
          <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-theme">
              <Package size={16} className="text-[#C9A84C]" />
              <h3 className="font-semibold text-theme">Articles commandés</h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-theme-surface shrink-0">
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-theme">{item.productName}</p>
                    <p className="text-xs text-theme-mute">Qté : {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-[#C9A84C]">
                    {formatPrice(item.price * item.quantity, selectedOrder.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-theme-card border border-theme rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-[#C9A84C]" />
              <h3 className="font-semibold text-theme">Récapitulatif</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-theme-mute">Sous-total</span>
                <span className="text-theme">{formatPrice(selectedOrder.subtotal, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-mute">Livraison ({selectedOrder.deliveryType})</span>
                <span className="text-theme">{formatPrice(selectedOrder.deliveryFee, selectedOrder.currency)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-theme-mute">Réduction</span>
                  <span className="text-emerald-500">-{formatPrice(selectedOrder.discount, selectedOrder.currency)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-theme font-bold">
                <span className="text-theme">Total</span>
                <span className="text-[#C9A84C] text-base">{formatPrice(selectedOrder.total, selectedOrder.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-theme">Commandes</h2>
          <p className="text-theme-mute text-sm">{orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm text-theme-sec hover:text-theme transition-colors"
        >
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all', ...STATUSES].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              filterStatus === status
                ? 'bg-[#C9A84C] text-black'
                : 'bg-theme-card border border-theme text-theme-sec hover:text-theme'
            }`}
          >
            {status === 'all' ? 'Toutes' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-theme-mute text-sm">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-theme-mute">Aucune commande</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme">
                  {['Commande', 'Client', 'Date', 'Total', 'Paiement', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-theme-mute uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-theme-hover transition-colors ${idx < filtered.length - 1 ? 'border-b border-theme' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono font-bold text-theme">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-theme">{order.userName}</p>
                      <p className="text-xs text-theme-mute">{order.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-theme-sec whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#C9A84C] whitespace-nowrap">
                      {formatPrice(order.total, order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {getStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="input-dark text-xs px-2 py-1.5 rounded-lg"
                        data-testid={`order-status-${order.id}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{getStatusLabel(s)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/commandes/${order.id}`}
                        className="text-theme-mute hover:text-[#C9A84C] transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
