export class CuentaSistemaRegistrarRequest {
    idPersona: number;
    tipoDocumento: number;
    nroDocumento: string;
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
    idUsuarioCrea: number
    listaServicios: number[];
    flgReporteDisociado: number;
}