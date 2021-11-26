import { EstructuraRegistrarParametroRequest } from "./estructura-registrar-parametro.request";

export class EstructuraRegistrarRequest {
    nombre: string;
    descripcion: string;
    idtTipoUsuario: string;
    idServicio: number;
    idEstructuraRepl: number;
    listaParametro: EstructuraRegistrarParametroRequest[];
    idUsuarioCrea: number;
}