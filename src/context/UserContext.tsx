import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'customer';
  suspended?: boolean;
  createdAt: any;
}

interface UserContextType {
  profile: UserProfile | null;
  loading: boolean;
  isSuspended: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    // Check if user exists, if not create
    const checkUser = async () => {
      try {
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            role: (user.email === 'godswillk116@gmail.com' || user.email === 'uokide@yahoo.com') ? 'admin' : 'customer',
            suspended: false,
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, newProfile);
        } else {
          // If user exists but is the owner and somehow not an admin, upgrade them
          const data = docSnap.data() as UserProfile;
          if ((user.email === 'godswillk116@gmail.com' || user.email === 'uokide@yahoo.com') && data.role !== 'admin') {
            await updateDoc(userRef, { role: 'admin' });
          }
        }
      } catch (error: any) {
        toast.error(`User profile check failed: ${error.message || 'Unknown error'}`);
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    };

    checkUser();

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        setProfile(data);
      }
      setLoading(false);
    }, (error) => {
      toast.error(`Failed to sync user profile: ${error.message}`);
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return unsubscribe;
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      toast.success('Profile updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const isSuspended = !!profile?.suspended;

  return (
    <UserContext.Provider value={{ profile, loading, isSuspended, updateProfile }}>
      {isSuspended ? (
        <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-black text-destructive uppercase italic tracking-tighter">MISEL: ACCESS DENIED</h1>
            <p className="text-muted-foreground">Your account has been suspended by the administrator. Please contact support if you believe this is a mistake.</p>
            <button 
              onClick={() => logout()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
