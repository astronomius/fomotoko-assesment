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
├── app/
│   ├── Console/Commands/
│   │   └── TestRaceCondition.php   # CLI Concurrency Test Command
│   ├── Http/Controllers/
│   │   └── OrderController.php      # Order Controller with Pessimistic Locking
│   └── Models/
│       ├── Order.php
│       ├── OrderItem.php
│       └── Product.php
├── database/migrations/
│   └── *_create_online_store_tables.php # Migrations
├── routes/
│   └── api.php                      # Order POST Route Definition
├── Dockerfile                       # Docker runner container config
├── docker-compose.yml               # PostgreSQL & App containers config
├── entrypoint.sh                    # Automated migration and test runner script
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
- An application container that automatically wait-connects to PostgreSQL, runs database migrations, and serves the application.

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

## 🛠️ Alternative Setup (Manual Local Setup)

If you prefer to run the project locally outside of Docker (requires PHP 8.2+ and Composer installed on your host machine):

1. **Install Dependencies**:
   ```bash
   composer install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and set up your PostgreSQL database credentials:
   ```bash
   cp .env.example .env
   ```

3. **Generate App Key & Run Migrations**:
   ```bash
   php artisan key:generate
   php artisan migrate
   ```

4. **Start Web Server & Run Concurrency Test**:
   To test concurrent requests, configure multiple CLI server workers when serving the application:
   ```bash
   PHP_CLI_SERVER_WORKERS=50 php artisan serve
   ```
   In a separate terminal window, execute the test:
   ```bash
   php artisan test:race-condition
   ```

---

## 🪵 Git Commit History Strategy (Bonus)

If this were a real Git repository, the progression of changes would be structured as follows:

* `feat: create migration and models for orders and products`
* `feat: implement OrderController with optimistic/pessimistic locking to prevent negative inventory`
* `feat: add api route for creating orders`
* `test: add CLI functional test command to simulate race condition`