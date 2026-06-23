## Problem Statement
Beyond knowing *what* to order, store managers struggle with *how* and *when* to manage their supply chain. They may not notice subtle patterns, such as a specific supplier consistently delivering late, or that ordering in larger batches monthly is more efficient than small weekly orders.

## Solution
An AI Supply Chain Optimization module that evaluates patterns in the `inventory_logs` table using Google Gemini. It identifies inefficiencies (like frequent stockouts leading to lost sales, or erratic restocking patterns) and generates natural language actionable alerts on the Admin Dashboard.

## User Stories
1. As an admin, I want to manually trigger the supply chain optimization analysis, so that I can review high-level operational efficiency.
2. As an admin, I want to see natural language alerts regarding my restocking habits, so that I can adjust my purchasing frequency.
3. As an admin, I want the AI to flag irregular inventory logs (e.g., high frequencies of "shrinkage" or "damaged goods"), so that I can investigate operational issues.
4. As an admin, I want to dismiss or resolve these alerts once I have taken action, so that my dashboard remains clean.

## Implementation Decisions
- **Backend Service**: `ProcessSupplyChainOptimization` background job will aggregate `inventory_logs` (focusing on "restock", "damaged", and "sold" events over time).
- **AI Prompting**: Gemini will be prompted to act as a Supply Chain Analyst, returning an array of structured JSON insights containing a `title`, `description`, `severity_level`, and `suggested_action`.
- **Database Schema**: A new `supply_chain_insights` table (or similar) will be needed to store the AI-generated alerts so they can be tracked, displayed, and marked as "resolved" by the Admin.
- **Frontend App**: Displayed as an "Alerts" or "Insights" widget on the main Admin Dashboard, categorized by severity.

## Testing Decisions
- **Test Strategy**: Verify that the prompt aggregation correctly formats the inventory logs. Mock the Gemini API to return a simulated array of insights, and assert that they are properly saved to the database.
- **Modules Tested**: `ProcessSupplyChainOptimization` job, Insight storing logic, and the read/update API endpoints for the dashboard widget.
- **Prior Art**: Use Laravel's `Http::fake()` for the API mock, and standard HTTP tests for the dismissal/resolution endpoints.

## Out of Scope
- Direct communication or emailing to suppliers.
- Multi-node supply chain routing (logistics tracking).
- Only focuses on the data available within the local `inventory_logs` table.

## Further Notes
- Because supply chain optimization is highly dependent on observing long-term trends, the data seeder must ensure it creates identifiable patterns (e.g., a product that is always restocked exactly 2 days after hitting zero stock, causing 2 days of lost sales).
