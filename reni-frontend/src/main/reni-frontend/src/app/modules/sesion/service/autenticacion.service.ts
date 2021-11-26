import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FuncionalidadUsuarioListarRequest } from '../dto/request/funcionalidad-usuario-listar.request';
import { UsuarioRequest } from '../dto/request/usuario-request';
import { FuncionalidadUsuarioListarResponse } from '../dto/response/funcionalidad-usuario-listar.response';
import { Oauth2Response } from '../dto/response/oauth2-response';
import { OutResponse } from '../dto/response/out.response';

@Injectable()
export class AutenticacionService {
  constructor(private http: HttpClient, private router: Router) { }

  public oauth2Token(req: UsuarioRequest): Observable<Oauth2Response> {
    const params = new URLSearchParams();
    params.append('username', req.usuario);
    params.append('password', req.contrasenia);
    params.append('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa(environment.clientId + ':' + environment.clientSecret)
    });

    return this.http.post<Oauth2Response>(`${environment.reniAuthorizerUrl}/oauth/token`, params.toString(), { headers });
  }

  public refreshOauth2Token(req: Oauth2Response): Observable<Oauth2Response> {
    const params = new URLSearchParams();
    params.append('refresh_token', req.refresh_token);
    params.append('grant_type', 'refresh_token');

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa(environment.clientId + ':' + environment.clientSecret)
    });

    return this.http.post<Oauth2Response>(`${environment.reniAuthorizerUrl}/oauth/token`, params.toString(), { headers });
  }

  public listarFuncionalidad(req: FuncionalidadUsuarioListarRequest, token: string): Observable<OutResponse<FuncionalidadUsuarioListarResponse[]>> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + token
      })
    };
    return this.http.post<OutResponse<FuncionalidadUsuarioListarResponse[]>>(`${environment.reniAuthorizerUrl}/funcionalidad/listarFuncionalidad`, req, httpOptions);
  }

  saveToken(token: Oauth2Response) {
    const expireDate = token.expires_in / 3600;
    Cookie.set('refresh_token', token.refresh_token, expireDate, '/reni');
  }

  existeToken(): any {
    const token = Cookie.get('refresh_token');
    return token;
  }

  saveCredenciales(idUsuario: string, passUsuario: string) {
    const expireDate = 3600 * 72 / 3600;
    Cookie.set('idUsuario', idUsuario, expireDate, '/reni');
    Cookie.set('passUsuario', passUsuario, expireDate, '/reni');
    Cookie.set('recordar', '1', expireDate, '/reni');
  }

  removeCredenciales() {
    Cookie.delete('idUsuario', '/reni');
    Cookie.delete('passUsuario', '/reni');
    Cookie.delete('recordar', '/reni');
  }

  salir() {
    Cookie.delete('refresh_token', '/reni');
    this.router.navigate(['/sesion/login']);
  }
}
