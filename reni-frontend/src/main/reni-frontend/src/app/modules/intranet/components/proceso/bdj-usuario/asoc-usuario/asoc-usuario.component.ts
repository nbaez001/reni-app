import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MAESTRAS, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { UsuarioAsociarRequest } from 'src/app/modules/intranet/dto/request/usuario-asociar.request';
import { UsuarioBuscarRequest } from 'src/app/modules/intranet/dto/request/usuario-buscar.request';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { UsuarioBuscarResponse } from 'src/app/modules/intranet/dto/response/usuario-buscar.response';
import { UsuarioListarResponse } from 'src/app/modules/intranet/dto/response/usuario-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { UsuarioReniService } from 'src/app/modules/intranet/services/usuario-reni.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-asoc-usuario',
  templateUrl: './asoc-usuario.component.html',
  styleUrls: ['./asoc-usuario.component.scss']
})
export class AsocUsuarioComponent implements OnInit {
  modif: boolean = false;
  busca: boolean = false;

  listaTipoDocumento: MaestraSubitemListarResponse[] = [];
  listaSexo: MaestraSubitemListarResponse[] = [];

  eUsuario: UsuarioBuscarResponse;

  formularioGrp: FormGroup;
  formErrors: any;

  formularioUsuGrp: FormGroup;
  formUsuErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AsocUsuarioComponent>,
    private _snackBar: MatSnackBar,
    @Inject(UsuarioReniService) private usuarioReniService: UsuarioReniService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<UsuarioListarResponse>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required, Validators.maxLength(15), CustomValidators.onlyNumbers]],
      nombre: ['', [Validators.required]],
      apePaterno: ['', [Validators.required]],
      apeMaterno: ['', [Validators.required]],
      sexo: ['', [Validators.required]]
    });

    this.formularioUsuGrp = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required, Validators.maxLength(15), CustomValidators.onlyNumbers]],
      nombre: ['', []],
      apePaterno: ['', []],
      apeMaterno: ['', []],
      sexo: ['', []]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.formUsuErrors = this.formService.buildFormErrors(this.formularioUsuGrp, this.formUsuErrors);
    this.formularioUsuGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioUsuGrp, this.formUsuErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.comboTipoDocumento();
    this.comboSexo();
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('nroDocumento').setValue(this.dataDialog.objeto.nroDocumento);
      this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nombre);
      this.formularioGrp.get('apePaterno').setValue(this.dataDialog.objeto.apePaterno);
      this.formularioGrp.get('apeMaterno').setValue(this.dataDialog.objeto.apeMaterno);
    }
  }

  comboTipoDocumento(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_DOCUMENTO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoDocumento = out.objeto;
          if (this.dataDialog.objeto && this.dataDialog.objeto.tipDocumento) {
            this.formularioGrp.get('tipoDocumento').setValue(this.listaTipoDocumento.filter(el => (el.codigo == this.dataDialog.objeto.tipDocumento))[0].nombre);
          }
        } else {
          console.log(out.rmensaje);
          this.listaTipoDocumento = [];
        }
      },
      error => {
        console.log(error);
        this.listaTipoDocumento = [];
      }
    );
  }

  comboSexo(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.SEXO_USU;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaSexo = out.objeto;
          if (this.dataDialog.objeto && this.dataDialog.objeto.sexo) {
            this.formularioGrp.get('sexo').setValue(this.listaSexo.filter(el => (el.codigo == this.dataDialog.objeto.sexo))[0].nombre);
          }
        } else {
          console.log(out.rmensaje);
          this.listaSexo = [];
        }
      },
      error => {
        console.log(error);
        this.listaSexo = [];
      }
    );
  }


  buscarUsuario(): void {
    if (this.formularioUsuGrp.valid) {
      this.busca = true;

      let req = new UsuarioBuscarRequest();
      req.nroDocumento = this.formularioUsuGrp.get('nroDocumento').value;
      req.idtTipoDocumento = this.formularioUsuGrp.get('tipoDocumento').value.codigo;

      console.log(req);
      this.usuarioReniService.buscarUsuario(req).subscribe(
        (out: OutResponse<UsuarioBuscarResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.eUsuario = out.objeto;
            this.formularioUsuGrp.get('nombre').setValue(out.objeto.nombre);
            this.formularioUsuGrp.get('apePaterno').setValue(out.objeto.apePaterno);
            this.formularioUsuGrp.get('apeMaterno').setValue(out.objeto.apeMaterno);
            this.formularioUsuGrp.get('apeMaterno').setValue(out.objeto.apeMaterno);
            this.formularioUsuGrp.get('sexo').setValue(this.listaSexo.filter(el => (el.codigo == this.dataDialog.objeto.sexo))[0].nombre);
          } else {
            this.eUsuario = null;
            this.formularioUsuGrp.get('nombre').setValue('');
            this.formularioUsuGrp.get('apePaterno').setValue('');
            this.formularioUsuGrp.get('apeMaterno').setValue('');
            this.formularioUsuGrp.get('apeMaterno').setValue('');
            this.formularioUsuGrp.get('sexo').setValue('');
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
          this.busca = false;
        },
        error => {
          console.log(error);
          this.busca = false;
          this.eUsuario = null;
          this.formularioUsuGrp.get('nombre').setValue('');
          this.formularioUsuGrp.get('apePaterno').setValue('');
          this.formularioUsuGrp.get('apeMaterno').setValue('');
          this.formularioUsuGrp.get('apeMaterno').setValue('');
          this.formularioUsuGrp.get('sexo').setValue('');
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioUsuGrp, this.formUsuErrors, true);
    }
  }

  asocUsuario(): void {
    if (this.formularioUsuGrp.valid) {
      if (this.eUsuario) {
        this.modif = true;

        let req = new UsuarioAsociarRequest();
        req.idUsuario = this.eUsuario.idUsuario;
        req.idUsuarioHist = this.dataDialog.objeto.idUsuario;
        req.idUsuarioCrea = this.user.getIdUsuario;

        console.log(req);
        this.usuarioReniService.asociarUsuario(req).subscribe(
          (out: OutResponse<any>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.dialogRef.close(1);
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
        this._snackBar.open('Busque un usuario al cual desea asociar el primero', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.formService.getValidationErrors(this.formularioUsuGrp, this.formUsuErrors, true);
    }
  }
}
