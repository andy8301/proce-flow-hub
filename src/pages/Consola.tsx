import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getSheetNames, readSheet, SHEET_NAMES } from "@/lib/googleSheets";

const PAGE_SIZE = 50;

export default function ConsolaPage() {
  const [sheets, setSheets] = useState<string[]>(Object.values(SHEET_NAMES));
  const [selected, setSelected] = useState<string>(SHEET_NAMES.BASE_OLGA);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getSheetNames()
      .then((info) => {
        const titles = info.map((s) => s.title).filter(Boolean);
        if (titles.length) {
          setSheets(titles);
          setSelected((cur) => (titles.includes(cur) ? cur : titles[0]));
        }
      })
      .catch((e) => console.error("No se pudieron listar las hojas:", e));
  }, []);

  const fetchData = async (sheet: string) => {
    setIsLoading(true);
    try {
      const result = await readSheet(sheet);
      const data = (result[sheet] || []) as Record<string, string>[];
      setRows(data);
      setPage(1);
    } catch (error) {
      console.error("Error leyendo la hoja:", error);
      toast.error(`Error al cargar la hoja "${sheet}"`);
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selected) fetchData(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const headers = useMemo(() => {
    const set = new Set<string>();
    rows.slice(0, 200).forEach((r) => Object.keys(r).forEach((k) => set.add(k)));
    return Array.from(set);
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Consola de Datos</h1>
          <p className="text-muted-foreground text-lg">Selecciona la hoja origen y explora todos sus campos</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecciona una hoja" />
            </SelectTrigger>
            <SelectContent>
              {sheets.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-[220px]"
          />
          <Button variant="outline" onClick={() => fetchData(selected)} disabled={isLoading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{selected}</CardTitle>
          <CardDescription>
            {isLoading ? "Cargando datos..." : `${filtered.length} registros · ${headers.length} columnas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mr-2" />
              <span>Cargando datos...</span>
            </div>
          ) : headers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No hay datos en esta hoja.</p>
          ) : (
            <>
              <div className="overflow-auto max-h-[65vh] border border-border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((h) => (
                        <TableHead key={h} className="whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((r, i) => (
                      <TableRow key={i}>
                        {headers.map((h) => (
                          <TableCell key={h} className="whitespace-nowrap max-w-[320px] truncate" title={String(r[h] ?? "")}>
                            {String(r[h] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
