import { create } from 'zustand';
import { auth, db } from '@/config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User, AuthState } from '@/types/user';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'admin' | 'nurse') => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => () => void;
}

const createUserProfile = async (firebaseUser: FirebaseUser, role: 'admin' | 'nurse') => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userData: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    role,
    preferences: {
      notifications: true,
      theme: 'system',
      language: 'fr',
    },
  };
  await setDoc(userRef, userData);
  return userData;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      const userData = userDoc.data() as User;
      set({ user: userData, loading: false });
    } catch (error: any) {
      console.error('Sign in error:', error);
      set({ 
        error: error.code === 'auth/configuration-not-found' 
          ? 'Authentication service is not properly configured. Please try again later.' 
          : error.message,
        loading: false 
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string, role: 'admin' | 'nurse') => {
    try {
      set({ loading: true, error: null });
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const userData = await createUserProfile(firebaseUser, role);
      set({ user: userData, loading: false });
    } catch (error: any) {
      console.error('Sign up error:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, error: null });
    } catch (error: any) {
      console.error('Logout error:', error);
      set({ error: error.message });
      throw error;
    }
  },

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } else {
          set({ user: null, loading: false });
        }
      } catch (error: any) {
        console.error('Auth state change error:', error);
        set({ error: error.message, loading: false });
      }
    });
    return unsubscribe;
  },
}));
