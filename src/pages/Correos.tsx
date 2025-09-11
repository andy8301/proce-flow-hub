import { ProcessTable } from "@/components/common/ProcessTable";
import { mockBaseCorreos } from "@/data/mockData";
import { BaseCorreos } from "@/types/processes";

export default function CorreosPage() {
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

      <ProcessTable
        title="Correspondencia Electrónica"
        description="Seguimiento de correos, consultas y respuestas"
        data={mockBaseCorreos}
        columns={columns}
      />
    </div>
  );
}