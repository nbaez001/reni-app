import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OutResponse } from '../../sesion/dto/response/out.response';
import { EdneDescargarPlantillaRequest } from '../dto/request/edne-descargar-plantilla.request';
import { EdneEliminarRequest } from '../dto/request/edne-eliminar.request';
import { EdneListarParamEstructuraRequest } from '../dto/request/edne-listar-param-estructura.request';
import { EdneListarUsuarioXCodigoRequest } from '../dto/request/edne-listar-usuario-x-codigo.request';
import { EdneListarUsuarioXDocumentoRequest } from '../dto/request/edne-listar-usuario-x-documento.request';
import { EdneListarRequest } from '../dto/request/edne-listar.request';
import { EdneModificarListarUsuarioRequest } from '../dto/request/edne-modificar-listar-usuario.request';
import { EdneModificarRequest } from '../dto/request/edne-modificar.request';
import { EdneRegistrarRequest } from '../dto/request/edne-registrar.request';
import { EdneListarParamEstructuraResponse } from '../dto/response/edne-listar-param-estructura.response';
import { EdneListarUsuarioXCodigoResponse } from '../dto/response/edne-listar-usuario-x-codigo.response';
import { EdneListarUsuarioXDocumentoResponse } from '../dto/response/edne-listar-usuario-x-documento.response';
import { EdneListarResponse } from '../dto/response/edne-listar.response';
import { EdneRegistrarResponse } from '../dto/response/edne-registrar.response';
import { FileResponse } from '../dto/response/file.response';

@Injectable()
export class EdneService {

  constructor(private http: HttpClient) { }

  public listarEdne(req: EdneListarRequest): Observable<OutResponse<EdneListarResponse[]>> {
    return this.http.post<OutResponse<EdneListarResponse[]>>(`${environment.reniBackendUrl}/edne/listarEdne`, req);
  }

  public registrarEdne(req: EdneRegistrarRequest): Observable<OutResponse<EdneRegistrarResponse>> {
    return this.http.post<OutResponse<EdneRegistrarResponse>>(`${environment.reniBackendUrl}/edne/registrarEdne`, req);
  }

  public modificarEdne(req: EdneModificarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/edne/modificarEdne`, req);
  }

  public eliminarEdne(req: EdneEliminarRequest): Observable<OutResponse<any>> {
    return this.http.post<OutResponse<any>>(`${environment.reniBackendUrl}/edne/eliminarEdne`, req);
  }

  public listarParamEstructura(req: EdneListarParamEstructuraRequest): Observable<OutResponse<EdneListarParamEstructuraResponse[]>> {
    return this.http.post<OutResponse<EdneListarParamEstructuraResponse[]>>(`${environment.reniBackendUrl}/edne/listarParamEstructura`, req);
  }

  public listarUsuarioXCodigo(req: EdneListarUsuarioXCodigoRequest): Observable<OutResponse<EdneListarUsuarioXCodigoResponse[]>> {
    return this.http.post<OutResponse<EdneListarUsuarioXCodigoResponse[]>>(`${environment.reniBackendUrl}/edne/listarUsuarioXCodigo`, req);
  }

  public listarUsuarioXDocumento(req: EdneListarUsuarioXDocumentoRequest): Observable<OutResponse<EdneListarUsuarioXDocumentoResponse[]>> {
    return this.http.post<OutResponse<EdneListarUsuarioXDocumentoResponse[]>>(`${environment.reniBackendUrl}/edne/listarUsuarioXDocumento`, req);
  }

  public listarUsuariosEdne(req: EdneModificarListarUsuarioRequest): Observable<OutResponse<any[]>> {
    return this.http.post<OutResponse<any[]>>(`${environment.reniBackendUrl}/edne/listarUsuariosEdne`, req);
  }

  public exportarListaEdneXlsx(req: EdneListarRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/edne/exportarListaEdneXlsx`, req);
  }
  
  public descargarPlantillaRENEXlsx(req: EdneDescargarPlantillaRequest): Observable<OutResponse<FileResponse>> {
    return this.http.post<OutResponse<FileResponse>>(`${environment.reniBackendUrl}/edne/descargarPlantillaRENEXlsx`, req);
  }
}
