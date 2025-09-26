import { useState } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { Fiscalizacion } from "@/types/processes";
import { FiscalizacionForm } from "@/components/forms/FiscalizacionForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Mock data para fiscalización
const mockFiscalizacion = [
  {
    id: '1',
    canalIngreso: 'Fiscalización',
    funcionarioEncargado: 'María García',
    tipoRenta: 'Vehicular',
    tipoTramite: 'Fiscalización',
    fechaVencimiento: '2024-12-28',
    diasPendientes: 18,
    semaforo: 'verde' as const,
    estado: 'en_proceso' as const,
    fechaIngreso: '2024-01-12',
    planilla: 'PL-FISC-001',
    expediente: 'EXP-FISC-001',
    actoAdministrativo: 'Auto de Fiscalización',
    fechaPlanillaIngreso: '2024-01-13',
    proceso: 'Fiscalización Vehicular',
    contribuyente: 'Juan Pérez',
    impuesto: 'Impuesto Vehicular',
    estadoProceso: 'En revisión',
    resolucionSadeSalida: 'SADE-FISC-001',
    fechaResolucionSade: '2024-02-12',
    fechaEjecutoria: '2024-02-20',
    semaforoVencimiento: 'verde' as const
  },
  {
    id: '2',
    canalIngreso: 'Oficina',
    funcionarioEncargado: 'Carlos Rodríguez',
    tipoRenta: 'Predial',
    tipoTramite: 'Fiscalización',
    fechaVencimiento: '2024-12-15',
    diasPendientes: 2,
    semaforo: 'rojo' as const,
    estado: 'vencido' as const,
    fechaIngreso: '2024-01-08',
    planilla: 'PL-FISC-002',
    expediente: 'EXP-FISC-002',
    actoAdministrativo: 'Auto de Fiscalización Predial',
    fechaPlanillaIngreso: '2024-01-09',
    proceso: 'Fiscalización Predial',
    contribuyente: 'Ana López',
    impuesto: 'Impuesto Predial',
    estadoProceso: 'Vencido',
    resolucionSadeSalida: 'SADE-FISC-002',
    fechaResolucionSade: '2024-02-08',
    fechaEjecutoria: '2024-02-15',
    semaforoVencimiento: 'rojo' as const
  }
];

export default function FiscalizacionPage() {
  const [data, setData] = useState<Fiscalizacion[]>(mockFiscalizacion);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Fiscalizacion | null>(null);
  const columns = [
    { key: 'expediente', label: 'Expediente' },
    { key: 'contribuyente', label: 'Contribuyente' },
    { key: 'proceso', label: 'Proceso' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'impuesto', label: 'Impuesto' },
    { key: 'estadoProceso', label: 'Estado Proceso' },
    { 
      key: 'fechaPlanillaIngreso', 
      label: 'Fecha Ingreso',
      render: (item: any) => new Date(item.fechaPlanillaIngreso).toLocaleDateString()
    }
  ];

  const handleSubmit = (formData: Fiscalizacion) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast({ title: "Proceso de fiscalización actualizado exitosamente" });
    } else {
      setData(prev => [...prev, formData]);
      toast({ title: "Proceso de fiscalización creado exitosamente" });
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Fiscalizacion) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Fiscalización
        </h1>
        <p className="text-muted-foreground text-lg">
          Seguimiento de procesos de fiscalización tributaria
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Procesos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">156</div>
            <p className="text-xs text-muted-foreground">En fiscalización</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Finalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">89</div>
            <p className="text-xs text-muted-foreground">Completados</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">61</div>
            <p className="text-xs text-muted-foreground">Activos</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Vencidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">6</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Fiscalización' : 'Nueva Fiscalización'}
              </DialogTitle>
            </DialogHeader>
            <FiscalizacionForm
              onSubmit={handleSubmit}
              initialData={editingItem || undefined}
              mode={editingItem ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProcessTable
        title="Procesos de Fiscalización"
        description="Seguimiento y control de procesos de fiscalización tributaria"
        data={data}
        columns={columns}
        onEdit={handleEdit}
      />
    </div>
  );
}