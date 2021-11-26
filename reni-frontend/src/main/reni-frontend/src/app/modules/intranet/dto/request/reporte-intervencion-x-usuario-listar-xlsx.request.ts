import { ReporteIntervencionXUsuarioListarXlsxDetRequest } from "./reporte-intervencion-x-usuario-listar-xlsx-det.request";

export class ReporteIntervencionXUsuarioListarXlsxRequest {
    sqlFields: string;
    sqlTables: string;
    listaMapeo: ReporteIntervencionXUsuarioListarXlsxDetRequest[];
    tipDocUsu: string;
    nroDocUsu: string;
    codUsu: string;
}