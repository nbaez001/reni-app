import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { ACTIVO_LISTA, CONSTANTES, MENSAJES, MENSAJES_PANEL } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { EntidadListarRequest } from '../../../dto/request/entidad-listar.request';
import { LineaIntervencionListarRequest } from '../../../dto/request/linea-intervencion-listar.request';
import { ServicioEliminarRequest } from '../../../dto/request/servicio-eliminar.request';
import { ServicioListarRequest } from '../../../dto/request/servicio-listar.request';
import { EntidadListarResponse } from '../../../dto/response/entidad-listar.response';
import { FileResponse } from '../../../dto/response/file.response';
import { LineaIntervencionListarResponse } from '../../../dto/response/linea-intervencion-listar.response';
import { ServicioListarResponse } from '../../../dto/response/servicio-listar.response';
import { EntidadService } from '../../../services/entidad.service';
import { LineaIntervencionService } from '../../../services/linea-intervencion.service';
import { ReporteService } from '../../../services/reporte.service';
import { ServicioService } from '../../../services/servicio.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ModServicioComponent } from './mod-servicio/mod-servicio.component';
import { RegServicioComponent } from './reg-servicio/reg-servicio.component';

@Component({
  selector: 'app-bdj-servicio',
  templateUrl: './bdj-servicio.component.html',
  styleUrls: ['./bdj-servicio.component.scss']
})
export class BdjServicioComponent implements OnInit {
  exportar = false;

  activoLista: any;
  listaServicio: ServicioListarResponse[] = [];
  listaEntidades: Observable<EntidadListarResponse[]>;
  listaLineaIntervencion: LineaIntervencionListarResponse[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<ServicioListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: ServicioListarResponse) => m.codigo ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: ServicioListarResponse) => m.nombre ? `${m.nombre}` : ''
    }, {
      columnDef: 'nomTipCentro',
      header: 'Tipo centro',
      cell: (m: ServicioListarResponse) => m.nomTipCentro ? `${m.nomTipCentro}` : ''
    }, {
      columnDef: 'nomEntidad',
      header: 'Entidad',
      cell: (m: ServicioListarResponse) => m.nomEntidad ? `${m.nomEntidad}` : ''
    }, {
      columnDef: 'nomLineaIntervencion',
      header: 'Linea de Intervencion',
      cell: (m: ServicioListarResponse) => m.nomLineaIntervencion ? `${m.nomLineaIntervencion}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: ServicioListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(LineaIntervencionService) private lineaIntervencionService: LineaIntervencionService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.maxLength(250)]],
      entidad: ['', [Validators.maxLength(250)]],
      lineaIntervencion: ['', [Validators.required]],
      flgActivo: ['', [Validators.required]]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    //FOR AUTOCOMPLETES
    this.formularioGrp.get('entidad').valueChanges.subscribe(
      data => {
        const filterValue = (typeof data == 'string') ? data.toUpperCase() : null;
        if (filterValue) {
          this._buscarEntidad(filterValue);
        }
      }
    );
    //PARA AUTOCOMPLETES

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.definirTabla();

    this.comboLineaIntervencion();

    this.activoLista = JSON.parse(JSON.stringify(ACTIVO_LISTA));
    this.activoLista.unshift({ id: null, nombre: 'TODOS' });
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
    this.buscar();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    if (this.listaServicio.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaServicio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  comboLineaIntervencion(): void {
    let req = new LineaIntervencionListarRequest();
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.lineaIntervencionService.listarLineaIntervencion(req).subscribe(
      (data: OutResponse<LineaIntervencionListarResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaLineaIntervencion = data.objeto;
          this.listaLineaIntervencion.unshift(JSON.parse(JSON.stringify({ idLineaInter: null, nombre: 'TODOS' })));
          this.formularioGrp.get('lineaIntervencion').setValue(this.listaLineaIntervencion[0]);
        } else {
          console.log(data.rmensaje);
        }
      }, error => {
        console.log(error);
      }
    )
  }

  private _buscarEntidad(value: any): void {
    let req = new EntidadListarRequest();
    req.nombre = value;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.entidadService.listarEntidad(req).subscribe(
      (data: OutResponse<EntidadListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEntidades = JSON.parse(JSON.stringify(data.objeto));
        } else {
          console.log(data.rmensaje);
          this.listaEntidades = of([]);
        }
      }, error => {
        console.log(error);
        this.listaEntidades = of([]);
      }
    )
  }

  buscar(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new ServicioListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nomServicio = this.formularioGrp.get('nombre').value;
    let ent = this.formularioGrp.get('entidad').value;
    req.nomEntidad = (typeof ent == 'string' || typeof ent == 'undefined') ? ent.toUpperCase() : ent.nombre;
    req.idLineaIntervencion = this.formularioGrp.get('lineaIntervencion').value.idLineaInter;

    this.servicioService.listarServicio(req).subscribe(
      (data: OutResponse<ServicioListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicio = data.objeto;
        } else {
          this.listaServicio = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      },
      error => {
        console.log(error);
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.isLoading = false;
      }
    );
  }

  exportarExcel() {
    this.exportar = true;

    let req = new ServicioListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nomServicio = this.formularioGrp.get('nombre').value;
    let ent = this.formularioGrp.get('entidad').value;
    req.nomEntidad = (typeof ent == 'string' || typeof ent == 'undefined') ? ent.toUpperCase() : ent.nombre;
    req.idLineaIntervencion = this.formularioGrp.get('lineaIntervencion').value.idLineaInter;

    this.servicioService.exportarListaServicioXlsx(req).subscribe(
      (data: OutResponse<FileResponse>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          let blob = this.reporteService.convertToBlobFromByte(data.objeto);
          this.reporteService.DownloadBlobFile(blob);
          this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
        } else {
          this._snackBar.open(data.rmensaje, null, { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
        this.exportar = false;
      },
      error => {
        console.log(error);
        this._snackBar.open(error.statusText, null, { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.exportar = false;
      }
    );
  }

  regServicio() {
    const dialogRef = this.dialog.open(RegServicioComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.SERVICIO.REGISTRAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaServicio.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editServicio(obj: ServicioListarResponse) {
    let index = this.listaServicio.indexOf(obj);
    const dialogRef = this.dialog.open(ModServicioComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.SERVICIO.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaServicio.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimServicio(obj: ServicioListarResponse): void {
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
        let index = this.listaServicio.indexOf(obj);

        let req = new ServicioEliminarRequest();
        req.idServicio = obj.idServicio;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.servicioService.eliminarServicio(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaServicio.splice(index, 1);
              this.cargarDatosTabla();
              this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else {
              this._snackBar.open(data.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
            }
            this.spinner.hide();
          }, error => {
            console.error(error);
            this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
            this.spinner.hide();
          }
        )
      }
    });
  }

  displayFn(obj: EntidadListarResponse) {
    return obj ? obj.nombre : '';
  }

  seleccionado(evt) {
    console.log(evt);
  }

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
    this.formularioGrp.get('lineaIntervencion').setValue(this.listaLineaIntervencion[0]);
    this.formularioGrp.get('entidad').setValue('');
  }

}
