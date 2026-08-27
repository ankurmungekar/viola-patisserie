# Viola Patisserie

Premium headless e-commerce storefront for Viola Patisserie — a cake and dessert brand.

## Architecture

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Commerce backend:** WordPress + WooCommerce (Store API)
- **Custom logic:** `wordpress/plugins/viola-commerce`
- **Database:** MySQL (via Docker locally)

```
Customer Browser → Next.js → WooCommerce Store API → WordPress/WooCommerce → MySQL
```

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm

## Quick start

### 1. Start WordPress + MySQL

```bash
docker compose up -d
```

WordPress will be available at [http://localhost:8080](http://localhost:8080).

Complete the WordPress setup wizard, install **WooCommerce**, and activate the **Viola Commerce** plugin.

Seed categories (slugs): `cakes`, `brownies`, `macarons`, `tea-cakes`, `cupcakes`, `bento-cakes`.

Mark 3+ products as **Featured** for the homepage bestsellers section.

### 2. Configure environment

```bash
cp .env.example frontend/.env.local
```

Update values in `frontend/.env.local` if needed.

### 3. Start Next.js

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If WooCommerce is unavailable, the homepage falls back to typed mock data in development.

## Project structure

```
viola-patisserie/
├── frontend/                 # Next.js storefront
├── wordpress/plugins/        # Viola custom WordPress plugin
├── docker-compose.yml        # Local WordPress + MySQL
├── .env.example
└── README.md
```

## Scripts (frontend)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## Deployment notes

- **Frontend:** Deploy `frontend/` to your Node.js host (e.g. Hostinger with Node support or a static/edge host after `next build`)
- **WordPress:** Deploy separately on Hostinger with WooCommerce
- Never expose `WOOCOMMERCE_CONSUMER_SECRET` or `RAZORPAY_KEY_SECRET` to the browser

## Current scope

Implemented storefront features:

- Homepage with hero, signature collections, bestsellers, value props, custom cakes CTA, and our story
- Collections listing with filters, sort, and promo banner
- Product detail page with delivery validation, cake message, and add-to-cart
- About page (CMS-driven via WordPress)
- Cart page with line-item review, quantity updates, and delivery metadata display
- Checkout with billing/contact form and Razorpay payment
- WooCommerce Store API cart session and Viola delivery REST APIs

### WordPress setup for checkout

1. Enable **Razorpay** under WooCommerce → Settings → Payments
2. Add Razorpay credentials to `wp-config.php`:
   ```php
   define('RAZORPAY_KEY_ID', 'your_key_id');
   define('RAZORPAY_KEY_SECRET', 'your_key_secret');
   define('RAZORPAY_WEBHOOK_SECRET', 'your_webhook_secret');
   ```
3. Configure a shipping method (e.g. Flat rate) in WooCommerce shipping zones

### Frontend env for Razorpay.js

Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `frontend/.env.local` (public key only).

Deferred: contact page, custom cakes page, legal/help pages, search, and account.
