import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { TrendingUp, TrendingDown, Plus, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertTransactionSchema } from "@shared/schema";

const transactionSchema = insertTransactionSchema;

export default function Transactions() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState("all");

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "ingreso" as const,
      category: "",
      amount: "",
      description: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/revenue"] });
      toast({
        title: "Transacción registrada",
        description: "La transacción se ha registrado correctamente",
      });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const handleCreate = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      amount: data.amount,
    };
    createMutation.mutate(payload);
  };

  const filteredTransactions = currentType === "all" 
    ? transactions 
    : transactions?.filter((t: any) => t.type === currentType);

  const totalIngresos = transactions?.filter((t: any) => t.type === 'ingreso')
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0) || 0;
  
  const totalEgresos = transactions?.filter((t: any) => t.type === 'egreso')
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0) || 0;

  const balance = totalIngresos - totalEgresos;

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-transactions-title">Finanzas</h1>
          <p className="text-muted-foreground">Gestiona ingresos y egresos</p>
        </div>
        <Button onClick={handleCreate} data-testid="button-add-transaction">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Transacción
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-total-ingresos">
              ${totalIngresos.toLocaleString('es-CO')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <TrendingDown className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-total-egresos">
              ${totalEgresos.toLocaleString('es-CO')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div 
              className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-destructive'}`}
              data-testid="text-balance"
            >
              ${balance.toLocaleString('es-CO')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={currentType} onValueChange={setCurrentType}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">Todas</TabsTrigger>
          <TabsTrigger value="ingreso" data-testid="tab-ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="egreso" data-testid="tab-egresos">Egresos</TabsTrigger>
        </TabsList>

        <TabsContent value={currentType} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions?.map((transaction: any) => (
                    <TableRow key={transaction.id} data-testid={`row-transaction-${transaction.id}`}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('es-CO')}
                      </TableCell>
                      <TableCell>
                        {transaction.type === 'ingreso' ? (
                          <Badge className="bg-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Ingreso
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Egreso
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description || '-'}</TableCell>
                      <TableCell className={`font-bold ${transaction.type === 'ingreso' ? 'text-green-600' : 'text-destructive'}`}>
                        {transaction.type === 'ingreso' ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString('es-CO')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Transacción</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-type">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ingreso">Ingreso</SelectItem>
                        <SelectItem value="egreso">Egreso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ventas, Nomina, Servicios..." data-testid="input-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto (COP)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} data-testid="input-amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="input-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending ? "Guardando..." : "Registrar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
