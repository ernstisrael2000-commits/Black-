import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';

interface AuthStore {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  firebaseUser: null,
  user: null,
  loading: true,

  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  isAdmin: () => {
    const { user } = get();
    return user?.isAdmin === true;
  },
}));
