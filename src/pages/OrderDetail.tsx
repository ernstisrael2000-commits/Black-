import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { getOrderById } from '../firebase/orders';
import { Order } from '../types';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '../utils/format';

const STATUS_STEPS = ['en_attente', 'confirme', 'en_cours', 'livre'];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrderById(id).then(setOrder).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Commande introuvable</p>
        <Link to="/compte/commandes" className="text-[#C9A84C] hover:underline">Retour aux commandes</Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen">
      <div className="bg-[#080808] border-b border-[#1F1F1F] py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/compte" className="hover:text-white">Mon compte</Link>
            <ChevronRight size={14} />
            <Link to="/compte/commandes" className="hover:text-white">Commandes</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">#{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-white">
              Commande #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Passée le {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Status tracker */}
        {order.status !== 'annule' && (
          <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-6">Suivi de commande</h2>
            <div className="flex items-start justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#1F1F1F] mx-10" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-[#C9A84C] mx-10 transition-all duration-500"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 80}%` }}
              />
              {STATUS_STEPS.map((status, i) => {
                const icons = [<Clock size={16} />, <CheckCircle size={16} />, <Truck size={16} />, <Package size={16} />];
                const labels = ['En attente', 'Confirmé', 'En livraison', 'Livré'];
                const isActive = i <= currentStep;
                return (
                  <div key={status} className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive ? 'bg-[#C9A84C] border-[#C9A84C] text-black' : 'bg-[#0A0A0A] border-[#1F1F1F] text-gray-600'
                    }`}>
                      {icons[i]}
                    </div>
                    <span className={`text-xs text-center ${isActive ? 'text-white' : 'text-gray-600'}`}>
                      {labels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
            {order.trackingNumber && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Numéro de suivi: <span className="text-[#C9A84C] font-mono">{order.trackingNumber}</span>
              </p>
            )}
          </div>
        )}

        {/* Items */}
        <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#1F1F1F]">
            <h2 className="font-semibold text-white">Articles commandés</h2>
          </div>
          <div className="divide-y divide-[#1F1F1F]">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#141414] shrink-0">
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{item.productName}</p>
                  <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                </div>
                <span className="font-bold text-[#C9A84C] text-sm">
                  {formatPrice(item.price * item.quantity, order.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotal, order.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Livraison</span>
                <span>{formatPrice(order.deliveryFee, order.currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Réduction</span>
                  <span>-{formatPrice(order.discount, order.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold border-t border-[#1F1F1F] pt-2 mt-2">
                <span>Total</span>
                <span className="text-[#C9A84C]">{formatPrice(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Adresse de livraison</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p className="text-white font-medium">{order.address.name}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.country}</p>
              <p>{order.address.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
