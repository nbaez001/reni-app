import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { PerfilEliminarRequest } from '../dto/request/perfil-eliminar.request';
import { PerfilFuncionalidadListarRequest } from '../dto/request/perfil-funcionalidad-listar.request';
import { PerfilFuncionalidadPerfListarRequest } from '../dto/request/perfil-funcionalidad-perf-listar.request';
import { PerfilListarRequest } from '../dto/request/perfil-listar.request';
import { PerfilModificarRequest } from '../dto/request/perfil-modificar.request';
import { PerfilRegistrarRequest } from '../dto/request/perfil-registrar.request';
import { FileResponse } from '../dto/response/file.response';
import { PerfilFuncionalidadListarResponse } from '../dto/response/perfil-funcionalidad-listar.response';
import { PerfilFuncionalidadPerfListarResponse } from '../dto/response/perfil-funcionalidad-perf-listar.response';
import { PerfilListarResponse } from '../dto/response/perfil-listar.response';
import { PerfilRegistrarResponse } from '../dto/response/perfil-registrar.response';

@Injectable()
export class PerfilService {

  constructor(private http: HttpClient) { }

  public listarPerfil(req: PerfilListarRequest): Observable<OutResponse<PerfilListarResponse[]>> {
    return this.http.post<OutResponse<PerfilListarResponse[]>>(`${environment.reniBackendUrl}/perfil/listarPerfil`, req);
  }

  public registrarPerfil(req: PerfilRegistrarRequest): Observable<OutResponse<PerfilRegistrarResponse>> {
    return this.http.post<OutResponse<PerfilRegistrarResponse>>(`${environment.reniBackendUrl}/perfil/registrarPerfil`, req);
  }

  public modificarPerfil(req: PerfilModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/perfil/modificarPerfil`, req);
  }

  public eliminarPerfil(req: PerfilEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/perfil/eliminarPerfil`, req);
  }

  public listarFuncionalidad(req: PerfilFuncionalidadListarRequest): Observable<OutResponse<PerfilFuncionalidadListarResponse[]>> {
    return this.http.post<OutResponse<PerfilFuncionalidadListarResponse[]>>(`${environment.reniBackendUrl}/perfil/listarFuncionalidad`, req);
  }

  public listarFuncionalidadPerfil(req: PerfilFuncionalidadPerfListarRequest): Observable<OutResponse<PerfilFuncionalidadPerfListarResponse[]>> {
    return this.http.post<OutResponse<PerfilFuncionalidadPerfListarResponse[]>>(`${environment.reniBackendUrl}/perfil/listarFuncionalidadPerfil`, req);
  }

  public exportarListaPerfilXlsx(req: PerfilListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/perfil/exportarListaPerfilXlsx`, req);
  }
}
