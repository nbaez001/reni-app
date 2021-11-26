import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { EstructuraBuscarRequest } from '../dto/request/estructura-buscar.request';
import { EstructuraEliminarRequest } from '../dto/request/estructura-eliminar.request';
import { EstructuraListarRequest } from '../dto/request/estructura-listar.request';
import { EstructuraModificarRequest } from '../dto/request/estructura-modificar.request';
import { EstructuraParametroListarRequest } from '../dto/request/estructura-parametro-listar.request';
import { EstructuraRegistrarRequest } from '../dto/request/estructura-registrar.request';
import { EstructuraBuscarResponse } from '../dto/response/estructura-buscar.response';
import { EstructuraListarResponse } from '../dto/response/estructura-listar.response';
import { EstructuraParametroListarResponse } from '../dto/response/estructura-parametro-listar.response';
import { EstructuraRegistrarResponse } from '../dto/response/estructura-registrar.response';
import { FileResponse } from '../dto/response/file.response';

@Injectable()
export class EstructuraService {

  constructor(private http: HttpClient) { }

  public listarEstructura(req: EstructuraListarRequest): Observable<OutResponse<EstructuraListarResponse[]>> {
    return this.http.post<OutResponse<EstructuraListarResponse[]>>(`${environment.reniBackendUrl}/estructura/listarEstructura`, req);
  }

  public registrarEstructura(req: EstructuraRegistrarRequest): Observable<OutResponse<EstructuraRegistrarResponse>> {
    return this.http.post<OutResponse<EstructuraRegistrarResponse>>(`${environment.reniBackendUrl}/estructura/registrarEstructura`, req);
  }

  public modificarEstructura(req: EstructuraModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/estructura/modificarEstructura`, req);
  }

  public eliminarEstructura(req: EstructuraEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/estructura/eliminarEstructura`, req);
  }

  public listarParametroEstructura(req: EstructuraParametroListarRequest): Observable<OutResponse<EstructuraParametroListarResponse[]>> {
    return this.http.post<OutResponse<EstructuraParametroListarResponse[]>>(`${environment.reniBackendUrl}/estructura/listarParametroEstructura`, req);
  }

  public buscarEstructura(req: EstructuraBuscarRequest): Observable<OutResponse<EstructuraBuscarResponse>> {
    return this.http.post<OutResponse<EstructuraBuscarResponse>>(`${environment.reniBackendUrl}/estructura/buscarEstructura`, req);
  }

  public exportarListaEstructuraXlsx(req: EstructuraListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/estructura/exportarListaEstructuraXlsx`, req);
  }
}
