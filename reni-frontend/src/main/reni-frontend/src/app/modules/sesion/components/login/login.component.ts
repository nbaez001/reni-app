import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { FuncionalidadUsuarioListarRequest } from '../../dto/request/funcionalidad-usuario-listar.request';
import { UsuarioRequest } from '../../dto/request/usuario-request';
import { FuncionalidadUsuarioListarResponse } from '../../dto/response/funcionalidad-usuario-listar.response';
import { Oauth2Response } from '../../dto/response/oauth2-response';
import { OutResponse } from '../../dto/response/out.response';
import { AutenticacionService } from '../../service/autenticacion.service';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  ingresar: boolean = false;

  usuario: UsuarioRequest = new UsuarioRequest();
  errorMessage: string = 'Usuario o contraseña son incorrectos';
  showMessage: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(AutenticacionService) private autenticacionService: AutenticacionService,
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasenia: ['', [Validators.required]],
      recordar: ['', []],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    let recordar = Cookie.get('recordar');
    if (recordar) {
      this.formularioGrp.get('usuario').setValue(Cookie.get('idUsuario'));
      this.formularioGrp.get('contrasenia').setValue(Cookie.get('passUsuario'));
      this.formularioGrp.get('recordar').setValue(recordar);
    }

    this.inicializarVariables();
  }

  inicializarVariables(): void {
  }

  autenticar() {
    if (this.formularioGrp.valid) {
      this.ingresar = true;

      let recordar = this.formularioGrp.get('recordar').value;
      this.usuario.usuario = this.formularioGrp.get('usuario').value;
      this.usuario.contrasenia = this.formularioGrp.get('contrasenia').value;

      if (recordar) {
        this.autenticacionService.saveCredenciales(this.usuario.usuario, this.usuario.contrasenia);
      } else {
        this.autenticacionService.removeCredenciales();
      }

      this.autenticacionService.oauth2Token(this.usuario).subscribe(
        (data: Oauth2Response) => {
          this.listarFuncionalidad(data);
          this.autenticacionService.saveToken(data);
        }, error => {
          console.log(error);

          this.ingresar = false;
          this.errorMessage = 'Usuario o contraseña son incorrectos';
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 7000);
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  listarFuncionalidad(oauth: Oauth2Response): void {
    let req = new FuncionalidadUsuarioListarRequest();
    req.idModulo = oauth.idModulo;
    req.idPerfil = oauth.idPerfil;

    this.autenticacionService.listarFuncionalidad(req, oauth.access_token).subscribe(
      (data: OutResponse<FuncionalidadUsuarioListarResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.user.setValues(oauth, data.objeto);
          this.autenticacionService.saveToken(oauth);
          this.ingresar = false;
          this.router.navigate(['/intranet/home']);
        } else {
          this.ingresar = false;
          this.errorMessage = 'Error al cargar datos de usuario';
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 7000);
        }
      }, error => {
        console.log(error);

        this.ingresar = false;
        this.errorMessage = 'Error al cargar datos de usuario';
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 7000);
      }
    );
  }
}
