import { Sidebar } from "@/components/sidebar/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <div className="fixed top-8 left-8 z-40">
        <Sidebar />
      </div>
      <div className="pl-16">
        {children}
      </div>
    </div>
  );
}
