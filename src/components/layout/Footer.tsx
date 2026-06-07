import { Link } from 'react-router-dom';
import { Share2, Camera, MessageCircle, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-theme-surface border-t border-theme mt-20">
      {/* Trust badges */}
      <div className="border-b border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={24} />, title: 'Paiement sécurisé', desc: 'Transactions 100% protégées' },
              { icon: <Truck size={24} />, title: 'Livraison rapide', desc: 'Standard & Express disponible' },
              { icon: <RotateCcw size={24} />, title: 'Retours faciles', desc: 'Retour sous 30 jours' },
              { icon: <CreditCard size={24} />, title: 'Multi-paiements', desc: 'MasterCard, PayPal, MonCash' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="text-[#C9A84C] shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-semibold text-theme text-sm">{item.title}</p>
                  <p className="text-xs text-theme-mute mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#C9A84C] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg font-display">B</span>
              </div>
              <span className="font-display font-bold text-xl text-gold-gradient">Black Store</span>
            </div>
            <p className="text-sm text-theme-mute leading-relaxed mb-6">
              Votre boutique premium en ligne. Produits authentiques, service d'excellence et expérience d'achat incomparable.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Share2 size={16} />, href: '#' },
                { icon: <Camera size={16} />, href: '#' },
                { icon: <MessageCircle size={16} />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-xl bg-theme-hover border border-theme flex items-center justify-center text-theme-sec hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-theme text-sm mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Accueil', to: '/' },
                { label: 'Boutique', to: '/boutique' },
                { label: 'Mes favoris', to: '/favoris' },
                { label: 'Mon compte', to: '/compte' },
                { label: 'Mes commandes', to: '/compte/commandes' },
                { label: 'À propos', to: '/a-propos' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-theme-mute hover:text-[#C9A84C] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-theme text-sm mb-4 uppercase tracking-wider">Catégories</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Électronique', slug: 'electronique' },
                { label: 'Mode & Vêtements', slug: 'mode' },
                { label: 'Beauté', slug: 'beaute' },
                { label: 'Informatique', slug: 'informatique' },
                { label: 'Maison', slug: 'maison' },
                { label: 'Sport', slug: 'sport' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/boutique?category=${cat.slug}`} className="text-sm text-theme-mute hover:text-[#C9A84C] transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-theme text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: <MapPin size={15} />, text: 'Port-au-Prince, Haïti' },
                { icon: <Phone size={15} />, text: '+509 3000-0000' },
                { icon: <Mail size={15} />, text: 'contact@blackstore.ht' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-theme-mute">
                  <span className="text-[#C9A84C] shrink-0">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h5 className="text-xs text-theme-mute uppercase tracking-wider mb-3">Newsletter</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="input-dark flex-1 px-3 py-2 rounded-xl text-xs"
                  data-testid="input-newsletter"
                />
                <button className="btn-gold px-3 py-2 rounded-xl text-xs font-semibold shrink-0">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-theme-mute">
            © 2024 Black Store. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {['Confidentialité', 'Conditions', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-theme-mute hover:text-theme-sec transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
