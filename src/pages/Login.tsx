import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { login, loginWithGoogle, resetPassword } from '../firebase/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential' ? 'Email ou mot de passe incorrect' :
        err.code === 'auth/too-many-requests' ? 'Trop de tentatives. Réessayez plus tard.' :
        'Erreur de connexion';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Connexion réussie !');
      navigate('/');
    } catch {
      toast.error('Erreur avec Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      toast.success('Email de réinitialisation envoyé !');
      setShowReset(false);
    } catch {
      toast.error('Email introuvable');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#0A0A0A]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#C9A84C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-3xl font-display">B</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            {showReset ? 'Réinitialiser le mot de passe' : 'Connexion'}
          </h1>
          <p className="text-gray-500 text-sm">
            {showReset ? 'Recevez un lien par email' : 'Bon retour sur Black Store'}
          </p>
        </div>

        <div className="bg-[#111] border border-[#1F1F1F] rounded-3xl p-8">
          {showReset ? (
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="votre@email.com"
                icon={<Mail size={16} />}
                data-testid="input-reset-email"
              />
              <Button type="submit" loading={resetLoading} fullWidth size="lg">
                Envoyer le lien
              </Button>
              <button type="button" onClick={() => setShowReset(false)} className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Retour à la connexion
              </button>
            </form>
          ) : (
            <>
              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#1F1F1F] text-white text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50 mb-5"
                data-testid="button-google-login"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#1F1F1F]" />
                <span className="text-xs text-gray-600">ou</span>
                <div className="flex-1 h-px bg-[#1F1F1F]" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  icon={<Mail size={16} />}
                  data-testid="input-email"
                />
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  data-testid="input-password"
                />
                <div className="flex justify-end">
                  <button type="button" onClick={() => setShowReset(true)} className="text-xs text-gray-500 hover:text-[#C9A84C] transition-colors">
                    Mot de passe oublié ?
                  </button>
                </div>
                <Button type="submit" loading={loading} fullWidth size="lg" data-testid="button-login">
                  <LogIn size={18} /> Se connecter
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-[#C9A84C] hover:underline font-medium">
            S'inscrire gratuitement
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
