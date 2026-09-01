import { useCallback, useEffect, useMemo, useState } from "react";
import { readSheet } from "@/lib/googleSheets";
import { DASHBOARD_SOURCES, SourceConfig } from "@/lib/dashboardSources";

export const CONSOLIDADO_SHEET = "CONSOLIDADO BASES";

export interface UnifiedRecord {
  id: string;
  hoja: string;
  hojaLabel: string;
  canal: string;
  funcionario: string;
  tipoRenta: string;
  tipoTramite: string;
  item: string;
  contribuyente: string;
  expediente: string;
  identificador: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  fechaRespuesta: string;
  diasPendientes: number | null;
  semaforo: "verde" | "amarillo" | "rojo" | "sin_dato";
  estado: "resuelto" | "vencido" | "pendiente";
  tipoRespuesta: string;
  anio: string;
  mes: string;
  observaciones: string;
}

export interface SheetAudit {
  hoja: string;
  label: string;
  registros: number;
  columnas: string[];
  columnasMapeadas: string[];
  columnasNoMapeadas: string[];
  error?: string;
}

const clean = (v: unknown): string => {
  const s = (v ?? "").toString().trim();
  if (!s || s.startsWith("#")) return ""; // #N/A, #VALUE!, #REF!
  return s;
};

const pick = (row: Record<string, string>, keys?: string[]): string => {
  if (!keys) return "";
  for (const k of keys) {
    const v = clean(row[k]);
    if (v) return v;
  }
  return "";
};

