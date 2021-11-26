import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { LineaIntervencionRegistrarRequest } from 'src/app/modules/intranet/dto/request/linea-intervencion-registrar.request';
import { LineaIntervencionListarResponse } from 'src/app/modules/intranet/dto/response/linea-intervencion-listar.response';
import { LineaIntervencionRegistrarResponse } from 'src/app/modules/intranet/dto/response/linea-intervencion-registrar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { LineaIntervencionService } from 'src/app/modules/intranet/services/linea-intervencion.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-reg-linea-intervencion',
  templateUrl: './reg-linea-intervencion.component.html',
  styleUrls: ['./reg-linea-intervencion.component.scss']
})
export class RegLineaIntervencionComponent implements OnInit {
  guardar: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegLineaIntervencionComponent>,
    private _snackBar: MatSnackBar,
    @Inject(LineaIntervencionService) private entidadService: LineaIntervencionService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      codigo: ['', [Validators.required, Validators.maxLength(25)]],
      orden: ['', [Validators.min(1)]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {

  }

  regLineaIntervencion(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new LineaIntervencionRegistrarRequest();
      req.nombre = this.formularioGrp.get('nombre').value;
      req.codigo = this.formularioGrp.get('codigo').value;
      req.orden = this.formularioGrp.get('orden').value;
      req.idUsuarioCrea = this.user.getIdUsuario;

      console.log(req);
      this.entidadService.registrarLineaIntervencion(req).subscribe(
        (out: OutResponse<LineaIntervencionRegistrarResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new LineaIntervencionListarResponse();
            res.idLineaInter = out.objeto.idLineaInter;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.orden = req.orden;
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
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }
}
