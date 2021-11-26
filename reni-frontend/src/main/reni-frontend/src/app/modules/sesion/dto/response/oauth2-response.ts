export class Oauth2Response {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;

    idUsuario: number;
    idModulo: number;
    idPersona: number;
    idTipDocumento: number;
    nomTipDocumento: string;
    nroDocumento: string;
    apePaterno: string;
    apeMaterno: string;
    nombres: string;
    idCargo: number;
    nomCargo: string;
    idArea: number;
    nomArea: string;
    idPerfil: number;
    nomPerfil: string;
    jti: string;
}