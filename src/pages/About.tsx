import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Star, Users, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/5 rounded-full filter blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9A84C] text-sm font-medium mb-2 block">Notre histoire</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              À propos de <span className="text-gold-gradient">Black Store</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Black Store est née d'une vision simple : offrir aux Haïtiens l'accès à des produits premium
              de qualité mondiale, avec un service client exceptionnel et des prix compétitifs.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Notre mission</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Nous croyons que chaque client mérite une expérience d'achat premium. C'est pourquoi nous
                  sélectionnons soigneusement chaque produit de notre catalogue pour garantir authenticité
                  et qualité.
                </p>
                <p>
                  En tant que plateforme e-commerce moderne, nous proposons à la fois nos propres produits
                  et des produits de partenaires de confiance comme Amazon, permettant à nos clients d'accéder
                  à un catalogue étendu.
                </p>
                <p>
                  Notre engagement : livraison rapide, service client irréprochable et expérience d'achat
                  sécurisée dans les deux devises (HTG et USD).
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '2022', label: 'Année de création' },
                { value: '10K+', label: 'Clients satisfaits' },
                { value: '500+', label: 'Produits disponibles' },
                { value: '4.9★', label: 'Note moyenne' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 text-center">
                  <p className="font-display text-3xl font-bold text-gold-gradient mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Nos valeurs</h2>
            <p className="text-gray-500">Ce qui nous guide au quotidien</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={28} />, title: 'Authenticité', desc: 'Chaque produit est vérifié et garanti 100% authentique.' },
              { icon: <Star size={28} />, title: 'Excellence', desc: 'Nous visons la perfection dans tout ce que nous faisons.' },
              { icon: <Users size={28} />, title: 'Communauté', desc: 'Nos clients sont au cœur de chaque décision.' },
              { icon: <Truck size={28} />, title: 'Fiabilité', desc: 'Livraisons ponctuelles et service client disponible.' },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Prêt à découvrir notre boutique ?
          </h2>
          <p className="text-gray-400 mb-8">
            Des milliers de produits premium vous attendent. Livraison partout en Haïti.
          </p>
          <Link
            to="/boutique"
            className="btn-gold px-10 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2 text-black"
          >
            Explorer la boutique <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
