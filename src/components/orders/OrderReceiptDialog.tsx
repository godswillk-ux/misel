import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Receipt, Download } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  trackingNumber?: string;
  createdAt: any;
}

interface OrderReceiptDialogProps {
  order: Order;
}

export const OrderReceiptDialog: React.FC<OrderReceiptDialogProps> = ({ order }) => {
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  
  return (
    <Dialog>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="gap-2">
          <Receipt className="h-4 w-4" />
          View Receipt
        </Button>
      } />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Receipt</span>
            <span className="text-sm font-normal text-muted-foreground mr-4">
              Order #{order.id.slice(-8).toUpperCase()}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 mt-4">
            <div className="flex justify-between text-sm">
              <div>
                <p className="font-semibold">Date</p>
                <p className="text-muted-foreground">
                  {order.createdAt?.toDate().toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Status</p>
                <p className="text-muted-foreground capitalize">{order.status}</p>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-semibold mb-1">Tracking Information</p>
                <p className="font-mono">{order.trackingNumber}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3">Items</h4>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded overflow-hidden bg-muted shrink-0">
                        <img src={item.imageURL} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-medium text-sm">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-end mt-4">
          <Button variant="secondary" className="gap-2" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
