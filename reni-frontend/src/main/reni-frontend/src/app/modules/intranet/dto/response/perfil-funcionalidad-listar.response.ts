export class PerfilFuncionalidadListarResponse {
    idFuncionalidad: number;
    idFuncionalidadPadre: number;
    titulo: string;
    referencia: string;
    listaFuncionalidad: PerfilFuncionalidadListarResponse[];

    selected: boolean = false;
    existe: boolean = false;
}