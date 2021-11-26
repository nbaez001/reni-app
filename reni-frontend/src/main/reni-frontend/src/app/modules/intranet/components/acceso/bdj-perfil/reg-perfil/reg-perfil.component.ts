import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES, MENU_HOME } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { PerfilFuncionalidadListarRequest } from 'src/app/modules/intranet/dto/request/perfil-funcionalidad-listar.request';
import { PerfilRegistrarRequest } from 'src/app/modules/intranet/dto/request/perfil-registrar.request';
import { PerfilFuncionalidadListarResponse } from 'src/app/modules/intranet/dto/response/perfil-funcionalidad-listar.response';
import { PerfilListarResponse } from 'src/app/modules/intranet/dto/response/perfil-listar.response';
import { PerfilRegistrarResponse } from 'src/app/modules/intranet/dto/response/perfil-registrar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { PerfilService } from 'src/app/modules/intranet/services/perfil.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { environment } from 'src/environments/environment';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-reg-perfil',
  templateUrl: './reg-perfil.component.html',
  styleUrls: ['./reg-perfil.component.scss']
})
export class RegPerfilComponent implements OnInit {
  guardar: boolean = false;

  MENU_HOME = MENU_HOME;
  step = 0;

  listaFuncionalidad: PerfilFuncionalidadListarResponse[];

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegPerfilComponent>,
    private _snackBar: MatSnackBar,
    @Inject(PerfilService) private perfilService: PerfilService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.listarFuncionalidad();
  }

  setStep(index: number) {
    this.step = index;
  }

  masterToggle(obj: PerfilFuncionalidadListarResponse): void {
    if (this.isAllSelected(obj)) {
      obj.selected = false;
      obj.listaFuncionalidad.forEach(el => {
        el.selected = false;
      })
    } else {
      let index = this.listaFuncionalidad.indexOf(obj);
      obj.selected = true;
      if (this.listaFuncionalidad.length > 0) {
        this.listaFuncionalidad[index].listaFuncionalidad.forEach(el => {
          el.selected = true;
        });
      }
    }
  }

  hasValue(obj: PerfilFuncionalidadListarResponse): boolean {
    let cont = 0;
    if (obj.listaFuncionalidad.length > 0) {
      obj.listaFuncionalidad.forEach(el => {
        if (el.selected) {
          cont++;
        }
      });

      if (cont > 0) {
        return obj.listaFuncionalidad.length >= cont;
      } else {
        return false;
      }
    } else {
      return obj.selected;
    }
  }

  isAllSelected(obj: PerfilFuncionalidadListarResponse): boolean {
    if (obj.listaFuncionalidad.length == 0) {
      return obj.selected;
    } else {
      let cont = 0;
      obj.listaFuncionalidad.forEach(el => {
        if (el.selected) {
          cont++;
        }
      });
      return obj.listaFuncionalidad.length == cont;
    }
  }

  isSelected(obj: PerfilFuncionalidadListarResponse): boolean {
    return obj.selected;
  }

  toggle(obj: PerfilFuncionalidadListarResponse, padre: PerfilFuncionalidadListarResponse): void {
    if (obj.selected) {
      obj.selected = false;
    } else {
      obj.selected = true;
    }

    let cont = 0;
    padre.listaFuncionalidad.forEach(el => {
      if (el.selected) {
        cont++;
      }
    });

    if (cont > 0) {
      padre.selected = true;
    } else {
      padre.selected = false;
    }
  }

  listarFuncionalidad(): void {
    let req = new PerfilFuncionalidadListarRequest();
    req.idModulo = environment.IdModuloReni;

    this.perfilService.listarFuncionalidad(req).subscribe(
      (out: OutResponse<PerfilFuncionalidadListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaFuncionalidad = out.objeto;

          // SETEO MENU HOME OBLIGATORIO
          this.listaFuncionalidad.forEach(el => {
            if (el.referencia == MENU_HOME.REFERENCIA) {
              el.selected = true;
            }
          });
        } else {
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          this.listaFuncionalidad = [];
        }
      },
      error => {
        console.log(error);
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.listaFuncionalidad = [];
      }
    );
  }

  regPerfil(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let cont = 0;
      this.listaFuncionalidad.forEach(el => {
        if (el.selected) {
          cont++;
        }
        el.listaFuncionalidad.forEach(el2 => {
          if (el2.selected) {
            cont++;
          }
        })
      });

      if (cont > 1) {
        this.grabarPerfil();
      } else {
        this.guardar = false;
        const dialogRef = this.dialog.open(ConfirmComponent, {
          width: '300px',
          data: {
            titulo: MENSAJES.MSG_CONFIRM_FUNC_VACIO,
            detalle: MENSAJES.MSG_CONFIRM_FUNC_VACIO_DETALLE,
            objeto: null
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result == CONSTANTES.COD_CONFIRMADO) {
            this.guardar = true;
            this.grabarPerfil();
          }
        });
      }
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  grabarPerfil(): void {
    let req = new PerfilRegistrarRequest();
    req.nomPerfil = this.formularioGrp.get('nombre').value;
    req.idUsuarioCrea = this.user.getIdUsuario;

    console.log(this.listaFuncionalidad);
    let lista: number[] = [];
    this.listaFuncionalidad.forEach(el => {
      if (el.selected) {
        lista.push(el.idFuncionalidad);
      }
      el.listaFuncionalidad.forEach(el2 => {
        if (el2.selected) {
          lista.push(el2.idFuncionalidad);
        }
      });
    })
    req.listaFuncionalidad = lista;
    req.idModulo = environment.IdModuloReni;

    this.perfilService.registrarPerfil(req).subscribe(
      (out: OutResponse<PerfilRegistrarResponse>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          let res = new PerfilListarResponse();
          res.idPerfil = out.objeto.idPerfil;
          res.idModulo = environment.IdModuloReni;
          res.nombre = req.nomPerfil;
          res.flgActivo = CONSTANTES.FLG_ACTIVO;

          this.dialogRef.close(res);
          this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
        } else {
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
        this.guardar = false;
      },
      error => {
        console.log(error);
        this.guardar = false;
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
      }
    );
  }
}
