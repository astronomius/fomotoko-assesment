<?php

namespace Database\Seeders;

use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin and Cashier
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@fomotoko.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Cashier User',
            'email' => 'cashier@fomotoko.com',
            'password' => Hash::make('password'),
            'role' => 'cashier',
        ]);

        $productsData = [
            ['name' => 'Wireless Mouse', 'base_price' => 25.00],
            ['name' => 'Mechanical Keyboard', 'base_price' => 120.00],
            ['name' => 'USB-C Cable', 'base_price' => 15.00],
            ['name' => 'Monitor Stand', 'base_price' => 45.00],
            ['name' => 'Webcam 1080p', 'base_price' => 60.00],
        ];

        $products = [];
        foreach ($productsData as $data) {
            $initialStock = rand(100, 250);
            $product = Product::create([
                'name' => $data['name'],
                'sku' => strtoupper(Str::random(8)),
                'base_price' => $data['base_price'],
                'current_stock' => $initialStock,
                'optimal_stock' => rand(150, 300),
            ]);
            $products[] = $product;

            InventoryLog::create([
                'product_id' => $product->id,
                'change_amount' => $initialStock,
                'reason' => 'Initial Restock',
                'created_at' => Carbon::now()->subDays(30),
                'updated_at' => Carbon::now()->subDays(30),
            ]);
        }

        // Generate orders over the past 30 days
        for ($i = 0; $i < 100; $i++) {
            $orderDate = Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 24));
            
            $order = Order::create([
                'total_amount' => 0, // Will update below
                'status' => 'completed',
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);

            $totalAmount = 0;
            $itemsCount = rand(1, 3);
            
            for ($j = 0; $j < $itemsCount; $j++) {
                $product = $products[array_rand($products)];
                $qty = rand(1, 3);
                $price = $product->base_price;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'price_at_time' => $price,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);

                // Deduct from current_stock
                $product->decrement('current_stock', $qty);

                InventoryLog::create([
                    'product_id' => $product->id,
                    'change_amount' => -$qty,
                    'reason' => 'Sale',
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);

                $totalAmount += ($price * $qty);
            }

            $order->update(['total_amount' => $totalAmount]);
        }
    }
}
