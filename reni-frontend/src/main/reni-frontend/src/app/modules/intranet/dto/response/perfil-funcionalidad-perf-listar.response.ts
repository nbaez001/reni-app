export class PerfilFuncionalidadPerfListarResponse {
    idFuncionalidad: number;
    idFuncionalidadPadre: number;
    titulo: string;
    referencia: string;
    imagen: string;
    orden: number;
    flgActivo: number;
    listaFuncionalidad: PerfilFuncionalidadPerfListarResponse[];
}