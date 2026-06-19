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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            $order = DB::transaction(function () use ($validated) {
                $order = Order::create(['total_price' => 0]);
                $totalPrice = 0;

                foreach ($validated['items'] as $item) {
                    $product = Product::where('id', $item['product_id'])
                                      ->lockForUpdate()
                                      ->first();

                    if ($product->inventory < $item['quantity']) {
                        throw new Exception("Insufficient inventory for product: {$product->name}. Only {$product->inventory} left.");
                    }

                    $product->inventory -= $item['quantity'];
                    $product->save();

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ]);

                    $totalPrice += $product->price * $item['quantity'];
                }

                $order->update(['total_price' => $totalPrice]);

                return $order;
            });

            return response()->json([
                'message' => 'Order created successfully.',
                'data' => $order->load('items')
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to process order.',
                'message' => $e->getMessage()
            ], 409);
        }
    }
}