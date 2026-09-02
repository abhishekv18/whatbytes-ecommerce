"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { FeaturedProductCard } from "./FeaturedProductCard";
import { SearchX } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onResetFilters,
}) => {
  return (
    <div className="flex-1">
      {/* Grid Header matching wireframe */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Product Listing
        </h1>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-6">
          <div className="w-16 h-16 bg-blue-50 text-[#0b57b8] rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchX size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">No products found</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5 mb-6">
            We couldn&apos;t find any products matching your current filters or search term.
          </p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-[#0b57b8] hover:bg-[#094799] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        /* Responsive Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) =>
            product.id === "8" && products.length > 1 ? (
              <FeaturedProductCard key={product.id} product={product} />
            ) : (
              <ProductCard key={product.id} product={product} />
            )
          )}
        </div>
      )}
    </div>
  );
};
