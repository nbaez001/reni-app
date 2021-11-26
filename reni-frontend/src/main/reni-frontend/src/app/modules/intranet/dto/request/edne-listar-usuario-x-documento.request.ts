import { EdneListarUsuarioXDocumentoDetRequest } from "./edne-listar-usuario-x-documento-det.request";

export class EdneListarUsuarioXDocumentoRequest {
    listaUsuarioDocumento: EdneListarUsuarioXDocumentoDetRequest[];
    campNroDoc: string;
    campTipDoc: string;
}