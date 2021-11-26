import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { UsuarioAsociarRequest } from '../dto/request/usuario-asociar.request';
import { UsuarioBuscarRequest } from '../dto/request/usuario-buscar.request';
import { UsuarioEliminarRequest } from '../dto/request/usuario-eliminar.request';
import { UsuarioListarRequest } from '../dto/request/usuario-listar.request';
import { UsuarioModificarRequest } from '../dto/request/usuario-modificar.request';
import { FileResponse } from '../dto/response/file.response';
import { UsuarioBuscarResponse } from '../dto/response/usuario-buscar.response';
import { UsuarioListarResponse } from '../dto/response/usuario-listar.response';

@Injectable()
export class UsuarioReniService {

  constructor(private http: HttpClient) { }

  public listarUsuario(req: UsuarioListarRequest): Observable<OutResponse<UsuarioListarResponse[]>> {
    return this.http.post<OutResponse<UsuarioListarResponse[]>>(`${environment.reniBackendUrl}/usuario/listarUsuario`, req);
  }

  public modificarUsuario(req: UsuarioModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/usuario/modificarUsuario`, req);
  }

  public eliminarUsuario(req: UsuarioEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/usuario/eliminarUsuario`, req);
  }

  public buscarUsuario(req: UsuarioBuscarRequest): Observable<OutResponse<UsuarioBuscarResponse>> {
    return this.http.post<OutResponse<UsuarioBuscarResponse>>(`${environment.reniBackendUrl}/usuario/buscarUsuario`, req);
  }

  public asociarUsuario(req: UsuarioAsociarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/usuario/asociarUsuario`, req);
  }

  public exportarListaUsuarioXlsx(req: UsuarioListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/usuario/exportarListaUsuarioXlsx`, req);
  }
}
