import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../types';

const isAdminEmail = (email: string | null): boolean => {
  if (!email) return false;
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
};

export const register = async (email: string, password: string, displayName: string): Promise<void> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  await createUserDocument(user, displayName);
};

export const login = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const { user } = await signInWithPopup(auth, provider);
    await upsertUserDocument(user);
  } catch (err: any) {
    // Fallback to redirect if popup blocked
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, provider);
    } else {
      throw err;
    }
  }
};

export const handleRedirectResult = async (): Promise<void> => {
  const result = await getRedirectResult(auth);
  if (result?.user) {
    await upsertUserDocument(result.user);
  }
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const upsertUserDocument = async (user: FirebaseUser): Promise<void> => {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const admin = isAdminEmail(user.email);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Utilisateur',
      photoURL: user.photoURL || null,
      isAdmin: admin,
      addresses: [],
      createdAt: serverTimestamp(),
    });
  } else {
    // Always keep admin status in sync with VITE_ADMIN_EMAILS
    await setDoc(ref, { isAdmin: admin, photoURL: user.photoURL || null }, { merge: true });
  }
};

export const createUserDocument = upsertUserDocument;

export const getUserDocument = async (uid: string): Promise<User | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as User;
  } catch {
    return null;
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
};
