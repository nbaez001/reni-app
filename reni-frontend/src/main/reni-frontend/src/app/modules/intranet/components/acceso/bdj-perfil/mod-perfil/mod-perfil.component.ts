import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES, MENU_HOME } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { PerfilFuncionalidadListarRequest } from 'src/app/modules/intranet/dto/request/perfil-funcionalidad-listar.request';
import { PerfilFuncionalidadPerfListarRequest } from 'src/app/modules/intranet/dto/request/perfil-funcionalidad-perf-listar.request';
import { PerfilModificarRequest } from 'src/app/modules/intranet/dto/request/perfil-modificar.request';
import { PerfilRegistrarRequest } from 'src/app/modules/intranet/dto/request/perfil-registrar.request';
import { PerfilFuncionalidadListarResponse } from 'src/app/modules/intranet/dto/response/perfil-funcionalidad-listar.response';
import { PerfilFuncionalidadPerfListarResponse } from 'src/app/modules/intranet/dto/response/perfil-funcionalidad-perf-listar.response';
import { PerfilListarResponse } from 'src/app/modules/intranet/dto/response/perfil-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { PerfilService } from 'src/app/modules/intranet/services/perfil.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { environment } from 'src/environments/environment';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-mod-perfil',
  templateUrl: './mod-perfil.component.html',
  styleUrls: ['./mod-perfil.component.scss']
})
export class ModPerfilComponent implements OnInit {
  modif: boolean = false;

  MENU_HOME = MENU_HOME;
  step = 0;

  listaFuncionalidad: PerfilFuncionalidadListarResponse[];

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModPerfilComponent>,
    private _snackBar: MatSnackBar,
    @Inject(PerfilService) private perfilService: PerfilService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<PerfilListarResponse>) { }

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
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nombre);
    }
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
          console.log('DATA INICIAL');
          console.log(out.objeto);
          this.listaFuncionalidad = out.objeto;

          // SETEO MENU HOME OBLIGATORIO
          this.listaFuncionalidad.forEach(el => {
            if (el.referencia == MENU_HOME.REFERENCIA) {
              el.selected = true;
            }
          });
          this.cargarFuncionalidad();
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

  cargarFuncionalidad(): void {
    let req = new PerfilFuncionalidadPerfListarRequest();
    req.idModulo = environment.IdModuloReni;
    req.idPerfil = this.dataDialog.objeto.idPerfil;

    this.perfilService.listarFuncionalidadPerfil(req).subscribe(
      (out: OutResponse<PerfilFuncionalidadPerfListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          console.log('DATA TRANSFORMADA');
          console.log(out.objeto);

          this.listaFuncionalidad.forEach(el => {
            out.objeto.forEach(el2 => {
              if (el.idFuncionalidad == el2.idFuncionalidad) {
                el.selected = true;
                el.existe = true;
                el.listaFuncionalidad.forEach(o => {
                  el2.listaFuncionalidad.forEach(o2 => {
                    if (o.idFuncionalidad == o2.idFuncionalidad) {
                      o.selected = true;
                      o.existe = true;
                    }
                  });
                });
              }
            });
          });
        } else {
          console.log(out.rmensaje);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  modPerfil(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

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
        this.grabarModPerfil();
      } else {
        this.modif = false;
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
            this.modif = true;
            this.grabarModPerfil();
          }
        });
      }
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  grabarModPerfil(): void {
    let req = new PerfilModificarRequest();
    req.idPerfil = this.dataDialog.objeto.idPerfil;
    req.nomPerfil = this.formularioGrp.get('nombre').value;
    req.idUsuarioModif = this.user.getIdUsuario;

    console.log(this.listaFuncionalidad);
    let listaNuevo: number[] = [];
    let listaModif: number[] = [];

    this.listaFuncionalidad.forEach(el => {
      if (el.selected) {
        if (el.existe) {
          listaModif.push(el.idFuncionalidad);
        } else {
          listaNuevo.push(el.idFuncionalidad);
        }
      }
      el.listaFuncionalidad.forEach(el2 => {
        if (el2.selected) {
          if (el2.existe) {
            listaModif.push(el2.idFuncionalidad);
          } else {
            listaNuevo.push(el2.idFuncionalidad);
          }
        }
      });
    })
    req.listaFuncionalidad = listaNuevo;
    req.listaFuncionalidadMod = listaModif;

    this.perfilService.modificarPerfil(req).subscribe(
      (out: OutResponse<any>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          let res = new PerfilListarResponse();
          res.idPerfil = this.dataDialog.objeto.idPerfil;
          res.idModulo = environment.IdModuloReni;
          res.nombre = req.nomPerfil;
          res.flgActivo = CONSTANTES.FLG_ACTIVO;

          this.dialogRef.close(res);
          this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
        } else {
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
        this.modif = false;
      },
      error => {
        console.log(error);
        this.modif = false;
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
      }
    );
  }
}
