"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    isHydrated,
  } = useCart();

  // Safe SSR placeholder until localStorage hydrates
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc]">
        <Suspense fallback={<div className="h-18 bg-[#0b57b8]" />}>
          <Header />
        </Suspense>
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
          Loading your cart...
        </main>
        <Footer />
      </div>
    );
  }

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
          <span className="text-slate-800 font-medium">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your items and proceed to checkout
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-[#0b57b8] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mb-6">
              Looks like you haven&apos;t added any items to your cart yet. Explore our curated selection of products.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b57b8] hover:bg-[#094799] text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
            >
              <ArrowLeft size={16} />
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          /* Cart Content: Items List + Price Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/product/${product.id}`}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100"
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="96px"
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b57b8] bg-blue-50 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                        <span className="text-xs text-slate-400">by {product.brand}</span>
                      </div>
                      <Link
                        href={`/product/${product.id}`}
                        className="text-base font-bold text-slate-900 hover:text-[#0b57b8] transition-colors truncate block"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Unit price: <span className="font-semibold text-slate-700">${product.price}</span>
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-semibold text-slate-800 min-w-[32px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-base font-bold text-slate-900">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Back to Shopping Button */}
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b57b8] hover:underline"
                >
                  <ArrowLeft size={14} />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Summary Column: Price Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Price Summary
                </h2>

                {/* Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-[#0b57b8]">
                      ${(subtotal + tax).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full py-3.5 px-6 bg-[#0b57b8] hover:bg-[#094799] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
