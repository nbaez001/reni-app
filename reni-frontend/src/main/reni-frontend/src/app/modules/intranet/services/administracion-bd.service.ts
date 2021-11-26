import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { BDCampoTablaListarRequest } from '../dto/request/bd-campo-tabla-listar.request';
import { BDCampoTablaRegistrarRequest } from '../dto/request/bd-campo-tabla-registrar.request';
import { BDCampoTablaListarResponse } from '../dto/response/bd-campo-tabla-listar.response';
import { BDTablaListarResponse } from '../dto/response/bd-tabla-listar.response';

@Injectable()
export class AdministracionBdService {

  constructor(private http: HttpClient) { }

  public listarTablasBD(): Observable<OutResponse<BDTablaListarResponse[]>> {
    return this.http.post<OutResponse<BDTablaListarResponse[]>>(`${environment.reniBackendUrl}/administrar-bd/listarTablasBD`, {});
  }

  public listarCamposBD(req: BDCampoTablaListarRequest): Observable<OutResponse<BDCampoTablaListarResponse[]>> {
    return this.http.post<OutResponse<BDCampoTablaListarResponse[]>>(`${environment.reniBackendUrl}/administrar-bd/listarCamposBD`, req);
  }

  public registrarCampoBD(req: BDCampoTablaRegistrarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/administrar-bd/registrarCampoBD`, req);
  }

}
