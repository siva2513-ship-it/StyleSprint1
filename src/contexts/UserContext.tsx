import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { onAuthStateChanged } from 'firebase/auth';

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  toggleFavoriteStore: (storeId: string) => Promise<void>;
  isFavorite: (storeId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubDoc = onSnapshot(doc(db, 'users', user.uid), async (docSnapshot) => {
          if (docSnapshot.exists()) {
            setProfile({ uid: user.uid, ...docSnapshot.data() } as UserProfile);
          } else {
            const initialProfile = { 
              uid: user.uid, 
              displayName: user.displayName, 
              email: user.email, 
              photoURL: user.photoURL, 
              favoriteStoreIds: [] 
            };
            await setDoc(doc(db, 'users', user.uid), initialProfile);
            setProfile(initialProfile);
          }
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  const toggleFavoriteStore = async (storeId: string) => {
    if (!profile) return;
    const isFav = profile.favoriteStoreIds?.includes(storeId);
    const userRef = doc(db, 'users', profile.uid);

    try {
      await updateDoc(userRef, {
        favoriteStoreIds: isFav ? arrayRemove(storeId) : arrayUnion(storeId)
      });
    } catch (e) {
      console.error("Error toggling favorite:", e);
    }
  };

  const isFavorite = (storeId: string) => {
    return profile?.favoriteStoreIds?.includes(storeId) || false;
  };

  return (
    <UserContext.Provider value={{ profile, loading, toggleFavoriteStore, isFavorite }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
