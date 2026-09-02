"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { PRODUCTS } from "@/data/products";

function ProductCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query parameters directly as single source of truth
  const selectedCategory = searchParams.get("category") || "All";
  const urlPrice = searchParams.get("price");
  const parsedPrice = urlPrice ? Number(urlPrice) : 1000;
  const initialMaxPrice = isNaN(parsedPrice) ? 1000 : parsedPrice;
  const urlSearch = searchParams.get("search") || "";
  const selectedBrand = searchParams.get("brand") || "All";

  // Local state for smooth slider dragging
  const [sliderPrice, setSliderPrice] = useState(initialMaxPrice);
  const [prevInitialMaxPrice, setPrevInitialMaxPrice] = useState(initialMaxPrice);
  if (initialMaxPrice !== prevInitialMaxPrice) {
    setPrevInitialMaxPrice(initialMaxPrice);
    setSliderPrice(initialMaxPrice);
  }

  // Helper to push updated URL params cleanly
  const updateUrlParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (cat: string) => {
    updateUrlParams({ category: cat });
  };

  const handlePriceChange = (price: number) => {
    setSliderPrice(price);
    updateUrlParams({ price: price === 1000 ? null : price });
  };

  const handleBrandChange = (brand: string) => {
    updateUrlParams({ brand: brand === "All" ? null : brand });
  };

  const handleResetFilters = () => {
    setSliderPrice(1000);
    router.push("/", { scroll: false });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category Filter
    if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price Filter
    list = list.filter((p) => p.price <= sliderPrice);

    // Brand Filter
    if (selectedBrand && selectedBrand.toLowerCase() !== "all") {
      list = list.filter(
        (p) => p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Search Query String Matching (searches title, description, and category)
    if (urlSearch.trim()) {
      const q = urlSearch.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, sliderPrice, selectedBrand, urlSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Active Search Term Banner if searched */}
      {urlSearch && (
        <div className="mb-6 p-4 bg-white rounded-xl border border-blue-100 flex items-center justify-between text-sm">
          <p className="text-slate-700">
            Search results for: <span className="font-bold text-[#0b57b8]">&ldquo;{urlSearch}&rdquo;</span>
          </p>
          <button
            onClick={() => updateUrlParams({ search: null })}
            className="text-xs font-semibold text-[#0b57b8] hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Main Layout: Left Sidebar + Right Product Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <Sidebar
          selectedCategory={selectedCategory}
          maxPrice={sliderPrice}
          selectedBrand={selectedBrand}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
          onBrandChange={handleBrandChange}
          onReset={handleResetFilters}
        />

        <ProductGrid
          products={filteredProducts}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Suspense fallback={<div className="h-18 bg-[#0b57b8]" />}>
        <Header />
      </Suspense>

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
              Loading products...
            </div>
          }
        >
          <ProductCatalog />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
