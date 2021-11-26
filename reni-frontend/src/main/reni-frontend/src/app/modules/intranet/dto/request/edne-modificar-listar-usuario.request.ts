import { EdneModificarListarUsuarioDetRequest } from "./edne-modificar-listar-usuario-det.request";

export class EdneModificarListarUsuarioRequest {
    idEdne: number;
    query: string;
    listaMapeo: EdneModificarListarUsuarioDetRequest[];
}