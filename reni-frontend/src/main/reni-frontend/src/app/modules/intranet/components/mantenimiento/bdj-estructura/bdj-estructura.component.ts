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
import { EntidadListarRequest } from '../../../dto/request/entidad-listar.request';
import { EstructuraEliminarRequest } from '../../../dto/request/estructura-eliminar.request';
import { EstructuraListarRequest } from '../../../dto/request/estructura-listar.request';
import { LineaIntervencionListarRequest } from '../../../dto/request/linea-intervencion-listar.request';
import { ServicioListarRequest } from '../../../dto/request/servicio-listar.request';
import { EntidadListarResponse } from '../../../dto/response/entidad-listar.response';
import { EstructuraListarResponse } from '../../../dto/response/estructura-listar.response';
import { FileResponse } from '../../../dto/response/file.response';
import { LineaIntervencionListarResponse } from '../../../dto/response/linea-intervencion-listar.response';
import { ServicioListarResponse } from '../../../dto/response/servicio-listar.response';
import { EntidadService } from '../../../services/entidad.service';
import { EstructuraService } from '../../../services/estructura.service';
import { LineaIntervencionService } from '../../../services/linea-intervencion.service';
import { ReporteService } from '../../../services/reporte.service';
import { ServicioService } from '../../../services/servicio.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ModEstructuraComponent } from './mod-estructura/mod-estructura.component';
import { RegEstructuraComponent } from './reg-estructura/reg-estructura.component';

@Component({
  selector: 'app-bdj-estructura',
  templateUrl: './bdj-estructura.component.html',
  styleUrls: ['./bdj-estructura.component.scss']
})
export class BdjEstructuraComponent implements OnInit {
  exportar = false;

  CONSTANTES = CONSTANTES;
  activoLista: any;
  listaEstructura: EstructuraListarResponse[] = null;
  listaLineaIntervencion: LineaIntervencionListarResponse[] = null;
  listaServicios: Observable<ServicioListarResponse[]>;
  listaEntidades: Observable<EntidadListarResponse[]>;

  displayedColumns: string[];
  dataSource: MatTableDataSource<EstructuraListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: EstructuraListarResponse) => (m.nombre) ? `${m.nombre}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descripción',
      cell: (m: EstructuraListarResponse) => (m.descripcion) ? `${m.descripcion}` : ''
    }, {
      columnDef: 'nomEntidad',
      header: 'Entidad',
      cell: (m: EstructuraListarResponse) => (m.nomEntidad) ? `${m.nomEntidad}` : ''
    }, {
      columnDef: 'nomLineaIntervencion',
      header: 'Linea intervencion',
      cell: (m: EstructuraListarResponse) => (m.nomLineaIntervencion) ? `${m.nomLineaIntervencion}` : ''
    }, {
      columnDef: 'nomServicio',
      header: 'Servicio',
      cell: (m: EstructuraListarResponse) => (m.nomServicio) ? `${m.nomServicio}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: EstructuraListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(EstructuraService) private estructuraService: EstructuraService,
    @Inject(LineaIntervencionService) private lineaIntervencionService: LineaIntervencionService,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.maxLength(250)]],
      entidad: ['', [Validators.maxLength(250)]],
      lineaIntervencion: ['', [Validators.maxLength(250)]],
      servicio: ['', [Validators.maxLength(250)]],
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
    if (this.listaEstructura.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaEstructura);
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

  buscar(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new EstructuraListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;
    let serv = this.formularioGrp.get('servicio').value;
    let ent = this.formularioGrp.get('entidad').value;
    req.nomServicio = (typeof serv == 'string' || typeof serv == 'undefined') ? serv.toUpperCase() : serv.nombre;
    req.nomEntidad = (typeof ent == 'string' || typeof ent == 'undefined') ? ent.toUpperCase() : ent.nombre;
    req.idLineaInter = this.formularioGrp.get('lineaIntervencion').value.idLineaInter;

    this.estructuraService.listarEstructura(req).subscribe(
      (data: OutResponse<EstructuraListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEstructura = data.objeto;
        } else {
          this.listaEstructura = [];
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

    let req = new EstructuraListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;
    let serv = this.formularioGrp.get('servicio').value;
    let ent = this.formularioGrp.get('entidad').value;
    req.nomServicio = (typeof serv == 'string' || typeof serv == 'undefined') ? serv.toUpperCase() : serv.nombre;
    req.nomEntidad = (typeof ent == 'string' || typeof ent == 'undefined') ? ent.toUpperCase() : ent.nombre;
    req.idLineaInter = this.formularioGrp.get('lineaIntervencion').value.idLineaInter;


    this.estructuraService.exportarListaEstructuraXlsx(req).subscribe(
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

  regEstructura() {
    const dialogRef = this.dialog.open(RegEstructuraComponent, {
      width: '1100px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.REGISTRAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('ESTRUCTURA');
        console.log(result);
        this.listaEstructura.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editEstructura(obj: EstructuraListarResponse) {
    let index = this.listaEstructura.indexOf(obj);
    const dialogRef = this.dialog.open(ModEstructuraComponent, {
      width: '1100px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaEstructura.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimEstructura(obj: EstructuraListarResponse): void {
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
        let index = this.listaEstructura.indexOf(obj);

        let req = new EstructuraEliminarRequest();
        req.idEstructura = obj.idEstructura;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.estructuraService.eliminarEstructura(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaEstructura.splice(index, 1);
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

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('entidad').setValue('');
    this.formularioGrp.get('lineaIntervencion').setValue(this.listaLineaIntervencion[0]);
    this.formularioGrp.get('servicio').setValue('');
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
  }
}
