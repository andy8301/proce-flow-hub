import { useState } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { mockBaseCorreos } from "@/data/mockData";
import { BaseCorreos } from "@/types/processes";
import { CorreosForm } from "@/components/forms/CorreosForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function CorreosPage() {
  const [data, setData] = useState<BaseCorreos[]>(mockBaseCorreos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseCorreos | null>(null);
  const columns = [
    { key: 'asuntoCorreo', label: 'Asunto' },
    { key: 'contribuyenteSolicitante', label: 'Solicitante' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'tipoTramite', label: 'Tipo Trámite' },
    { 
      key: 'fechaCorreo', 
      label: 'Fecha Correo',
      render: (item: BaseCorreos) => new Date(item.fechaCorreo).toLocaleDateString()
    },
    { 
      key: 'fechaRespuesta', 
      label: 'Fecha Respuesta',
      render: (item: BaseCorreos) => item.fechaRespuesta ? new Date(item.fechaRespuesta).toLocaleDateString() : 'Pendiente'
    }
  ];

  const handleSubmit = (formData: BaseCorreos) => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? formData : item));
      toast({ title: "Correo actualizado exitosamente" });
    } else {
      setData(prev => [...prev, formData]);
      toast({ title: "Correo creado exitosamente" });
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: BaseCorreos) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Correos Electrónicos
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión y seguimiento de correspondencia electrónica
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
                {editingItem ? 'Editar Correo' : 'Nuevo Correo'}
              </DialogTitle>
            </DialogHeader>
            <CorreosForm
              onSubmit={handleSubmit}
              initialData={editingItem || undefined}
              mode={editingItem ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ProcessTable
        title="Correspondencia Electrónica"
        description="Seguimiento de correos, consultas y respuestas"
        data={data}
        columns={columns}
        onEdit={handleEdit}
      />
    </div>
  );
}