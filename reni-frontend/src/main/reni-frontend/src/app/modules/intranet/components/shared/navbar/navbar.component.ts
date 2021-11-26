import { Component, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { AutenticacionService } from 'src/app/modules/sesion/service/autenticacion.service';
import { Oauth2Response } from 'src/app/modules/sesion/dto/response/oauth2-response';
import { CONSTANTES } from 'src/app/common';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { FuncionalidadUsuarioListarRequest } from 'src/app/modules/sesion/dto/request/funcionalidad-usuario-listar.request';
import { FuncionalidadUsuarioListarResponse } from 'src/app/modules/sesion/dto/response/funcionalidad-usuario-listar.response';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private spinner: NgxSpinnerService,
    @Inject(UsuarioService) public user: UsuarioService,
    @Inject(AutenticacionService) public autenticacionService: AutenticacionService,) { }

  ngOnInit() {
    if (!this.user.getIdUsuario) {
      let token = this.autenticacionService.existeToken();
      if (token != null && typeof (token) !== 'undefined' && token != '') {
        let oauth = new Oauth2Response();
        oauth.refresh_token = token;
        this.autenticacionService.refreshOauth2Token(oauth).subscribe(
          (data: Oauth2Response) => {
            this.listarFuncionalidad(data);
          }, error => {
            console.log(error);
            this.autenticacionService.salir();
          });
      } else {
        this.autenticacionService.salir();
      }
    }
  }

  listarFuncionalidad(oauth: Oauth2Response): void {
    let req = new FuncionalidadUsuarioListarRequest();
    req.idPerfil = oauth.idPerfil;
    req.idModulo = oauth.idModulo;

    this.autenticacionService.listarFuncionalidad(req, oauth.access_token).subscribe(
      (data: OutResponse<FuncionalidadUsuarioListarResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.user.setValues(oauth, data.objeto);
          this.autenticacionService.saveToken(oauth);
        } else {
          this.autenticacionService.salir();
        }
      }, error => {
        console.log(error);
        this.autenticacionService.salir();
      }
    );
  }

  salir(): void {
    this.autenticacionService.salir();
  }

  marcarSeleccionado(obj: FuncionalidadUsuarioListarResponse): void {
    this.user.getListaFuncionalidad.forEach(el => {
      if (el.idFuncionalidad == obj.idFuncionalidad) {
        el.selected = true;
      } else {
        el.selected = false;
      }
    });
  }
}
