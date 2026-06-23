"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  base_price: string | number;
  dynamic_price?: string | number | null;
  current_stock: number;
  optimal_stock?: number | null;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", sku: "", base_price: "", current_stock: "", optimal_stock: "" });

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setIsLoading(false);
      });
  }, []);

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`http://localhost:8000/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p: Product) => p.id !== id));
  };

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        base_price: String(product.base_price),
        current_stock: String(product.current_stock),
        optimal_stock: product.optimal_stock ? String(product.optimal_stock) : "",
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", sku: "", base_price: "", current_stock: "", optimal_stock: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingProduct;
    const url = isEditing ? `http://localhost:8000/api/products/${editingProduct.id}` : "http://localhost:8000/api/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const savedProduct = await res.json();
      if (isEditing) {
        setProducts(products.map((p: Product) => p.id === savedProduct.id ? savedProduct : p));
      } else {
        setProducts([...products, savedProduct]);
      }
      setIsModalOpen(false);
    } else {
      alert("Error saving product");
    }
  };

  return (
    <div className="p-8 pt-8">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">Manage your product catalog and view stock levels</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500">Loading products...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Base Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Optimal Stock</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="p-4 font-mono text-sm">{product.sku}</td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">${Number(product.base_price).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.current_stock < 50 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {product.current_stock}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-500">{product.optimal_stock || '-'}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="p-2 text-neutral-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500">No products found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input required type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price ($)</label>
                  <input required type="number" step="0.01" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Stock</label>
                  <input required type="number" value={formData.current_stock} onChange={(e) => setFormData({ ...formData, current_stock: e.target.value })} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Optimal Stock (Optional)</label>
                <input type="number" value={formData.optimal_stock} onChange={(e) => setFormData({ ...formData, optimal_stock: e.target.value })} className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
