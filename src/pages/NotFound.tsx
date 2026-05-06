import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-8xl font-display font-bold text-gold-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page introuvable</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="btn-gold px-8 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2 text-black"
        >
          <ArrowLeft size={18} /> Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
