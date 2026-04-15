import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, Menu, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

export const AmazonHeader = () => {
  const { totalItems } = useCart();
  const { user, isAdmin: isFirebaseAdmin } = useAuth();
  const navigate = useNavigate();
  const isLocalStorageAdmin = localStorage.getItem('admin_session') === 'true';
  const isAdmin = isFirebaseAdmin || isLocalStorageAdmin;
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as SiteSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <header className="flex flex-col w-full bg-black text-white sticky top-0 z-50 border-b border-[#333333]">
      {/* Top Bar */}
      <div className="flex items-center h-16 px-6 gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-extrabold tracking-tighter uppercase">
            {settings?.siteName.toUpperCase() || 'ZENVY'}<span className="text-[#F27D26]">.</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
            if (query) navigate(`/?search=${query}`);
          }}
          className="flex flex-1 h-10 rounded bg-[#161616] border border-[#333333] overflow-hidden items-center px-3"
        >
          <Search size={18} className="text-[#A0A0A0] mr-2" />
          <input 
            name="search"
            className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm placeholder:text-[#A0A0A0]" 
            placeholder="Search high-margin products..."
          />
        </form>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link to="/orders" className="flex flex-col cursor-pointer group">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-bold">Returns</span>
            <span className="text-sm font-medium group-hover:text-[#F27D26] transition-colors">& Orders</span>
          </Link>

          <Link to={user ? "/orders" : "/login"} className="flex flex-col cursor-pointer group">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-bold">Hello, {user ? user.displayName?.split(' ')[0] : 'Sign in'}</span>
            <span className="text-sm font-medium group-hover:text-[#F27D26] transition-colors">Account</span>
          </Link>

          <Link to="/cart" className="flex flex-col cursor-pointer group relative">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-bold">Cart</span>
            <div className="flex items-center gap-1">
              <ShoppingCart size={18} className="group-hover:text-[#F27D26] transition-colors" />
              <span className="text-sm font-medium">{totalItems} Items</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Nav Bottom */}
      <div className="flex items-center h-10 bg-[#0A0A0A] px-6 gap-6 text-[11px] font-bold uppercase tracking-widest text-[#A0A0A0] overflow-x-auto whitespace-nowrap scrollbar-hide border-t border-[#333333]/50">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <Menu size={16} />
          All
        </button>
        <Link to="/?category=Electronics" className="hover:text-white transition-colors">Best Sellers</Link>
        <Link to="/?category=Electronics" className="hover:text-white transition-colors">Today's Deals</Link>
        <Link to="/?category=Electronics" className="hover:text-white transition-colors">Electronics</Link>
        <Link to="/" className="hover:text-white transition-colors">Prime</Link>
        
        {isAdmin && (
          <Link to="/admin/dashboard" className="text-[#F27D26] ml-auto hover:brightness-110 transition-all font-black">
            Admin Panel
          </Link>
        )}
      </div>
    </header>
  );
};
