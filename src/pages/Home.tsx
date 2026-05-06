import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import { useFeaturedProducts, usePopularProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';
import { seedDemoProducts } from '../firebase/products';

const categories = [
  { name: 'Électronique', slug: 'electronique', icon: '📱', count: '120+ produits' },
  { name: 'Mode', slug: 'mode', icon: '👟', count: '200+ produits' },
  { name: 'Beauté', slug: 'beaute', icon: '✨', count: '80+ produits' },
  { name: 'Informatique', slug: 'informatique', icon: '💻', count: '60+ produits' },
  { name: 'Maison', slug: 'maison', icon: '🏠', count: '90+ produits' },
  { name: 'Sport', slug: 'sport', icon: '⚽', count: '70+ produits' },
];

const banners = [
  {
    title: 'Nouveautés Tech 2024',
    subtitle: 'Les derniers smartphones et gadgets premium',
    tag: 'Collection Exclusive',
    gradient: 'from-[#C9A84C]/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    link: '/boutique?category=electronique',
  },
  {
    title: 'Mode Premium',
    subtitle: 'Sneakers et vêtements de marque authentiques',
    tag: 'Nouveaux arrivages',
    gradient: 'from-blue-600/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    link: '/boutique?category=mode',
  },
];

export default function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: popularProducts, isLoading: popularLoading } = usePopularProducts();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    seedDemoProducts().catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveSlide((s) => (s + 1) % banners.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {banners.map((banner, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === activeSlide ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
            </div>
          </motion.div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="inline-block px-3 py-1.5 bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-semibold rounded-full mb-4">
                {banners[activeSlide].tag}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {banners[activeSlide].title}
              </h1>
              <p className="text-lg text-gray-400 mb-8">
                {banners[activeSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={banners[activeSlide].link}
                  className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2 text-black"
                  data-testid="button-hero-shop"
                >
                  Explorer <ArrowRight size={18} />
                </Link>
                <Link
                  to="/boutique"
                  className="px-8 py-3.5 rounded-xl text-base font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors"
                >
                  Tout voir
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide ? 'w-8 bg-[#C9A84C]' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A0A0A] to-transparent h-16" />
      </section>

      {/* Stats */}
      <section className="py-6 border-b border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10K+', label: 'Clients satisfaits' },
              { value: '500+', label: 'Produits disponibles' },
              { value: '4.9/5', label: 'Note moyenne' },
              { value: '24h', label: 'Livraison express' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-gold-gradient">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#C9A84C] text-sm font-medium mb-1">Nos catégories</p>
              <h2 className="font-display text-3xl font-bold text-white">Parcourez par catégorie</h2>
            </div>
            <Link to="/boutique" className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/boutique?category=${cat.slug}`}
                  className="block bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 text-center card-hover group"
                  data-testid={`link-category-${cat.slug}`}
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <p className="font-semibold text-white text-sm group-hover:text-[#C9A84C] transition-colors">{cat.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#C9A84C] text-sm font-medium mb-1 flex items-center gap-1.5">
                <Star size={14} /> Sélection premium
              </p>
              <h2 className="font-display text-3xl font-bold text-white">Produits vedettes</h2>
            </div>
            <Link to="/boutique?sort=newest" className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          {featuredLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="aspect-square skeleton" />
                  <div className="p-4 bg-[#111] space-y-2">
                    <div className="h-4 skeleton rounded-lg" />
                    <div className="h-3 skeleton rounded-lg w-2/3" />
                    <div className="h-5 skeleton rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {(featuredProducts || []).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1200] to-[#111] border border-[#C9A84C]/20 p-8 sm:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C] rounded-full filter blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C9A84C]/20 border border-[#C9A84C]/30 rounded-full text-[#C9A84C] text-xs font-semibold mb-4">
                  <Zap size={12} /> Offre limitée
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
                  -20% sur la mode
                </h2>
                <p className="text-gray-400 text-lg">
                  Profitez de nos promotions exclusives sur toute la collection mode.
                </p>
              </div>
              <Link
                to="/boutique?category=mode"
                className="btn-gold px-8 py-4 rounded-xl text-lg font-semibold text-black shrink-0 inline-flex items-center gap-2"
                data-testid="button-promo-shop"
              >
                En profiter <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#C9A84C] text-sm font-medium mb-1 flex items-center gap-1.5">
                <TrendingUp size={14} /> Les plus achetés
              </p>
              <h2 className="font-display text-3xl font-bold text-white">Tendances du moment</h2>
            </div>
            <Link to="/boutique?sort=popular" className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors flex items-center gap-1">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          {popularLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="aspect-square skeleton" />
                  <div className="p-4 bg-[#111] space-y-2">
                    <div className="h-4 skeleton rounded-lg" />
                    <div className="h-3 skeleton rounded-lg w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {(popularProducts || []).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck size={28} />,
                title: '100% Authentique',
                desc: 'Tous nos produits sont garantis authentiques avec certificat de conformité.',
              },
              {
                icon: <Zap size={28} />,
                title: 'Livraison Express',
                desc: 'Recevez vos commandes en 24h avec notre service express dans toutes les villes.',
              },
              {
                icon: <Star size={28} />,
                title: 'Service Premium',
                desc: 'Support client 7j/7 par WhatsApp, email et téléphone pour toute assistance.',
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
