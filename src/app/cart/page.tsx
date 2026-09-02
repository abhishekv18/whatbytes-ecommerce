"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
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
    shipping,
    tax,
    total,
    isHydrated,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (promoCode.trim().toUpperCase() === "WHATBYTES10") {
      const discount = Math.round(subtotal * 0.1 * 100) / 100;
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promo code. Try WHATBYTES10 for 10% off!");
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode("");
  };

  const finalTotal = Math.max(0, total - promoDiscount);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      clearCart();
    }, 1500);
  };

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

        {/* Checkout Success Screen */}
        {checkoutSuccess ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
            <p className="text-sm text-slate-500 mb-6">
              Thank you for your order! Your order #WB-84920 has been placed successfully. A confirmation email with tracking details has been sent.
            </p>
            <Link
              href="/"
              onClick={() => setCheckoutSuccess(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b57b8] hover:bg-[#094799] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Store</span>
            </Link>
          </div>
        ) : items.length === 0 ? (
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
          /* Cart Content: Items List + Order Summary */
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

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary
                </h2>

                {/* Free Shipping Meter */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {subtotal >= 150 ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                      <CheckCircle2 size={15} />
                      <span>You qualify for <strong>FREE Shipping!</strong></span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-600 mb-1.5">
                        Add <span className="font-bold text-[#0b57b8]">${(150 - subtotal).toFixed(2)}</span> more to unlock <strong>FREE Shipping</strong>
                      </p>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0b57b8] h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-slate-900">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 uppercase text-xs font-bold">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        <span>Discount (10%)</span>
                        <button
                          onClick={handleRemovePromo}
                          className="text-xs text-rose-500 hover:underline ml-1"
                        >
                          (remove)
                        </button>
                      </span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-[#0b57b8]">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="pt-2 border-t border-slate-100">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5 flex items-center gap-1">
                    <Tag size={13} />
                    <span>Have a promo code? (Try: WHATBYTES10)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="WHATBYTES10"
                      disabled={promoApplied}
                      className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b57b8] uppercase disabled:bg-slate-100"
                    />
                    <button
                      type="submit"
                      disabled={promoApplied || !promoCode.trim()}
                      className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-500 mt-1.5">{promoError}</p>
                  )}
                  {promoApplied && (
                    <p className="text-[11px] text-emerald-600 mt-1.5 font-medium">
                      Coupon applied: 10% off your subtotal!
                    </p>
                  )}
                </form>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 px-6 bg-[#0b57b8] hover:bg-[#094799] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isCheckingOut ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-2 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>256-bit SSL encrypted safe checkout</span>
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
