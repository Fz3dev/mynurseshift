import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Shift {
  id: string;
  userId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  service: string;
  type: 'day' | 'night';
  status: 'pending' | 'confirmed' | 'completed';
  notes?: string;
}

export const shiftsCollection = collection(db, 'shifts');

export const getShiftsForUser = async (userId: string): Promise<Shift[]> => {
  const q = query(shiftsCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Shift[];
};

export const getShiftsForService = async (service: string): Promise<Shift[]> => {
  const q = query(shiftsCollection, where('service', '==', service));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Shift[];
};

export const subscribeToUserShifts = (
  userId: string,
  onShiftsUpdate: (shifts: Shift[]) => void
) => {
  const q = query(shiftsCollection, where('userId', '==', userId));
  
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const shifts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Shift[];
    onShiftsUpdate(shifts);
  });
};

export const subscribeToServiceShifts = (
  service: string,
  onShiftsUpdate: (shifts: Shift[]) => void
) => {
  const q = query(shiftsCollection, where('service', '==', service));
  
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const shifts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Shift[];
    onShiftsUpdate(shifts);
  });
};

export const createShift = async (shift: Omit<Shift, 'id'>): Promise<string> => {
  const docRef = await addDoc(shiftsCollection, shift);
  return docRef.id;
};

export const updateShift = async (shiftId: string, updates: Partial<Shift>): Promise<void> => {
  const shiftRef = doc(db, 'shifts', shiftId);
  await updateDoc(shiftRef, updates);
};

export const deleteShift = async (shiftId: string): Promise<void> => {
  const shiftRef = doc(db, 'shifts', shiftId);
  await deleteDoc(shiftRef);
};
