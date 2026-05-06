import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../firebase/orders';
import { Order } from '../../types';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../../utils/format';
import toast from 'react-hot-toast';

const STATUSES: Order['status'][] = ['en_attente', 'confirme', 'en_cours', 'livre', 'annule'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    const all = await getAllOrders();
    setOrders(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    await updateOrderStatus(orderId, status);
    toast.success('Statut mis à jour');
    await load();
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Commandes</h2>
          <p className="text-gray-500 text-sm">{orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
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
                : 'bg-[#111] border border-[#1F1F1F] text-gray-400 hover:text-white'
            }`}
          >
            {status === 'all' ? 'Toutes' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucune commande</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  {['Commande', 'Client', 'Date', 'Total', 'Paiement', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-white">{order.userName}</p>
                      <p className="text-xs text-gray-500">{order.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{formatDate(order.createdAt)}</td>
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
                        className="text-xs bg-[#141414] border border-[#1F1F1F] rounded-lg px-2 py-1.5 text-gray-300"
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
                        className="text-gray-500 hover:text-[#C9A84C] transition-colors"
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
