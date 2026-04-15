import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'India'
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items,
        totalAmount: totalPrice,
        status: 'pending',
        shippingAddress: address,
        createdAt: serverTimestamp()
      });
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      {/* Simple Checkout Header */}
      <header className="bg-black border-b border-[#333333] p-4 flex justify-between items-center px-8 sticky top-0 z-50">
        <Link to="/">
          <span className="text-xl font-black tracking-tighter uppercase">ZENVY<span className="text-[#F27D26]">.</span></span>
        </Link>
        <h1 className="text-lg font-black uppercase tracking-widest">Secure Checkout</h1>
        <Lock className="text-[#F27D26]" size={18} />
      </header>

      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#F27D26] text-black flex items-center justify-center font-black">1</span>
              <h2 className="text-xl font-black uppercase tracking-tight">Shipping Details</h2>
            </div>
            <Card className="bg-[#161616] border-[#333333] shadow-xl">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Full Name</label>
                    <Input 
                      className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                      value={address.fullName} 
                      onChange={e => setAddress({...address, fullName: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Delivery Address</label>
                    <Input 
                      className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                      value={address.address} 
                      onChange={e => setAddress({...address, address: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">City</label>
                      <Input 
                        className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                        value={address.city} 
                        onChange={e => setAddress({...address, city: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Postal Code</label>
                      <Input 
                        className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]"
                        value={address.zipCode} 
                        onChange={e => setAddress({...address, zipCode: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#222222] text-[#A0A0A0] flex items-center justify-center font-black border border-[#333333]">2</span>
              <h2 className="text-xl font-black uppercase tracking-tight">Payment Method</h2>
            </div>
            <Card className="bg-[#161616] border-[#333333]">
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#222222] rounded flex items-center justify-center">
                    <span className="text-[#F27D26] font-black">$</span>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-widest text-xs">Cash on Delivery (COD)</p>
                    <p className="text-[10px] text-[#A0A0A0] uppercase tracking-widest mt-1">Standard for dropshipping logistics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#222222] text-[#A0A0A0] flex items-center justify-center font-black border border-[#333333]">3</span>
              <h2 className="text-xl font-black uppercase tracking-tight">Review Items</h2>
            </div>
            <Card className="bg-[#161616] border-[#333333]">
              <CardContent className="p-8 space-y-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-6 pb-6 border-b border-[#333333] last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-[#222222] rounded p-2 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold uppercase tracking-tight line-clamp-1">{item.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-black text-[#F27D26]">${item.price}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#A0A0A0]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 bg-[#161616] border-[#333333] shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-tighter">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A0A0A0]">Subtotal</span>
                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0A0A0]">Shipping</span>
                    <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Free</span>
                  </div>
                  <div className="h-px bg-[#333333] my-4" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-black uppercase tracking-tighter">Total</span>
                    <span className="text-2xl font-black text-[#F27D26]">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handlePlaceOrder}
                className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-black uppercase tracking-widest py-8 rounded-none transition-all shadow-[0_0_20px_rgba(242,125,38,0.2)]"
              >
                Place Order
              </Button>
              <p className="text-[9px] text-center text-[#A0A0A0] uppercase font-bold tracking-widest leading-relaxed">
                By placing your order, you agree to our terms of service and high-margin dropshipping policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
