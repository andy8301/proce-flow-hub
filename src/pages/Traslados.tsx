import { ProcessTable } from "@/components/common/ProcessTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, TrendingUp } from "lucide-react";

// Mock data para traslados
const mockTraslados = [
  {
    id: '1',
    canalIngreso: 'Interno',
    funcionarioEncargado: 'Carlos Rodríguez',
    tipoRenta: 'Vehicular',
    tipoTramite: 'Traslado',
    fechaVencimiento: '2024-12-25',
    diasPendientes: 20,
    semaforo: 'verde' as const,
    estado: 'en_proceso' as const,
    fechaIngreso: '2024-01-15',
    sadeIngreso: 'SADE-TR-001',
    numeroActo: 'AUTO-TR-001',
    planilla: 'PL-TR-001',
    expediente: 'EXP-TR-001',
    fechaPlanilla: '2024-01-16',
    actoAdministrativo: 'Auto de Traslado',
    numeroSadeSalida: 'SADE-OUT-TR-001'
  },
  {
    id: '2',
    canalIngreso: 'Externo',
    funcionarioEncargado: 'Ana Torres',
    tipoRenta: 'Predial',
    tipoTramite: 'Traslado',
    fechaVencimiento: '2024-12-15',
    diasPendientes: 5,
    semaforo: 'amarillo' as const,
    estado: 'pendiente' as const,
    fechaIngreso: '2024-01-20',
    sadeIngreso: 'SADE-TR-002',
    numeroActo: 'AUTO-TR-002',
    planilla: 'PL-TR-002',
    expediente: 'EXP-TR-002',
    fechaPlanilla: '2024-01-21',
    actoAdministrativo: 'Auto de Traslado',
    numeroSadeSalida: 'SADE-OUT-TR-002'
  }
];

export default function TrasladosPage() {
  const columns = [
    { key: 'sadeIngreso', label: 'SADE Ingreso' },
    { key: 'numeroActo', label: 'No. Acto' },
    { key: 'expediente', label: 'Expediente' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'actoAdministrativo', label: 'Acto Administrativo' },
    { 
      key: 'fechaPlanilla', 
      label: 'Fecha Planilla',
      render: (item: any) => new Date(item.fechaPlanilla).toLocaleDateString()
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Traslados
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión y seguimiento de procesos de traslado
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Total Traslados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">48</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">12</div>
            <p className="text-xs text-muted-foreground">Pendientes de finalizar</p>
          </CardContent>
        </Card>

        <Card className="shadow-corporate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">8.5 días</div>
            <p className="text-xs text-muted-foreground">Promedio de procesamiento</p>
          </CardContent>
        </Card>
      </div>

      <ProcessTable
        title="Procesos de Traslado"
        description="Seguimiento de traslados administrativos y fiscales"
        data={mockTraslados}
        columns={columns}
      />
    </div>
  );
}