import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { TipoCentroModificarRequest } from 'src/app/modules/intranet/dto/request/tipo-centro-modificar.request';
import { TipoCentroListarResponse } from 'src/app/modules/intranet/dto/response/tipo-centro-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { TipoCentroService } from 'src/app/modules/intranet/services/tipo-centro.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-mod-tipo-centro-atencion',
  templateUrl: './mod-tipo-centro-atencion.component.html',
  styleUrls: ['./mod-tipo-centro-atencion.component.scss']
})
export class ModTipoCentroAtencionComponent implements OnInit {
  modif: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModTipoCentroAtencionComponent>,
    private _snackBar: MatSnackBar,
    @Inject(TipoCentroService) private tipoCentroService: TipoCentroService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<TipoCentroListarResponse>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      codigo: ['', [Validators.required, Validators.maxLength(25)]],
      abreviatura: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      orden: ['', [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('codigo').setValue(this.dataDialog.objeto.codigo);
      this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nombre);
      this.formularioGrp.get('abreviatura').setValue(this.dataDialog.objeto.abreviatura);
      this.formularioGrp.get('descripcion').setValue(this.dataDialog.objeto.descripcion);
      this.formularioGrp.get('orden').setValue(this.dataDialog.objeto.orden);
    }
  }

  modTipoCentro(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new TipoCentroModificarRequest();
      req.idTipoCentro = this.dataDialog.objeto.idTipoCentro;
      req.codigo = this.formularioGrp.get('codigo').value;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.abreviatura = this.formularioGrp.get('abreviatura').value;
      req.descripcion = this.formularioGrp.get('descripcion').value;
      req.orden = this.formularioGrp.get('orden').value;
      req.idUsuarioModif = this.user.getIdUsuario;

      console.log(req);
      this.tipoCentroService.modificarTipoCentro(req).subscribe(
        (out: OutResponse<any>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new TipoCentroListarResponse();
            res.idTipoCentro = this.dataDialog.objeto.idTipoCentro;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.abreviatura = req.abreviatura;
            res.descripcion = req.descripcion;
            res.flgActivo = CONSTANTES.FLG_ACTIVO;
            res.orden = req.orden;

            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            this.dialogRef.close(res);
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

}
