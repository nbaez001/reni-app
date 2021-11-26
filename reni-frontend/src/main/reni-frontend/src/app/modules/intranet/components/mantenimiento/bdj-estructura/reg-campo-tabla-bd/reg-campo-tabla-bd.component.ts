import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TIPOS_DATO_BD, CONSTANTES, MENSAJES, TABLAS_BD } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { BDCampoTablaRegistrarRequest } from 'src/app/modules/intranet/dto/request/bd-campo-tabla-registrar.request';
import { BDCampoTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-campo-tabla-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { AdministracionBdService } from 'src/app/modules/intranet/services/administracion-bd.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-reg-campo-tabla-bd',
  templateUrl: './reg-campo-tabla-bd.component.html',
  styleUrls: ['./reg-campo-tabla-bd.component.scss']
})
export class RegCampoTablaBdComponent implements OnInit {
  guardar: boolean = false;

  longitud: boolean = false;
  escala: boolean = false;

  listaTipoDato = TIPOS_DATO_BD;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegCampoTablaBdComponent>,
    private _snackBar: MatSnackBar,
    @Inject(AdministracionBdService) private administracionBdService: AdministracionBdService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<string>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(70), CustomValidators.onlyAlfanumericoYSubguion]],
      tipoCampo: ['', [Validators.required]],
      longitud: ['', []],
      escala: ['', []],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {

  }

  regCampoBD(): void {
    if (this.formularioGrp.valid) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '300px',
        data: {
          titulo: MENSAJES.MSG_CONFIRMACION_AGREGAR_CAMPO_BD,
          detalle: MENSAJES.MSG_CONFIRMACION_AGREGAR_CAMPO_BD_DETALLE,
          objeto: null
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == CONSTANTES.COD_CONFIRMADO) {
          if (TABLAS_BD.CENTRO_ATENCION.NOMBRE != this.dataDialog.objeto) {
            this.guardar = true;

            let req = new BDCampoTablaRegistrarRequest();
            req.nomTabla = this.dataDialog.objeto;
            req.nomColumna = this.formularioGrp.get('nombre').value;
            req.tipoDato = this.formularioGrp.get('tipoCampo').value.tipo;
            req.longitud = this.formularioGrp.get('longitud').value;
            req.escala = this.formularioGrp.get('escala').value;

            this.administracionBdService.registrarCampoBD(req).subscribe(
              (out: OutResponse<any>) => {
                if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
                  let res = new BDCampoTablaListarResponse();
                  res.nomColumna = req.nomColumna;
                  res.tipoDato = req.tipoDato;
                  res.longitudDato = req.longitud;
                  res.precisionDato = req.longitud;
                  res.escalaDato = req.escala;

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
          } else {
            this._snackBar.open('No puede agregar campos a la tabla ' + TABLAS_BD.CENTRO_ATENCION.NOMBRE + ', debido a que esta tabla no es dinamica', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
        }
      });
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  actualizarLongitud(): void {
    let tipoDato = this.formularioGrp.get('tipoCampo').value;
    if (tipoDato) {
      if (tipoDato.longitud == 1 || tipoDato.presicion == 1) {
        this.longitud = true;
        this.formularioGrp.get('longitud').setValidators(Validators.compose([Validators.required, Validators.min(1)]));
        this.formularioGrp.get('longitud').updateValueAndValidity();
      } else {
        this.longitud = false;
        this.formularioGrp.get('longitud').setValidators(Validators.compose([]));
        this.formularioGrp.get('longitud').updateValueAndValidity();
      }

      if (tipoDato.escala == 1) {
        this.escala = true;
        this.formularioGrp.get('escala').setValidators(Validators.compose([Validators.required, Validators.min(0)]));
        this.formularioGrp.get('escala').updateValueAndValidity();
      } else {
        this.escala = false;
        this.formularioGrp.get('escala').setValidators(Validators.compose([]));
        this.formularioGrp.get('escala').updateValueAndValidity();
      }
      this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    } else {
      this.longitud = false;
      this.escala = false;

      this.formularioGrp.get('longitud').setValidators(Validators.compose([]));
      this.formularioGrp.get('longitud').updateValueAndValidity();
      this.formularioGrp.get('escala').setValidators(Validators.compose([]));
      this.formularioGrp.get('escala').updateValueAndValidity();
      this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    }
  }
}
