<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderController extends Controller
{
    /**
     * Create a new order (Flash Sale Endpoint)
     */
    public function store(Request $request)
    {
        // 1. Validate incoming JSON payload
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            // 2. Wrap the creation in a database transaction
            $order = DB::transaction(function () use ($validated) {
                $order = Order::create(['total_price' => 0]);
                $totalPrice = 0;

                foreach ($validated['items'] as $item) {
                    // 3. CORE RACE CONDITION FIX: lockForUpdate()
                    // This creates a pessimistic lock. Any concurrent request trying to 
                    // read/update this specific product row will be forced to wait 
                    // until this transaction completes or rolls back.
                    $product = Product::where('id', $item['product_id'])
                                      ->lockForUpdate()
                                      ->first();

                    // 4. Validate Inventory
                    if ($product->inventory < $item['quantity']) {
                        throw new Exception("Insufficient inventory for product: {$product->name}. Only {$product->inventory} left.");
                    }

                    // 5. Deduct inventory and save
                    $product->inventory -= $item['quantity'];
                    $product->save();

                    // 6. Create Order Item
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ]);

                    $totalPrice += $product->price * $item['quantity'];
                }

                // 7. Update final order price
                $order->update(['total_price' => $totalPrice]);

                return $order;
            });

            // 8. Return success JSON
            return response()->json([
                'message' => 'Order created successfully.',
                'data' => $order->load('items')
            ], 201); // 201 Created

        } catch (Exception $e) {
            // 9. Return error JSON (409 Conflict is standard for state issues like Out of Stock)
            return response()->json([
                'error' => 'Failed to process order.',
                'message' => $e->getMessage()
            ], 409); 
        }
    }
}