import {
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, updateDoc, doc
} from 'firebase/firestore';
import { db } from './config';
import { Review } from '../types';

const COLLECTION = 'reviews';

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
};

export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...review,
    createdAt: serverTimestamp(),
  });

  // Update product rating
  const reviews = await getProductReviews(review.productId);
  const allReviews = [...reviews, { ...review, id: ref.id }];
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await updateDoc(doc(db, 'products', review.productId), {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: allReviews.length,
  });

  return ref.id;
};

export const hasUserReviewed = async (productId: string, userId: string): Promise<boolean> => {
  const q = query(
    collection(db, COLLECTION),
    where('productId', '==', productId),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
};
