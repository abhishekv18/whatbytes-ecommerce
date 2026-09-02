"use client";

import React from "react";
import { RotateCcw, Filter } from "lucide-react";
import { CATEGORIES, BRANDS } from "@/data/products";

interface SidebarProps {
  selectedCategory: string;
  maxPrice: number;
  selectedBrand?: string;
  onCategoryChange: (category: string) => void;
  onPriceChange: (price: number) => void;
  onBrandChange: (brand: string) => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  maxPrice,
  selectedBrand,
  onCategoryChange,
  onPriceChange,
  onBrandChange,
  onReset,
}) => {
  return (
    <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
      {/* Main Category & Price Filter Card */}
      <div className="bg-[#0f56af] text-white rounded-2xl p-5 shadow-sm">
        {/* Title */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold tracking-wide">Filters</h2>
          <button
            onClick={onReset}
            className="text-xs text-white/80 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        {/* Category Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 tracking-wide">Category</h3>
          <div className="space-y-2.5">
            {CATEGORIES.map((cat) => {
              const isChecked = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <label
                  key={cat}
                  className="flex items-center gap-2.5 cursor-pointer text-sm hover:text-white/90 group select-none"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="primary-category"
                      value={cat}
                      checked={isChecked}
                      onChange={() => onCategoryChange(cat)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "border-white bg-white"
                          : "border-white/60 bg-transparent group-hover:border-white"
                      }`}
                    >
                      {isChecked && <div className="w-2 h-2 rounded-full bg-[#0f56af]"></div>}
                    </div>
                  </div>
                  <span className={`${isChecked ? "font-medium text-white" : "text-white/90"}`}>
                    {cat}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Slider Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold tracking-wide">Price</h3>
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded text-white">
              Up to ${maxPrice}
            </span>
          </div>

          <div className="pt-1">
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="custom-slider"
              aria-label="Filter products by maximum price"
            />
            <div className="flex items-center justify-between text-xs text-white/80 font-medium mt-2">
              <span>0</span>
              <span>1000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Brand & Price Range Filter */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 tracking-wide flex items-center gap-1.5">
            <Filter size={14} className="text-[#0b57b8]" />
            <span>Brand</span>
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 hover:text-slate-900 group">
              <input
                type="radio"
                name="brand-filter"
                checked={!selectedBrand || selectedBrand === "All"}
                onChange={() => onBrandChange("All")}
                className="accent-[#0b57b8] cursor-pointer"
              />
              <span>All Brands</span>
            </label>
            {BRANDS.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 hover:text-slate-900 group"
              >
                <input
                  type="radio"
                  name="brand-filter"
                  checked={selectedBrand === b}
                  onChange={() => onBrandChange(b)}
                  className="accent-[#0b57b8] cursor-pointer"
                />
                <span className={selectedBrand === b ? "font-semibold text-slate-900" : ""}>
                  {b}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Max Price Input ($)
          </label>
          <input
            type="number"
            min={0}
            max={1000}
            value={maxPrice}
            onChange={(e) => onPriceChange(Math.min(1000, Math.max(0, Number(e.target.value) || 0)))}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0b57b8]"
            placeholder="5000"
          />
        </div>
      </div>
    </aside>
  );
};
