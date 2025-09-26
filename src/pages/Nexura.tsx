import { useState } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { mockBaseNexura } from "@/data/mockData";
import { BaseNexura } from "@/types/processes";
import { NexuraForm } from "@/components/forms/NexuraForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function NexuraPage() {
  const [data, setData] = useState<BaseNexura[]>(mockBaseNexura);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseNexura | null>(null);
  const columns = [
    { key: 'radicacion', label: 'Radicación' },
    { key: 'tipoSolicitud', label: 'Tipo Solicitud' },
    { key: 'nombreSolicitante', label: 'Solicitante' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'responsable', label: 'Responsable' },
    { 
      key: 'fechaIngreso', 
      label: 'Fecha Ingreso',
      render: (item: BaseNexura) => new Date(item.fechaIngreso).toLocaleDateString()
    },
    { 
      key: 'fechaLimiteRespuesta', 
      label: 'Fecha Límite',
      render: (item: BaseNexura) => new Date(item.fechaLimiteRespuesta).toLocaleDateString()
    }
  ];

  const handleSubmit = (formData: BaseNexura) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast({ title: "Registro Nexura actualizado exitosamente" });
    } else {
      setData(prev => [...prev, formData]);
      toast({ title: "Registro Nexura creado exitosamente" });
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: BaseNexura) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Base Nexura
        </h1>
        <p className="text-muted-foreground text-lg">
          Sistema de radicación y gestión de PQRSD
        </p>
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
                {editingItem ? 'Editar PQRSD' : 'Nueva PQRSD'}
              </DialogTitle>
            </DialogHeader>
            <NexuraForm
              onSubmit={handleSubmit}
              initialData={editingItem || undefined}
              mode={editingItem ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProcessTable
        title="PQRSD y Radicación"
        description="Seguimiento de peticiones, quejas, reclamos, sugerencias y denuncias"
        data={data}
        columns={columns}
        onEdit={handleEdit}
      />
    </div>
  );
}