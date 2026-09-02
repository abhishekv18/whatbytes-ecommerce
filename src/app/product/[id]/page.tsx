"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Suspense } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const unwrappedParams = use(params);
  const { addToCart } = useCart();

  const product = PRODUCTS.find((p) => p.id === unwrappedParams.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Suspense fallback={<div className="h-18 bg-[#0b57b8]" />}>
          <Header />
        </Suspense>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md shadow-xs">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h1>
            <p className="text-slate-500 mb-6">
              The product you are looking for does not exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0b57b8] text-white rounded-lg text-sm font-semibold hover:bg-[#094799] transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Product Listing</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Find related products in the same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Suspense fallback={<div className="h-18 bg-[#0b57b8]" />}>
        <Header />
      </Suspense>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0b57b8] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#0b57b8] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs sm:max-w-md">
            {product.title}
          </span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0b57b8] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
        </div>

        {/* Main Product Section: 2 Columns */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Product Gallery / Images (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Image Frame */}
              <div className="relative w-full pt-[85%] sm:pt-[80%] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Image
                  src={galleryImages[activeImageIndex] || product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6 hover:scale-105 transition-transform duration-300 ease-out"
                  priority
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="absolute top-4 left-4 bg-[#0b57b8] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    Save ${(product.originalPrice - product.price).toFixed(0)}
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 bg-slate-50 flex-shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-[#0b57b8] ring-2 ring-[#0b57b8]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} view ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Details (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Brand & Category */}
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0b57b8] bg-blue-50 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                  {product.title}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-100"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {product.rating}
                  </span>
                  <span className="text-sm text-slate-400">•</span>
                  <span className="text-sm text-slate-500">
                    {product.reviewCount} customer reviews
                  </span>
                  <span className="text-sm text-slate-400">•</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    In Stock
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-100">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Description (matches the lorem ipsum / detailed description) */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features Highlights */}
                {product.features && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                      Highlights
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={14} className="text-[#0b57b8] mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
                      <button
                        onClick={handleDecreaseQty}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-2 text-sm font-semibold text-slate-800 min-w-[40px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncreaseQty}
                        className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">
                      Total: ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-6 bg-[#0b57b8] hover:bg-[#094799] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs (Reviews / Specs) */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-6 border-b border-slate-200 pb-3 mb-6">
            <button
              onClick={() => setActiveTab("description")}
              className={`text-sm font-bold pb-2 transition-colors cursor-pointer relative ${
                activeTab === "description"
                  ? "text-[#0b57b8] border-b-2 border-[#0b57b8]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Overview & Specs
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-bold pb-2 transition-colors cursor-pointer relative ${
                activeTab === "reviews"
                  ? "text-[#0b57b8] border-b-2 border-[#0b57b8]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="space-y-6">
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description}
              </p>
              {product.specs && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs"
                      >
                        <span className="font-semibold text-slate-600">{key}</span>
                        <span className="text-slate-800 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                <div className="text-center pr-4 border-r border-slate-200">
                  <div className="text-3xl font-extrabold text-slate-900">{product.rating}</div>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">Based on {product.reviewCount} ratings</span>
                </div>
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">96% of customers recommend this product</p>
                  <p className="text-slate-500 mt-0.5">High quality craftsmanship and fast delivery confirmed by buyers.</p>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">Alex M.</span>
                    <span className="text-[11px] text-slate-400">3 days ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Exceeded my expectations! Build quality is top-notch and exactly as described in the specs.
                  </p>
                </div>
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">Sarah K.</span>
                    <span className="text-[11px] text-slate-400">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Great value for money. Smooth checkout experience and fast shipping.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
              Related Products in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
