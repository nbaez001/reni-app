import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { SubtipoCentroEliminarRequest } from '../dto/request/subtipo-centro-eliminar.request';
import { SubtipoCentroListarRequest } from '../dto/request/subtipo-centro-listar.request';
import { SubtipoCentroModificarRequest } from '../dto/request/subtipo-centro-modificar-request';
import { SubtipoCentroRegistrarRequest } from '../dto/request/subtipo-centro-registrar.request';
import { TipoCentroEliminarRequest } from '../dto/request/tipo-centro-eliminar.request';
import { TipoCentroListarRequest } from '../dto/request/tipo-centro-listar.request';
import { TipoCentroModificarRequest } from '../dto/request/tipo-centro-modificar.request';
import { TipoCentroRegistrarRequest } from '../dto/request/tipo-centro-registrar.request';
import { FileResponse } from '../dto/response/file.response';
import { SubtipoCentroListarResponse } from '../dto/response/subtipo-centro-listar.response';
import { SubtipoCentroRegistrarResponse } from '../dto/response/subtipo-centro-registrar.response';
import { TipoCentroListarResponse } from '../dto/response/tipo-centro-listar.response';
import { TipoCentroRegistrarResponse } from '../dto/response/tipo-centro-registrar.response';

@Injectable()
export class TipoCentroService {

  constructor(private http: HttpClient) { }

  public listarTipoCentro(req: TipoCentroListarRequest): Observable<OutResponse<TipoCentroListarResponse[]>> {
    return this.http.post<OutResponse<TipoCentroListarResponse[]>>(`${environment.reniBackendUrl}/tipo-centro/listarTipoCentro`, req);
  }

  public registrarTipoCentro(req: TipoCentroRegistrarRequest): Observable<OutResponse<TipoCentroRegistrarResponse>> {
    return this.http.post<OutResponse<TipoCentroRegistrarResponse>>(`${environment.reniBackendUrl}/tipo-centro/registrarTipoCentro`, req);
  }

  public modificarTipoCentro(req: TipoCentroModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/tipo-centro/modificarTipoCentro`, req);
  }

  public eliminarTipoCentro(req: TipoCentroEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/tipo-centro/eliminarTipoCentro`, req);
  }

  public exportarListaTipoCentroXlsx(req: TipoCentroListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/tipo-centro/exportarListaTipoCentroXlsx`, req);
  }

  public listarSubtipoCentro(req: SubtipoCentroListarRequest): Observable<OutResponse<SubtipoCentroListarResponse[]>> {
    return this.http.post<OutResponse<SubtipoCentroListarResponse[]>>(`${environment.reniBackendUrl}/tipo-centro/listarSubtipoCentro`, req);
  }

  public registrarSubtipoCentro(req: SubtipoCentroRegistrarRequest): Observable<OutResponse<SubtipoCentroRegistrarResponse>> {
    return this.http.post<OutResponse<SubtipoCentroRegistrarResponse>>(`${environment.reniBackendUrl}/tipo-centro/registrarSubtipoCentro`, req);
  }

  public modificarSubtipoCentro(req: SubtipoCentroModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/tipo-centro/modificarSubtipoCentro`, req);
  }

  public eliminarSubtipoCentro(req: SubtipoCentroEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/tipo-centro/eliminarSubtipoCentro`, req);
  }
}
