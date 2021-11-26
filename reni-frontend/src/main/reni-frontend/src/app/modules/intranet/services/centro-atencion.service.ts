import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { CentroAtencionServListarXTipCenRequest } from '../dto/centro-atencion-serv-listar-x-tipcen.request';
import { CentroAtencionAsociarServicioRequest } from '../dto/request/centro-atencion-asociar-servicio.request';
import { CentroAtencionCargaMasivaCentroListarRequest } from '../dto/request/centro-atencion-carga-masiva-centro-listar.request';
import { CentroAtencionCargaMasivaServListarRequest } from '../dto/request/centro-atencion-carga-masiva-serv-listar.request';
import { CentroAtencionCargaMasivaRequest } from '../dto/request/centro-atencion-carga-masiva.request';
import { CentroAtencionEliminarServicioAsocRequest } from '../dto/request/centro-atencion-eliminar-servicio-asoc.request';
import { CentroAtencionEliminarRequest } from '../dto/request/centro-atencion-eliminar.request';
import { CentroAtencionListarRequest } from '../dto/request/centro-atencion-listar.request';
import { CentroAtencionModificarRequest } from '../dto/request/centro-atencion-modificar.request';
import { CentroAtencionRegistrarRequest } from '../dto/request/centro-atencion-registrar.request';
import { CentroAtencionServListarXCentroRequest } from '../dto/request/centro-atencion-serv-listar-x-centro.request';
import { CentroAtencionAsociarServicioResponse } from '../dto/response/centro-atencion-asociar-servicio.response';
import { CentroAtencionCargaMasivaCentroListarResponse } from '../dto/response/centro-atencion-carga-masiva-centro-listar.response';
import { CentroAtencionCargaMasivaServListarResponse } from '../dto/response/centro-atencion-carga-masiva-serv-listar.response';
import { CentroAtencionListarResponse } from '../dto/response/centro-atencion-listar.response';
import { CentroAtencionRegistrarResponse } from '../dto/response/centro-atencion-registrar.response';
import { CentroAtencionServListarXCentroResponse } from '../dto/response/centro-atencion-serv-listar-x-centro.response';
import { CentroAtencionServListarXTipCenResponse } from '../dto/response/centro-atencion-serv-listar-x-tipcen.response';
import { FileResponse } from '../dto/response/file.response';

@Injectable()
export class CentroAtencionService {

  constructor(private http: HttpClient) { }

  public listarCentroAtencion(req: CentroAtencionListarRequest): Observable<OutResponse<CentroAtencionListarResponse[]>> {
    return this.http.post<OutResponse<CentroAtencionListarResponse[]>>(`${environment.reniBackendUrl}/centro-atencion/listarCentroAtencion`, req);
  }

  public listarCentroAtencionLigero(req: CentroAtencionListarRequest): Observable<OutResponse<CentroAtencionListarResponse[]>> {
    return this.http.post<OutResponse<CentroAtencionListarResponse[]>>(`${environment.reniBackendUrl}/centro-atencion/listarCentroAtencionLigero`, req);
  }

  public registrarCentroAtencion(req: CentroAtencionRegistrarRequest): Observable<OutResponse<CentroAtencionRegistrarResponse>> {
    return this.http.post<OutResponse<CentroAtencionRegistrarResponse>>(`${environment.reniBackendUrl}/centro-atencion/registrarCentroAtencion`, req);
  }

  public modificarCentroAtencion(req: CentroAtencionModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/centro-atencion/modificarCentroAtencion`, req);
  }

  public eliminarCentroAtencion(req: CentroAtencionEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/centro-atencion/eliminarCentroAtencion`, req);
  }

  public listarServicioXTipoCentro(req: CentroAtencionServListarXTipCenRequest): Observable<OutResponse<CentroAtencionServListarXTipCenResponse[]>> {
    return this.http.post<OutResponse<CentroAtencionServListarXTipCenResponse[]>>(`${environment.reniBackendUrl}/centro-atencion/listarServicioXTipoCentro`, req);
  }

  public listarServicioXCentro(req: CentroAtencionServListarXCentroRequest): Observable<OutResponse<CentroAtencionServListarXCentroResponse[]>> {
    return this.http.post<OutResponse<CentroAtencionServListarXCentroResponse[]>>(`${environment.reniBackendUrl}/centro-atencion/listarServicioXCentro`, req);
  }

  public registrarServicioCentroAtencion(req: CentroAtencionAsociarServicioRequest): Observable<OutResponse<CentroAtencionAsociarServicioResponse>> {
    return this.http.post<OutResponse<CentroAtencionAsociarServicioResponse>>(`${environment.reniBackendUrl}/centro-atencion/registrarServicioCentroAtencion`, req);
  }

  public eliminarServicioCentroAtencion(req: CentroAtencionEliminarServicioAsocRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/centro-atencion/eliminarServicioCentroAtencion`, req);
  }

  public listarServicio(req: CentroAtencionCargaMasivaServListarRequest): Observable<OutResponse<CentroAtencionCargaMasivaServListarResponse[]>> {
    return this.http.post<OutResponse<CentroAtencionCargaMasivaServListarResponse[]>>(`${environment.reniBackendUrl}/centro-atencion/listarServicio`, req);
  }

  public listarCentro(req: CentroAtencionCargaMasivaCentroListarRequest): Observable<OutResponse<CentroAtencionCargaMasivaCentroListarResponse[]>> {
    return this.http.post<OutResponse<CentroAtencionCargaMasivaCentroListarResponse[]>>(`${environment.reniBackendUrl}/centro-atencion/listarCentro`, req);
  }

  public cargaMasivaCentro(req: CentroAtencionCargaMasivaRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/centro-atencion/cargaMasivaCentro`, req);
  }

  public exportarListaCentroAtencionXlsx(req: CentroAtencionListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/centro-atencion/exportarListaCentroAtencionXlsx`, req);
  }
}
