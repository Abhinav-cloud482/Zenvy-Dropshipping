import React from 'react';
import { Link } from 'react-router-dom';
import { useCart as useCartContext } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Separator } from '../components/ui/separator';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCartContext();

  if (items.length === 0) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen p-8 text-white">
        <div className="max-w-7xl mx-auto bg-[#161616] border border-[#333333] p-12 rounded-xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#222222] rounded-full flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-[#A0A0A0]" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-4 uppercase">Your Cart is Empty</h1>
          <p className="text-[#A0A0A0] mb-8 max-w-md">Your dropshipping inventory is currently empty. Start adding high-margin products to your catalog.</p>
          <Link to="/">
            <Button className="bg-[#F27D26] hover:bg-[#d96a1a] text-black font-black uppercase tracking-widest px-12 py-6 rounded-none">
              Explore Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3 bg-[#161616] border border-[#333333] p-8 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black tracking-tighter uppercase">Inventory Cart</h1>
            <span className="text-[#A0A0A0] text-xs font-bold uppercase tracking-widest">{totalItems} Items</span>
          </div>
          
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 pb-8 border-b border-[#333333] last:border-0 last:pb-0">
                <div className="w-32 h-32 md:w-44 md:h-44 flex-shrink-0 bg-[#222222] rounded-lg overflow-hidden p-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-white line-clamp-2 hover:text-[#F27D26] transition-colors cursor-pointer">{item.name}</h3>
                    <span className="text-xl font-black text-[#F27D26]">${item.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Ready for Dispatch</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 mt-auto">
                    <div className="flex items-center bg-[#0A0A0A] border border-[#333333] rounded overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-[#222222] text-[#A0A0A0] hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-1 text-sm font-bold min-w-[40px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-[#222222] text-[#A0A0A0] hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-[#A0A0A0] hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-10 pt-10 border-t border-[#333333]">
            <div className="text-right">
              <span className="text-[#A0A0A0] text-xs font-bold uppercase tracking-widest block mb-1">Subtotal</span>
              <span className="text-3xl font-black text-[#F27D26]">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#161616] border border-[#333333] p-8 rounded-xl">
            <h2 className="text-xl font-black tracking-tighter uppercase mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-[#A0A0A0]">Items ({totalItems})</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#A0A0A0]">Shipping</span>
                <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Free</span>
              </div>
              <div className="h-px bg-[#333333] my-4" />
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-black uppercase tracking-tighter">Total</span>
                <span className="text-2xl font-black text-[#F27D26]">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-black uppercase tracking-widest py-7 rounded-none transition-all shadow-[0_0_20px_rgba(242,125,38,0.2)]">
                Secure Checkout
              </Button>
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[#A0A0A0] font-bold uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-[#F27D26]" />
              Encrypted Transaction
            </div>
          </div>

          <div className="bg-[#161616] border border-[#333333] p-6 rounded-xl">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Recommended Add-ons</h3>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-16 h-16 bg-[#222222] rounded overflow-hidden p-2 flex-shrink-0">
                <img src="https://picsum.photos/seed/suggest1/100/100" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A0A0A0] line-clamp-2 group-hover:text-white transition-colors uppercase">Premium Shipping Insurance</p>
                <p className="text-sm font-black text-[#F27D26] mt-1">$4.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
