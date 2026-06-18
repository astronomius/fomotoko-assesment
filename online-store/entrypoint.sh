#!/bin/bash
set -e

echo "=== Entrypoint script started ==="

# 1. Initialize Laravel skeleton if not present or incomplete
if [ ! -f "/workspace/laravel-app/composer.json" ]; then
    echo "Installing fresh Laravel 10 skeleton..."
    
    # Disable security advisory blocking in Composer
    composer config -g policy.advisories.block false || true

    MAX_RETRIES=3
    RETRY_COUNT=0
    until [ $RETRY_COUNT -ge $MAX_RETRIES ]
    do
        echo "Running composer create-project (Attempt $((RETRY_COUNT+1))/$MAX_RETRIES)..."
        rm -rf /workspace/laravel-app
        if composer create-project laravel/laravel:^10.0 /workspace/laravel-app --prefer-dist --no-interaction --no-audit; then
            break
        fi
        RETRY_COUNT=$((RETRY_COUNT+1))
        echo "Composer create-project failed. Retrying in 5 seconds..."
        sleep 5
    done

    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "Error: Composer create-project failed after $MAX_RETRIES attempts."
        exit 1
    fi
else
    echo "Laravel skeleton already exists."
fi

# 2. Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL database to start..."
until php -r "new PDO('pgsql:host=db;port=5432;dbname=postgres', 'postgres', 'password');" >/dev/null 2>&1; do
    echo "PostgreSQL is unavailable - sleeping..."
    sleep 1
done
echo "PostgreSQL is up and running!"

# 3. Synchronize project files to Laravel application directory
echo "Syncing online-store files to Laravel structure..."
mkdir -p /workspace/laravel-app/app/Http/Controllers
mkdir -p /workspace/laravel-app/app/Models
mkdir -p /workspace/laravel-app/app/Console/Commands
mkdir -p /workspace/laravel-app/database/migrations

cp /workspace/Http/Controller/OrderController.php /workspace/laravel-app/app/Http/Controllers/OrderController.php
cp /workspace/Http/routes.php /workspace/laravel-app/routes/api.php
cp /workspace/Models/Product.php /workspace/laravel-app/app/Models/Product.php
cp /workspace/Models/Order.php /workspace/laravel-app/app/Models/Order.php
cp /workspace/Models/OrderItem.php /workspace/laravel-app/app/Models/OrderItem.php
cp /workspace/migrations.php /workspace/laravel-app/database/migrations/2026_06_18_000000_create_online_store_tables.php
cp /workspace/race-condition.test.php /workspace/laravel-app/app/Console/Commands/TestRaceCondition.php

# 4. Update .env configuration
echo "Configuring .env file..."
cd /workspace/laravel-app

# Set database connection configuration
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=pgsql/' .env
sed -i 's/DB_HOST=.*/DB_HOST=db/' .env
sed -i 's/DB_PORT=.*/DB_PORT=5432/' .env
sed -i 's/DB_DATABASE=.*/DB_DATABASE=postgres/' .env
sed -i 's/DB_USERNAME=.*/DB_USERNAME=postgres/' .env
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=password/' .env

# 5. Run database migrations
echo "Running migrations..."
php artisan migrate:fresh --force

# 6. Start the local server in the background (with multi-worker concurrency)
echo "Starting Laravel server..."
PHP_CLI_SERVER_WORKERS=50 php artisan serve --host=0.0.0.0 --port=8000 &

# Give the server a few seconds to start up
sleep 3

# 7. Run the race condition functional test
echo "Running the race condition functional test..."
php artisan test:race-condition

# Keep the container running for further inspection or manual runs
echo "=== Setup and test completed. Keeping container alive... ==="
tail -f /dev/null
