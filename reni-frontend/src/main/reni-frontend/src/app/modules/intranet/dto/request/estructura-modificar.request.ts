import { EstructuraModificarParametroRequest } from "./estructura-modificar-parametro.request";
import { EstructuraRegistrarParametroRequest } from "./estructura-registrar-parametro.request";

export class EstructuraModificarRequest {
    idEstructura: number;
    nombre: string;
    descripcion: string;
    idtTipoUsuario: string;
    idServicio: number;
    idEstructuraRepl: number;
    listaParametro: EstructuraRegistrarParametroRequest[];
    listaParametroMod: EstructuraModificarParametroRequest[];
    listaParametroElim: number[];
    idUsuarioModif: number;
}