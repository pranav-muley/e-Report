'use client'

import Footer from "@/components/layout/footer/app-footer";
import Header from "@/components/layout/header/app-header";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  console.log("APP LAYOUT RENDERED");
  return (
    <div className="flex h-screen w-full overflow-hidden google-sans-regular bg-gradient-to-r from-[#f7edf9] via-[#e2e4ed] via-[#dfe5f2] to-[#d0e3f5] dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Sidebar controls its own width */}
      <AppSidebar />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}