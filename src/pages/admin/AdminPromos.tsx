import { useState, useEffect } from 'react';
import { Plus, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import { getAllPromoCodes, createPromoCode, togglePromoCode } from '../../firebase/promos';
import { PromoCode } from '../../types';
import { formatDate } from '../../utils/format';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function AdminPromos() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', type: 'percent' as 'percent' | 'fixed', value: 10, minOrder: 0, maxUses: 0, isActive: true,
  });

  const load = async () => {
    setLoading(true);
    const all = await getAllPromoCodes();
    setPromos(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.code) { toast.error('Code requis'); return; }
    setSaving(true);
    try {
      await createPromoCode({
        ...form,
        maxUses: form.maxUses || undefined,
        minOrder: form.minOrder || undefined,
      });
      toast.success('Code promo créé !');
      setShowForm(false);
      setForm({ code: '', type: 'percent', value: 10, minOrder: 0, maxUses: 0, isActive: true });
      await load();
    } catch { toast.error('Erreur'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await togglePromoCode(id, !isActive);
    toast.success(!isActive ? 'Code activé' : 'Code désactivé');
    await load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-theme">Codes promo</h2>
          <p className="text-theme-mute text-sm">{promos.length} code{promos.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus size={16} /> Nouveau code
        </Button>
      </div>

      {showForm && (
        <div className="bg-theme-card border border-theme rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={16} className="text-[#C9A84C]" />
            <h3 className="font-semibold text-theme">Créer un code promo</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="PROMO20"
              data-testid="input-promo-code-create"
            />
            <div>
              <label className="text-sm font-medium text-theme-sec mb-1.5 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              >
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (HTG)</option>
              </select>
            </div>
            <Input
              label={`Valeur (${form.type === 'percent' ? '%' : 'HTG'})`}
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            />
            <Input
              label="Commande minimum (HTG, 0 = aucun)"
              type="number"
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
            />
            <Input
              label="Utilisations maximum (0 = illimité)"
              type="number"
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleCreate} loading={saving} size="sm">Créer</Button>
            <Button onClick={() => setShowForm(false)} variant="outline" size="sm">Annuler</Button>
          </div>
        </div>
      )}

      <div className="bg-theme-card border border-theme rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-theme-mute text-sm">Chargement...</p>
          </div>
        ) : promos.length === 0 ? (
          <div className="p-12 text-center text-theme-mute">Aucun code promo — créez-en un !</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme">
                  {['Code', 'Type', 'Valeur', 'Min. commande', 'Utilisations', 'Statut'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-theme-mute uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map((promo, idx) => (
                  <tr
                    key={promo.id}
                    className={`hover:bg-theme-hover transition-colors ${idx < promos.length - 1 ? 'border-b border-theme' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#C9A84C] text-sm">{promo.code}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-theme-sec">
                      {promo.type === 'percent' ? 'Pourcentage' : 'Fixe'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-theme">
                      {promo.type === 'percent' ? `${promo.value}%` : `${promo.value} HTG`}
                    </td>
                    <td className="px-4 py-3 text-sm text-theme-sec">
                      {promo.minOrder ? `${promo.minOrder} HTG` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-theme-sec">
                      {promo.usedCount}{promo.maxUses ? `/${promo.maxUses}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(promo.id, promo.isActive)}>
                        {promo.isActive
                          ? <ToggleRight size={22} className="text-emerald-500" />
                          : <ToggleLeft size={22} className="text-theme-mute" />
                        }
                      </button>
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
