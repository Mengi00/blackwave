import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  UserCog, 
  Calendar, 
  ClipboardList, 
  TrendingUp,
  Store
} from "lucide-react";
import { Link, useLocation } from "wouter";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Inventario",
    url: "/admin/inventory",
    icon: Package,
  },
  {
    title: "Productos",
    url: "/admin/products",
    icon: Store,
  },
  {
    title: "Clientes",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Pedidos",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Personal",
    url: "/admin/staff",
    icon: UserCog,
  },
  {
    title: "Horarios",
    url: "/admin/schedules",
    icon: Calendar,
  },
  {
    title: "Asistencia",
    url: "/admin/attendance",
    icon: ClipboardList,
  },
  {
    title: "Finanzas",
    url: "/admin/transactions",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">RestoCafé</h2>
            <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Link href="/kiosk" data-testid="link-kiosk">
          <div className="flex items-center gap-2 rounded-md bg-accent p-3 hover-elevate active-elevate-2">
            <ShoppingCart className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Modo Tótem</p>
              <p className="text-xs text-muted-foreground">Autoservicio</p>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
