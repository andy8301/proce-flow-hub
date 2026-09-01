import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SheetAudit } from "@/hooks/useDashboardData";
import { Database } from "lucide-react";

interface FieldAuditPanelProps {
  audit: SheetAudit[];
}

export function FieldAuditPanel({ audit }: FieldAuditPanelProps) {
  return (
    <Card className="shadow-corporate">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Auditoría de campos por hoja
        </CardTitle>
        <CardDescription>
          Columnas detectadas en Google Sheets y su cobertura en el Dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {audit.map((a) => (
            <AccordionItem key={a.hoja} value={a.hoja}>
              <AccordionTrigger className="text-sm">
                <div className="flex flex-wrap items-center gap-2 text-left">
                  <span className="font-medium">{a.label}</span>
                  <Badge variant="outline">{a.registros.toLocaleString()} registros</Badge>
                  <Badge variant="secondary">{a.columnas.length} columnas</Badge>
                  <Badge variant="default">{a.columnasMapeadas.length} mapeadas</Badge>
                  {a.error && <Badge variant="destructive">error de lectura</Badge>}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {a.error && <p className="text-sm text-destructive mb-2">{a.error}</p>}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Campos integrados al Dashboard
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {a.columnasMapeadas.map((c) => (
                        <Badge key={c} variant="secondary" className="text-[10px] font-normal">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Campos disponibles en la hoja (detalle en cada módulo)
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {a.columnasNoMapeadas.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px] font-normal">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
