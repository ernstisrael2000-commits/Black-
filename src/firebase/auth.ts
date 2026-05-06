import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '../types';

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
  const { user } = await signInWithPopup(auth, provider);
  const exists = await getDoc(doc(db, 'users', user.uid));
  if (!exists.exists()) {
    await createUserDocument(user, user.displayName || 'Utilisateur');
  }
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const createUserDocument = async (user: FirebaseUser, displayName: string): Promise<void> => {
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim());
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL: user.photoURL || null,
    isAdmin: adminEmails.includes(user.email || ''),
    addresses: [],
    createdAt: serverTimestamp(),
  });
};

export const getUserDocument = async (uid: string): Promise<User | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  await setDoc(doc(db, 'users', uid), data, { merge: true });
};
