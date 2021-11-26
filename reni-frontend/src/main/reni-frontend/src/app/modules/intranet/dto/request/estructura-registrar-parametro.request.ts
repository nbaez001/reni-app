export class EstructuraRegistrarParametroRequest {
    nomCampoExcel: string;
    ordenCampoExcel: number;
    nomTablaBd: string;
    nomCampoBd: string;
    campoEsFk: number;
    campoIdmaestra: string;
    descripcion: string;

    error: any[] = [];
    errorTablaBDExiste: boolean;
    errorCampoBDExiste: boolean;

}