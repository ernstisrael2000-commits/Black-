import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, startAfter, DocumentSnapshot,
  serverTimestamp, increment, QueryConstraint
} from 'firebase/firestore';
import { db } from './config';
import { Product, FilterState } from '../types';
import { DEMO_PRODUCTS } from '../data/demoProducts';

let useDemo = false;

const withTimeout = <T>(promise: Promise<T>, ms = 6000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
};

const filterDemoProducts = (filters?: Partial<FilterState>) => {
  let results = DEMO_PRODUCTS.filter(p => p.isActive);
  if (filters?.category && filters.category !== 'all') {
    results = results.filter(p => p.category === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (filters?.sort === 'price_asc') results.sort((a, b) => a.price - b.price);
  else if (filters?.sort === 'price_desc') results.sort((a, b) => b.price - a.price);
  else if (filters?.sort === 'popular') results.sort((a, b) => b.reviewCount - a.reviewCount);
  else if (filters?.sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  return results;
};

const COLLECTION = 'products';

export const getProducts = async (filters?: Partial<FilterState>, lastDoc?: DocumentSnapshot, pageSize = 12) => {
  if (useDemo) {
    const all = filterDemoProducts(filters);
    return { products: all.slice(0, pageSize), lastDoc: undefined, hasMore: all.length > pageSize };
  }
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.category && filters.category !== 'all') {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(where('isActive', '==', true));

    const sortField = filters?.sort === 'price_asc' || filters?.sort === 'price_desc' ? 'price' :
      filters?.sort === 'popular' ? 'reviewCount' :
      filters?.sort === 'rating' ? 'rating' : 'createdAt';
    const sortDir = filters?.sort === 'price_asc' ? 'asc' : 'desc';

    constraints.push(orderBy(sortField, sortDir));
    constraints.push(limit(pageSize));

    if (lastDoc) constraints.push(startAfter(lastDoc));

    const q = query(collection(db, COLLECTION), ...constraints);
    const snap = await withTimeout(getDocs(q));

    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));

    if (products.length === 0 && !filters?.category && !filters?.search) {
      useDemo = true;
      const all = filterDemoProducts(filters);
      return { products: all.slice(0, pageSize), lastDoc: undefined, hasMore: all.length > pageSize };
    }

    if (filters?.search) {
      const q2 = filters.search.toLowerCase();
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q2) || p.description?.toLowerCase().includes(q2)
      );
      return { products: filtered, lastDoc: snap.docs[snap.docs.length - 1], hasMore: snap.docs.length === pageSize };
    }

    return {
      products,
      lastDoc: snap.docs[snap.docs.length - 1],
      hasMore: snap.docs.length === pageSize,
    };
  } catch (err: any) {
    console.warn('[Firebase] getProducts failed, using demo data:', err?.code || err?.message);
    useDemo = true;
    const all = filterDemoProducts(filters);
    return { products: all.slice(0, pageSize), lastDoc: undefined, hasMore: all.length > pageSize };
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (useDemo || id.startsWith('demo-')) {
    return DEMO_PRODUCTS.find(p => p.id === id) || null;
  }
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  } catch {
    return DEMO_PRODUCTS.find(p => p.id === id) || null;
  }
};

export const getFeaturedProducts = async (count = 8): Promise<Product[]> => {
  if (useDemo) {
    return DEMO_PRODUCTS.filter(p => p.isActive && p.featured).slice(0, count);
  }
  try {
    const q = query(
      collection(db, COLLECTION),
      where('isActive', '==', true),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snap = await withTimeout(getDocs(q));
    const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    if (results.length === 0) {
      useDemo = true;
      return DEMO_PRODUCTS.filter(p => p.isActive && p.featured).slice(0, count);
    }
    return results;
  } catch (err: any) {
    console.warn('[Firebase] getFeaturedProducts failed, using demo data:', err?.code || err?.message);
    useDemo = true;
    return DEMO_PRODUCTS.filter(p => p.isActive && p.featured).slice(0, count);
  }
};

export const getPopularProducts = async (count = 8): Promise<Product[]> => {
  if (useDemo) {
    return [...DEMO_PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, count);
  }
  try {
    const q = query(
      collection(db, COLLECTION),
      where('isActive', '==', true),
      orderBy('reviewCount', 'desc'),
      limit(count)
    );
    const snap = await withTimeout(getDocs(q));
    const results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    if (results.length === 0) {
      useDemo = true;
      return [...DEMO_PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, count);
    }
    return results;
  } catch (err: any) {
    console.warn('[Firebase] getPopularProducts failed, using demo data:', err?.code || err?.message);
    useDemo = true;
    return [...DEMO_PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, count);
  }
};

export const getSimilarProducts = async (category: string, excludeId: string, count = 4): Promise<Product[]> => {
  if (useDemo) {
    return DEMO_PRODUCTS.filter(p => p.category === category && p.id !== excludeId && p.isActive).slice(0, count);
  }
  try {
    const q = query(
      collection(db, COLLECTION),
      where('category', '==', category),
      where('isActive', '==', true),
      limit(count + 1)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Product))
      .filter((p) => p.id !== excludeId)
      .slice(0, count);
  } catch {
    return DEMO_PRODUCTS.filter(p => p.category === category && p.id !== excludeId && p.isActive).slice(0, count);
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};

export const updateStock = async (id: string, delta: number): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    stock: increment(delta),
  });
};

