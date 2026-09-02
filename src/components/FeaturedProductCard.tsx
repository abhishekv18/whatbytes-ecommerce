"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface FeaturedProductCardProps {
  product: Product;
}

export const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();
  const itemInCart = items.find((i) => i.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden col-span-1 sm:col-span-2 flex flex-col sm:flex-row">
      {/* Product Image Section (Left) */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full sm:w-1/2 min-h-[260px] sm:min-h-[320px] bg-slate-50 flex items-center justify-center p-6 overflow-hidden cursor-pointer"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 bg-[#0b57b8] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Save ${(product.originalPrice - product.price).toFixed(0)}
          </div>
        )}
      </Link>

      {/* Product Details Section (Right) */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#0b57b8] transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 mt-2.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 ml-1.5">
              ({product.reviewCount})
            </span>
          </div>

          {/* Product Overview Description */}
          <p className="text-xs sm:text-sm text-slate-500 mt-4 leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Category */}
          <div className="mt-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Category
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {product.category}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-2">
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 sm:py-3 px-6 rounded-xl bg-[#0b57b8] hover:bg-[#094799] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            {itemInCart ? (
              <>
                <Check size={16} />
                <span>Added to Cart ({itemInCart.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
