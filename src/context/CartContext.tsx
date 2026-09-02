"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useSyncExternalStore } from "react";
import { Product, CartItem } from "@/types/product";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isHydrated: boolean;
  toastMessage: string | null;
  dismissToast: () => void;
}

const STORAGE_KEY = "whatbytes_cart_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage event subscriber for synchronizing across tabs or updates
const listeners = new Set<() => void>();
const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_CART: CartItem[] = [];
let cachedSnapshot: CartItem[] = EMPTY_CART;
let cachedRaw: string | null = null;

function getSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSnapshot = raw ? JSON.parse(raw) : EMPTY_CART;
    }
  } catch {
    cachedSnapshot = EMPTY_CART;
  }
  return cachedSnapshot;
}

const getServerSnapshot = (): CartItem[] => EMPTY_CART;

const noopSubscribe = () => () => {};
const getClientHydrated = () => true;
const getServerHydrated = () => false;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = useSyncExternalStore(noopSubscribe, getClientHydrated, getServerHydrated);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const saveItems = useCallback((newItems: CartItem[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      emitChange();
    } catch (e) {
      console.error("Failed to persist cart to localStorage", e);
    }
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (quantity <= 0) return;
      const current = getSnapshot();
      const existing = current.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...current, { product, quantity }];
      }
      saveItems(updated);
      showToast(`Added "${product.title}" to cart`);
    },
    [saveItems, showToast]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const current = getSnapshot();
      const target = current.find((i) => i.product.id === productId);
      if (target) {
        showToast(`Removed "${target.product.title}" from cart`);
      }
      const updated = current.filter((item) => item.product.id !== productId);
      saveItems(updated);
    },
    [saveItems, showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      const current = getSnapshot();
      const updated = current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveItems(updated);
    },
    [removeFromCart, saveItems]
  );

  const clearCart = useCallback(() => {
    saveItems([]);
    showToast("Cart has been cleared");
  }, [saveItems, showToast]);

  const items = storeItems;

  const totalCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal > 150 ? 0 : 15;
  }, [subtotal]);

  const tax = useMemo(() => {
    return Math.round(subtotal * 0.08 * 100) / 100;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + shipping + tax;
  }, [subtotal, shipping, tax]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        shipping,
        tax,
        total,
        isHydrated,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            onClick={dismissToast}
            className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
