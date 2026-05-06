import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-[#080808] border-b border-[#1F1F1F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#C9A84C] text-sm font-medium mb-2 block">Nous contacter</span>
            <h1 className="font-display text-4xl font-bold text-white mb-4">Besoin d'aide ?</h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Notre équipe est disponible 7j/7 pour répondre à toutes vos questions.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {[
              { icon: <Phone size={22} />, title: 'Téléphone', desc: '+509 3000-0000', sub: 'Lun-Sam: 8h - 20h' },
              { icon: <Mail size={22} />, title: 'Email', desc: 'contact@blackstore.ht', sub: 'Réponse sous 24h' },
              { icon: <MessageSquare size={22} />, title: 'WhatsApp', desc: '+509 3000-0000', sub: 'Réponse instantanée' },
              { icon: <MapPin size={22} />, title: 'Adresse', desc: 'Port-au-Prince, Haïti', sub: 'Visite sur RDV' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center text-[#C9A84C] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-[#C9A84C] text-sm mt-0.5">{item.desc}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-8">
              <h2 className="font-semibold text-white text-xl mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jean Dupont"
                    data-testid="input-contact-name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com"
                    data-testid="input-contact-email"
                  />
                </div>
                <Input
                  label="Sujet"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Comment pouvons-nous vous aider ?"
                  data-testid="input-contact-subject"
                />
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="Décrivez votre demande..."
                    className="input-dark w-full rounded-xl px-4 py-3 text-sm resize-none"
                    data-testid="textarea-contact-message"
                  />
                </div>
                <Button type="submit" loading={loading} fullWidth size="lg" data-testid="button-send-message">
                  <Send size={18} /> Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
