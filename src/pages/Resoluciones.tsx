import { useState } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Plus, Scale, FileCheck } from "lucide-react";
import { Resoluciones } from "@/types/processes";
import { ResolucionesForm } from "@/components/forms/ResolucionesForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Mock data para resoluciones
const mockResoluciones = [
  {
    id: '1',
    canalIngreso: 'Sistema',
    funcionarioEncargado: 'Laura Martínez',
    tipoRenta: 'Vehicular',
    tipoTramite: 'Resolución',
    fechaVencimiento: '2024-12-30',
    diasPendientes: 25,
    semaforo: 'verde' as const,
    estado: 'resuelto' as const,
    fechaIngreso: '2024-01-10',
    sadeIngreso: 'SADE-RES-001',
    numeroActoSadeSalida: 'RES-001',
    planilla: 'PL-RES-001',
    fechaPlanilla: '2024-01-11',
    actoAdministrativo: 'Resolución Administrativa',
    numeroSadeSalida: 'SADE-OUT-RES-001',
    expediente: 'EXP-RES-001'
  },
  {
    id: '2',
    canalIngreso: 'Oficina',
    funcionarioEncargado: 'Pedro Sánchez',
    tipoRenta: 'Predial',
    tipoTramite: 'Resolución',
    fechaVencimiento: '2024-12-20',
    diasPendientes: 8,
    semaforo: 'amarillo' as const,
    estado: 'en_proceso' as const,
    fechaIngreso: '2024-01-25',
    sadeIngreso: 'SADE-RES-002',
    numeroActoSadeSalida: 'RES-002',
    planilla: 'PL-RES-002',
    fechaPlanilla: '2024-01-26',
    actoAdministrativo: 'Resolución de Cobro',
    numeroSadeSalida: 'SADE-OUT-RES-002',
    expediente: 'EXP-RES-002'
  }
];

export default function ResolucionesPage() {
  const [data, setData] = useState<Resoluciones[]>(mockResoluciones);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Resoluciones | null>(null);
  const columns = [
    { key: 'sadeIngreso', label: 'SADE Ingreso' },
    { key: 'numeroActoSadeSalida', label: 'No. Resolución' },
    { key: 'expediente', label: 'Expediente' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'actoAdministrativo', label: 'Tipo Resolución' },
    { 
      key: 'fechaPlanilla', 
      label: 'Fecha Planilla',
      render: (item: any) => new Date(item.fechaPlanilla).toLocaleDateString()
    }
  ];

  const handleSubmit = (formData: Resoluciones) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast({ title: "Resolución actualizada exitosamente" });
    } else {
      setData(prev => [...prev, formData]);
      toast({ title: "Resolución creada exitosamente" });
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: Resoluciones) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Resoluciones
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión de resoluciones administrativas y actos definitivos
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Total Resoluciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">87</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Resueltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">73</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">14</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
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
                {editingItem ? 'Editar Resolución' : 'Nueva Resolución'}
              </DialogTitle>
            </DialogHeader>
            <ResolucionesForm
              onSubmit={handleSubmit}
              initialData={editingItem || undefined}
              mode={editingItem ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProcessTable
        title="Resoluciones Administrativas"
        description="Seguimiento de resoluciones, autos y actos administrativos definitivos"
        data={data}
        columns={columns}
        onEdit={handleEdit}
      />
    </div>
  );
}