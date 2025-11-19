import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Eye, 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Package 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
  pending: { label: "Pendiente", variant: "default", icon: Clock },
  preparing: { label: "En Preparación", variant: "secondary", icon: ChefHat },
  ready: { label: "Listo", variant: "default", icon: Package },
  delivered: { label: "Entregado", variant: "default", icon: CheckCircle },
};

export default function Orders() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Estado actualizado",
        description: "El estado del pedido se ha actualizado correctamente",
      });
    },
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const filteredOrders = currentStatus === "all" 
    ? orders 
    : orders?.filter((o: any) => o.status === currentStatus);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-orders-title">Pedidos y Comandas</h1>
        <p className="text-muted-foreground">Gestiona todos los pedidos del restaurante</p>
      </div>

      <Tabs value={currentStatus} onValueChange={setCurrentStatus}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">Todos</TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">Pendientes</TabsTrigger>
          <TabsTrigger value="preparing" data-testid="tab-preparing">En Preparación</TabsTrigger>
          <TabsTrigger value="ready" data-testid="tab-ready">Listos</TabsTrigger>
          <TabsTrigger value="delivered" data-testid="tab-delivered">Entregados</TabsTrigger>
        </TabsList>

        <TabsContent value={currentStatus} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Lista de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders?.map((order: any) => {
                    const statusInfo = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                        <TableCell className="font-bold">#{order.orderNumber}</TableCell>
                        <TableCell>{order.customer?.name || 'Cliente General'}</TableCell>
                        <TableCell className="font-medium">${parseFloat(order.total).toLocaleString('es-CO')}</TableCell>
                        <TableCell>{order.paymentMethod || '-'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={statusInfo.variant}
                            className={
                              order.status === 'preparing' ? 'bg-orange-500' :
                              order.status === 'ready' ? 'bg-green-600' :
                              order.status === 'delivered' ? 'bg-blue-600' : ''
                            }
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.isKiosk ? (
                            <Badge variant="outline">Tótem</Badge>
                          ) : (
                            <Badge variant="secondary">Manual</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleString('es-CO')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(order)}
                              data-testid={`button-view-order-${order.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customer?.name || 'Cliente General'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString('es-CO')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium text-lg">${parseFloat(selectedOrder.total).toLocaleString('es-CO')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pago</p>
                  <p className="font-medium">{selectedOrder.paymentMethod || '-'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Items del Pedido</h3>
                <div className="border rounded-md">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between p-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${parseFloat(item.subtotal).toLocaleString('es-CO')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Actualizar Estado</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const StatusIcon = config.icon;
                    return (
                      <Button
                        key={status}
                        variant={selectedOrder.status === status ? "default" : "outline"}
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        data-testid={`button-status-${status}`}
                        className={
                          selectedOrder.status === status 
                            ? status === 'preparing' ? 'bg-orange-500' :
                              status === 'ready' ? 'bg-green-600' :
                              status === 'delivered' ? 'bg-blue-600' : ''
                            : ''
                        }
                      >
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {config.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
