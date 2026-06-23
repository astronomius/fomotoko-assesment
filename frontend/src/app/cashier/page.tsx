"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, CreditCard, Minus, Plus, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface Product {
  id: number;
  name: string;
  sku: string;
  base_price: string | number;
  dynamic_price?: string | number | null;
  current_stock: number;
  optimal_stock?: number | null;
}

export default function CashierPOS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      console.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      const payload = {
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Payment Successful!");
        setCart([]);
        fetchProducts(); // Refresh stock
      } else {
        const error = await res.json();
        alert(`Checkout Failed: ${error.message}`);
      }
    } catch {
      alert("Checkout Failed due to network error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product.dynamic_price || item.product.base_price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white flex transition-colors">
      {/* Product List Section */}
      <div className="flex-1 p-8 flex flex-col h-screen overflow-y-auto">
        <header className="mb-8 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Cashier POS</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Select items to add to order</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or SKU..."
                className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors w-64"
              />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 grow content-start">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.current_stock <= 0}
              className={`bg-neutral-50 dark:bg-neutral-900 border ${product.current_stock > 0 ? 'border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50' : 'border-red-200 dark:border-red-900/50 opacity-50'} rounded-xl p-4 text-left transition-colors group`}
            >
              <div className="w-full h-32 bg-white dark:bg-neutral-800 rounded-lg mb-4 flex items-center justify-center border border-neutral-100 dark:border-neutral-700">
                <ShoppingBag className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="font-medium mb-1 truncate" title={product.name}>{product.name}</h3>
              <div className="flex justify-between items-center">
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  ${Number(product.dynamic_price || product.base_price).toFixed(2)}
                </p>
                <p className="text-xs text-neutral-500">Stock: {product.current_stock}</p>
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-neutral-50 dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col h-screen">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold">Current Order</h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-neutral-500 mt-10">
              Cart is empty. Add items to begin.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-100 dark:border-neutral-700 shadow-sm">
                <div className="flex-1">
                  <h4 className="font-medium truncate pr-2">{item.product.name}</h4>
                  <p className="text-sm text-neutral-500">${Number(item.product.dynamic_price || item.product.base_price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 rounded-md p-1 border border-neutral-200 dark:border-neutral-700">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/50">
          <div className="flex justify-between mb-2 text-neutral-500 dark:text-neutral-400">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-6 text-xl font-bold">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center transition-colors"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
