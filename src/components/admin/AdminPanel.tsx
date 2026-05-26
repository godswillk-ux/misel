import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { doc, deleteDoc, collection, query, onSnapshot, orderBy, updateDoc, getDocs } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/lib/firebase';
import { Product, UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductForm } from './ProductForm';
import { Plus, Pencil, Trash2, Package, ShoppingCart, Users, BarChart3, Ban, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AdminPanel = () => {
  const { products, loading: productsLoading } = useProducts();
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setOrdersLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile)));
      setUsersLoading(false);
    });
    return unsubscribe;
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyOrders = orders.filter(order => {
      const date = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const yearlyOrders = orders.filter(order => {
      const date = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return date.getFullYear() === currentYear;
    });

    const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + (order.total || 0), 0);
    const yearlyRevenue = yearlyOrders.reduce((acc, order) => acc + (order.total || 0), 0);

    return {
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue,
      monthlyAverage: monthlyOrders.length > 0 ? monthlyRevenue / monthlyOrders.length : 0,
      yearlyAverage: yearlyOrders.length > 0 ? yearlyRevenue / yearlyOrders.length : 0,
    };
  }, [orders]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      toast.success('Order status updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const toggleUserSuspension = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { suspended: !currentStatus });
      toast.success(currentStatus ? 'User unsuspended' : 'User suspended');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!products || products.length === 0) return;
    if (!confirm(`WARNING: This will delete ALL ${products.length} products. This action cannot be undone. Are you sure?`)) return;
    
    toast.loading('Resetting store inventory...');
    try {
      const deletePromises = products.map(p => deleteDoc(doc(db, 'products', p.id)));
      await Promise.all(deletePromises);
      toast.dismiss();
      toast.success('Gallery cleared. Studio is ready for new aesthetic pieces!');
    } catch (error) {
      toast.dismiss();
      handleFirestoreError(error, OperationType.DELETE, `products/bulk`);
    }
  };

  if (productsLoading || ordersLoading || usersLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your store inventory, orders, and users.</p>
      </div>

      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Stats
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingCart className="h-4 w-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Avg: ${stats.monthlyAverage.toFixed(2)} / order</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Yearly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.yearlyRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Avg: ${stats.yearlyAverage.toFixed(2)} / order</p>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <h3 className="font-bold mb-4">Revenue History (Recent Orders)</h3>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                    <p className="text-[10px] uppercase text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 mt-6">
          <div className="flex justify-between items-center bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <div>
              <h3 className="font-bold text-destructive">Danger Zone</h3>
              <p className="text-xs text-muted-foreground">Reset current inventory to 0 for the new aesthetic studio launch.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Clear All Products
            </Button>
          </div>

          <div className="flex justify-end">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={<Button className="gap-2" />}>
                <Plus className="h-4 w-4" /> Add Product
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm onSuccess={() => setIsAddOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                          <DialogTrigger render={<Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)} />}>
                            <Pencil className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            <ProductForm product={product} onSuccess={() => setEditingProduct(null)} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs uppercase">{order.id.slice(-8)}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(val) => updateOrderStatus(order.id, val)}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.uid}>
                    <TableCell className="flex items-center gap-2">
                      <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                      <span className="font-medium">{u.displayName}</span>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell>
                      {u.suspended ? (
                        <Badge variant="destructive" className="gap-1">
                          <Ban className="h-3 w-3" /> Suspended
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {(u.email !== 'godswillk116@gmail.com' && u.email !== 'uokide@yahoo.com') && (
                        <Button 
                          variant={u.suspended ? "secondary" : "destructive"} 
                          size="sm"
                          onClick={() => toggleUserSuspension(u.uid, !!u.suspended)}
                        >
                          {u.suspended ? 'Unsuspend' : 'Suspend'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
