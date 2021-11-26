import { MaestraCargaMasivaDetalleRequest } from "./maestra-carga-masiva-detalle.request";

export class MaestraCargaMasivaRequest {
    listaMaestra: MaestraCargaMasivaDetalleRequest[];
    listaMaestraIds: string[];
    idUsuarioCrea: number;
}