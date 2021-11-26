import { ReporteIntervencionListarXlsxDetRequest } from "./reporte-intervencion-listar-xlsx-det.request";

export class ReporteIntervencionListarXlsxRequest {
    sqlFields: string;
    sqlTables: string;
    listaMapeo: ReporteIntervencionListarXlsxDetRequest[];
    listaEstructura: string;
}