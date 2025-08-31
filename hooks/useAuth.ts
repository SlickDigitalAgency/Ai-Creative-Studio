
import { useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useUserStore } from '../stores/userStore';
import type { User } from '../types';

export const useAuth = () => {
  const { setUser, setLoading, logout, user, loading, error } = useUserStore();

  const handleUserSnapshot = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // This case might happen on first registration before user doc is created
          // Or if there's an issue. For now, we set a minimal user object.
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            plan: 'free',
            credits: 10,
            emailVerified: firebaseUser.emailVerified,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          };
          setUser(newUser);
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        setUser(null); // Or handle error state appropriately
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [setUser, setLoading]);

  const initializeAuth = useCallback(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, handleUserSnapshot);
    // In a real app, you might want to return this unsubscribe function
    // to call it on cleanup, but for a one-time init, this is fine.
  }, [handleUserSnapshot, setLoading]);

  return {
    user,
    loading,
    error,
    initializeAuth,
    logout: () => {
      auth.signOut();
      logout();
    },
    // Login/Register functions would be added here
  };
};
