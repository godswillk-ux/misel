import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface GlobalSettings {
  backgroundImageUrl?: string;
  backgroundImageUrlDark?: string;
  backgroundTheme?: 'default' | 'gold';
}

export const useSettings = () => {
  const [settings, setSettings] = useState<GlobalSettings>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as GlobalSettings);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/global');
    });

    return unsubscribe;
  }, []);

  const updateSettings = async (newSettings: Partial<GlobalSettings>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'settings', 'global'), { ...settings, ...newSettings }, { merge: true });
      toast.success('Settings updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    }
  };

  return { settings, loading, updateSettings };
};
