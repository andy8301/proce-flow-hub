import { useMemo, useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { DistributionChart } from "@/components/dashboard/DistributionChart";
import { FieldAuditPanel } from "@/components/dashboard/FieldAuditPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  Timer,
  RefreshCw,
} from "lucide-react";
import {
  useDashboardData,
  useDashboardMetrics,
  DashboardFilters,
  CONSOLIDADO_SHEET,
} from "@/hooks/useDashboardData";
import { DASHBOARD_SOURCES } from "@/lib/dashboardSources";

const INITIAL_FILTERS: DashboardFilters = {
  hoja: "all",
  funcionario: "all",
  anio: "all",
  tipoRenta: "all",
  semaforo: "all",
};

export default function Dashboard() {
  const { records, audit, isLoading, error, lastUpdate, refresh } = useDashboardData();
  const [filters, setFilters] = useState<DashboardFilters>(INITIAL_FILTERS);
  const metrics = useDashboardMetrics(records, filters);

  const setFilter = (key: keyof DashboardFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const cumplimientoGlobal = useMemo(() => {
    const { total, resueltos } = metrics.kpis;
    return total ? Math.round((resueltos / total) * 1000) / 10 : 0;
  }, [metrics.kpis]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard - Control de Procesos</h1>
          <p className="text-muted-foreground text-lg">
            Datos en vivo desde Google Sheets · {records.length.toLocaleString()} registros sincronizados
            {lastUpdate && ` · actualizado ${lastUpdate.toLocaleTimeString("es-CO")}`}
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40">
          <CardContent className="py-4 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {/* Filtros interactivos */}
      <Card className="shadow-corporate">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-6">
          <Select value={filters.hoja} onValueChange={(v) => setFilter("hoja", v)}>
            <SelectTrigger><SelectValue placeholder="Base" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las bases</SelectItem>
              {DASHBOARD_SOURCES.map((s) => (
                <SelectItem key={s.sheet} value={s.sheet}>
                  {s.label}{s.sheet === CONSOLIDADO_SHEET ? " (consolidado)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.funcionario} onValueChange={(v) => setFilter("funcionario", v)}>
            <SelectTrigger><SelectValue placeholder="Funcionario" /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Todos los funcionarios</SelectItem>
              {metrics.options.funcionarios.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.anio} onValueChange={(v) => setFilter("anio", v)}>
            <SelectTrigger><SelectValue placeholder="Año" /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Todos los años</SelectItem>
              {metrics.options.anios.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.tipoRenta} onValueChange={(v) => setFilter("tipoRenta", v)}>
            <SelectTrigger><SelectValue placeholder="Tipo de renta" /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Todos los tipos de renta</SelectItem>
              {metrics.options.tiposRenta.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.semaforo} onValueChange={(v) => setFilter("semaforo", v)}>
            <SelectTrigger><SelectValue placeholder="Semáforo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los semáforos</SelectItem>
              <SelectItem value="verde">Verde</SelectItem>
              <SelectItem value="amarillo">Amarillo</SelectItem>
              <SelectItem value="rojo">Rojo / Vencido</SelectItem>
              <SelectItem value="sin_dato">Sin dato</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <RefreshCw className="h-8 w-8 animate-spin mr-3" />
          <span>Cargando datos de Google Sheets...</span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Procesos Ingresados" value={metrics.kpis.total.toLocaleString()} subtitle="Registros en las bases" icon={FileText} />
            <KPICard title="Procesos Resueltos" value={metrics.kpis.resueltos.toLocaleString()} subtitle="Con fecha de respuesta" icon={CheckCircle} variant="success" />
            <KPICard title="Procesos Pendientes" value={metrics.kpis.pendientes.toLocaleString()} subtitle="En trámite" icon={Clock} variant="warning" />
            <KPICard title="Procesos Vencidos" value={metrics.kpis.vencidos.toLocaleString()} subtitle="Semáforo en rojo" icon={AlertTriangle} variant="destructive" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Días Pendientes Prom." value={`${metrics.kpis.tiempoPromedio} días`} subtitle="Promedio del filtro actual" icon={Timer} />
            <KPICard title="Eficiencia" value={`${metrics.kpis.eficiencia}%`} subtitle="Resueltos dentro de término" icon={Target} variant="success" />
            <KPICard title="Eficacia" value={`${metrics.kpis.eficacia}%`} subtitle="Resueltos sobre total" icon={TrendingUp} variant="success" />
            <KPICard title="Funcionarios Activos" value={metrics.kpis.funcionariosActivos} subtitle="Con procesos asignados" icon={Users} />
          </div>

          {/* Alertas y resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AlertsPanel alerts={metrics.alerts} />
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-corporate">
                <h3 className="text-lg font-semibold mb-2">Cumplimiento Global</h3>
                <div className="text-3xl font-bold mb-2">{cumplimientoGlobal}%</div>
                <p className="text-primary-foreground/80 text-sm">Meta establecida: 85%</p>
                <div className="mt-4 bg-primary-foreground/20 rounded-full h-2">
                  <div
                    className="bg-primary-foreground h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, cumplimientoGlobal)}%` }}
                  />
                </div>
              </div>

              <div className="bg-gradient-success rounded-lg p-6 text-success-foreground shadow-corporate">
                <h3 className="text-lg font-semibold mb-2">Estado por Semáforo</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Verde</span><span className="font-semibold">{metrics.semaforoResumen.verde.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Amarillo</span><span className="font-semibold">{metrics.semaforoResumen.amarillo.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Rojo</span><span className="font-semibold">{metrics.semaforoResumen.rojo.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Sin dato</span><span className="font-semibold">{metrics.semaforoResumen.sinDato.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos principales */}
          <ChartsSection
            cumplimientoPorProceso={metrics.cumplimientoPorProceso}
            distribucionPorFuncionario={metrics.distribucionPorFuncionario}
            evolucionMensual={metrics.evolucionMensual}
            procesosPorCanal={metrics.procesosPorCanal}
          />

          {/* Campos antes no visualizados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistributionChart title="Tipo de Renta" description="Distribución de procesos por tipo de renta" data={metrics.porTipoRenta} />
            <DistributionChart title="Tipo de Trámite" description="Distribución por trámite solicitado" data={metrics.porTipoTramite} color="hsl(142, 71%, 45%)" />
            <DistributionChart title="Ítem" description="Clasificación por ítem (columna ITEM)" data={metrics.porItem} color="hsl(38, 92%, 50%)" />
            <DistributionChart title="Tipo de Respuesta" description="Resultado final de los procesos" data={metrics.porTipoRespuesta} color="hsl(262, 83%, 58%)" />
          </div>

          <FieldAuditPanel audit={audit} />
        </>
      )}
    </div>
  );
}
