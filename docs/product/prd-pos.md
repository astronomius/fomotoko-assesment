## Problem Statement
Store cashiers need a fast, reliable interface to process customer orders, scan items, and calculate totals in real-time. Currently, there is no digital POS system that integrates seamlessly with the backend inventory and order management system, slowing down checkout times and risking discrepancies in stock levels.

## Solution
A modern, web-based Cashier Point-of-Sale (POS) interface built within the Next.js frontend application. It will allow cashiers to search for products, add them to a digital cart, adjust quantities, and process checkout flows. For the MVP, payments will be recorded as dummy transactions, with the database structured to easily integrate Midtrans in the future. The interface will be strictly online-first to ensure live synchronization with the central inventory and AI pricing engines.

## User Stories
1. As a cashier, I want to search for products by name or SKU, so that I can quickly add items to a customer's order.
2. As a cashier, I want to see the current dynamic price of an item, so that I charge the customer the AI-optimized price.
3. As a cashier, I want to add multiple items to a cart, so that I can process a single transaction for a customer's entire basket.
4. As a cashier, I want to adjust the quantity of an item in the cart, so that I can handle bulk purchases easily.
5. As a cashier, I want to remove items from the cart, so that I can correct mistakes before checkout.
6. As a cashier, I want to see the total order amount automatically calculated, so that I do not have to perform manual calculations.
7. As a cashier, I want to process a dummy payment (cash checkout), so that I can finalize the order in the system.
8. As a cashier, I want the system to automatically deduct the purchased items from the live inventory, so that stock levels remain accurate.

## Implementation Decisions
- **Frontend App**: Built in Next.js using App Router (`/cashier` route), styled with Tailwind CSS and Radix UI primitives. It will support both light and dark mode.
- **Backend API**: Uses the Laravel `OrderController` to handle the `POST /api/orders` endpoint.
- **Database Schema**: The `orders` table includes `payment_gateway_id`, `payment_status`, and `payment_url` columns to prepare for Midtrans without requiring future schema changes.
- **Authentication**: Route restricted to users with the `Cashier` (or Admin) role using Laravel Sanctum.
- **Connectivity**: The application is strictly online-first; no local caching/sync mechanisms are built for offline support.

## Testing Decisions
- **Test Strategy**: Test the external behavior of the cart lifecycle (add, adjust, remove, checkout) and verify correct API payload submission.
- **Modules Tested**: Next.js POS page components, Laravel `OrderController@store` endpoint.
- **Prior Art**: Refer to existing API test structures in Laravel, utilizing Laravel's HTTP testing methods to mock the request and assert database state changes.

## Out of Scope
- Integration with physical barcode scanners via USB/Bluetooth (keyboard emulation only).
- Printing physical receipts.
- Live Midtrans payment processing (Dummy transactions only for MVP).
- Offline capabilities or PWA local storage synchronization.

## Further Notes
- This foundational POS feature must be rock solid before AI features can provide accurate insights, as the POS generates the core historical sales data.
