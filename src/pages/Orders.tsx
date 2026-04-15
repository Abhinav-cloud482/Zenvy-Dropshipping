import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { Package } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) return <div className="p-8 text-center bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center font-black uppercase tracking-widest">Please login to view your orders.</div>;

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Order History</h1>
          <div className="h-px flex-1 bg-[#333333] mx-8" />
        </div>

        <div className="flex gap-8 border-b border-[#333333] mb-10 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="border-b-2 border-[#F27D26] pb-4 text-[#F27D26] cursor-pointer">All Orders</span>
          <span className="pb-4 text-[#A0A0A0] hover:text-white transition-colors cursor-pointer">Processing</span>
          <span className="pb-4 text-[#A0A0A0] hover:text-white transition-colors cursor-pointer">Dispatched</span>
          <span className="pb-4 text-[#A0A0A0] hover:text-white transition-colors cursor-pointer">Cancelled</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 bg-[#161616] rounded-xl border border-[#333333] border-dashed">
            <Package className="mx-auto text-[#333333] mb-6" size={64} />
            <p className="text-[#A0A0A0] font-bold uppercase tracking-widest text-xs">No orders found in your history.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map(order => (
              <Card key={order.id} className="bg-[#161616] border-[#333333] overflow-hidden shadow-2xl rounded-xl">
                <CardHeader className="bg-[#222222]/50 border-b border-[#333333] py-4 px-8 flex flex-row justify-between items-center">
                  <div className="flex gap-12 text-[10px] text-[#A0A0A0] uppercase font-black tracking-widest">
                    <div>
                      <p className="mb-1">Placed</p>
                      <p className="text-white">{order.createdAt?.toDate().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="mb-1">Total</p>
                      <p className="text-[#F27D26]">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="mb-1">Ship To</p>
                      <p className="text-white hover:text-[#F27D26] transition-colors cursor-pointer">{order.shippingAddress.fullName}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-right">
                    <p className="text-[#A0A0A0] mb-1">ID: {order.id.substring(0, 8)}...</p>
                    <p className="text-[#F27D26] hover:brightness-110 cursor-pointer uppercase font-black tracking-widest">Details</p>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#F27D26]" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Status: {order.status}</h3>
                      </div>
                      
                      {order.items.map(item => (
                        <div key={item.id} className="flex gap-6 group">
                          <div className="w-24 h-24 bg-[#222222] rounded-lg p-3 flex-shrink-0">
                            <img src={item.image} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-[#F27D26] transition-colors cursor-pointer uppercase tracking-tight">{item.name}</p>
                            <p className="text-[10px] text-[#A0A0A0] mt-2 uppercase tracking-widest font-bold">Return window closed</p>
                            <Button variant="outline" size="sm" className="mt-4 h-8 text-[10px] font-black uppercase tracking-widest border-[#333333] hover:bg-[#222222]">Buy Again</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full md:w-56">
                      <Button className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-black uppercase tracking-widest text-[10px] py-6 rounded-none">Track Package</Button>
                      <Button variant="outline" className="w-full border-[#333333] hover:bg-[#222222] text-[10px] font-black uppercase tracking-widest py-6 rounded-none">Support Request</Button>
                      <Button variant="outline" className="w-full border-[#333333] hover:bg-[#222222] text-[10px] font-black uppercase tracking-widest py-6 rounded-none">Invoice</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
