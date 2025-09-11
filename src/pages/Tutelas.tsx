import { ProcessTable } from "@/components/common/ProcessTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Shield } from "lucide-react";

// Mock data para tutelas
const mockTutelas = [
  {
    id: '1',
    canalIngreso: 'Juzgado',
    funcionarioEncargado: 'Ana Torres',
    tipoRenta: 'Constitucional',
    tipoTramite: 'Tutela',
    fechaVencimiento: '2024-12-18',
    diasPendientes: 10,
    semaforo: 'amarillo' as const,
    estado: 'en_proceso' as const,
    fechaIngreso: '2024-01-08',
    mes: 'Enero',
    fechaAsignacion: '2024-01-09',
    asuntoCorreo: 'Tutela - Derecho de Petición No. T-001',
    remitente: 'Juzgado Tercero Civil',
    fechaRespuestaPeticion: '2024-01-15',
    fechaRespuestaJuridica: '2024-01-20',
    observaciones: 'En espera de concepto jurídico'
  },
  {
    id: '2',
    canalIngreso: 'Defensoría',
    funcionarioEncargado: 'Laura Martínez',
    tipoRenta: 'Constitucional',
    tipoTramite: 'Tutela',
    fechaVencimiento: '2024-12-12',
    diasPendientes: 2,
    semaforo: 'rojo' as const,
    estado: 'vencido' as const,
    fechaIngreso: '2024-01-05',
    mes: 'Enero',
    fechaAsignacion: '2024-01-06',
    asuntoCorreo: 'Tutela - Acceso a Información No. T-002',
    remitente: 'Defensoría del Pueblo',
    fechaRespuestaPeticion: '2024-01-12',
    fechaRespuestaJuridica: '2024-01-18',
    observaciones: 'Requiere respuesta urgente'
  }
];

export default function TutelasPage() {
  const columns = [
    { key: 'asuntoCorreo', label: 'Asunto' },
    { key: 'remitente', label: 'Remitente' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { 
      key: 'fechaAsignacion', 
      label: 'Fecha Asignación',
      render: (item: any) => new Date(item.fechaAsignacion).toLocaleDateString()
    },
    { 
      key: 'fechaRespuestaPeticion', 
      label: 'Respuesta Petición',
      render: (item: any) => item.fechaRespuestaPeticion ? new Date(item.fechaRespuestaPeticion).toLocaleDateString() : 'Pendiente'
    },
    { key: 'observaciones', label: 'Observaciones' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tutelas
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión de acciones de tutela y derechos fundamentales
        </p>
      </div>

      {/* Alerta de tiempo crítico */}
      <Card className="border-destructive/50 bg-destructive/5 shadow-corporate">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Atención Prioritaria
          </CardTitle>
          <CardDescription>
            Las tutelas tienen términos perentorios que deben cumplirse estrictamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">48 horas</div>
              <p className="text-sm text-muted-foreground">Término legal para respuesta</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">2</div>
              <p className="text-sm text-muted-foreground">Tutelas activas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">1</div>
              <p className="text-sm text-muted-foreground">Próxima a vencer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Total Tutelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">28</div>
            <p className="text-xs text-muted-foreground">Este año</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              En Término
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">25</div>
            <p className="text-xs text-muted-foreground">Respondidas a tiempo</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Cumplimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">89.3%</div>
            <p className="text-xs text-muted-foreground">Eficacia en respuesta</p>
          </CardContent>
        </Card>
      </div>

      <ProcessTable
        title="Acciones de Tutela"
        description="Seguimiento de tutelas y derechos de petición constitucionales"
        data={mockTutelas}
        columns={columns}
      />
    </div>
  );
}