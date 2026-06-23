<?php

namespace App\Jobs;

use App\Models\InventoryLog;
use App\Services\GeminiAIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessSupplyChainOptimization implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(GeminiAIService $aiService): void
    {
        $logs = InventoryLog::orderBy('created_at', 'desc')->take(100)->get()->toArray();
        $result = $aiService->supplyChainOptimization($logs);
        
        if ($result) {
            Log::info('Supply Chain Insights: ' . $result);
        }
    }
}
