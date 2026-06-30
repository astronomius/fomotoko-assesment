"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Package, Users, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { logout } from "@/lib/utils/auth";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <Dialog.Trigger asChild>
        <button className="p-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl transition-colors shadow-sm flex items-center justify-center">
          <Menu className="w-6 h-6" />
        </button>
      </Dialog.Trigger>
      
      {isMounted && (
        <Dialog.Portal container={document.body}>
          <Dialog.Content 
            onInteractOutside={e => e.preventDefault()}
            onPointerDownOutside={e => e.preventDefault()}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl z-50 flex flex-col focus:outline-none"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                AI Retail OS
              </h2>
              <Dialog.Close asChild>
                <button className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <nav className="flex flex-col gap-2 flex-grow">
              <Link onClick={() => setOpen(false)} href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium text-neutral-700 dark:text-neutral-200">
                <LayoutDashboard className="w-5 h-5 text-neutral-500" />
                <span>Dashboard</span>
              </Link>
              <Link onClick={() => setOpen(false)} href="/admin/inventory" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium text-neutral-700 dark:text-neutral-200">
                <Package className="w-5 h-5 text-neutral-500" />
                <span>Inventory & Catalog</span>
              </Link>
              <Link onClick={() => setOpen(false)} href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium text-neutral-700 dark:text-neutral-200">
                <Users className="w-5 h-5 text-neutral-500" />
                <span>User Management</span>
              </Link>
            </nav>

            <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors font-medium text-neutral-700 dark:text-neutral-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
