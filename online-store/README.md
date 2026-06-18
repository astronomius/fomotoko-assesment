# Task 1: Online Store API

A Laravel-based API solution designed to handle concurrent race conditions during a high-traffic flash sale.

---

## ⚡ Design Decisions & Race Condition Handling

To prevent race conditions where multiple concurrent requests might bypass a simple `if ($inventory > 0)` check (potentially leading to overselling or negative inventory), this solution employs:

1. **Pessimistic Locking (`lockForUpdate()`)**: Wraps product retrieval and update in a Database Transaction. When an order request is processed, the specific product row is locked in the database. Any simultaneous requests attempting to buy the same product are queued and must wait until the current transaction commits or rolls back.
2. **Database-level Failsafe**: The database schema enforces an unsigned integer constraint (`$table->integer('inventory')->unsigned()`) for the product inventory, ensuring the database will reject any updates that would result in a negative stock level.

---

## 📁 File Structure

The project files are organized as follows:

```text
online-store/
├── Http/
│   ├── Controller/
│   │   └── OrderController.php
│   └── routes.php
├── Models/
│   ├── Product.php
│   ├── Order.php (Order Model)
│   └── OrderItem.php
├── migrations.php
├── race-condition.test.php
├── Dockerfile              # Docker recipe for the PHP CLI runner environment
├── docker-compose.yml      # Multi-container orchestration (App & Postgres DB)
├── entrypoint.sh           # Automation script to setup skeleton, sync, migrate, and test
└── README.md
```

---

## ⚙️ Execution & Testing Instructions (Using Docker)

No local PHP or composer dependencies are required. Docker and Docker Compose handle the complete setup.

### 1. Start the Docker Environment
From the `online-store` directory, run:
```bash
docker compose up -d
```
This spins up:
- A PostgreSQL database container.
- An application container that automatically boots up, provisions a clean Laravel 10 skeleton, maps the source files, configurations, migrations, runs them, and hosts the server.

### 2. Run the Concurrency Test
The container automatically runs the test upon initial setup. You can run it manually at any time using:
```bash
docker compose exec app php artisan test:race-condition
```

### 3. Verify Results
The Artisan test command fires **50 concurrent HTTP requests** to buy a product that only has **10 items in stock**. The command outputs:

```text
--- TEST RESULTS ---
Successful Orders (Expected: 10): 10
Failed/Rejected Orders (Expected: 40): 40
Remaining Inventory (Expected: 0): 0
✅ SUCCESS: Race condition was handled correctly. No negative inventory!
```

### 4. Manual API Testing (cURL / Postman)
You can also manually send HTTP requests to test the order endpoint using Postman, Insomnia, or cURL.

**Request:**
- **URL**: `POST http://localhost:8000/api/orders`
- **Headers**: 
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Body** (JSON):
  ```json
  {
    "items": [
      {
        "product_id": 1,
        "quantity": 1
      }
    ]
  }
  ```

**cURL Command Example:**
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "items": [
      {
        "product_id": 1,
        "quantity": 1
      }
    ]
  }'
```

**Success Response (`201 Created`):**
```json
{
  "message": "Order created successfully.",
  "data": {
    "id": 1,
    "total_price": 5000,
    "created_at": "2026-06-18T12:00:00.000000Z",
    "updated_at": "2026-06-18T12:00:00.000000Z",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "quantity": 1,
        "price": "5000.00",
        "created_at": "2026-06-18T12:00:00.000000Z",
        "updated_at": "2026-06-18T12:00:00.000000Z"
      }
    ]
  }
}
```

**Out of Stock Response (`409 Conflict`):**
```json
{
  "error": "Failed to process order.",
  "message": "Insufficient inventory for product: Flash Sale Smartphone. Only 0 left."
}
```

---

## 🛠️ Alternative Setup (Manual Local Integration)

If you prefer to run it outside Docker in your own existing Laravel project:

1. **Copy the Files**:
   - `migrations.php` $\rightarrow$ `database/migrations/<timestamp>_create_online_store_tables.php`
   - `race-condition.test.php` $\rightarrow$ `app/Console/Commands/TestRaceCondition.php`
   - `Http/routes.php` $\rightarrow$ `routes/api.php`
   - `Http/Controller/OrderController.php` $\rightarrow$ `app/Http/Controllers/OrderController.php`
   - `Models/*` $\rightarrow$ `app/Models/`

2. **Configure Database & Web Server**: Ensure your database configuration supports row-level locking (e.g. MySQL/InnoDB, PostgreSQL) and configure `PHP_CLI_SERVER_WORKERS=50` if using the built-in Artisan server to allow concurrent request handling.

3. **Run migrations and trigger test**:
   ```bash
   php artisan migrate
   php artisan serve
   # (In a separate terminal tab)
   php artisan test:race-condition
   ```

---

## 🪵 Git Commit History Strategy (Bonus)

If this were a real Git repository, the progression of changes would be structured as follows:

* `feat: create migration and models for orders and products`
* `feat: implement OrderController with optimistic/pessimistic locking to prevent negative inventory`
* `feat: add api route for creating orders`
* `test: add CLI functional test command to simulate race condition`