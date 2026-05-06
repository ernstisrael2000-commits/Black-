import {
  collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from './config';
import { PromoCode } from '../types';

const COLLECTION = 'promoCodes';

export const validatePromoCode = async (code: string, orderTotal: number): Promise<{ valid: boolean; discount: number; message: string }> => {
  const q = query(
    collection(db, COLLECTION),
    where('code', '==', code.toUpperCase()),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);

  if (snap.empty) return { valid: false, discount: 0, message: 'Code promo invalide' };

  const promo = { id: snap.docs[0].id, ...snap.docs[0].data() } as PromoCode;

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: 'Code promo expiré' };
  }

  if (promo.minOrder && orderTotal < promo.minOrder) {
    return { valid: false, discount: 0, message: `Commande minimum: ${promo.minOrder} HTG` };
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return { valid: false, discount: 0, message: 'Code promo épuisé' };
  }

  const discount = promo.type === 'percent'
    ? (orderTotal * promo.value) / 100
    : promo.value;

  return { valid: true, discount, message: `Code appliqué: -${promo.type === 'percent' ? promo.value + '%' : promo.value + ' HTG'}` };
};

export const usePromoCode = async (code: string): Promise<void> => {
  const q = query(collection(db, COLLECTION), where('code', '==', code.toUpperCase()));
  const snap = await getDocs(q);
  if (!snap.empty) {
    await updateDoc(doc(db, COLLECTION, snap.docs[0].id), {
      usedCount: increment(1),
    });
  }
};

export const getAllPromoCodes = async (): Promise<PromoCode[]> => {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PromoCode));
};

export const createPromoCode = async (promo: Omit<PromoCode, 'id' | 'usedCount'>): Promise<string> => {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...promo,
    code: promo.code.toUpperCase(),
    usedCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const togglePromoCode = async (id: string, isActive: boolean): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), { isActive });
};
