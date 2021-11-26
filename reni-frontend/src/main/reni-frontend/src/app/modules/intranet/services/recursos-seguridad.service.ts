import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { RecursosSeguridadListarCargoResponse } from '../dto/response/recursos-seguridad-listar-cargo.response';
import { RecursosSeguridadListarTipoDocumResponse } from '../dto/response/recursos-seguridad-listar-tipo-docum.response';

@Injectable()
export class RecursosSeguridadService {

  constructor(private http: HttpClient) { }

  public listarTipoDocumento(): Observable<OutResponse<RecursosSeguridadListarTipoDocumResponse[]>> {
    return this.http.post<OutResponse<RecursosSeguridadListarTipoDocumResponse[]>>(`${environment.reniBackendUrl}/recursos-seguridad/listarTipoDocumento`, {});
  }

  public listarCargo(): Observable<OutResponse<RecursosSeguridadListarCargoResponse[]>> {
    return this.http.post<OutResponse<RecursosSeguridadListarCargoResponse[]>>(`${environment.reniBackendUrl}/recursos-seguridad/listarCargo`, {});
  }
}
