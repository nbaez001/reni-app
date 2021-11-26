import { ReporteIntervencionListarDetRequest } from "./reporte-intervencion-listar-det.request";

export class ReporteIntervencionListarRequest {
    sqlFields: string;
    sqlTables: string;
    listaMapeo: ReporteIntervencionListarDetRequest[];
    listaEstructura: string;
}