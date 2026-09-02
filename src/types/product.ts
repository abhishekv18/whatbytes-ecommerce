export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: "Electronics" | "Clothing" | "Home" | string;
  brand: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
  features?: string[];
  specs?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = "All" | "Electronics" | "Clothing" | "Home";

export interface FilterState {
  category: Category;
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  brand?: string;
  sortBy?: "featured" | "price-asc" | "price-desc" | "rating";
}
