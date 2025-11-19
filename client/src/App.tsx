import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import Dashboard from "@/pages/admin/dashboard";
import Inventory from "@/pages/admin/inventory";
import Products from "@/pages/admin/products";
import Customers from "@/pages/admin/customers";
import Orders from "@/pages/admin/orders";
import Staff from "@/pages/admin/staff";
import Schedules from "@/pages/admin/schedules";
import Attendance from "@/pages/admin/attendance";
import Transactions from "@/pages/admin/transactions";
import Kiosk from "@/pages/kiosk/index";
import NotFound from "@/pages/not-found";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="text-sm text-muted-foreground">
              Sistema de Gestión - RestoCafé
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <Redirect to="/admin" />}
      </Route>
      
      <Route path="/admin">
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/inventory">
        <AdminLayout>
          <Inventory />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/products">
        <AdminLayout>
          <Products />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/customers">
        <AdminLayout>
          <Customers />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/orders">
        <AdminLayout>
          <Orders />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/staff">
        <AdminLayout>
          <Staff />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/schedules">
        <AdminLayout>
          <Schedules />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/attendance">
        <AdminLayout>
          <Attendance />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/transactions">
        <AdminLayout>
          <Transactions />
        </AdminLayout>
      </Route>
      
      <Route path="/kiosk">
        <Kiosk />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
