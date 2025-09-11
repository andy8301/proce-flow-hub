import { ProcessTable } from "@/components/common/ProcessTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

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
    fechaResolucion: '2024-02-12',
    fechaEjecutoria: '2024-02-20'
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
    fechaResolucion: '2024-02-08',
    fechaEjecutoria: '2024-02-15'
  }
];

export default function FiscalizacionPage() {
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

      <ProcessTable
        title="Procesos de Fiscalización"
        description="Seguimiento y control de procesos de fiscalización tributaria"
        data={mockFiscalizacion}
        columns={columns}
      />
    </div>
  );
}