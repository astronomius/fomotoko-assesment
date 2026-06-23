#!/bin/bash
set -e

echo "=== Entrypoint script started ==="

echo "Waiting for MySQL database to start..."
until php -r "new PDO('mysql:host=db;port=3306;dbname=retailer_ai', 'mysqluser', 'password');" >/dev/null 2>&1; do
    echo "MySQL is unavailable - sleeping..."
    sleep 1
done
echo "MySQL is up and running!"

echo "Running migrations..."
php artisan migrate --force

echo "Starting Laravel server..."
PHP_CLI_SERVER_WORKERS=50 php artisan serve --host=0.0.0.0 --port=8000 &

echo "=== Setup completed. Keeping container alive... ==="
tail -f /dev/null
