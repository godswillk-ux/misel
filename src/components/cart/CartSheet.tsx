import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, PackageOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const CartSheet = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { products } = useProducts();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  
  // Checkout form state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number } | null>(null);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const cartItems = cart?.items.map(item => {
    const product = products?.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product) || [];

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const taxRate = 0.08;
  const tax = (subtotal - discount) * taxRate;
  const totalPrice = subtotal - discount + tax;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'MISEL10') {
      setAppliedPromo({ code: 'MISEL10', discount: 0.1 });
      toast.success('Promo code applied! 10% discount added.');
      setPromoCode('');
    } else if (promoCode) {
      toast.error('Invalid promo code');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cartItems.length === 0) return;

    try {
      const orderItems = cartItems.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));

      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: orderItems,
        total: totalPrice,
        discount,
        promoCode: appliedPromo?.code || null,
        status: 'pending',
        shippingDetails,
        trackingNumber: 'NX' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        createdAt: serverTimestamp(),
      });
      
      await clearCart();
      setIsOpen(false);
      setIsCheckoutMode(false);
      setShippingDetails({ fullName: '', address: '', city: '', zipCode: '' });
      setAppliedPromo(null);
      toast.success('Order placed successfully! Track it in your dashboard.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
    }
  };

  // Reset checkout mode when sheet closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setIsCheckoutMode(false), 300);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative h-10 w-10 rounded-full border bg-background/50 backdrop-blur-sm shadow-sm")}>
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-gold text-gold-foreground font-black animate-in fade-in zoom-in">
            {totalItems}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg overflow-hidden border-l border-gold/10">
        <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b border-gold/5">
          <div className="flex items-center gap-2">
            {isCheckoutMode && (
              <Button variant="ghost" size="icon" onClick={() => setIsCheckoutMode(false)} className="h-8 w-8 -ml-2 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <SheetTitle className="text-2xl font-black italic uppercase tracking-tighter">
              {isCheckoutMode ? 'Checkout' : `Bag (${totalItems})`}
            </SheetTitle>
          </div>
          {!isCheckoutMode && cartItems.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive h-8 px-2 font-bold uppercase text-[10px] tracking-widest transition-all">
              Clear Bag
            </Button>
          )}
        </SheetHeader>
        
        <ScrollArea className="flex-grow mt-2 -mx-6 px-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20">
                  <PackageOpen className="h-12 w-12 text-gold animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black italic uppercase tracking-tighter">Your bag is empty</p>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">Looks like you haven't added any elegant pieces to your collection yet.</p>
              </div>
              <Button size="lg" className="rounded-full bg-gold text-gold-foreground font-black uppercase italic tracking-tighter" onClick={() => setIsOpen(false)}>
                Go Shopping
              </Button>
            </div>
          ) : isCheckoutMode ? (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold text-gold-foreground text-[10px] font-black flex items-center justify-center">1</div>
                  <h3 className="font-black italic uppercase tracking-tight">Shipping Information</h3>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                    <Input 
                      id="fullName" 
                      required 
                      className="rounded-xl border-border/50 focus:border-gold/50"
                      value={shippingDetails.fullName}
                      onChange={e => setShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Street Address</Label>
                    <Input 
                      id="address" 
                      required 
                      className="rounded-xl border-border/50 focus:border-gold/50"
                      value={shippingDetails.address}
                      onChange={e => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">City</Label>
                      <Input 
                        id="city" 
                        required 
                        className="rounded-xl border-border/50 focus:border-gold/50"
                        value={shippingDetails.city}
                        onChange={e => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ZIP Code</Label>
                      <Input 
                        id="zipCode" 
                        required 
                        className="rounded-xl border-border/50 focus:border-gold/50"
                        value={shippingDetails.zipCode}
                        onChange={e => setShippingDetails(prev => ({ ...prev, zipCode: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-gold/5" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold text-gold-foreground text-[10px] font-black flex items-center justify-center">2</div>
                  <h3 className="font-black italic uppercase tracking-tight">Order Summary</h3>
                </div>
                <div className="space-y-2 text-sm bg-muted/30 p-4 rounded-2xl border border-gold/5">
                  {cartItems.map(item => (
                    <div key={item.productId} className="flex justify-between items-center text-muted-foreground py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-gold/10 text-gold text-[10px] font-black flex items-center justify-center">{item.quantity}</span>
                        <span className="line-clamp-1 pr-4">{item.product!.name}</span>
                      </div>
                      <span className="font-mono text-xs">${(item.product!.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator className="my-3 bg-gold/5" />
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span className="font-mono text-xs">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-500 font-bold italic uppercase text-[10px] tracking-widest">
                      <span>Discount ({appliedPromo.code})</span>
                      <span className="font-mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Tax (8%)</span>
                    <span className="font-mono text-xs">${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-3 bg-gold/5" />
                  <div className="flex justify-between font-black text-foreground text-lg uppercase italic tracking-tighter">
                    <span>Total</span>
                    <span className="font-mono">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6 pt-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.productId} 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 group p-2 rounded-2xl hover:bg-gold/5 transition-colors"
                  >
                    <div className="h-24 w-24 rounded-xl overflow-hidden shrink-0 bg-muted shadow-sm border border-gold/10 relative">
                      <img 
                        src={item.product!.imageURL} 
                        alt={item.product!.name} 
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col flex-grow justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold italic uppercase tracking-tight text-sm line-clamp-1">{item.product!.name}</h4>
                          <p className="text-xs font-mono text-muted-foreground">${item.product!.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 shrink-0 rounded-full"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input 
                          type="number"
                          className="h-7 w-12 text-center text-sm p-0 border-none bg-accent/50 rounded-md font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val > 0) {
                              updateQuantity(item.productId, Math.min(val, item.product!.stock), item.product!.stock);
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                              updateQuantity(item.productId, 1);
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 shrink-0 rounded-full"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.product!.stock)}
                          disabled={item.quantity >= item.product!.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {item.product!.stock <= 5 && (
                          <span className="text-[10px] font-bold text-destructive uppercase tracking-tighter">
                            Only {item.product!.stock} left
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <SheetFooter className="mt-6 flex-col sm:flex-col gap-4 border-t border-gold/5 pt-6">
            {!isCheckoutMode ? (
              <>
                <div className="flex gap-2 w-full mb-2">
                  <Input 
                    placeholder="Promo Code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-10 rounded-full border-gold/10 focus:border-gold/30 bg-gold/5 uppercase font-bold tracking-widest text-[10px]"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleApplyPromo}
                    className="h-10 px-6 rounded-full border-gold/20 font-black uppercase italic tracking-tighter hover:bg-gold hover:text-gold-foreground transition-all"
                  >
                    Apply
                  </Button>
                </div>
                <div className="space-y-2 w-full text-sm bg-gold/5 p-4 rounded-3xl border border-gold/10">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span className="font-mono text-xs">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-500 font-bold italic uppercase text-[10px] tracking-widest">
                      <span>Discount ({appliedPromo.code})</span>
                      <span className="font-mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Tax (8%)</span>
                    <span className="font-mono text-xs">${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-3 bg-gold/10" />
                  <div className="flex justify-between font-black text-xl uppercase italic tracking-tighter">
                    <span>Total</span>
                    <span className="font-mono text-gold">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full h-14 rounded-full bg-gold text-gold-foreground font-black uppercase italic tracking-tighter text-lg shadow-lg hover:shadow-gold/20 hover:scale-[1.02] transition-all" onClick={() => setIsCheckoutMode(true)}>
                  Proceed to Checkout
                </Button>
              </>
            ) : (
              <Button type="submit" form="checkout-form" className="w-full h-14 rounded-full bg-gold text-gold-foreground font-black uppercase italic tracking-tighter text-lg shadow-lg hover:shadow-gold/20 hover:scale-[1.02] transition-all">
                Place Order (${totalPrice.toFixed(2)})
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
