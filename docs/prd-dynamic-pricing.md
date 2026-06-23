## Problem Statement
Retailers often struggle to price items optimally. Prices remain static while demand fluctuates, leading to lost revenue on high-demand items or dead stock on low-demand items. Manually analyzing sales velocity to adjust prices is time-consuming and error-prone.

## Solution
An AI-powered Dynamic Pricing module that leverages Google Gemini. The system will analyze current stock, base prices, and historical sales velocity to suggest a `dynamic_price` for products. For safety, these prices remain as suggestions in the Admin Dashboard until explicitly approved by a store manager.

## User Stories
1. As an admin, I want to manually trigger the AI pricing analysis via a button on the dashboard, so that I can control when the system evaluates prices.
2. As an admin, I want to view a list of AI-suggested dynamic prices for products, so that I can see the reasoning behind the suggested price changes.
3. As an admin, I want to approve or reject suggested dynamic prices, so that I maintain ultimate control over the catalog pricing.
4. As an admin, I want approved dynamic prices to immediately reflect on the Cashier POS, so that customers are charged the optimized amount.
5. As a cashier, I want to see the dynamic price override the base price automatically, so that I don't have to manually apply discounts or markups.

## Implementation Decisions
- **Backend Service**: `GeminiAIService` in Laravel communicates with `gemini-1.5-flash` API.
- **Background Job**: `ProcessDynamicPricing` handles the data gathering, sends the prompt to Gemini, and stores the resulting JSON suggestions in the database.
- **Safety Guardrails**: Results from the job are saved in a pending state (e.g., a `PricingSuggestion` model or a `suggested_price` column) rather than immediately updating the `dynamic_price` column on the `Product`.
- **Frontend App**: The Admin Dashboard will have a "Dynamic Pricing Review" queue where admins can bulk approve or reject suggestions.

## Testing Decisions
- **Test Strategy**: Test the manual trigger mechanism, verify the background job successfully queues, and mock the HTTP response from the Gemini API to ensure the payload is parsed and saved as a suggestion correctly.
- **Modules Tested**: `GeminiAIService`, `ProcessDynamicPricing` job, and the Admin approval endpoint.
- **Prior Art**: Use Laravel's `Http::fake()` to mock the Gemini API responses to avoid hitting rate limits or spending credits during automated tests.

## Out of Scope
- Fully automated, zero-touch dynamic pricing (Admin approval is strictly required).
- Minute-by-minute real-time pricing updates (Analysis is triggered manually or via batched background jobs).
- Complex A/B testing of different price points.

## Further Notes
- Prompt engineering for Gemini is critical here. The prompt must strictly enforce returning a JSON payload with the suggested price and a brief, 1-sentence reasoning string for the Admin to review.
