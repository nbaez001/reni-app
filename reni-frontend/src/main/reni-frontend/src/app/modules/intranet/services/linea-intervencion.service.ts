import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { UsuarioService } from '../../sesion/service/usuario.service';
import { LineaIntervencionEliminarRequest } from '../dto/request/linea-intervencion-eliminar.request';
import { LineaIntervencionListarRequest } from '../dto/request/linea-intervencion-listar.request';
import { LineaIntervencionModificarRequest } from '../dto/request/linea-intervencion-modificar.request';
import { LineaIntervencionRegistrarRequest } from '../dto/request/linea-intervencion-registrar.request';
import { FileResponse } from '../dto/response/file.response';
import { LineaIntervencionListarResponse } from '../dto/response/linea-intervencion-listar.response';
import { LineaIntervencionRegistrarResponse } from '../dto/response/linea-intervencion-registrar.response';

@Injectable()
export class LineaIntervencionService {

  constructor(private http: HttpClient,
    @Inject(UsuarioService) private user: UsuarioService) { }

  public listarLineaIntervencion(req: LineaIntervencionListarRequest): Observable<OutResponse<LineaIntervencionListarResponse[]>> {
    return this.http.post<OutResponse<LineaIntervencionListarResponse[]>>(`${environment.reniBackendUrl}/linea-intervencion/listarLineaIntervencion`, req);
  }

  public registrarLineaIntervencion(req: LineaIntervencionRegistrarRequest): Observable<OutResponse<LineaIntervencionRegistrarResponse>> {
    return this.http.post<OutResponse<LineaIntervencionRegistrarResponse>>(`${environment.reniBackendUrl}/linea-intervencion/registrarLineaIntervencion`, req);
  }

  public modificarLineaIntervencion(req: LineaIntervencionModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/linea-intervencion/modificarLineaIntervencion`, req);
  }

  public eliminarLineaIntervencion(req: LineaIntervencionEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/linea-intervencion/eliminarLineaIntervencion`, req);
  }

  public exportarListaLineaIntervencionXlsx(req: LineaIntervencionListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/linea-intervencion/exportarListaLineaIntervencionXlsx`, req);
  }
}
