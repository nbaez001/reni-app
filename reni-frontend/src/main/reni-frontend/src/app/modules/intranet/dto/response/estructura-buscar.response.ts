import { EstructuraBuscarParametroResponse } from "./estructura-buscar-parametro.response";

export class EstructuraBuscarResponse {
    nombre: string;
    descripcion: string;
    idTipoUsuario: string;
    idServicio: number;
    nomServicio: string;
    idEntidad: number;
    nomEntidad: string;
    idLineaInter: number;
    nomLineaInter: string;
    idEstructuraRepl: number;
    nomEstructuraRepl: string;
    listaParametro: EstructuraBuscarParametroResponse[];
}