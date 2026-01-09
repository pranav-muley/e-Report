import AppSideBar from "@/components/layout/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar controls its own width */}
        <AppSideBar />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-14 border-b flex items-center px-4">
            <SidebarTrigger />
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>

          <footer className="h-10 border-t text-xs flex items-center px-4">
            © Police e-Report System
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
