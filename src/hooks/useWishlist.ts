import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Wishlist } from '@/types';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist(null);
      setLoading(false);
      return;
    }

    const wishlistRef = doc(db, 'wishlists', user.uid);

    const unsubscribe = onSnapshot(wishlistRef, (docSnap) => {
      if (docSnap.exists()) {
        setWishlist(docSnap.data() as Wishlist);
      } else {
        setWishlist({ userId: user.uid, productIds: [] });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `wishlists/${user.uid}`);
    });

    return unsubscribe;
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) return;
    const wishlistRef = doc(db, 'wishlists', user.uid);
    
    try {
      const docSnap = await getDoc(wishlistRef);
      if (!docSnap.exists()) {
        await setDoc(wishlistRef, { userId: user.uid, productIds: [productId] });
      } else {
        const productIds = docSnap.data().productIds || [];
        if (productIds.includes(productId)) {
          await updateDoc(wishlistRef, { productIds: arrayRemove(productId) });
        } else {
          await updateDoc(wishlistRef, { productIds: arrayUnion(productId) });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `wishlists/${user.uid}`);
    }
  };

  return { wishlist, toggleWishlist, loading };
};
