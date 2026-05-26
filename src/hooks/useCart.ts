import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'carts', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCart(docSnap.data() as Cart);
      } else {
        setCart({ userId: user.uid, items: [] });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `carts/${user.uid}`);
    });

    return unsubscribe;
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1, maxStock?: number) => {
    if (!user) {
      toast.error('Please sign in to add to cart');
      return;
    }

    try {
      const cartRef = doc(db, 'carts', user.uid);
      const currentItems = cart?.items || [];
      let newItems = [...currentItems];
      const existingItemIndex = newItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        if (maxStock !== undefined && newQuantity > maxStock) {
          toast.error(`Only ${maxStock} items available in stock`);
          return;
        }
        newItems[existingItemIndex].quantity = newQuantity;
      } else {
        if (maxStock !== undefined && quantity > maxStock) {
          toast.error(`Only ${maxStock} items available in stock`);
          return;
        }
        newItems.push({ productId, quantity });
      }

      // Optimistic update
      setCart({ userId: user.uid, items: newItems });

      await setDoc(cartRef, {
        userId: user.uid,
        items: newItems
      });
      
      toast.success('Added to cart');
    } catch (error) {
      // Revert on error
      const cartSnap = await getDoc(doc(db, 'carts', user.uid));
      if (cartSnap.exists()) setCart(cartSnap.data() as Cart);
      handleFirestoreError(error, OperationType.WRITE, `carts/${user.uid}`);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user || !cart) return;

    const previousItems = [...cart.items];
    try {
      const newItems = cart.items.filter(item => item.productId !== productId);
      setCart({ ...cart, items: newItems });
      
      await setDoc(doc(db, 'carts', user.uid), {
        userId: user.uid,
        items: newItems
      });
    } catch (error) {
      setCart({ ...cart, items: previousItems });
      handleFirestoreError(error, OperationType.WRITE, `carts/${user.uid}`);
    }
  };

  const updateQuantity = async (productId: string, quantity: number, maxStock?: number) => {
    if (!user || !cart) return;
    if (maxStock !== undefined && quantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }

    const previousItems = [...cart.items];
    try {
      const newItems = cart.items.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      setCart({ ...cart, items: newItems });

      await setDoc(doc(db, 'carts', user.uid), {
        userId: user.uid,
        items: newItems
      });
    } catch (error) {
      setCart({ ...cart, items: previousItems });
      handleFirestoreError(error, OperationType.WRITE, `carts/${user.uid}`);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'carts', user.uid), {
        userId: user.uid,
        items: []
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `carts/${user.uid}`);
    }
  };

  return { cart, loading, addToCart, removeFromCart, updateQuantity, clearCart };
};
