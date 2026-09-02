"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();

  const itemInCart = items.find((i) => i.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link
        href={`/product/${product.id}`}
        className="relative block w-full pt-[85%] bg-slate-50 overflow-hidden cursor-pointer"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
          priority={Number(product.id) <= 3}
        />
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 bg-[#0b57b8] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Save ${(product.originalPrice - product.price).toFixed(0)}
          </div>
        )}
      </Link>

      {/* Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 fill-slate-100"
                  }
                />
              ))}
            </div>
            <span className="text-[12px] font-medium text-slate-400 ml-1">
              ({product.reviewCount})
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#0b57b8] transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add to Cart Button */}
        <div className="mt-4 pt-1">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              itemInCart
                ? "bg-[#0b57b8] text-white hover:bg-[#094799] shadow-xs active:scale-[0.98]"
                : "bg-[#0b57b8] text-white hover:bg-[#094799] shadow-xs active:scale-[0.98]"
            }`}
          >
            {itemInCart ? (
              <>
                <Check size={16} />
                <span>Add More ({itemInCart.quantity})</span>
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
