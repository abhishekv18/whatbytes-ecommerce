# Whatbytes E-Commerce - Frontend Assessment

Live Deployment: [https://whatbytes-ecommerces.vercel.app/](https://whatbytes-ecommerces.vercel.app/)

A responsive e-commerce web application built using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, strictly implementing all requirements specified in the Whatbytes frontend assessment.

---

## Implemented Requirements

### 1. Home Page (`/`) – Product Listing
- **Header:**
  - Logo on the left
  - Centered search bar with real-time string matching
  - Cart icon with dynamic item badge counter and user avatar on the right
- **Sidebar (Left):**
  - Category filter (All, Electronics, Clothing, Home)
  - Price range slider ($0 – $1000)
  - Brand filter
  - Reset filters option
- **Product Grid (Right):**
  - Responsive layout: 3 columns on desktop, 2 on tablet, 1 on mobile
  - Product cards including image cover, title, price, quick "Add to Cart" button, and rating stars
  - Conditional empty state rendering when no products match filters
- **Footer:**
  - Navigation links
  - Social media icons
  - Copyright information

### 2. Product Detail Page (`/product/[id]`)
- **Image Section (Left):**
  - Large product image with interactive gallery carousel
- **Details Section (Right):**
  - Product title
  - Price
  - Description
  - Category
  - Quantity selector
  - "Add to Cart" button
  - Reviews section with customer feedback and ratings

### 3. Cart Page (`/cart`) – Bonus Feature
- List of added products with thumbnails and unit prices
- Quantity update controls (+ / -)
- Remove item option
- Price summary with subtotal, estimated tax, and total

### 4. Logic & State Management
- **Filtering Logic:** Real-time filtering by category and price range
- **Search Filtering:** String matching on product titles, categories, and descriptions
- **URL-Based Filters:** Synchronized with Next.js router query parameters (`?category=...&price=...&search=...`)
- **Client-Side State:** Cart state managed via React Context API
- **State Persistence:** Cart state persisted across sessions using browser `localStorage`
- **Dynamic Routing:** Next.js dynamic routes for `/product/[id]`

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React & SVGs
- **Language:** TypeScript

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/abhishekv18/whatbytes-ecommerce.git
cd whatbytes-ecommerce

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Lint

```bash
# Run ESLint
npm run lint

# Build for production
npm run build
```
