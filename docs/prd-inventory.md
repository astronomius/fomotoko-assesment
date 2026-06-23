## Problem Statement
Store managers and admins lack a centralized system to manage product details, track real-time stock levels, and review historical transactions. Without a digital source of truth, it is impossible to leverage AI for pricing or forecasting, and difficult to maintain an accurate catalog.

## Solution
An Inventory and Catalog Management module accessible via the Admin Dashboard (`/admin`). This module will provide interfaces to create, read, update, and delete (CRUD) product information, view current stock levels, and review order histories. It acts as the foundational data source for all AI analysis.

## User Stories
1. As an admin, I want to view a list of all products in the catalog, so that I can see what the store currently offers.
2. As an admin, I want to add a new product with a name, SKU, and base price, so that it can be sold at the POS.
3. As an admin, I want to update existing product details, so that I can correct mistakes or change base pricing.
4. As an admin, I want to view the current stock level of any product, so that I know what is physically available in the store.
5. As an admin, I want the system to automatically generate inventory logs whenever stock changes (via sales or manual updates), so that there is an audit trail of inventory movement.
6. As an admin, I want to view the order history, so that I can audit past transactions and sales volume.

## Implementation Decisions
- **Frontend App**: Managed within the Next.js Admin Dashboard (`/admin/inventory`), styled with Tailwind and Radix UI.
- **Backend API**: Uses Laravel `ProductController` and `OrderController` to serve REST endpoints.
- **Database Schema**: Leverages `products`, `orders`, `order_items`, and `inventory_logs` tables. 
- **Authentication**: Strictly limited to users with the `Admin` role via Laravel Sanctum.
- **Audit Trail**: Every change to `current_stock` must create a corresponding record in the `inventory_logs` table (reason: sale, restock, manual adjustment).

## Testing Decisions
- **Test Strategy**: Ensure product CRUD operations accurately reflect in the database and that stock deductions correctly trigger inventory log generation.
- **Modules Tested**: Laravel `ProductController`, Eloquent model observers/events for `Product` to trigger `InventoryLog` creation.
- **Prior Art**: Standard Laravel model testing using factories and database assertions.

## Out of Scope
- Multi-warehouse tracking (assume a single store location for MVP).
- Automated Purchase Order generation to suppliers.
- Bulk CSV import/export for products (can be added in V2).

## Further Notes
- A Laravel Seeder will be implemented alongside this feature to populate the database with realistic historical data, which is essential for testing the subsequent AI features.