const toNumber = (v: string): number | null => {
  if (!v) return null;
  const n = Number(v.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const normalizeSemaforo = (raw: string, dias: number | null): UnifiedRecord["semaforo"] => {
  const s = raw.toUpperCase();
  if (s.includes("VENCID") || s.includes("ROJO")) return "rojo";
  if (s.includes("AMARILL") || s.includes("PROXIM") || s.includes("PRÓXIM")) return "amarillo";
  if (s.includes("VERDE") || s.includes("TIEMPO") || s.includes("CUMPL")) return "verde";
  if (dias === null) return "sin_dato";
  if (dias < 0) return "rojo";
  if (dias <= 3) return "amarillo";
  return "verde";
};

const MESES = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

const normalizeMes = (raw: string): string => {
  const s = raw.toUpperCase().trim();
  if (!s) return "";
  const n = Number(s);
  if (Number.isFinite(n) && n >= 1 && n <= 12) return MESES[n - 1];
  const found = MESES.find((m) => s.startsWith(m.slice(0, 3)));
  return found ?? s;
};

function mapRow(row: Record<string, string>, cfg: SourceConfig, index: number): UnifiedRecord {
  const f = cfg.fields;
  const diasPendientes = toNumber(pick(row, f.diasPendientes));
  const fechaRespuesta = pick(row, f.fechaRespuesta);
  const semaforoRaw = pick(row, f.semaforo);
  const semaforo = normalizeSemaforo(semaforoRaw, diasPendientes);

  const estado: UnifiedRecord["estado"] = fechaRespuesta
    ? "resuelto"
    : semaforo === "rojo"
      ? "vencido"
      : "pendiente";

  return {
    id: `${cfg.sheet}-${index + 2}`,
    hoja: cfg.sheet,
    hojaLabel: cfg.label,
    canal: pick(row, f.canal) || "SIN CANAL",
    funcionario: pick(row, f.funcionario) || "SIN ASIGNAR",
    tipoRenta: pick(row, f.tipoRenta) || "SIN CLASIFICAR",
    tipoTramite: pick(row, f.tipoTramite) || "SIN CLASIFICAR",
    item: pick(row, f.item),
    contribuyente: pick(row, f.contribuyente),
    expediente: pick(row, f.expediente),
    identificador: pick(row, f.identificador),
    fechaIngreso: pick(row, f.fechaIngreso),
    fechaVencimiento: pick(row, f.fechaVencimiento),
    fechaRespuesta,
    diasPendientes,
    semaforo,
    estado,
    tipoRespuesta: pick(row, f.tipoRespuesta),
    anio: pick(row, f.anio),
    mes: normalizeMes(pick(row, f.mes)),
    observaciones: pick(row, f.observaciones),
  };
}

export function useDashboardData() {
  const [records, setRecords] = useState<UnifiedRecord[]>([]);
  const [audit, setAudit] = useState<SheetAudit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        DASHBOARD_SOURCES.map(async (cfg) => {
          try {
            const res = await readSheet(cfg.sheet);
            const rows = (res?.[cfg.sheet] ?? []) as Record<string, string>[];
            return { cfg, rows, error: undefined as string | undefined };
          } catch (e) {
            return { cfg, rows: [] as Record<string, string>[], error: (e as Error).message };
          }
        })
      );

      const allRecords: UnifiedRecord[] = [];
      const audits: SheetAudit[] = [];

      for (const { cfg, rows, error: sheetError } of results) {
        const columnas = rows.length ? Object.keys(rows[0]).filter((c) => c.trim() !== "") : [];
        const mapeadas = new Set(
          Object.values(cfg.fields)
            .flat()
            .filter((h): h is string => !!h && columnas.includes(h))
        );

        audits.push({
          hoja: cfg.sheet,
          label: cfg.label,
          registros: rows.length,
          columnas,
          columnasMapeadas: [...mapeadas],
          columnasNoMapeadas: columnas.filter((c) => !mapeadas.has(c)),
          error: sheetError,
        });

        rows.forEach((row, i) => allRecords.push(mapRow(row, cfg, i)));
      }

      setRecords(allRecords);
      setAudit(audits);
      setLastUpdate(new Date());
      if (audits.every((a) => a.error)) setError("No fue posible leer las hojas de cálculo");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { records, audit, isLoading, error, lastUpdate, refresh: fetchAll };
}

export interface DashboardFilters {
  hoja: string;
  funcionario: string;
  anio: string;
  tipoRenta: string;
  semaforo: string;
}

const countBy = (items: UnifiedRecord[], key: (r: UnifiedRecord) => string) => {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
};

export function useDashboardMetrics(records: UnifiedRecord[], filters: DashboardFilters) {
  return useMemo(() => {
    const base = records.filter((r) =>
      filters.hoja === "all" ? r.hoja !== CONSOLIDADO_SHEET : r.hoja === filters.hoja
    );

    const data = base.filter(
      (r) =>
        (filters.funcionario === "all" || r.funcionario === filters.funcionario) &&
        (filters.anio === "all" || r.anio === filters.anio) &&
        (filters.tipoRenta === "all" || r.tipoRenta === filters.tipoRenta) &&
        (filters.semaforo === "all" || r.semaforo === filters.semaforo)
    );

    const total = data.length;
    const resueltos = data.filter((r) => r.estado === "resuelto").length;
    const vencidos = data.filter((r) => r.estado === "vencido").length;
    const pendientes = total - resueltos - vencidos;

    const diasList = data.map((r) => r.diasPendientes).filter((d): d is number => d !== null);
    const tiempoPromedio = diasList.length
      ? Math.round(diasList.reduce((a, b) => a + b, 0) / diasList.length)
      : 0;

    // Eficacia = resueltos / total ; Eficiencia = resueltos a tiempo / resueltos
    const resueltosATiempo = data.filter(
      (r) => r.estado === "resuelto" && r.semaforo !== "rojo"
    ).length;
    const eficacia = total ? Math.round((resueltos / total) * 1000) / 10 : 0;
    const eficiencia = resueltos ? Math.round((resueltosATiempo / resueltos) * 1000) / 10 : 0;

    const funcionariosMap = countBy(data, (r) => r.funcionario);
    const funcionariosActivos = funcionariosMap.size;

    const distribucionPorFuncionario = [...funcionariosMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([funcionario, procesos]) => ({ funcionario, procesos }));

    const procesosPorCanal = [...countBy(data, (r) => r.canal).entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    const porTipoRenta = [...countBy(data, (r) => r.tipoRenta).entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    const porTipoTramite = [...countBy(data, (r) => r.tipoTramite).entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    const porItem = [...countBy(data, (r) => r.item).entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    const porTipoRespuesta = [...countBy(data, (r) => r.tipoRespuesta).entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Cumplimiento por hoja (base)
    const cumplimientoPorProceso = DASHBOARD_SOURCES.filter(
      (s) => s.sheet !== CONSOLIDADO_SHEET
    ).map((s) => {
      const rows = data.filter((r) => r.hoja === s.sheet);
      const done = rows.filter((r) => r.estado === "resuelto").length;
      return {
        proceso: s.label,
        cumplimiento: rows.length ? Math.round((done / rows.length) * 100) : 0,
        meta: 85,
        total: rows.length,
      };
    });

    // Evolución mensual (ingresados vs resueltos)
    const evolucionMensual = MESES.map((mes) => {
      const rows = data.filter((r) => r.mes === mes);
      return {
        mes: mes.slice(0, 3),
        ingresados: rows.length,
        resueltos: rows.filter((r) => r.estado === "resuelto").length,
      };
    }).filter((m) => m.ingresados > 0);

    const semaforoResumen = {
      verde: data.filter((r) => r.semaforo === "verde").length,
      amarillo: data.filter((r) => r.semaforo === "amarillo").length,
      rojo: data.filter((r) => r.semaforo === "rojo").length,
      sinDato: data.filter((r) => r.semaforo === "sin_dato").length,
    };

    const alerts = data
      .filter((r) => r.estado !== "resuelto" && r.semaforo !== "verde" && r.semaforo !== "sin_dato")
      .sort((a, b) => (a.diasPendientes ?? 0) - (b.diasPendientes ?? 0))
      .slice(0, 12)
      .map((r) => ({
        id: r.id,
        tipo: r.hojaLabel,
        funcionario: r.funcionario,
        descripcion:
          [r.identificador, r.contribuyente, r.tipoTramite].filter(Boolean).join(" · ") ||
          "Proceso sin identificador",
        diasPendientes: r.diasPendientes ?? 0,
        semaforo: r.semaforo as "verde" | "amarillo" | "rojo",
        fechaVencimiento: r.fechaVencimiento,
      }));

    const options = {
      funcionarios: [...new Set(base.map((r) => r.funcionario))].filter(Boolean).sort(),
      anios: [...new Set(base.map((r) => r.anio))].filter(Boolean).sort().reverse(),
      tiposRenta: [...new Set(base.map((r) => r.tipoRenta))].filter(Boolean).sort(),
    };

    return {
      data,
      kpis: {
        total,
        resueltos,
        pendientes,
        vencidos,
        tiempoPromedio,
        eficiencia,
        eficacia,
        funcionariosActivos,
      },
      distribucionPorFuncionario,
      procesosPorCanal,
      porTipoRenta,
      porTipoTramite,
      porItem,
      porTipoRespuesta,
      cumplimientoPorProceso,
      evolucionMensual,
      semaforoResumen,
      alerts,
      options,
    };
  }, [records, filters]);
}
