import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTES, MAESTRAS, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CentroAtencionServListarXTipCenRequest } from 'src/app/modules/intranet/dto/centro-atencion-serv-listar-x-tipcen.request';
import { CentroAtencionAsociarServicioRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-asociar-servicio.request';
import { CentroAtencionEliminarServicioAsocRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-eliminar-servicio-asoc.request';
import { CentroAtencionServListarXCentroRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-serv-listar-x-centro.request';
import { CentroAtencionAsociarServicioResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-asociar-servicio.response';
import { CentroAtencionListarResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-listar.response';
import { CentroAtencionServListarXCentroResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-serv-listar-x-centro.response';
import { CentroAtencionServListarXTipCenResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-serv-listar-x-tipcen.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { CentroAtencionService } from 'src/app/modules/intranet/services/centro-atencion.service';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-servs-centro-atencion',
  templateUrl: './servs-centro-atencion.component.html',
  styleUrls: ['./servs-centro-atencion.component.scss']
})
export class ServsCentroAtencionComponent implements OnInit {
  guardar: boolean = false;

  index: number = null;

  listaServicio: CentroAtencionServListarXTipCenResponse[] = null;

  listaServicioXCentro: CentroAtencionServListarXCentroResponse[] = null;
  displayedColumns: string[];
  dataSource: MatTableDataSource<CentroAtencionServListarXCentroResponse> = null;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: CentroAtencionServListarXCentroResponse) => (m.codigo != null) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: CentroAtencionServListarXCentroResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ServsCentroAtencionComponent>,
    private _snackBar: MatSnackBar,
    @Inject(CentroAtencionService) private centroAtencionService: CentroAtencionService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<CentroAtencionListarResponse>,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoCentro: ['', [Validators.required]],
      servicio: ['', [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.formularioGrp.get('tipoCentro').setValue(this.dataDialog.objeto.nomTipoCentro);
    this.comboServicioXTipoCentro();

    this.listarServicioXCentro();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  comboServicioXTipoCentro(): void {
    let req = new CentroAtencionServListarXTipCenRequest();
    req.idtTipoCentro = this.dataDialog.objeto.idtTipoCentro;

    this.centroAtencionService.listarServicioXTipoCentro(req).subscribe(
      (out: OutResponse<CentroAtencionServListarXTipCenResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicio = out.objeto;
        } else {
          console.log(out.rmensaje);
          this.listaServicio = [];
        }
      },
      error => {
        console.log(error);
        this.listaServicio = [];
      }
    );
  }

  listarServicioXCentro(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new CentroAtencionServListarXCentroRequest();
    req.idCentroAtencion = this.dataDialog.objeto.idCentroAtencion;

    this.centroAtencionService.listarServicioXCentro(req).subscribe(
      (data: OutResponse<CentroAtencionServListarXCentroResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicioXCentro = data.objeto;
        } else {
          this.listaServicioXCentro = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.listaServicioXCentro = [];
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaServicioXCentro.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaServicioXCentro);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  regCentroAtenServicio(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new CentroAtencionAsociarServicioRequest();
      req.idCentroAtencion = this.dataDialog.objeto.idCentroAtencion;
      req.idServicio = this.formularioGrp.get('servicio').value.idServicio;
      req.idUsuarioCrea = this.user.getIdUsuario;

      this.centroAtencionService.registrarServicioCentroAtencion(req).subscribe(
        (out: OutResponse<CentroAtencionAsociarServicioResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new CentroAtencionServListarXCentroResponse();
            res.idCentroAtenServicio = out.objeto.idCentroAtenServicio;
            res.idServicio = req.idServicio;
            res.codigo = this.formularioGrp.get('servicio').value.codigo;
            res.nombre = this.formularioGrp.get('servicio').value.nombre;

            this.formularioGrp.get('servicio').setValue('');
            this.formService.setAsUntoched(this.formularioGrp, this.formErrors, ['tipoCentro']);

            this.listaServicioXCentro.unshift(res);
            this.cargarDatosTabla();
            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
          this.guardar = false;
        },
        error => {
          console.error(error);
          this.guardar = false;
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  eliminarCentroAtenServicio(obj: CentroAtencionServListarXCentroResponse): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        titulo: MENSAJES.MSG_CONFIRMACION_DELETE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == CONSTANTES.COD_CONFIRMADO) {
        this.spinner.show();
        let index = this.listaServicioXCentro.indexOf(obj);

        let req = new CentroAtencionEliminarServicioAsocRequest();
        req.idCentroAtenServicio = obj.idCentroAtenServicio;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.centroAtencionService.eliminarServicioCentroAtencion(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaServicioXCentro.splice(index, 1);
              console.log(this.listaServicioXCentro);
              this.cargarDatosTabla();

              this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else {
              this._snackBar.open(data.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
            }
            this.spinner.hide();
          },
          error => {
            console.log(error);
            this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
            this.spinner.hide();
          }
        );
      }
    });
  }
}
