<?php

namespace App\Jobs;

use App\Models\Product;
use App\Services\GeminiAIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessDynamicPricing implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(GeminiAIService $aiService): void
    {
        $products = Product::all();
        foreach ($products as $product) {
            $data = $product->toArray();
            $result = $aiService->optimizePricing($data);
            
            if ($result) {
                $decoded = json_decode($result, true);
                if (isset($decoded['recommended_price'])) {
                    $product->update(['dynamic_price' => $decoded['recommended_price']]);
                }
            }
        }
    }
}
