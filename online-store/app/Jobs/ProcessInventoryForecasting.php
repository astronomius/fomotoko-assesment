<?php

namespace App\Jobs;

use App\Models\Product;
use App\Services\GeminiAIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessInventoryForecasting implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(GeminiAIService $aiService): void
    {
        $products = Product::with('inventoryLogs')->get();
        foreach ($products as $product) {
            $data = [
                'product' => $product->name,
                'current_stock' => $product->current_stock,
                'logs' => $product->inventoryLogs->toArray()
            ];
            
            $result = $aiService->forecastInventory($data);
            
            if ($result) {
                $decoded = json_decode($result, true);
                if (isset($decoded['optimal_stock'])) {
                    $product->update(['optimal_stock' => $decoded['optimal_stock']]);
                }
            }
        }
    }
}
