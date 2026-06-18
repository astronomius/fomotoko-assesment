#!/bin/bash
set -e

echo "=== Entrypoint script started ==="

# 1. Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL database to start..."
until php -r "new PDO('pgsql:host=db;port=5432;dbname=postgres', 'postgres', 'password');" >/dev/null 2>&1; do
    echo "PostgreSQL is unavailable - sleeping..."
    sleep 1
done
echo "PostgreSQL is up and running!"

# 2. Run database migrations
echo "Running migrations..."
php artisan migrate:fresh --force

# 3. Start the local server in the background (with multi-worker concurrency)
echo "Starting Laravel server..."
PHP_CLI_SERVER_WORKERS=50 php artisan serve --host=0.0.0.0 --port=8000 &

# Give the server a few seconds to start up
sleep 3

# 4. Run the race condition functional test
echo "Running the race condition functional test..."
php artisan test:race-condition

# Keep the container running for further inspection or manual runs
echo "=== Setup and test completed. Keeping container alive... ==="
tail -f /dev/null
