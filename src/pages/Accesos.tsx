import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Search, Users } from "lucide-react";

interface LoginEvent {
  id: string;
  email: string | null;
  full_name: string | null;
  event_type: string;
  user_agent: string | null;
  occurred_at: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

export default function AccesosPage() {
  const [events, setEvents] = useState<LoginEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("login_events")
      .select("id,email,full_name,event_type,user_agent,occurred_at")
      .order("occurred_at", { ascending: false })
      .limit(500);
    setEvents((data as LoginEvent[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = events.filter((e) =>
    `${e.email ?? ""} ${e.full_name ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  const usuariosUnicos = new Set(events.map((e) => e.email)).size;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Registro de accesos</h1>
          <p className="text-muted-foreground text-sm">
            Quién ingresó, con qué correo, en qué fecha y a qué hora.
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de ingresos</CardDescription>
            <CardTitle className="text-3xl">{events.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Usuarios distintos
            </CardDescription>
            <CardTitle className="text-3xl">{usuariosUnicos}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por correo o nombre..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Fecha y hora</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Dispositivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.full_name || "—"}</TableCell>
                  <TableCell>{e.email || "—"}</TableCell>
                  <TableCell>{fmt(e.occurred_at)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{e.event_type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground">
                    {e.user_agent || "—"}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Aún no hay accesos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
