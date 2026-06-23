# AI-Powered Retail Management System - Backend API

This is the headless Laravel 11 API that powers the AI Retail OS. It handles all backend operations, database interactions (MySQL), secure authentication (RBAC), and integrations with Google's Gemini AI to provide dynamic pricing, inventory forecasting, and supply chain insights.

## Prerequisites
- Docker & Docker Compose
- Google Gemini API Key

## Setup & Running (Using Docker)

The backend is fully containerized with Docker, utilizing a PHP/Laravel application container (`online-store-app`) and a MySQL 8.0 database container (`online-store-db`).

### 1. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Edit `.env` to add your `GEMINI_API_KEY`. The database configuration is already set up to communicate within the Docker network (`DB_HOST=db`).

### 2. Start Docker Environment
From the `online-store` directory, simply start the containers. The entrypoint script will automatically wait for the MySQL database, run all migrations, seed the database with demo users/data, and start the Laravel server:
```bash
docker compose up -d
```
The REST API will be exposed and available at `http://localhost:8000`.

### 3. Default Demo Accounts
The database automatically seeds demo accounts for testing Role-Based Access Control (RBAC):
- **Admin User:** `admin@fomotoko.com` / `password` (Has full access to user management and inventory)
- **Cashier User:** `cashier@fomotoko.com` / `password` (Restricted to the POS system)

## Running AI Jobs
The system includes queued background jobs that communicate with Gemini to optimize the store data. You can dispatch these jobs using Laravel's tinker or queue worker:
```bash
# Example: Running the Dynamic Pricing job manually
docker compose exec app php artisan tinker --execute="App\Jobs\ProcessDynamicPricing::dispatchSync();"
```

## Core Features & Architecture
- **Authentication & RBAC**: Managed via `AuthController`, issuing session tokens/cookies for secure frontend communication.
- **User Management**: API endpoints for Admins to create, read, update, and delete employee accounts.
- **Product & Inventory Management**: Fully modeled schema for tracking stock, orders, logs, and products.
- **Gemini AI Service**: The `App\Services\GeminiAIService` handles direct communication with the `gemini-1.5-flash` model.
- **AI Background Jobs**:
  - `ProcessDynamicPricing`: Suggests price updates based on stock levels.
  - `ProcessInventoryForecasting`: Predicts future stock needs.
  - `ProcessSupplyChainOptimization`: Analyzes inventory logs for supply chain insights.