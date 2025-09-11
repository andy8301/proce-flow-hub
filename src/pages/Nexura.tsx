import { ProcessTable } from "@/components/common/ProcessTable";
import { mockBaseNexura } from "@/data/mockData";
import { BaseNexura } from "@/types/processes";

export default function NexuraPage() {
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

      <ProcessTable
        title="PQRSD y Radicación"
        description="Seguimiento de peticiones, quejas, reclamos, sugerencias y denuncias"
        data={mockBaseNexura}
        columns={columns}
      />
    </div>
  );
}