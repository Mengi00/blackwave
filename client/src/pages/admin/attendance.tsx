import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ClipboardList, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
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
import { insertAttendanceSchema } from "@shared/schema";

const attendanceSchema = insertAttendanceSchema.extend({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
}).omit({ date: true });

const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
  present: { label: "Presente", variant: "default", icon: CheckCircle },
  absent: { label: "Ausente", variant: "destructive", icon: XCircle },
  late: { label: "Tarde", variant: "secondary", icon: Clock },
};

export default function Attendance() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: attendance, isLoading } = useQuery({
    queryKey: ["/api/attendance"],
  });

  const { data: staff } = useQuery({
    queryKey: ["/api/staff"],
  });

  const form = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      staffId: "",
      status: "",
      checkIn: "",
      checkOut: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/attendance", {
        ...data,
        date: new Date().toISOString(),
        checkIn: data.checkIn ? new Date(`${new Date().toISOString().split('T')[0]}T${data.checkIn}`).toISOString() : null,
        checkOut: data.checkOut ? new Date(`${new Date().toISOString().split('T')[0]}T${data.checkOut}`).toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "Asistencia registrada",
        description: "La asistencia se ha registrado correctamente",
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
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-attendance-title">Asistencia</h1>
          <p className="text-muted-foreground">Registra la asistencia del personal</p>
        </div>
        <Button onClick={handleCreate} data-testid="button-add-attendance">
          <Plus className="h-4 w-4 mr-2" />
          Registrar Asistencia
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Registro de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance?.map((record: any) => {
                const statusInfo = statusConfig[record.status] || statusConfig.present;
                const StatusIcon = statusInfo.icon;
                
                return (
                  <TableRow key={record.id} data-testid={`row-attendance-${record.id}`}>
                    <TableCell className="font-medium">{record.staff?.name}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell>
                      {record.checkIn 
                        ? new Date(record.checkIn).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {record.checkOut 
                        ? new Date(record.checkOut).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusInfo.variant}
                        className={
                          record.status === 'late' ? 'bg-orange-500' :
                          record.status === 'present' ? 'bg-green-600' : ''
                        }
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Asistencia</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empleado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-staff">
                          <SelectValue placeholder="Selecciona un empleado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staff?.filter((s: any) => s.active).map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} - {s.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Entrada</FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          data-testid="input-check-in"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Salida</FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          data-testid="input-check-out"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
