import { BarChart3, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function AdminDashboard() {
  return (
    <div className="p-8 pt-8">
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400">AI-Powered Insights and Store Management</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-neutral-300">Dynamic Pricing</h3>
            <TrendingUp className="text-green-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-semibold mb-2">12 Items</p>
          <p className="text-sm text-neutral-500">Prices adjusted by Gemini in last 24h</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-neutral-300">Inventory Forecast</h3>
            <Package className="text-blue-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-semibold mb-2">8 Items</p>
          <p className="text-sm text-neutral-500">Predicted to run out in 7 days</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-neutral-300">Supply Chain Alerts</h3>
            <AlertTriangle className="text-yellow-400 w-5 h-5" />
          </div>
          <p className="text-3xl font-semibold mb-2">2 Warnings</p>
          <p className="text-sm text-neutral-500">Supplier delays detected</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-400">Charts and data tables will be populated from the API.</p>
        </div>
      </div>
    </div>
  );
}
