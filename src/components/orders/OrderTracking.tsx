import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

import { OrderReceiptDialog } from './OrderReceiptDialog';

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  createdAt: any;
}

export const OrderTracking = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return unsubscribe;
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'processing': return <Package className="h-5 w-5" />;
      case 'shipped': return <Truck className="h-5 w-5" />;
      case 'delivered': return <CheckCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'processing': return 'bg-blue-500/10 text-blue-500';
      case 'shipped': return 'bg-purple-500/10 text-purple-500';
      case 'delivered': return 'bg-green-500/10 text-green-500';
      default: return '';
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('tracking.title')}</h2>
      <div className="grid gap-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Order #{order.id.slice(-6).toUpperCase()}
                </CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{t(`tracking.${order.status}`)}</span>
                  </div>
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt?.toDate().toLocaleString()}
                    </p>
                    <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
                    {order.trackingNumber && (
                      <p className="text-xs font-mono bg-muted p-1 rounded inline-block">
                        {t('tracking.trackingNumber')}: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-muted">
                        <img src={item.imageURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <OrderReceiptDialog order={order} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
