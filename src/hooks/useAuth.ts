import { useEffect } from 'react';
import { onAuthChange, getUserDocument } from '../firebase/auth';
import { useAuthStore } from '../store/authStore';

export const useAuthInit = () => {
  const { setFirebaseUser, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getUserDocument(firebaseUser.uid);
        setUser(userDoc);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [setFirebaseUser, setUser, setLoading]);
};
