import { useEffect } from 'react';
import { onAuthChange, getUserDocument, handleRedirectResult } from '../firebase/auth';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';

const isAdminEmail = (email: string | null): boolean => {
  if (!email) return false;
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
};

export const useAuthInit = () => {
  const { setFirebaseUser, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Handle Google redirect result (mobile/popup-blocked fallback)
    handleRedirectResult().catch(() => {});

    const unsub = onAuthChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getUserDocument(firebaseUser.uid);
        if (userDoc) {
          // Always sync admin status from env var (in case it was updated)
          const syncedUser: User = {
            ...userDoc,
            isAdmin: isAdminEmail(firebaseUser.email),
          };
          setUser(syncedUser);
        } else {
          // Firestore not accessible (demo mode) — build minimal user from Firebase Auth
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Utilisateur',
            photoURL: firebaseUser.photoURL || undefined,
            isAdmin: isAdminEmail(firebaseUser.email),
            addresses: [],
            createdAt: new Date(),
          };
          setUser(fallbackUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [setFirebaseUser, setUser, setLoading]);
};
