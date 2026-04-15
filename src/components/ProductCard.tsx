import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col h-full bg-[#161616] border border-[#333333] hover:border-[#F27D26] transition-all duration-300 cursor-pointer group rounded-lg overflow-hidden">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="aspect-square relative mb-4 overflow-hidden bg-[#222222] rounded-md flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 p-4"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <h3 className="text-sm font-medium line-clamp-2 mb-2 text-white group-hover:text-[#F27D26] transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-[#F27D26]">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                className={i < Math.floor(product.rating) ? "" : "text-[#333333]"}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#A0A0A0] font-bold uppercase tracking-tighter">({product.reviewsCount})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline mb-4">
            <span className="text-xl font-bold text-[#F27D26]">${product.price}</span>
          </div>
          
          <Button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs h-9 rounded transition-all"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
