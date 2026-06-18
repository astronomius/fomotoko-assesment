<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Pool;

class TestRaceCondition extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:race-condition';

    /**
     * The console command description.
     */
    protected $description = 'Tests the API\'s ability to handle race conditions by sending concurrent requests.';

    public function handle()
    {
        $this->info('Setting up database for test...');
        
        // Clean up and setup a dummy flash sale product
        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();
        DB::table('products')->truncate();
        
        // We set inventory strictly to 10
        $product = Product::create([
            'name' => 'Flash Sale Smartphone',
            'inventory' => 10,
            'price' => 5000.00
        ]);

        $this->info("Product '{$product->name}' created with Inventory: {$product->inventory}");
        $this->info('Firing 50 concurrent requests to buy 1 item each...');

        // IMPORTANT: Assuming the app is running on default local port 8000
        $apiUrl = url('http://127.0.0.1:8000/api/orders'); 

        // Use Laravel's HTTP Pool to fire simultaneous concurrent requests
        $responses = Http::pool(function (Pool $pool) use ($apiUrl, $product) {
            $requests = [];
            for ($i = 0; $i < 50; $i++) {
                $requests[] = $pool->post($apiUrl, [
                    'items' => [
                        ['product_id' => $product->id, 'quantity' => 1]
                    ]
                ]);
            }
            return $requests;
        });

        $successCount = 0;
        $failCount = 0;

        foreach ($responses as $response) {
            if ($response->successful()) {
                $successCount++;
            } else {
                $failCount++;
            }
        }

        $product->refresh();
        $this->newLine();
        $this->info("--- TEST RESULTS ---");
        $this->info("Successful Orders (Expected: 10): {$successCount}");
        $this->info("Failed/Rejected Orders (Expected: 40): {$failCount}");
        $this->info("Remaining Inventory (Expected: 0): {$product->inventory}");

        // Assert logic
        if ($product->inventory === 0 && $successCount === 10) {
            $this->info('✅ SUCCESS: Race condition was handled correctly. No negative inventory!');
            return Command::SUCCESS;
        } else {
            $this->error('❌ FAILED: Race condition occurred or logic is broken!');
            return Command::FAILURE;
        }
    }
}