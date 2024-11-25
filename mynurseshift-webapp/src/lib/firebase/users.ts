import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { User } from '@/types/user';

export const usersCollection = collection(db, 'users');

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<User, 'id'>>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, updates);
};

export const getUsersByService = async (service: string): Promise<User[]> => {
  const q = query(usersCollection, where('service', '==', service));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as User[];
};

export const updateUserPreferences = async (
  userId: string,
  preferences: User['preferences']
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { preferences });
};
