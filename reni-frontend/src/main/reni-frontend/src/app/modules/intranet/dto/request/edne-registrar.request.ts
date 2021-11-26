import { EdneListarParamEstructuraResponse } from "../response/edne-listar-param-estructura.response";
import { EdneRegistrarDetUsuarioRequest } from "./edne-registrar-det-usuario.request";

export class EdneRegistrarRequest {
    idEstructura: number;
    nomArchivo: string;
    fecImportacion: Date;
    fecPeriodo: Date;
    idtEstado: string;
    // listaUsuarioIdentificado: EdneRegistrarDetUsuarioRequest[];
    // listaUsuarioNoIdentificado: EdneRegistrarDetUsuarioRequest[];
    // queryUsuario: string;
    // queryUsuarioDetalle: string;
    // queryUsuarioIngreso: string;
    // queryAgenteExterno: string;
    // queryUsuarioActividad: string;
    // queryUsuarioSituacion: string;
    listaParametro: EdneListarParamEstructuraResponse[];
    listaUsuario: any[];
    
    idUsuarioCrea: number;
}