import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { ACTIVO_LISTA, CONSTANTES, MENSAJES_PANEL, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { EdneEliminarRequest } from '../../../dto/request/edne-eliminar.request';
import { EdneListarRequest } from '../../../dto/request/edne-listar.request';
import { EntidadListarRequest } from '../../../dto/request/entidad-listar.request';
import { EstructuraListarRequest } from '../../../dto/request/estructura-listar.request';
import { LineaIntervencionListarRequest } from '../../../dto/request/linea-intervencion-listar.request';
import { ServicioListarRequest } from '../../../dto/request/servicio-listar.request';
import { EdneListarResponse } from '../../../dto/response/edne-listar.response';
import { EntidadListarResponse } from '../../../dto/response/entidad-listar.response';
import { EstructuraListarResponse } from '../../../dto/response/estructura-listar.response';
import { FileResponse } from '../../../dto/response/file.response';
import { LineaIntervencionListarResponse } from '../../../dto/response/linea-intervencion-listar.response';
import { ServicioListarResponse } from '../../../dto/response/servicio-listar.response';
import { EdneService } from '../../../services/edne.service';
import { EntidadService } from '../../../services/entidad.service';
import { EstructuraService } from '../../../services/estructura.service';
import { LineaIntervencionService } from '../../../services/linea-intervencion.service';
import { ReporteService } from '../../../services/reporte.service';
import { ServicioService } from '../../../services/servicio.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ModImportacionEdneComponent } from './mod-importacion-edne/mod-importacion-edne.component';
import { RegImportacionEdneComponent } from './reg-importacion-edne/reg-importacion-edne.component';

@Component({
  selector: 'app-bdj-importacion-edne',
  templateUrl: './bdj-importacion-edne.component.html',
  styleUrls: ['./bdj-importacion-edne.component.scss']
})
export class BdjImportacionEdneComponent implements OnInit {
  exportar = false;

  CONSTANTES = CONSTANTES;
  activoLista: any;
  listaEdne: EdneListarResponse[] = null;
  listaLineaIntervencion: LineaIntervencionListarResponse[] = null;
  listaServicios: Observable<ServicioListarResponse[]>;
  listaEntidades: Observable<EntidadListarResponse[]>;
  listaEstructuras: Observable<EstructuraListarResponse[]>;

  displayedColumns: string[];
  dataSource: MatTableDataSource<EdneListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nomArchivo',
      header: 'Nombre archivo',
      cell: (m: EdneListarResponse) => (m.nomArchivo) ? `${m.nomArchivo}` : ''
    }, {
      columnDef: 'nomEstructura',
      header: 'Estructura',
      cell: (m: EdneListarResponse) => (m.nomEstructura) ? `${m.nomEstructura}` : ''
    }, {
      columnDef: 'fecImportacion',
      header: 'Fecha corte informacion reportada',
      cell: (m: EdneListarResponse) => (m.fecImportacion) ? `${this.datePipe.transform(m.fecImportacion, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'fecPeriodo',
      header: 'Fecha periodo',
      cell: (m: EdneListarResponse) => (m.fecPeriodo) ? `${this.datePipe.transform(m.fecPeriodo, 'MMMM yyyy')}` : ''
    }, {
      columnDef: 'nomServicio',
      header: 'Servicio',
      cell: (m: EdneListarResponse) => (m.nomServicio) ? `${m.nomServicio}` : ''
    }, {
      columnDef: 'nomEntidad',
      header: 'Entidad',
      cell: (m: EdneListarResponse) => (m.nomEntidad) ? `${m.nomEntidad}` : ''
    }, {
      columnDef: 'nomLineaInter',
      header: 'Linea intervencion',
      cell: (m: EdneListarResponse) => (m.nomLineaInter) ? `${m.nomLineaInter}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: EdneListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(EdneService) private edneService: EdneService,
    @Inject(LineaIntervencionService) private lineaIntervencionService: LineaIntervencionService,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(ReporteService) private reporteService: ReporteService,
    @Inject(EstructuraService) private estructuraService: EstructuraService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      estructura: ['', [Validators.maxLength(250)]],
      entidad: ['', [Validators.maxLength(250)]],
      lineaIntervencion: ['', [Validators.required]],
      servicio: ['', [Validators.maxLength(250)]],
      fecInicio: ['', [Validators.required]],
      fecFin: ['', [Validators.required]],
      flgActivo: ['', [Validators.required]]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    //FOR AUTOCOMPLETES
    this.formularioGrp.get('servicio').valueChanges.subscribe(
      data => {
        const filterValue = (typeof data == 'string') ? data.toUpperCase() : null;
        if (filterValue) {
          this._buscarServicio(filterValue);
        }
      }
    );

    this.formularioGrp.get('entidad').valueChanges.subscribe(
      data => {
        const filterValue = (typeof data == 'string') ? data.toUpperCase() : null;
        if (filterValue) {
          this._buscarEntidad(filterValue);
        }
      }
    );

    this.formularioGrp.get('estructura').valueChanges.subscribe(
      data => {
        const filterValue = (typeof data == 'string') ? data.toUpperCase() : null;
        if (filterValue) {
          this._buscarEstructura(filterValue);
        }
      }
    );
    //PARA AUTOCOMPLETES

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.comboLineaIntervencion();
    this.definirTabla();

    this.activoLista = JSON.parse(JSON.stringify(ACTIVO_LISTA));
    this.activoLista.unshift({ nombre: 'TODOS' });
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
    if (this.listaEdne.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaEdne);
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
    req.flgActivo = 1;

    this.lineaIntervencionService.listarLineaIntervencion(req).subscribe(
      (out: OutResponse<LineaIntervencionListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaLineaIntervencion = out.objeto;
          this.listaLineaIntervencion.unshift(JSON.parse(JSON.stringify({ nombre: 'TODOS' })));
          this.formularioGrp.get('lineaIntervencion').setValue(this.listaLineaIntervencion[0]);
        } else {
          console.log(out.rmensaje);
          this.listaLineaIntervencion = [];
        }
      },
      error => {
        console.log(error);
        this.listaLineaIntervencion = [];
      }
    );
  }

  private _buscarServicio(value: any): void {
    let req = new ServicioListarRequest();
    req.nomServicio = value;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.servicioService.listarServicio(req).subscribe(
      (data: OutResponse<ServicioListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicios = JSON.parse(JSON.stringify(data.objeto));
        } else {
          console.log(data.rmensaje);
          this.listaServicios = of([]);
        }
      }, error => {
        console.log(error);
        this.listaServicios = of([]);
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

  private _buscarEstructura(value: any): void {
    let req = new EstructuraListarRequest();
    req.nombre = value;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.estructuraService.listarEstructura(req).subscribe(
      (data: OutResponse<EstructuraListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEstructuras = JSON.parse(JSON.stringify(data.objeto));
        } else {
          console.log(data.rmensaje);
          this.listaEstructuras = of([]);
        }
      }, error => {
        console.log(error);
        this.listaEstructuras = of([]);
      }
    )
  }

  buscar(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new EdneListarRequest();
    let serv = this.formularioGrp.get('servicio').value;
    let ent = this.formularioGrp.get('entidad').value;
    let est = this.formularioGrp.get('estructura').value;
    req.nomEstructura = (typeof est == 'string' || typeof est == 'undefined') ? est.toUpperCase() : est.nombre;
    req.nomEntidad = (typeof ent == 'string' || typeof ent == 'undefined') ? ent.toUpperCase() : ent.nombre;
    req.nomServicio = (typeof serv == 'string' || typeof serv == 'undefined') ? serv.toUpperCase() : serv.nombre;
    req.idLineaInter = this.formularioGrp.get('lineaIntervencion').value.idLineaInter;
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.fecInicio = this.formularioGrp.get('fecInicio').value;
    req.fecFin = this.formularioGrp.get('fecFin').value;

    this.edneService.listarEdne(req).subscribe(
      (data: OutResponse<EdneListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEdne = data.objeto;
        } else {
          this.listaEdne = [];
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

    let req = new EdneListarRequest();
    let serv = this.formularioGrp.get('servicio').value;
    let ent = this.formularioGrp.get('entidad').value;
    let est = this.formularioGrp.get('estructura').value;
    req.nomEstructura = (typeof est == 'string' || typeof est == 'undefined') ? est.toUpperCase() : est.nombre;
    req.nomEntidad = (typeof ent == 'string' || typeof ent == 'undefined') ? ent.toUpperCase() : ent.nombre;
    req.nomServicio = (typeof serv == 'string' || typeof serv == 'undefined') ? serv.toUpperCase() : serv.nombre;
    req.idLineaInter = this.formularioGrp.get('lineaIntervencion').value.idLineaInter;
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.fecInicio = this.formularioGrp.get('fecInicio').value;
    req.fecFin = this.formularioGrp.get('fecFin').value;

    this.edneService.exportarListaEdneXlsx(req).subscribe(
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

  regEdne() {
    const dialogRef = this.dialog.open(RegImportacionEdneComponent, {
      width: '1200px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.EDNE.REGISTRAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaEdne.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editEdne(obj: EdneListarResponse) {
    let index = this.listaEdne.indexOf(obj);
    const dialogRef = this.dialog.open(ModImportacionEdneComponent, {
      width: '1100px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.EDNE.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaEdne.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimEdne(obj: EdneListarResponse): void {
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
        let index = this.listaEdne.indexOf(obj);

        let req = new EdneEliminarRequest();
        req.idEdne = obj.idEdne;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.edneService.eliminarEdne(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaEdne.splice(index, 1);
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

  displayFn2(obj: ServicioListarResponse) {
    return obj ? obj.nombre : '';
  }

  seleccionado2(evt) {
    console.log(evt);
  }

  displayFn3(obj: EstructuraListarResponse) {
    return obj ? obj.nombre : '';
  }

  seleccionado3(evt) {
    console.log(evt);
  }

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('entidad').setValue('');
    this.formularioGrp.get('lineaIntervencion').setValue(this.listaLineaIntervencion[0]);
    this.formularioGrp.get('servicio').setValue('');
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
  }
}
