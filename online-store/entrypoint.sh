#!/bin/bash
set -e

echo "=== Entrypoint script started ==="

echo "Waiting for PostgreSQL database to start..."
until php -r "new PDO('pgsql:host=db;port=5432;dbname=postgres', 'postgres', 'password');" >/dev/null 2>&1; do
    echo "PostgreSQL is unavailable - sleeping..."
    sleep 1
done
echo "PostgreSQL is up and running!"

echo "Running migrations..."
php artisan migrate:fresh --force

echo "Starting Laravel server..."
PHP_CLI_SERVER_WORKERS=50 php artisan serve --host=0.0.0.0 --port=8000 &

sleep 3

echo "Running the race condition functional test..."
php artisan test:race-condition

echo "=== Setup and test completed. Keeping container alive... ==="
tail -f /dev/null
