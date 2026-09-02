"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ShoppingCart, Search, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalCount, isHydrated } = useCart();

  const urlQuery = searchParams.get("search") || "";
  const [prevQuery, setPrevQuery] = useState(urlQuery);
  const [searchVal, setSearchVal] = useState(urlQuery);

  if (urlQuery !== prevQuery) {
    setPrevQuery(urlQuery);
    setSearchVal(urlQuery);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("search", searchVal.trim());
    } else {
      params.delete("search");
    }

    if (pathname === "/") {
      router.push(`/?${params.toString()}`);
    } else {
      router.push(`/?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(pathname === "/" ? `/?${params.toString()}` : "/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b57b8] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white hover:opacity-95 transition-opacity flex items-center gap-2"
            >
              Logo
            </Link>
          </div>

          {/* Search Bar (Center) */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-9 py-2 rounded-md bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 shadow-inner"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Section: Cart and User Profile */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors relative"
            >
              <div className="relative flex items-center">
                <ShoppingCart size={20} />
                {isHydrated && totalCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[11px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center shadow-sm">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">Cart</span>
            </Link>

            <button
              type="button"
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white focus:outline-none"
              aria-label="User profile"
              title="Account"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                <User size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
