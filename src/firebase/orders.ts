import {
  collection, addDoc, updateDoc, doc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp, onSnapshot, limit
} from 'firebase/firestore';
import { db } from './config';
import { Order } from '../types';

const COLLECTION = 'orders';

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Order;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updatePaymentStatus = async (id: string, paymentStatus: Order['paymentStatus']): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
};

export const listenToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
  });
};

export const getOrderStats = async () => {
  const orders = await getAllOrders();
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paye')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'en_attente').length;
  const completedOrders = orders.filter((o) => o.status === 'livre').length;

  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    completedOrders,
    recentOrders: orders.slice(0, 5),
  };
};
