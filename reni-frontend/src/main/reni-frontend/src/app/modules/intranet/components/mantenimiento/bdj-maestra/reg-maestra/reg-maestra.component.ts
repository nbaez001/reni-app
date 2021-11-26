import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { MaestraRegistrarRequest } from 'src/app/modules/intranet/dto/request/maestra-registrar.request';
import { MaestraListarResponse } from 'src/app/modules/intranet/dto/response/maestra-listar.response';
import { MaestraRegistrarResponse } from 'src/app/modules/intranet/dto/response/maestra-registrar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-reg-maestra',
  templateUrl: './reg-maestra.component.html',
  styleUrls: ['./reg-maestra.component.scss']
})
export class RegMaestraComponent implements OnInit {
  guardar: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegMaestraComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      descripcion: ['', [Validators.maxLength(500)]],
      idTabla: ['', [Validators.required, Validators.maxLength(50), CustomValidators.onlyAlfanumericoYSubguion]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {

  }

  regMaestra(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new MaestraRegistrarRequest();
      req.idTabla = this.formularioGrp.get('idTabla').value;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.codigo = this.generarCodigo(req.nombre);
      req.descripcion = this.formularioGrp.get('descripcion').value;
      req.idUsuarioCrea = this.user.getIdUsuario;

      console.log(req);
      this.maestraService.registrarMaestra(req).subscribe(
        (out: OutResponse<MaestraRegistrarResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new MaestraListarResponse();
            res.idMaestra = out.objeto.idMaestra;
            res.idTabla = req.idTabla;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.descripcion = req.descripcion;
            res.flgActivo = CONSTANTES.FLG_ACTIVO;

            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            this.dialogRef.close(res);
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

  generarCodigo(nombre: string): string {
    let cod = '';
    let array = nombre.split(' ');
    if (array.length >= 2) {
      array.forEach(e => {
        cod += e.charAt(0);
      });
    } else {
      if (nombre.length >= 2) {
        cod = nombre.substring(0, 2);
      } else {
        cod = nombre.substring(0, nombre.length);
      }
    }
    return cod;
  }

}
