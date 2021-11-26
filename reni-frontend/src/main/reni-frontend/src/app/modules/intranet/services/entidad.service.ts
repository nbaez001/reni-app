import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { AreaBuscarRequest } from '../dto/request/area-buscar.request';
import { AreaListarRequest } from '../dto/request/area-listar.request';
import { EntidadEliminarRequest } from '../dto/request/entidad-eliminar.request';
import { EntidadListarRequest } from '../dto/request/entidad-listar.request';
import { EntidadModificarRequest } from '../dto/request/entidad-modificar.request';
import { EntidadRegistrarRequest } from '../dto/request/entidad-registrar.request';
import { AreaBuscarResponse } from '../dto/response/area-buscar.response';
import { AreaListarResponse } from '../dto/response/area-listar.response';
import { EntidadListarResponse } from '../dto/response/entidad-listar.response';
import { EntidadRegistrarResponse } from '../dto/response/entidad-registrar.response';
import { FileResponse } from '../dto/response/file.response';

@Injectable()
export class EntidadService {

  constructor(private http: HttpClient) { }

  public listarEntidad(req: EntidadListarRequest): Observable<OutResponse<EntidadListarResponse[]>> {
    return this.http.post<OutResponse<EntidadListarResponse[]>>(`${environment.reniBackendUrl}/entidad/listarEntidad`, req);
  }

  public registrarEntidad(req: EntidadRegistrarRequest): Observable<OutResponse<EntidadRegistrarResponse>> {
    return this.http.post<OutResponse<EntidadRegistrarResponse>>(`${environment.reniBackendUrl}/entidad/registrarEntidad`, req);
  }

  public modificarEntidad(req: EntidadModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/entidad/modificarEntidad`, req);
  }

  public eliminarEntidad(req: EntidadEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/entidad/eliminarEntidad`, req);
  }

  public listarArea(req: AreaListarRequest): Observable<OutResponse<AreaListarResponse[]>> {
    return this.http.post<OutResponse<AreaListarResponse[]>>(`${environment.reniAuthorizerUrl}/area/listarArea`, req);
  }

  public buscarArea(req: AreaBuscarRequest): Observable<OutResponse<AreaBuscarResponse>> {
    return this.http.post<OutResponse<AreaBuscarResponse>>(`${environment.reniAuthorizerUrl}/area/buscarArea`, req);
  }

  public exportarListaEntidadXlsx(req: EntidadListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/entidad/exportarListaEntidadXlsx`, req);
  }
}
