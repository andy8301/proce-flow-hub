import { useState, useEffect } from "react";
import { ProcessTable } from "@/components/common/ProcessTable";
import { BaseOlgaForm } from "@/components/forms/BaseOlgaForm";
import { BaseOlga } from "@/types/processes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { readSheet, appendToSheet, updateSheetRow, SHEET_NAMES } from "@/lib/googleSheets";

// Helper to convert sheet row to BaseOlga object
function rowToBaseOlga(row: string[], index: number): BaseOlga {
  const fechaVencimiento = row[28] || new Date().toISOString();
  const diasPendientes = Math.ceil((new Date(fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    id: `row-${index + 2}`, // +2 because row 1 is headers, and we're 0-indexed
    consecutivo: row[0] || "",
    canalIngreso: row[1] || "",
    areaRemitente: row[2] || "",
    planilla: row[3] || "",
    expediente: row[4] || "",
    fechaRadicacion: row[5] || "",
    actoAdministrativo: row[6] || "",
    numeroActo: row[7] || "",
    fechaActo: row[8] || "",
    placa: row[9] || "",
    identificacion: row[10] || "",
    contribuyente: row[11] || "",
    ciudadDepartamento: row[12] || "",
    funcionarioEncargado: row[13] || "",
    fechaRecibido: row[14] || "",
    tipoRenta: row[15] || "",
    tipoTramite: row[16] || "",
    item: row[17] || "",
    numeroResolucion: row[18] || "",
    numeroSadeSalida: row[19] || "",
    fechaResolucion: row[20] || "",
    tipoRespuesta: row[21] || "",
    fechaEjecutoria: row[22] || "",
    traslado: row[23] || "",
    cerradoPasadoArchivo: row[24] || "",
    ubicacionFisica: row[25] || "",
    observacionSade: row[26] || "",
    fechaVencimiento: fechaVencimiento,
    fechaIngreso: row[14] || new Date().toISOString(),
    diasPendientes: diasPendientes,
    semaforo: diasPendientes < 0 ? 'rojo' : diasPendientes <= 5 ? 'amarillo' : 'verde',
    estado: row[24] === 'Si' ? 'resuelto' : diasPendientes < 0 ? 'vencido' : 'pendiente',
  };
}

// Helper to convert BaseOlga object to sheet row
function baseOlgaToRow(data: BaseOlga): string[] {
  return [
    data.consecutivo,
    data.canalIngreso,
    data.areaRemitente,
    data.planilla,
    data.expediente,
    data.fechaRadicacion,
    data.actoAdministrativo,
    data.numeroActo,
    data.fechaActo,
    data.placa,
    data.identificacion,
    data.contribuyente,
    data.ciudadDepartamento,
    data.funcionarioEncargado,
    data.fechaRecibido,
    data.tipoRenta,
    data.tipoTramite,
    data.item,
    data.numeroResolucion,
    data.numeroSadeSalida,
    data.fechaResolucion,
    data.tipoRespuesta,
    data.fechaEjecutoria,
    data.traslado,
    data.cerradoPasadoArchivo,
    data.ubicacionFisica,
    data.observacionSade,
    "", // Días pendientes (calculated)
    data.fechaVencimiento,
  ];
}

export default function BaseOlgaPage() {
  const [data, setData] = useState<BaseOlga[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BaseOlga | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const columns = [
    { key: 'consecutivo', label: 'Consecutivo' },
    { key: 'expediente', label: 'Expediente' },
    { key: 'contribuyente', label: 'Contribuyente' },
    { key: 'funcionarioEncargado', label: 'Funcionario' },
    { key: 'tipoTramite', label: 'Tipo Trámite' },
    { 
      key: 'fechaVencimiento', 
      label: 'Fecha Vencimiento',
      render: (item: BaseOlga) => {
        try {
          return new Date(item.fechaVencimiento).toLocaleDateString();
        } catch {
          return item.fechaVencimiento || '-';
        }
      }
    }
  ];

  // Fetch data from Google Sheets
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await readSheet(SHEET_NAMES.BASE_OLGA);
      const sheetData = result[SHEET_NAMES.BASE_OLGA] || [];
      
      // Skip header row and convert to BaseOlga objects
      const records = sheetData.slice(1).map((row: string[], index: number) => rowToBaseOlga(row, index));
      setData(records);
      console.log(`Loaded ${records.length} records from Base Olga`);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos de Google Sheets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (formData: BaseOlga) => {
    setIsSaving(true);
    try {
      const rowData = baseOlgaToRow(formData);
      
      if (editingItem) {
        // Update existing row - extract row number from id
        const rowNumber = parseInt(editingItem.id.replace('row-', ''));
        const range = `A${rowNumber}:AC${rowNumber}`;
        await updateSheetRow(SHEET_NAMES.BASE_OLGA, range, rowData);
        toast.success("Registro actualizado exitosamente en Google Sheets");
      } else {
        // Append new row
        await appendToSheet(SHEET_NAMES.BASE_OLGA, rowData);
        toast.success("Registro creado exitosamente en Google Sheets");
      }
      
      // Refresh data
      await fetchData();
      setIsDialogOpen(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error al guardar los datos en Google Sheets");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: BaseOlga) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Base Olga
          </h1>
          <p className="text-muted-foreground text-lg">
            Gestión de expedientes y actos administrativos
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchData} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Editar Registro' : 'Nuevo Registro'} - Base Olga
                </DialogTitle>
              </DialogHeader>
              <BaseOlgaForm
                onSubmit={handleSubmit}
                initialData={editingItem}
                mode={editingItem ? 'edit' : 'create'}
              />
              {isSaving && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Guardando...</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando datos...</span>
        </div>
      ) : (
        <ProcessTable
          title="Expedientes y Actos Administrativos"
          description={`Seguimiento completo de expedientes, planillas y resoluciones (${data.length} registros)`}
          data={data}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
