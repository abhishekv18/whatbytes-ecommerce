# Whatbytes Store - Modern E-Commerce Application

A responsive e-commerce web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Features real-time URL search and category filtering, dynamic product routing, and persistent client-side cart management.

---

## Features

- **Product Catalog & Search:** Real-time product search with string matching and debounced input.
- **Multilevel Filters:** Category selection, interactive price range slider ($0 - $1000), brand filtering, and one-click filter reset.
- **URL Query Synchronization:** Filter and search state are synchronized bidirectionally with URL search parameters (`?category=...&price=...&search=...`), enabling shareable and bookmarkable filtered views.
- **Dynamic Routing:** Individual product pages (`/product/[id]`) with multi-angle image gallery, detailed specifications, stock status, and customer reviews.
- **Client-Side Cart Management:**
  - Built with React Context and `useSyncExternalStore` for flicker-free browser `localStorage` persistence.
  - Live quantity adjustment, item removal, and subtotal calculation.
  - Visual free shipping progress threshold meter ($150).
  - Promo code discount system (`WHATBYTES10`).
- **Responsive Layout:** Mobile-first design adapting from 1 column on mobile to 2 columns on tablet and 3 columns on desktop.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React & Optimized SVGs
- **State Management:** React Context API + `useSyncExternalStore`

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm 9+

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/abhishekv18/whatbytes-ecommerce.git
cd whatbytes-ecommerce

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Type-check and lint
npm run lint

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## Deployment

This application is ready for deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. The framework preset will automatically detect Next.js with zero configuration needed.
4. Click **Deploy**.
