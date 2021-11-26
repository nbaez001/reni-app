import { CentroAtencionCargaMasivaServicioRequest } from "./centro-atencion-carga-masiva-servicio.request";

export class CentroAtencionCargaMasivaDetalleRequest {
    nombre: string;
    codigo: string;
    fechaCreacion: Date;
    idtTipoCentro: string;
    nomTipoCentro: string;
    idtSubtipoCentro: string;
    nomSubtipoCentro: string;
    ubigeo: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    refDireccion: string;
    areaResid: string;
    flgTieneTelef: number;
    flgTieneLuz: number;
    flgTieneAgua: number;
    flgTieneDesague: number;
    capacidadMaxima: number;
    idTipDocRepres: number;
    nroDocRepres: string;
    nombreRepres: string;
    apePaternoRepres: string;
    apeMaternoRepres: string;
    nroTelefono: string;
    tipoCoordenada: string;
    coordenadaX: string;
    coordenadaY: string;
    flgActivo: number;
    listaServicio: CentroAtencionCargaMasivaServicioRequest[];

    error: any[];
}