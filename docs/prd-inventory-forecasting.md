## Problem Statement
Store managers frequently run out of popular items or overstock slow-moving items because predicting future sales is difficult. Without data-driven forecasting, purchasing decisions are based on gut feeling, leading to lost sales or tied-up capital.

## Solution
An AI-powered Inventory Forecasting tool that uses Google Gemini to analyze historical sales data and inventory logs. It predicts when items will run out of stock and calculates the `optimal_stock` needed to sustain the store for the next 30 days.

## User Stories
1. As an admin, I want to manually trigger the inventory forecasting analysis, so that I can get updated predictions before placing supplier orders.
2. As an admin, I want to see a list of items that are predicted to run out of stock within the next 7/14/30 days, so that I can prioritize restocking.
3. As an admin, I want to see the AI-calculated `optimal_stock` level for each product, so that I know exactly how many units to order.
4. As an admin, I want the forecasting dashboard to display the AI's reasoning (e.g., "sales increased 20% last week"), so that I can trust the recommendation.

## Implementation Decisions
- **Backend Service**: `GeminiAIService` in Laravel constructs prompts containing time-series data of sales and inventory logs.
- **Background Job**: `ProcessInventoryForecasting` handles data aggregation and interacts with the Gemini API.
- **Data Pipeline**: The job will aggregate `order_items` data by day/week to reduce the token count sent to Gemini, rather than sending every raw transaction.
- **Frontend App**: The Admin Dashboard will feature an "Inventory Forecast" section highlighting critical low-stock predictions and optimal stock targets.

## Testing Decisions
- **Test Strategy**: Mock the Gemini API to return structured JSON containing `optimal_stock` and `run_out_date` predictions. Verify the background job correctly updates the `Product` models with these values.
- **Modules Tested**: Data aggregation logic within `ProcessInventoryForecasting`, and the API endpoint serving the forecast data to the Next.js frontend.
- **Prior Art**: Leverage Laravel's `Http::fake()` for Gemini, and standard PHPUnit tests for the data aggregation methods to ensure accurate time-series generation.

## Out of Scope
- Automated purchasing or integration with external supplier APIs.
- Seasonal forecasting that requires external data (e.g., weather patterns, holidays not present in the historical dataset).
- Real-time minute-by-minute forecasting.

## Further Notes
- The accuracy of this feature heavily depends on the quality of the seed data. The Laravel Seeder must generate realistic trends (e.g., weekend spikes) to properly demonstrate the AI's forecasting capabilities.
