<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiAIService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY', '');
    }

    public function generateInsights(string $prompt): ?string
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API key is not set.');
            return null;
        }

        $response = Http::post($this->baseUrl . '?key=' . $this->apiKey, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
        }

        Log::error('Gemini API request failed: ' . $response->body());
        return null;
    }
    
    public function optimizePricing(array $productData): ?string
    {
        $prompt = "Analyze the following product data and suggest a dynamic price based on stock levels. Respond ONLY with a JSON object containing the recommended_price.\n\n" . json_encode($productData);
        return $this->generateInsights($prompt);
    }

    public function forecastInventory(array $salesData): ?string
    {
        $prompt = "Analyze the following sales data and forecast the optimal stock level for the next 30 days. Respond ONLY with a JSON object containing the optimal_stock.\n\n" . json_encode($salesData);
        return $this->generateInsights($prompt);
    }

    public function supplyChainOptimization(array $inventoryLogs): ?string
    {
        $prompt = "Analyze the following inventory logs and suggest supply chain optimizations. Respond ONLY with a JSON object containing the insights array.\n\n" . json_encode($inventoryLogs);
        return $this->generateInsights($prompt);
    }
}
