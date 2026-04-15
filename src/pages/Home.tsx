import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, SiteSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const categoryQuery = searchParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
      
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as SiteSettings);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'settings/global');
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  // Mock data if no products in DB yet
  const baseProducts = products.length > 0 ? products : [
    { id: '1', name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium', price: 999.99, image: 'https://picsum.photos/seed/iphone/400/400', category: 'Electronics', rating: 4.8, reviewsCount: 1250, stock: 10, description: '' },
    { id: '2', name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', price: 348.00, image: 'https://picsum.photos/seed/sony/400/400', category: 'Electronics', rating: 4.7, reviewsCount: 850, stock: 15, description: '' },
    { id: '3', name: 'Kindle Paperwhite (16 GB) - Now with a 6.8" display', price: 139.99, image: 'https://picsum.photos/seed/kindle/400/400', category: 'Electronics', rating: 4.9, reviewsCount: 3200, stock: 20, description: '' },
    { id: '4', name: 'Echo Dot (5th Gen, 2022 release) | Smart speaker with Alexa', price: 49.99, image: 'https://picsum.photos/seed/echo/400/400', category: 'Electronics', rating: 4.6, reviewsCount: 5400, stock: 50, description: '' },
    { id: '5', name: 'Samsung Galaxy S24 Ultra, 256GB, Titanium Gray', price: 1299.99, image: 'https://picsum.photos/seed/samsung/400/400', category: 'Electronics', rating: 4.7, reviewsCount: 420, stock: 8, description: '' },
    { id: '6', name: 'Logitech MX Master 3S Wireless Mouse', price: 99.00, image: 'https://picsum.photos/seed/mouse/400/400', category: 'Electronics', rating: 4.8, reviewsCount: 2100, stock: 30, description: '' },
  ];

  const displayProducts = baseProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryQuery ? p.category === categoryQuery : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#0A0A0A] min-h-screen pb-20 text-white">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent z-10" />
        <div className="absolute inset-0">
          <img 
            src={settings?.heroBanner || "https://picsum.photos/seed/zenvy-hero/1920/800"} 
            className="w-full h-full object-cover opacity-40" 
            alt="Hero Banner"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <span className="text-[#F27D26] text-xs font-black uppercase tracking-[0.2em] mb-4 block">Trending Now</span>
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
              {settings?.siteName.toUpperCase() || 'ZENVY.'} <br /> <span className="text-[#F27D26]">PREMIUM</span>
            </h1>
            <p className="text-[#A0A0A0] text-lg mb-8 leading-relaxed">
              Next-gen accessories curated for high-conversion storefronts. Streamlined global shipping in under 7 days.
            </p>
            <Button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#F27D26] hover:bg-[#d96a1a] text-black font-black uppercase tracking-widest px-8 py-6 rounded-none transition-all"
            >
              Explore Catalog
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-30 grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Electronics', 'Home Decor', 'Fashion', 'Beauty'].map((cat) => (
          <Link 
            to={`/?category=${cat}`}
            key={cat} 
            className="bg-[#161616] border border-[#333333] p-6 rounded-xl hover:border-[#F27D26] transition-all group cursor-pointer"
          >
            <h3 className="text-lg font-bold mb-4 group-hover:text-[#F27D26] transition-colors">{cat}</h3>
            <div className="aspect-square bg-[#222222] mb-4 rounded-lg overflow-hidden">
               <img src={`https://picsum.photos/seed/${cat}/300/300`} alt={cat} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[#F27D26] text-xs font-bold uppercase tracking-widest hover:brightness-110">Shop now</span>
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      <div id="products" className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tighter">
            {searchQuery ? `SEARCH RESULTS FOR "${searchQuery.toUpperCase()}"` : categoryQuery ? `${categoryQuery.toUpperCase()} COLLECTION` : 'BEST SELLERS'}
          </h2>
          <div className="h-px flex-1 bg-[#333333] mx-8" />
          <Link to="/" className="text-[#A0A0A0] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">View All</Link>
        </div>
        
        {displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#A0A0A0] text-lg">No products found matching your criteria.</p>
            <Link to="/" className="text-[#F27D26] mt-4 inline-block hover:underline">Clear all filters</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {displayProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
