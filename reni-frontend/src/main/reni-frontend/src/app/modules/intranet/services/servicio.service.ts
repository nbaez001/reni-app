import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { ServicioEliminarRequest } from '../dto/request/servicio-eliminar.request';
import { ServicioListarRequest } from '../dto/request/servicio-listar.request';
import { ServicioModificarRequest } from '../dto/request/servicio-modificar.request';
import { ServicioRegistrarRequest } from '../dto/request/servicio-registrar.request';
import { FileResponse } from '../dto/response/file.response';
import { ServicioListarResponse } from '../dto/response/servicio-listar.response';
import { ServicioRegistrarResponse } from '../dto/response/servicio-registrar.response';

@Injectable()
export class ServicioService {

  constructor(private http: HttpClient) { }

  public listarServicio(req: ServicioListarRequest): Observable<OutResponse<ServicioListarResponse[]>> {
    return this.http.post<OutResponse<ServicioListarResponse[]>>(`${environment.reniBackendUrl}/servicio/listarServicio`, req);
  }

  public registrarServicio(req: ServicioRegistrarRequest): Observable<OutResponse<ServicioRegistrarResponse>> {
    return this.http.post<OutResponse<ServicioRegistrarResponse>>(`${environment.reniBackendUrl}/servicio/registrarServicio`, req);
  }

  public modificarServicio(req: ServicioModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/servicio/modificarServicio`, req);
  }

  public eliminarServicio(req: ServicioEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/servicio/eliminarServicio`, req);
  }

  public exportarListaServicioXlsx(req: ServicioListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/servicio/exportarListaServicioXlsx`, req);
  }
}
