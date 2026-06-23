# AI-Powered Retail Management System - Frontend

This is the Next.js frontend application for the AI Retail OS. It provides beautiful, responsive, and role-based user interfaces for the Point-of-Sale (POS) and the Admin Dashboard. Built with React 19, Next.js 16, Tailwind CSS v4, and Radix UI.

## Features

- **Role-Based Access Control (RBAC)**: Secure authentication flow powered by Next.js edge proxies that redirects users based on their roles (`admin` vs `cashier`).
- **Cashier POS (`/cashier`)**: A fast, efficient point-of-sale interface for processing transactions, searching products, and adding items to the cart.
- **Admin Dashboard (`/admin`)**: A centralized view for store managers featuring:
  - **Inventory & Catalog Management**: Full CRUD operations to manage store items and monitor stock.
  - **User Management**: Create and manage store employees (Admins and Cashiers).
  - AI-generated insights from Google Gemini (Dynamic Pricing, Forecasting, Alerts).
- **Modern UI/UX**: Fully responsive layouts, sleek design, and global Dark/Light mode toggles using `next-themes` and Lucide icons.
- **Radix UI Primitives**: Accessible and headless components (like the global layout Sidebar and Modals) for a premium feel.

## Prerequisites
- [Bun](https://bun.sh/) (JavaScript runtime and package manager)
- The Laravel backend API must be running locally via Docker.

## Setup & Running

1. Install the dependencies:
```bash
bun install
```

2. Run the development server:
```bash
bun run dev
```

3. Open your browser:
Navigate to [http://localhost:3000](http://localhost:3000) to view the landing page.

### Demo Accounts
You can log into the system at `/authentication/login` using the demo accounts seeded by the backend:
- **Admin**: `admin@fomotoko.com` / `password`
- **Cashier**: `cashier@fomotoko.com` / `password`

## API Proxying
The frontend is configured in `next.config.ts` to automatically proxy requests from `/api/*` to the local backend running at `http://localhost:8000/api/*`. This resolves CORS issues natively and ensures smooth communication with Laravel.

## Tech Stack
- Next.js 16.2.9 (App Router)
- React 19
- Tailwind CSS v4
- Radix UI (Accessible components)
- Lucide React (Icons)
- next-themes
