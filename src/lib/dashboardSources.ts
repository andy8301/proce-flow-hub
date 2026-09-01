// Mapeo dinámico entre las hojas de Google Sheets y el modelo unificado del Dashboard.
// Cada entrada lista los posibles encabezados reales (respetando espacios/tildes) de cada hoja.

export interface SourceConfig {
  /** Nombre exacto de la pestaña en Google Sheets */
  sheet: string;
  /** Etiqueta corta para la UI */
  label: string;
  /** Encabezados candidatos por campo lógico */
  fields: {
    canal?: string[];
    funcionario?: string[];
    tipoRenta?: string[];
    tipoTramite?: string[];
    item?: string[];
    contribuyente?: string[];
    expediente?: string[];
    identificador?: string[];
    fechaIngreso?: string[];
    fechaVencimiento?: string[];
    fechaRespuesta?: string[];
    diasPendientes?: string[];
    semaforo?: string[];
    tipoRespuesta?: string[];
    anio?: string[];
    mes?: string[];
    observaciones?: string[];
  };
}

export const DASHBOARD_SOURCES: SourceConfig[] = [
  {
    sheet: 'Base Olga',
    label: 'Base Olga',
    fields: {
      canal: ['Canal de ingreso'],
      funcionario: ['FUNCIONARIO ENCARGADO'],
      tipoRenta: ['TIPO DE RENTA'],
      tipoTramite: ['TIPO DE TRAMITE'],
      item: ['ITEM'],
      contribuyente: ['CONTRIBUYENTE '],
      expediente: ['No.  EXPEDIENTE'],
      identificador: ['No. ACTO ADMINISTRATIVO Y No. SADE', 'No consecutivo'],
      fechaIngreso: ['FECHA DE RECIBIDO', 'FECHA ACTO (DD-MM-AAAA)'],
      fechaVencimiento: ['FECHA DE VENCIMIENTO'],
      fechaRespuesta: ['FECHA RESOLUCION/SADE SALIDA'],
      diasPendientes: ['DIAS PENDIENTES'],
      semaforo: ['SEMAFORO DE VENCIMIENTO'],
      tipoRespuesta: ['TIPO DE RESPUESTA FINAL', 'TIPO DE RESPUESTA'],
      anio: ['AÑO INGRESO'],
      mes: ['MES'],
      observaciones: ['OBSERVACIONES'],
    },
  },
  {
    sheet: 'BASE CORREOS ELECTRONICOS',
    label: 'Correos',
    fields: {
      canal: ['CANAL DE INGRESO'],
      funcionario: ['FUNCIONARIO ENCARGADO'],
      tipoRenta: ['TIPO DE RENTA'],
      tipoTramite: ['TIPO DE TRAMITE'],
      item: ['ITEM'],
      contribuyente: ['CONTRIBUYENTE O SOLICITANTE'],
      expediente: ['NO EXPEDIENTE'],
      identificador: ['No DE SADE DE SALIDA'],
      fechaIngreso: ['FECHA ASIGNACION', 'FECHA CORREO (DD-MM-AAAA)'],
      fechaVencimiento: ['FECHA DE VENCIMIENTO'],
      fechaRespuesta: ['FECHA RESPUESTA (DD-MM-AAAA)'],
      diasPendientes: ['DIAS PENDIENTES'],
      semaforo: ['SEMAFORO'],
      tipoRespuesta: ['TIPO DE RESPUESTA'],
      anio: ['AÑO INGRESO'],
      mes: ['MES INGRESO', 'MES'],
      observaciones: ['OBSERVACIONES'],
    },
  },
  {
    sheet: 'Base NEXURA',
    label: 'Nexura',
    fields: {
      canal: ['CANAL DE INGRESO', 'Canal de ingreso'],
      funcionario: ['FUNCIONARIO ENCARGADO', 'Responsable'],
      tipoRenta: ['TIPO DE RENTA'],
      tipoTramite: ['TIPO DE TRAMITE', 'Tipo de solicitud'],
      item: ['ITEM'],
      contribuyente: ['Nombre del solicitante'],
      expediente: ['No Expediente'],
      identificador: ['No. radicación'],
      fechaIngreso: ['Fecha ingreso', 'Fecha de Registro'],
      fechaVencimiento: ['Fecha límite de respuesta'],
      fechaRespuesta: ['FECHA DE RESPUESTA', 'Fecha de respuesta'],
      diasPendientes: ['DIAS PENDIENTES', 'Días hábiles restantes'],
      semaforo: ['SEMAFORO DE VENCIMIENTO'],
      tipoRespuesta: ['TIPO DE RESPUESTA'],
      anio: ['AÑO INGRESO'],
      mes: ['MES INGRESO'],
      observaciones: ['Requerimiento'],
    },
  },
  {
    sheet: 'Base Traslados Fiscalización',
    label: 'Fiscalización',
    fields: {
      canal: ['CANAL DE INGRESO'],
      funcionario: ['FUNCIONARIO ENCARGADO'],
      tipoRenta: ['TIPO DE RENTA'],
      tipoTramite: ['TIPO DE TRAMITE'],
      item: ['ITEM'],
      contribuyente: ['CONTRIBUYENTE'],
      expediente: ['No. EXPEDIENTE'],
      identificador: ['No. ACTO ADMINISTRATIVO Y No. SADE'],
      fechaIngreso: ['FECHA PLANILLA INGRESO', 'FECHA ACTO (DD-MM-AAAA)'],
      fechaVencimiento: ['FECHA DE VENCIMIENTO'],
      fechaRespuesta: ['FECHA RESOLUCION/SADE DE SALIDA'],
      diasPendientes: ['DIAS PENDIENTES'],
      semaforo: ['SEMAFORO DE VENCIMIENTO'],
      tipoRespuesta: ['TIPO DE RESPUESTA'],
      anio: ['VIGENCIA (año)', 'AÑO INGRESO'],
      mes: ['MES INGRESO', 'PERIODO (mes)'],
      observaciones: ['OBSERVACIONES'],
    },
  },
  {
    sheet: 'BASE TUTELAS',
    label: 'Tutelas',
    fields: {
      canal: ['CANAL DE INGRESO'],
      funcionario: ['FUNCIONARIO ENCARGADO'],
      tipoRenta: ['TIPO DE RENTA'],
      tipoTramite: ['TIPO DE TRAMITE'],
      item: ['ITEM'],
      contribuyente: ['CONTRIBUYENTE O SOLICITANTE'],
      identificador: ['ASUNTO CORREO'],
      fechaIngreso: ['FECHA ASIGNACION'],
      fechaVencimiento: ['FECHA DE VENCIMIENTO'],
      fechaRespuesta: ['FECHA RESPUESTA DERECHO DE PETICIÓN DD-MM-AAAA'],
      diasPendientes: ['DIAS PENDIENTES'],
      semaforo: ['SEMAFORO'],
      mes: ['MES'],
      observaciones: ['OBSERVACIONES'],
    },
  },
  {
    sheet: 'CONSOLIDADO BASES',
    label: 'Consolidado',
    fields: {
      canal: ['Canal de ingreso'],
      funcionario: ['FUNCIONARIO ENCARGADO'],
      tipoRenta: ['TIPO DE RENTA'],
      tipoTramite: ['TIPO DE TRAMITE'],
      item: ['ITEM'],
      contribuyente: ['CONTRIBUYENTE '],
      expediente: ['No.  EXPEDIENTE'],
      identificador: ['No. ACTO ADMINISTRATIVO Y No. SADE'],
      fechaIngreso: ['FECHA ACTO (DD-MM-AAAA)'],
      fechaVencimiento: ['FECHA DE VENCIMIENTO'],
      fechaRespuesta: ['FECHA RESPUESTA'],
      diasPendientes: ['DIAS FALTANTES'],
      semaforo: ['SEMAFORO'],
      tipoRespuesta: ['TIPO DE RESPUESTA'],
      anio: ['AÑO INGRESO'],
      mes: ['MES INGRESO'],
      observaciones: ['OBSERVACION'],
    },
  },
];
