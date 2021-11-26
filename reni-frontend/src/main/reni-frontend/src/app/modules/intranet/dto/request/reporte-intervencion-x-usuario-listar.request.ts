import { ReporteIntervencionXUsuarioListarDetRequest } from "./reporte-intervencion-x-usuario-listar-det.request";

export class ReporteIntervencionXUsuarioListarRequest {
    sqlFields: string;
    sqlTables: string;
    listaMapeo: ReporteIntervencionXUsuarioListarDetRequest[];
    tipDocUsu: string;
    nroDocUsu: string;
    codUsu: string;
}