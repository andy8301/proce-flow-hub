import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BaseOlga } from "@/types/processes";

const baseOlgaSchema = z.object({
  consecutivo: z.string().min(1, "Consecutivo es requerido"),
  canalIngreso: z.string().min(1, "Canal de ingreso es requerido"),
  areaRemitente: z.string().min(1, "Área remitente es requerida"),
  planilla: z.string().min(1, "Número de planilla es requerido"),
  expediente: z.string().min(1, "Número de expediente es requerido"),
  fechaRadicacion: z.date({ required_error: "Fecha de radicación es requerida" }),
  actoAdministrativo: z.string().min(1, "Acto administrativo es requerido"),
  numeroActo: z.string().min(1, "Número de acto es requerido"),
  fechaActo: z.date({ required_error: "Fecha del acto es requerida" }),
  placa: z.string().optional(),
  identificacion: z.string().min(1, "Identificación es requerida"),
  contribuyente: z.string().min(1, "Contribuyente es requerido"),
  ciudadDepartamento: z.string().min(1, "Ciudad/Departamento es requerido"),
  funcionarioEncargado: z.string().min(1, "Funcionario encargado es requerido"),
  fechaRecibido: z.date({ required_error: "Fecha de recibido es requerida" }),
  tipoRenta: z.string().min(1, "Tipo de renta es requerido"),
  tipoTramite: z.string().min(1, "Tipo de trámite es requerido"),
  item: z.string().optional(),
  numeroResolucion: z.string().optional(),
  numeroSadeSalida: z.string().optional(),
  fechaResolucion: z.date().optional(),
  tipoRespuesta: z.string().optional(),
  fechaEjecutoria: z.date().optional(),
  traslado: z.string().optional(),
  cerradoPasadoArchivo: z.string().optional(),
  ubicacionFisica: z.string().optional(),
  fechaVencimiento: z.date({ required_error: "Fecha de vencimiento es requerida" }),
  observacionSade: z.string().optional(),
});

type BaseOlgaFormData = z.infer<typeof baseOlgaSchema>;

interface BaseOlgaFormProps {
  onSubmit: (data: BaseOlga) => void;
  initialData?: Partial<BaseOlga>;
  mode?: 'create' | 'edit';
}

export function BaseOlgaForm({ onSubmit, initialData, mode = 'create' }: BaseOlgaFormProps) {
  const form = useForm<BaseOlgaFormData>({
    resolver: zodResolver(baseOlgaSchema),
    defaultValues: {
      consecutivo: initialData?.consecutivo || "",
      canalIngreso: initialData?.canalIngreso || "",
      areaRemitente: initialData?.areaRemitente || "",
      planilla: initialData?.planilla || "",
      expediente: initialData?.expediente || "",
      actoAdministrativo: initialData?.actoAdministrativo || "",
      numeroActo: initialData?.numeroActo || "",
      placa: initialData?.placa || "",
      identificacion: initialData?.identificacion || "",
      contribuyente: initialData?.contribuyente || "",
      ciudadDepartamento: initialData?.ciudadDepartamento || "",
      funcionarioEncargado: initialData?.funcionarioEncargado || "",
      tipoRenta: initialData?.tipoRenta || "",
      tipoTramite: initialData?.tipoTramite || "",
      item: initialData?.item || "",
      numeroResolucion: initialData?.numeroResolucion || "",
      numeroSadeSalida: initialData?.numeroSadeSalida || "",
      tipoRespuesta: initialData?.tipoRespuesta || "",
      traslado: initialData?.traslado || "",
      cerradoPasadoArchivo: initialData?.cerradoPasadoArchivo || "",
      ubicacionFisica: initialData?.ubicacionFisica || "",
      observacionSade: initialData?.observacionSade || "",
    },
  });

  const handleSubmit = (data: BaseOlgaFormData) => {
    const processData: BaseOlga = {
      id: initialData?.id || crypto.randomUUID(),
      consecutivo: data.consecutivo,
      canalIngreso: data.canalIngreso,
      areaRemitente: data.areaRemitente,
      planilla: data.planilla,
      expediente: data.expediente,
      fechaRadicacion: data.fechaRadicacion.toISOString(),
      actoAdministrativo: data.actoAdministrativo,
      numeroActo: data.numeroActo,
      fechaActo: data.fechaActo.toISOString(),
      placa: data.placa || "",
      identificacion: data.identificacion,
      contribuyente: data.contribuyente,
      ciudadDepartamento: data.ciudadDepartamento,
      funcionarioEncargado: data.funcionarioEncargado,
      fechaRecibido: data.fechaRecibido.toISOString(),
      tipoRenta: data.tipoRenta,
      tipoTramite: data.tipoTramite,
      item: data.item || "",
      numeroResolucion: data.numeroResolucion || "",
      numeroSadeSalida: data.numeroSadeSalida || "",
      fechaResolucion: data.fechaResolucion?.toISOString() || "",
      tipoRespuesta: data.tipoRespuesta || "",
      fechaEjecutoria: data.fechaEjecutoria?.toISOString() || "",
      traslado: data.traslado || "",
      cerradoPasadoArchivo: data.cerradoPasadoArchivo || "",
      ubicacionFisica: data.ubicacionFisica || "",
      observacionSade: data.observacionSade || "",
      fechaVencimiento: data.fechaVencimiento.toISOString(),
      fechaIngreso: data.fechaRecibido.toISOString(),
      diasPendientes: Math.ceil((new Date(data.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      semaforo: 'verde' as const,
      estado: 'pendiente' as const,
    };
    onSubmit(processData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Nuevo Registro' : 'Editar Registro'} - Base Olga</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campos básicos */}
              <FormField
                control={form.control}
                name="consecutivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Consecutivo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canalIngreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canal de Ingreso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar canal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="telefono">Teléfono</SelectItem>
                        <SelectItem value="correo">Correo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areaRemitente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Remitente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planilla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Planilla</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expediente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Expediente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaRadicacion"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Radicación Expediente</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="pointer-events-auto"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Más campos... */}
              <FormField
                control={form.control}
                name="actoAdministrativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acto Administrativo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroActo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Acto Administrativo y No. SADE</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contribuyente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribuyente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funcionarioEncargado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funcionario Encargado</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observacionSade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observación SADE</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="submit">
                {mode === 'create' ? 'Crear Registro' : 'Actualizar Registro'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}