import { useState } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { BaseOlgaForm } from "@/components/forms/BaseOlgaForm";
import { mockBaseOlga } from "@/data/mockData";
import { BaseOlga } from "@/types/processes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function BaseOlgaPage() {
  const [data, setData] = useState<BaseOlga[]>(mockBaseOlga);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseOlga | undefined>(undefined);

  const columns = [
    { key: 'consecutivo', label: 'Consecutivo' },
    { key: 'expediente', label: 'Expediente' },
    { key: 'contribuyente', label: 'Contribuyente' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'tipoTramite', label: 'Tipo Trámite' },
    { 
      key: 'fechaVencimiento', 
      label: 'Fecha Vencimiento',
      render: (item: BaseOlga) => new Date(item.fechaVencimiento).toLocaleDateString()
    }
  ];

  const handleSubmit = (formData: BaseOlga) => {
    if (editingItem) {
      // Update existing item
      setData(prev => prev.map(item => 
        item.id === editingItem.id ? formData : item
      ));
      toast.success("Registro actualizado exitosamente");
    } else {
      // Add new item
      setData(prev => [...prev, formData]);
      toast.success("Registro creado exitosamente");
    }
    setIsDialogOpen(false);
    setEditingItem(undefined);
  };

  const handleEdit = (item: BaseOlga) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Base Olga
          </h1>
          <p className="text-muted-foreground text-lg">
            Gestión de expedientes y actos administrativos
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Registro' : 'Nuevo Registro'} - Base Olga
              </DialogTitle>
            </DialogHeader>
            <BaseOlgaForm
              onSubmit={handleSubmit}
              initialData={editingItem}
              mode={editingItem ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProcessTable
        title="Expedientes y Actos Administrativos"
        description="Seguimiento completo de expedientes, planillas y resoluciones"
        data={data}
        columns={columns}
        onEdit={handleEdit}
      />
    </div>
  );
}