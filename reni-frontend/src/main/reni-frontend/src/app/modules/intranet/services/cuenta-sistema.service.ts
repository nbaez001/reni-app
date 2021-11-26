import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { CuentaSistemaBuscarPersonaRequest } from '../dto/request/cuenta-sistema-buscar-persona.request';
import { CuentaSistemaEliminarRequest } from '../dto/request/cuenta-sistema-eliminar.request';
import { CuentaSistemaListarRequest } from '../dto/request/cuenta-sistema-listar.request';
import { CuentaSistemaModificarRequest } from '../dto/request/cuenta-sistema-modificar.request';
import { CuentaSistemaRegistrarRequest } from '../dto/request/cuenta-sistema-registrar.request';
import { CuentaSistemaUsuarioSeguridadBuscarRequest } from '../dto/request/cuenta-sistema-usuario-seguridad-buscar.request';
import { CuentaSistemaBuscarPersonaResponse } from '../dto/response/cuenta-sistema-buscar-persona.response';
import { CuentaSistemaListarResponse } from '../dto/response/cuenta-sistema-listar.response';
import { CuentaSistemaRegistrarResponse } from '../dto/response/cuenta-sistema-registrar.response';
import { CuentaSistemaUsuarioSeguridadBuscarResponse } from '../dto/response/cuenta-sistema-usuario-seguridad-buscar.response';
import { CuentaSistemaValidarUsuarioRequest } from '../dto/response/cuenta-sistema-validar-usuario.request';
import { FileResponse } from '../dto/response/file.response';

@Injectable()
export class CuentaSistemaService {

  constructor(private http: HttpClient) { }

  public listarCuentaSistema(req: CuentaSistemaListarRequest): Observable<OutResponse<CuentaSistemaListarResponse[]>> {
    return this.http.post<OutResponse<CuentaSistemaListarResponse[]>>(`${environment.reniBackendUrl}/cuenta-sistema/listarCuentaSistema`, req);
  }

  public registrarCuentaSistema(req: CuentaSistemaRegistrarRequest): Observable<OutResponse<CuentaSistemaRegistrarResponse>> {
    return this.http.post<OutResponse<CuentaSistemaRegistrarResponse>>(`${environment.reniBackendUrl}/cuenta-sistema/registrarCuentaSistema`, req);
  }

  public modificarCuentaSistema(req: CuentaSistemaModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/cuenta-sistema/modificarCuentaSistema`, req);
  }

  public eliminarCuentaSistema(req: CuentaSistemaEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/cuenta-sistema/eliminarCuentaSistema`, req);
  }

  public buscarCuentaPersona(req: CuentaSistemaBuscarPersonaRequest): Observable<OutResponse<CuentaSistemaBuscarPersonaResponse>> {
    return this.http.post<OutResponse<CuentaSistemaBuscarPersonaResponse>>(`${environment.reniBackendUrl}/cuenta-sistema/buscarCuentaPersona`, req);
  }

  public validarExisteUsuario(req: CuentaSistemaValidarUsuarioRequest): Observable<OutResponse<number>> {
    return this.http.post<OutResponse<number>>(`${environment.reniBackendUrl}/cuenta-sistema/validarExisteUsuario`, req);
  }

  public buscarUsuarioSeguridad(req: CuentaSistemaUsuarioSeguridadBuscarRequest): Observable<OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse>> {
    return this.http.post<OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse>>(`${environment.reniBackendUrl}/cuenta-sistema/buscarUsuarioSeguridad`, req);
  }

  public exportarListaCuentaSistemaXlsx(req: CuentaSistemaListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/cuenta-sistema/exportarListaCuentaSistemaXlsx`, req);
  }
}
