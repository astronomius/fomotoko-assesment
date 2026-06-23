<?php

namespace App\Observers;

use App\Models\InventoryLog;
use App\Models\Product;

class ProductObserver
{
    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        if ($product->wasChanged('current_stock')) {
            $diff = $product->current_stock - $product->getOriginal('current_stock');
            
            if ($diff !== 0) {
                InventoryLog::create([
                    'product_id' => $product->id,
                    'change_amount' => $diff,
                    'reason' => 'Stock update', // In a real app we might pass dynamic reasons
                ]);
            }
        }
    }
}
