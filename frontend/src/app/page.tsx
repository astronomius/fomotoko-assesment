import Link from 'next/link';
import { ArrowRight, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-24 text-neutral-900 dark:text-white transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-600 mb-6">
          AI Retail OS
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl">
          Complete AI-automated retail management system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/cashier" className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-8 hover:border-blue-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col h-full relative z-10">
            <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <ShoppingCart className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Cashier POS</h2>
            <p className="text-neutral-400 mb-8 grow">Process transactions, scan items, and manage customer orders efficiently.</p>
            <div className="flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
              Launch POS <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        </Link>

        <Link href="/admin" className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-8 hover:border-purple-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col h-full relative z-10">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <LayoutDashboard className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
            <p className="text-neutral-400 mb-8 grow">View inventory forecasting, dynamic pricing suggestions, and supply chain insights.</p>
            <div className="flex items-center text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
              Open Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
