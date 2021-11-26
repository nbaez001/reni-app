import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioListarResponse } from 'src/app/modules/intranet/dto/response/servicio-listar.response';
import { LineaIntervencionListarResponse } from 'src/app/modules/intranet/dto/response/linea-intervencion-listar.response';
import { ServicioService } from 'src/app/modules/intranet/services/servicio.service';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { EntidadListarResponse } from 'src/app/modules/intranet/dto/response/entidad-listar.response';
import { FormService } from 'src/app/core/services/form.service';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { ServicioRegistrarRequest } from 'src/app/modules/intranet/dto/request/servicio-registrar.request';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { ServicioRegistrarResponse } from 'src/app/modules/intranet/dto/response/servicio-registrar.response';
import { CONSTANTES, MAESTRAS, MENSAJES, MENSAJES_PANEL } from 'src/app/common';
import { BuscEntidadComponent } from '../busc-entidad/busc-entidad.component';
import { BuscLineaInterComponent } from '../busc-linea-inter/busc-linea-inter.component';
import { MaestraListarRequest } from 'src/app/modules/intranet/dto/request/maestra-listar.request';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';

@Component({
  selector: 'app-reg-servicio',
  templateUrl: './reg-servicio.component.html',
  styleUrls: ['./reg-servicio.component.scss']
})
export class RegServicioComponent implements OnInit {
  guardar: boolean = false;

  entidad: EntidadListarResponse = null;
  lineaIntervencion: LineaIntervencionListarResponse = null;
  listaTipoCentros: MaestraSubitemListarResponse[] = [];
  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegServicioComponent>,
    private _snackBar: MatSnackBar,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      codigo: ['', [Validators.required, Validators.maxLength(25)]],
      tipoCentro: ['', [Validators.required]],
      entidad: ['', [Validators.required]],
      lineaIntervencion: ['', [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.comboTipoCentro();
  }

  comboTipoCentro(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_CENTRO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoCentros = out.objeto;
          this.formularioGrp.get('tipoCentro').setValue(this.listaTipoCentros[0]);
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

  regServicio(): void {
    if (this.formularioGrp.valid) {
      if (this.entidad && this.lineaIntervencion) {
        this.guardar = true;

        let req = new ServicioRegistrarRequest();
        req.nombre = this.formularioGrp.get('nombre').value;
        req.codigo = this.formularioGrp.get('codigo').value;
        req.idtTipCentro = this.formularioGrp.get('tipoCentro').value.codigo;
        req.idEntidad = this.entidad.idEntidad;
        req.idLineaIntervencion = this.lineaIntervencion.idLineaInter;
        req.idUsuarioCrea = this.user.getIdUsuario;

        console.log(req);
        this.servicioService.registrarServicio(req).subscribe(
          (out: OutResponse<ServicioRegistrarResponse>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              let res = new ServicioListarResponse();
              res.idServicio = out.objeto.idServicio;
              res.codigo = req.codigo;
              res.nombre = req.nombre;
              res.idtTipCentro = req.idtTipCentro;
              res.nomTipCentro = this.formularioGrp.get('tipoCentro').value.nombre;
              res.flgActivo = CONSTANTES.FLG_ACTIVO;
              res.idEntidad = this.entidad.idEntidad;
              res.nomEntidad = this.entidad.nombre;
              res.idLineaIntervencion = this.lineaIntervencion.idLineaInter;
              res.nomLineaIntervencion = this.lineaIntervencion.nombre;

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
        this._snackBar.open('FALTA COMPLETAR EL CAMPO "Codigo servicio BD Seguridad"', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  buscarEntidades(): void {
    const dialogRef = this.dialog.open(BuscEntidadComponent, {
      width: '900px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.SERVICIO.BUSCAR_ENTIDAD.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: EntidadListarResponse) => {
      if (result) {
        this.formularioGrp.get('entidad').setValue(result.siglas + ' - ' + result.nombre);
        this.entidad = result;
      }
    });
  }

  buscarLineasIntervencion(): void {
    const dialogRef = this.dialog.open(BuscLineaInterComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.SERVICIO.BUSCAR_LINEA_INTERVENCION.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: LineaIntervencionListarResponse) => {
      if (result) {
        this.formularioGrp.get('lineaIntervencion').setValue(result.nombre);
        this.lineaIntervencion = result;
      }
    });
  }
}
