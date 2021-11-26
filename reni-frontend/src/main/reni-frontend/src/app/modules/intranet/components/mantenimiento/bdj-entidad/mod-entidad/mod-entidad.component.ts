import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES, MENSAJES_PANEL } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { AreaBuscarRequest } from 'src/app/modules/intranet/dto/request/area-buscar.request';
import { EntidadModificarRequest } from 'src/app/modules/intranet/dto/request/entidad-modificar.request';
import { AreaBuscarResponse } from 'src/app/modules/intranet/dto/response/area-buscar.response';
import { AreaListarResponse } from 'src/app/modules/intranet/dto/response/area-listar.response';
import { EntidadListarResponse } from 'src/app/modules/intranet/dto/response/entidad-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { EntidadService } from 'src/app/modules/intranet/services/entidad.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { BuscAreaComponent } from '../busc-area/busc-area.component';

@Component({
  selector: 'app-mod-entidad',
  templateUrl: './mod-entidad.component.html',
  styleUrls: ['./mod-entidad.component.scss']
})
export class ModEntidadComponent implements OnInit {
  modif: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  eAreaSeguridad: AreaListarResponse = null;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModEntidadComponent>,
    private _snackBar: MatSnackBar,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<EntidadListarResponse>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      siglas: ['', [Validators.required, Validators.maxLength(25)]],
      codigo: ['', [Validators.required, Validators.maxLength(25)]],
      idAreaSeguridad: [{ value: '', disabled: true }, [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nombre);
      this.formularioGrp.get('siglas').setValue(this.dataDialog.objeto.siglas);
      this.formularioGrp.get('codigo').setValue(this.dataDialog.objeto.codigo);

      this.cargarEntidadSeguridad(this.dataDialog.objeto.idAreaSeguridad);
    }

  }

  modEntidad(): void {
    if (this.formularioGrp.valid) {
      if (this.eAreaSeguridad) {
        this.modif = true;

        let req = new EntidadModificarRequest();
        req.idEntidad = this.dataDialog.objeto.idEntidad;
        req.nombre = this.formularioGrp.get('nombre').value;
        req.codigo = this.formularioGrp.get('codigo').value;
        req.siglas = this.formularioGrp.get('siglas').value;
        req.idAreaSeguridad = this.eAreaSeguridad.idArea;
        req.idUsuarioModif = this.user.getIdUsuario;

        console.log(req);
        this.entidadService.modificarEntidad(req).subscribe(
          (out: OutResponse<any>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              let res = new EntidadListarResponse();
              res.idEntidad = this.dataDialog.objeto.idEntidad;
              res.idAreaSeguridad = req.idAreaSeguridad;
              res.codigo = req.codigo;
              res.nombre = req.nombre;
              res.siglas = req.siglas;
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
      } else {
        this._snackBar.open('FALTA COMPLETAR EL CAMPO "Codigo entidad BD Seguridad"', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  generarSiglas(): void {
    let siglaActual = this.formularioGrp.get('siglas').value;
    if (!siglaActual) {
      let nombre = this.formularioGrp.get('nombre').value;
      let exclusionSiglas = ['DE', 'Y', 'A', 'LAS', 'LA', 'PARA'];
      let cod = '';
      let array = nombre.split(' ');
      array.forEach(e => {
        if (!exclusionSiglas.includes(e)) {
          cod += e.charAt(0);
        }
      });

      this.formularioGrp.get('siglas').setValue(cod);
    }
  }

  buscarEntidadesSeguridad(): void {
    const dialogRef = this.dialog.open(BuscAreaComponent, {
      width: '900px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ENTIDAD.BUSCAR_AREA_SEG.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: AreaListarResponse) => {
      if (result) {
        this.formularioGrp.get('idAreaSeguridad').setValue(result.idArea + ' - ' + result.nombre);
        this.eAreaSeguridad = result;
      }
    });
  }

  cargarEntidadSeguridad(idAreaSeguridad: number): void {
    if (idAreaSeguridad) {
      let req = new AreaBuscarRequest();
      req.idArea = idAreaSeguridad;

      this.entidadService.buscarArea(req).subscribe(
        (out: OutResponse<AreaBuscarResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.eAreaSeguridad = new AreaListarResponse();
            this.eAreaSeguridad.idArea = out.objeto.idArea;
            this.eAreaSeguridad.nombre = out.objeto.nombre;
            this.eAreaSeguridad.sigla = out.objeto.sigla;
            this.eAreaSeguridad.flgActivo = out.objeto.flgActivo;

            this.formularioGrp.get('idAreaSeguridad').setValue(this.eAreaSeguridad.idArea + ' - ' + this.eAreaSeguridad.nombre);
          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
        },
        error => {
          console.log(error);
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    }
  }

}
