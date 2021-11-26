import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReporteIntervencionListarEntidadPermitidoRequest } from '../dto/request/reporte-intervencion-listar-entidad-permitido.request';
import { ReporteIntervencionListarEstructuraPermitidoRequest } from '../dto/request/reporte-intervencion-listar-estructura-permitido.request';
import { ReporteIntervencionListarLineaInterPermitidoRequest } from '../dto/request/reporte-intervencion-listar-linea-inter-permitido.request';
import { ReporteIntervencionListarServicioPermitidoRequest } from '../dto/request/reporte-intervencion-listar-servicio-permitido.request';
import { ReporteIntervencionListarUsuarioXDatosRequest } from '../dto/request/reporte-intervencion-listar-usuario-x-datos.request';
import { ReporteIntervencionListarXlsxRequest } from '../dto/request/reporte-intervencion-listar-xlsx.request';
import { ReporteIntervencionListarRequest } from '../dto/request/reporte-intervencion-listar.request';
import { ReporteIntervencionXUsuarioListarXlsxRequest } from '../dto/request/reporte-intervencion-x-usuario-listar-xlsx.request';
import { ReporteIntervencionXUsuarioListarRequest } from '../dto/request/reporte-intervencion-x-usuario-listar.request';
import { ReporteParametroEstrucListarRequest } from '../dto/request/reporte-parametro-estruc-listar.request';
import { ReporteParametroEstrucXUsuListarRequest } from '../dto/request/reporte-parametro-estruc-x-usu-listar.request';
import { ReportePlantillaRequest } from '../dto/request/reporte-plantilla.request';
import { EntidadListarResponse } from '../dto/response/entidad-listar.response';
import { FileResponse } from '../dto/response/file.response';
import { LineaIntervencionListarResponse } from '../dto/response/linea-intervencion-listar.response';
import { OutResponse } from '../dto/response/out.response';
import { ReporteIntervencionListarEstructuraPermitidoResponse } from '../dto/response/reporte-intervencion-listar-estructura-permitido.response';
import { ReporteIntervencionListarUsuarioXDatosResponse } from '../dto/response/reporte-intervencion-listar-usuario-x-datos.response';
import { ReporteParametroEstrucListarResponse } from '../dto/response/reporte-parametro-estruc-listar.response';
import { ServicioListarResponse } from '../dto/response/servicio-listar.response';

@Injectable()
export class ReporteService {

  constructor(private http: HttpClient) { }

  public listarParametroEstructura(req: ReporteParametroEstrucListarRequest): Observable<OutResponse<ReporteParametroEstrucListarResponse[]>> {
    return this.http.post<OutResponse<ReporteParametroEstrucListarResponse[]>>(`${environment.reniBackendUrl}/reporte/listarParametroEstructura`, req);
  }

  public listarReporteIntervencion(req: ReporteIntervencionListarRequest): Observable<OutResponse<any[]>> {
    return this.http.post<OutResponse<any[]>>(`${environment.reniBackendUrl}/reporte/listarReporteIntervencion`, req);
  }

  public listarReporteIntervencionXlsx(req: ReporteIntervencionListarXlsxRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/reporte/listarReporteIntervencionXlsx`, req);
  }

  public listarEntidadPermitido(req: ReporteIntervencionListarEntidadPermitidoRequest): Observable<OutResponse<EntidadListarResponse[]>> {
    return this.http.post<OutResponse<EntidadListarResponse[]>>(`${environment.reniBackendUrl}/reporte/listarEntidadPermitido`, req);
  }

  public listarLineaInterPermitido(req: ReporteIntervencionListarLineaInterPermitidoRequest): Observable<OutResponse<LineaIntervencionListarResponse[]>> {
    return this.http.post<OutResponse<LineaIntervencionListarResponse[]>>(`${environment.reniBackendUrl}/reporte/listarLineaInterPermitido`, req);
  }

  public listarServicioPermitido(req: ReporteIntervencionListarServicioPermitidoRequest): Observable<OutResponse<ServicioListarResponse[]>> {
    return this.http.post<OutResponse<ServicioListarResponse[]>>(`${environment.reniBackendUrl}/reporte/listarServicioPermitido`, req);
  }

  public listarEstructuraPermitido(req: ReporteIntervencionListarEstructuraPermitidoRequest): Observable<OutResponse<ReporteIntervencionListarEstructuraPermitidoResponse[]>> {
    return this.http.post<OutResponse<ReporteIntervencionListarEstructuraPermitidoResponse[]>>(`${environment.reniBackendUrl}/reporte/listarEstructuraPermitido`, req);
  }

  public listarParametroEstructuraXUsu(req: ReporteParametroEstrucXUsuListarRequest): Observable<OutResponse<ReporteParametroEstrucListarResponse[]>> {
    return this.http.post<OutResponse<ReporteParametroEstrucListarResponse[]>>(`${environment.reniBackendUrl}/reporte/listarParametroEstructuraXUsu`, req);
  }

  public listarReporteIntervencionXUsuario(req: ReporteIntervencionXUsuarioListarRequest): Observable<OutResponse<any[]>> {
    return this.http.post<OutResponse<any[]>>(`${environment.reniBackendUrl}/reporte/listarReporteIntervencionXUsuario`, req);
  }

  public listarUsuarioXDatos(req: ReporteIntervencionListarUsuarioXDatosRequest): Observable<OutResponse<ReporteIntervencionListarUsuarioXDatosResponse[]>> {
    return this.http.post<OutResponse<ReporteIntervencionListarUsuarioXDatosResponse[]>>(`${environment.reniBackendUrl}/reporte/listarUsuarioXDatos`, req);
  }

  public listarReporteIntervencionXUsuarioXlsx(req: ReporteIntervencionXUsuarioListarXlsxRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/reporte/listarReporteIntervencionXUsuarioXlsx`, req);
  }

  public descargarPlantilla(req: ReportePlantillaRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/reporte/descargarPlantilla`, req);
  }

  public convertToBlobFromByte(fResp: FileResponse): Blob {
    const byteCharacters = atob(fResp.data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fResp.type });
    const resultBlob: any = blob;
    resultBlob.lastModifiedDate = new Date();
    resultBlob.name = fResp.nombre;

    return blob;
  }

  public DownloadBlobFile(blob: any): void {
    const link = document.createElement('a');
    // link.target = '_blank';
    link.download = blob.name;
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }
}
