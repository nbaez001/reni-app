export class CuentaSistemaModificarRequest {
    idUsuario: number;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    fecNacimiento: Date;
    sexo: string;
    idArea: number;
    idCargo: number;
    usuario: string;
    contrasenia: string;
    idPerfil: number;
    idUsuarioModif: number
    listaServicios: number[];
    flgReporteDisociado: number;
}