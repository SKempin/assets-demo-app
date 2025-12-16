import { getApp } from '@react-native-firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from '@react-native-firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { Asset } from '@/types/Asset';

interface FirestoreContextType {
  assets: Asset[];
  loading: boolean;
  createAsset: (assetData: Omit<Asset, 'id'>) => Promise<string>;
  updateAsset: (id: string, assetData: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  getAsset: (id: string) => Promise<Asset | null>;
  subscribeToAsset: (id: string, callback: (asset: Asset | null) => void) => () => void;
}

export const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

interface FirestoreProviderProps {
  children: React.ReactNode;
}

export function FirestoreProvider({ children }: FirestoreProviderProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const app = getApp();
  const firestore = getFirestore(app);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setAssets([]);
      return;
    }

    const assetsCollection = collection(firestore, `users/${currentUser.uid}/assets`);

    const unsubscribe = onSnapshot(
      assetsCollection,
      (snapshot) => {
        const assetsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Asset[];

        setAssets(assetsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching assets:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const createAsset = async (assetData: Omit<Asset, 'id'>): Promise<string> => {
    if (!currentUser) {
      throw new Error('You must be logged in to create assets.');
    }

    const assetsCollection = collection(firestore, `users/${currentUser.uid}/assets`);

    const docRef = await addDoc(assetsCollection, {
      ...assetData,
      createdAt: new Date(),
    });

    return docRef.id;
  };

  const updateAsset = async (id: string, assetData: Partial<Asset>): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to update assets.');
    }

    const docRef = doc(firestore, `users/${currentUser.uid}/assets`, id);

    await updateDoc(docRef, {
      ...assetData,
      updatedAt: new Date(),
    });
  };

  const deleteAsset = async (id: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete assets.');
    }

    const docRef = doc(firestore, `users/${currentUser.uid}/assets`, id);

    await deleteDoc(docRef);
  };

  const getAsset = async (id: string): Promise<Asset | null> => {
    if (!currentUser) {
      throw new Error('You must be logged in to fetch assets.');
    }

    const docRef = doc(firestore, `users/${currentUser.uid}/assets`, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Asset;
    }

    return null;
  };

  const subscribeToAsset = (id: string, callback: (asset: Asset | null) => void): (() => void) => {
    if (!currentUser) {
      callback(null);
      return () => {};
    }

    const docRef = doc(firestore, `users/${currentUser.uid}/assets`, id);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() } as Asset);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to asset:', error);
        callback(null);
      }
    );

    return unsubscribe;
  };

  const value: FirestoreContextType = {
    assets,
    loading,
    createAsset,
    updateAsset,
    deleteAsset,
    getAsset,
    subscribeToAsset,
  };

  return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>;
}

export function useFirestore() {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
}
