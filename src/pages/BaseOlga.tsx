import { ProcessTable } from "@/components/common/ProcessTable";
import { mockBaseOlga } from "@/data/mockData";
import { BaseOlga } from "@/types/processes";

export default function BaseOlgaPage() {
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Base Olga
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión de expedientes y actos administrativos
        </p>
      </div>

      <ProcessTable
        title="Expedientes y Actos Administrativos"
        description="Seguimiento completo de expedientes, planillas y resoluciones"
        data={mockBaseOlga}
        columns={columns}
      />
    </div>
  );
}