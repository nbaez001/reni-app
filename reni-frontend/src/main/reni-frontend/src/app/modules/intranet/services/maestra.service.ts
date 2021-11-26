import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { MaestraCargaMasivaListarMaeRequest } from '../dto/request/maestra-carga-masiva-listar-mae.request';
import { MaestraCargaMasivaRequest } from '../dto/request/maestra-carga-masiva.request';
import { MaestraEliminarRequest } from '../dto/request/maestra-eliminar.request';
import { MaestraListarRequest } from '../dto/request/maestra-listar.request';
import { MaestraModificarRequest } from '../dto/request/maestra-modificar.request';
import { MaestraRegistrarRequest } from '../dto/request/maestra-registrar.request';
import { MaestraSubitemEliminarRequest } from '../dto/request/maestra-subitem-eliminar.request';
import { MaestraSubitemListarRequest } from '../dto/request/maestra-subitem-listar.request';
import { MaestraSubitemModificarRequest } from '../dto/request/maestra-subitem-modificar.request';
import { MaestraSubitemRegistrarRequest } from '../dto/request/maestra-subitem-registrar.request';
import { FileResponse } from '../dto/response/file.response';
import { MaestraCargaMasivaListarMaeResponse } from '../dto/response/maestra-carga-masiva-listar-mae.response';
import { MaestraListarResponse } from '../dto/response/maestra-listar.response';
import { MaestraRegistrarResponse } from '../dto/response/maestra-registrar.response';
import { MaestraSubitemListarResponse } from '../dto/response/maestra-subitem-listar.response';
import { MaestraSubitemRegistrarResponse } from '../dto/response/maestra-subitem-registrar.response';

@Injectable()
export class MaestraService {

  constructor(private http: HttpClient) { }

  public listarMaestra(req: MaestraListarRequest): Observable<OutResponse<MaestraListarResponse[]>> {
    return this.http.post<OutResponse<MaestraListarResponse[]>>(`${environment.reniBackendUrl}/maestra/listarMaestra`, req);
  }

  public registrarMaestra(req: MaestraRegistrarRequest): Observable<OutResponse<MaestraRegistrarResponse>> {
    return this.http.post<OutResponse<MaestraRegistrarResponse>>(`${environment.reniBackendUrl}/maestra/registrarMaestra`, req);
  }

  public modificarMaestra(req: MaestraModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/maestra/modificarMaestra`, req);
  }

  public eliminarMaestra(req: MaestraEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/maestra/eliminarMaestra`, req);
  }

  public listarMaestraSubitem(req: MaestraSubitemListarRequest): Observable<OutResponse<MaestraSubitemListarResponse[]>> {
    return this.http.post<OutResponse<MaestraSubitemListarResponse[]>>(`${environment.reniBackendUrl}/maestra/listarMaestraSubitem`, req);
  }

  public registrarMaestraSubitem(req: MaestraSubitemRegistrarRequest): Observable<OutResponse<MaestraSubitemRegistrarResponse>> {
    return this.http.post<OutResponse<MaestraSubitemRegistrarResponse>>(`${environment.reniBackendUrl}/maestra/registrarMaestraSubitem`, req);
  }

  public modificarMaestraSubitem(req: MaestraSubitemModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/maestra/modificarMaestraSubitem`, req);
  }

  public eliminarMaestraSubitem(req: MaestraSubitemEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/maestra/eliminarMaestraSubitem`, req);
  }

  public exportarListaMaestraXlsx(req: MaestraListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/maestra/exportarListaMaestraXlsx`, req);
  }

  public listarMaestraCargaMasiva(req: MaestraCargaMasivaListarMaeRequest): Observable<OutResponse<MaestraCargaMasivaListarMaeResponse[]>> {
    return this.http.post<OutResponse<MaestraCargaMasivaListarMaeResponse[]>>(`${environment.reniBackendUrl}/maestra/listarMaestraCargaMasiva`, req);
  }

  public cargaMasivaMaestras(req: MaestraCargaMasivaRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/maestra/cargaMasivaMaestras`, req);
  }
}
