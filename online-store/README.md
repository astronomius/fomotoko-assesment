# Task 1: Online Store API

## Running instructions (Using Docker)

### 1. Start Docker Environment
From the `online-store` directory, run:
```bash
docker compose up -d
```

### 2. Run Concurrency Test

```bash
docker compose exec app php artisan test:race-condition
```

### 3. Manual API Testing

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