export const seedDemoProducts = async () => {
  try {
    const existing = await withTimeout(getDocs(query(collection(db, COLLECTION), limit(1))), 4000);
    if (!existing.empty) return;

    const demoProducts = [
      {
        name: 'iPhone 15 Pro Max',
        description: "Le dernier flagship d'Apple avec puce A17 Pro, appareil photo 48MP, écran Super Retina XDR 6.7\"",
        price: 195000, priceUSD: 1479, originalPrice: 215000,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'],
        category: 'electronique', stock: 15, rating: 4.9, reviewCount: 128,
        isAffiliate: false, isActive: true, featured: true, tags: ['apple', 'iphone', 'smartphone'], discount: 9,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Smartphone premium avec S Pen intégré, caméra 200MP et intelligence artificielle avancée',
        price: 175000, priceUSD: 1329,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
        category: 'electronique', stock: 8, rating: 4.8, reviewCount: 94,
        isAffiliate: false, isActive: true, featured: true, tags: ['samsung', 'galaxy', 'smartphone'],
      },
      {
        name: 'MacBook Pro M3',
        description: 'Ordinateur portable ultra-puissant avec puce Apple M3, écran Liquid Retina XDR 14"',
        price: 280000, priceUSD: 2129,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=600'],
        category: 'informatique', stock: 5, rating: 4.9, reviewCount: 67,
        isAffiliate: true, affiliateLink: 'https://amzn.to/macbook-pro-m3',
        isActive: true, featured: true, tags: ['apple', 'macbook', 'ordinateur'],
      },
      {
        name: 'Air Jordan 1 Retro High OG',
        description: 'La sneaker iconique de Nike en coloris exclusif. Confort premium et style intemporel.',
        price: 28000, priceUSD: 212, originalPrice: 35000,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
        category: 'mode', stock: 20, rating: 4.7, reviewCount: 203,
        isAffiliate: false, isActive: true, featured: true, tags: ['nike', 'jordan', 'sneaker'], discount: 20,
      },
      {
        name: 'Sony WH-1000XM5',
        description: "Casque audio sans fil avec suppression de bruit active, 30h d'autonomie, qualité studio",
        price: 52000, priceUSD: 394,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        category: 'electronique', stock: 12, rating: 4.8, reviewCount: 156,
        isAffiliate: true, affiliateLink: 'https://amzn.to/sony-wh1000xm5',
        isActive: true, featured: false, tags: ['sony', 'casque', 'audio'],
      },
      {
        name: 'Nike Air Force 1',
        description: 'Sneaker classique et intemporelle en cuir blanc premium. Le must-have de toute garde-robe.',
        price: 18000, priceUSD: 136,
        images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600'],
        category: 'mode', stock: 30, rating: 4.6, reviewCount: 412,
        isAffiliate: false, isActive: true, featured: false, tags: ['nike', 'air force', 'sneaker'],
      },
      {
        name: 'Apple Watch Ultra 2',
        description: "Montre connectée ultra-résistante pour les aventuriers, GPS précis, 60h d'autonomie",
        price: 120000, priceUSD: 909,
        images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600'],
        category: 'electronique', stock: 7, rating: 4.9, reviewCount: 45,
        isAffiliate: false, isActive: true, featured: true, tags: ['apple', 'watch', 'montre'],
      },
      {
        name: 'Parfum Bleu de Chanel',
        description: 'Eau de parfum iconique pour homme. Notes fraîches et boisées d\'une élégance absolue.',
        price: 25000, priceUSD: 189,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'],
        category: 'beaute', stock: 25, rating: 4.8, reviewCount: 89,
        isAffiliate: false, isActive: true, featured: false, tags: ['chanel', 'parfum', 'beauté'],
      },
    ];

    for (const product of demoProducts) {
      await addDoc(collection(db, COLLECTION), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    useDemo = false;
  } catch {
    console.warn('[Firebase] seedDemoProducts failed — Firebase not reachable, demo data in use');
    useDemo = true;
  }
};
