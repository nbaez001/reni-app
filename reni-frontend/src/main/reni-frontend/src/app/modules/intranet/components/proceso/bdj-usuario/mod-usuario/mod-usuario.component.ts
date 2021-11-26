import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MAESTRAS, TIENE_DOC_IDE, MENSAJES } from 'src/app/common';
import { DateService } from 'src/app/core/services/date.service';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { UsuarioModificarRequest } from 'src/app/modules/intranet/dto/request/usuario-modificar.request';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { UsuarioListarResponse } from 'src/app/modules/intranet/dto/response/usuario-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { UsuarioReniService } from 'src/app/modules/intranet/services/usuario-reni.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-mod-usuario',
  templateUrl: './mod-usuario.component.html',
  styleUrls: ['./mod-usuario.component.scss']
})
export class ModUsuarioComponent implements OnInit {
  modif: boolean = false;

  TIENE_DOC_IDE = TIENE_DOC_IDE;

  listaTieneDocumento: MaestraSubitemListarResponse[] = [];
  listaTipoDocumento: MaestraSubitemListarResponse[] = [];
  listaSexo: MaestraSubitemListarResponse[] = [];

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModUsuarioComponent>,
    private _snackBar: MatSnackBar,
    @Inject(UsuarioReniService) private usuarioReniService: UsuarioReniService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(DateService) private dateService: DateService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<UsuarioListarResponse>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tieneDocumento: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required, Validators.maxLength(15), CustomValidators.onlyNumbers]],
      nombre: ['', [Validators.required]],
      apePaterno: ['', [Validators.required]],
      apeMaterno: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      fecNacimiento: ['', [Validators.required]]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.comboTieneDocumento();
    this.comboTipoDocumento();
    this.comboSexo();
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('nroDocumento').setValue(this.dataDialog.objeto.nroDocumento);
      this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nombre);
      this.formularioGrp.get('apePaterno').setValue(this.dataDialog.objeto.apePaterno);
      this.formularioGrp.get('apeMaterno').setValue(this.dataDialog.objeto.apeMaterno);
      this.formularioGrp.get('fecNacimiento').setValue(this.dateService.parseGuionDDMMYYYY(this.dataDialog.objeto.fecNacimiento));
    }
  }

  comboTieneDocumento(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIENE_DOC_IDE;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTieneDocumento = out.objeto;
          if (this.dataDialog.objeto && this.dataDialog.objeto.tieneDocIdent) {
            this.formularioGrp.get('tieneDocumento').setValue(this.listaTieneDocumento.filter(el => (el.codigo == this.dataDialog.objeto.tieneDocIdent))[0]);
          }
        } else {
          console.log(out.rmensaje);
          this.listaTieneDocumento = [];
        }
      },
      error => {
        console.log(error);
        this.listaTieneDocumento = [];
      }
    );
  }

  comboTipoDocumento(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_DOCUMENTO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoDocumento = out.objeto;
          if (this.dataDialog.objeto && this.dataDialog.objeto.tipDocumento) {
            this.formularioGrp.get('tipoDocumento').setValue(this.listaTipoDocumento.filter(el => (el.codigo == this.dataDialog.objeto.tipDocumento))[0]);
            this.evaluarDocumento();
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
            this.formularioGrp.get('sexo').setValue(this.listaSexo.filter(el => (el.codigo == this.dataDialog.objeto.sexo))[0]);
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

  modUsuario(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new UsuarioModificarRequest();
      req.idUsuario = this.dataDialog.objeto.idUsuario;
      req.idtTieneDocIdent = this.formularioGrp.get('tieneDocumento').value.codigo;
      if (req.idtTieneDocIdent == TIENE_DOC_IDE.SI_TIENE) {
        req.nroDocumento = this.formularioGrp.get('nroDocumento').value;
      }
      req.idtTipoDocumento = this.formularioGrp.get('tipoDocumento').value.codigo;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.apePaterno = this.formularioGrp.get('apePaterno').value;
      req.apeMaterno = this.formularioGrp.get('apeMaterno').value;
      req.sexo = this.formularioGrp.get('sexo').value.codigo;
      req.fecNacimiento = this.formularioGrp.get('fecNacimiento').value;
      req.idUsuarioModif = this.user.getIdUsuario;

      console.log(req);
      this.usuarioReniService.modificarUsuario(req).subscribe(
        (out: OutResponse<any>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new UsuarioListarResponse();
            res.idUsuario = this.dataDialog.objeto.idUsuario;
            res.tieneDocIdent = req.idtTieneDocIdent;
            res.tipDocumento = req.idtTipoDocumento;
            res.nroDocumento = req.nroDocumento;
            res.nombre = req.nombre;
            res.apePaterno = req.apePaterno;
            res.apeMaterno = req.apeMaterno;
            res.sexo = req.sexo;
            res.fecNacimiento = req.fecNacimiento;
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
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  evaluarDocumento() {
    let codTieneDoc = this.formularioGrp.get('tieneDocumento').value.codigo;
    if (codTieneDoc != TIENE_DOC_IDE.SI_TIENE) {
      this.formularioGrp.get('nroDocumento').disable();
      this.formularioGrp.get('tipoDocumento').disable();

      this.formularioGrp.get('tipoDocumento').setValue(this.listaTipoDocumento.filter(el => (el.codigo == TIENE_DOC_IDE.TIP_DOCUMENTO_NO_APLICA))[0]);
    } else {
      this.formularioGrp.get('nroDocumento').enable();
      this.formularioGrp.get('tipoDocumento').enable();
    }
  }
}
