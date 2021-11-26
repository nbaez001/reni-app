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
import { ACTIVO_LISTA, CONSTANTES, MAESTRAS, MENSAJES_PANEL, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { CentroAtencionEliminarRequest } from '../../../dto/request/centro-atencion-eliminar.request';
import { CentroAtencionListarRequest } from '../../../dto/request/centro-atencion-listar.request';
import { MaestraSubitemListarRequest } from '../../../dto/request/maestra-subitem-listar.request';
import { ServicioListarRequest } from '../../../dto/request/servicio-listar.request';
import { CentroAtencionListarResponse } from '../../../dto/response/centro-atencion-listar.response';
import { FileResponse } from '../../../dto/response/file.response';
import { MaestraSubitemListarResponse } from '../../../dto/response/maestra-subitem-listar.response';
import { ServicioListarResponse } from '../../../dto/response/servicio-listar.response';
import { CentroAtencionService } from '../../../services/centro-atencion.service';
import { MaestraService } from '../../../services/maestra.service';
import { ReporteService } from '../../../services/reporte.service';
import { ServicioService } from '../../../services/servicio.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { CargMasivaCentroComponent } from './carg-masiva-centro/carg-masiva-centro.component';
import { ModCentroAtencionComponent } from './mod-centro-atencion/mod-centro-atencion.component';
import { RegCentroAtencionComponent } from './reg-centro-atencion/reg-centro-atencion.component';
import { ServsCentroAtencionComponent } from './servs-centro-atencion/servs-centro-atencion.component';

@Component({
  selector: 'app-bdj-centro-atencion',
  templateUrl: './bdj-centro-atencion.component.html',
  styleUrls: ['./bdj-centro-atencion.component.scss']
})
export class BdjCentroAtencionComponent implements OnInit {
  exportar = false;

  CONSTANTES = CONSTANTES;
  activoLista: any;
  listaCentroAtencion: CentroAtencionListarResponse[] = null;
  listaTipoCentros: MaestraSubitemListarResponse[] = null;
  listaServicios: Observable<ServicioListarResponse[]>;

  displayedColumns: string[];
  dataSource: MatTableDataSource<CentroAtencionListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: CentroAtencionListarResponse) => (m.codigo) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: CentroAtencionListarResponse) => (m.nombre) ? `${m.nombre}` : ''
    }, {
      columnDef: 'nomTipoCentro',
      header: 'Tipo centro',
      cell: (m: CentroAtencionListarResponse) => (m.nomTipoCentro) ? `${m.nomTipoCentro}` : ''
    }, {
      columnDef: 'nomSubtipoCentro',
      header: 'Subtipo centro',
      cell: (m: CentroAtencionListarResponse) => (m.nomSubtipoCentro) ? `${m.nomSubtipoCentro}` : ''
    }, {
      columnDef: 'fechaCreacion',
      header: 'Fecha creacion',
      cell: (m: CentroAtencionListarResponse) => (m.fechaCreacion) ? `${this.datePipe.transform(m.fechaCreacion, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'ubigeo',
      header: 'Ubigeo',
      cell: (m: CentroAtencionListarResponse) => (m.ubigeo) ? `${m.ubigeo}` : ''
    }, {
      columnDef: 'nomDepartamento',
      header: 'Departamento',
      cell: (m: CentroAtencionListarResponse) => (m.nomDepartamento) ? `${m.nomDepartamento}` : ''
    }, {
      columnDef: 'nomProvincia',
      header: 'Provincia',
      cell: (m: CentroAtencionListarResponse) => (m.nomProvincia) ? `${m.nomProvincia}` : ''
    }, {
      columnDef: 'nomDistrito',
      header: 'Distrito',
      cell: (m: CentroAtencionListarResponse) => (m.nomDistrito) ? `${m.nomDistrito}` : ''
    }, {
      columnDef: 'areaResid',
      header: 'Area residencia',
      cell: (m: CentroAtencionListarResponse) => (m.areaResid) ? `${m.areaResid}` : ''
    }, {
      columnDef: 'direccion',
      header: 'Direccion',
      cell: (m: CentroAtencionListarResponse) => (m.direccion) ? `${m.direccion}` : ''
    }, {
      columnDef: 'nroTelefono',
      header: 'Telefono',
      cell: (m: CentroAtencionListarResponse) => (m.nroTelefono) ? `${m.nroTelefono}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: CentroAtencionListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(CentroAtencionService) private centroAtencionService: CentroAtencionService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.maxLength(250)]],
      servicio: ['', [Validators.maxLength(250)]],
      tipoCentro: ['', [Validators.required]],
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
    //PARA AUTOCOMPLETES

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.comboTipoCentro();
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
    if (this.listaCentroAtencion.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaCentroAtencion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  comboTipoCentro(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_CENTRO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoCentros = out.objeto;
          this.listaTipoCentros.unshift(JSON.parse(JSON.stringify({ nombre: 'TODOS' })));
          this.formularioGrp.get('tipoCentro').setValue(this.listaTipoCentros[0]);
        } else {
          console.log(out.rmensaje);
          this.listaTipoCentros = [];
        }
      },
      error => {
        console.log(error);
        this.listaTipoCentros = [];
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

  buscar(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new CentroAtencionListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;
    let serv = this.formularioGrp.get('servicio').value;
    req.nomServicio = (typeof serv == 'string' || typeof serv == 'undefined') ? serv.toUpperCase() : serv.nombre;
    req.idtTipoCentro = this.formularioGrp.get('tipoCentro').value.codigo;

    this.centroAtencionService.listarCentroAtencion(req).subscribe(
      (data: OutResponse<CentroAtencionListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaCentroAtencion = data.objeto;
        } else {
          this.listaCentroAtencion = [];
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

    let req = new CentroAtencionListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;
    let serv = this.formularioGrp.get('servicio').value;
    req.nomServicio = (typeof serv == 'string' || typeof serv == 'undefined') ? serv.toUpperCase() : serv.nombre;
    req.idtTipoCentro = this.formularioGrp.get('tipoCentro').value.codigo;

    this.centroAtencionService.exportarListaCentroAtencionXlsx(req).subscribe(
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

  regCentroAtencion() {
    const dialogRef = this.dialog.open(RegCentroAtencionComponent, {
      width: '900px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.CENTRO_ATENCION.REGISTRAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaCentroAtencion.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editCentroAtencion(obj: CentroAtencionListarResponse) {
    let index = this.listaCentroAtencion.indexOf(obj);
    const dialogRef = this.dialog.open(ModCentroAtencionComponent, {
      width: '900px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.CENTRO_ATENCION.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaCentroAtencion.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimCentroAtencion(obj: CentroAtencionListarResponse): void {
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
        let index = this.listaCentroAtencion.indexOf(obj);

        let req = new CentroAtencionEliminarRequest();
        req.idCentroAtencion = obj.idCentroAtencion;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.centroAtencionService.eliminarCentroAtencion(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaCentroAtencion.splice(index, 1);
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

  asociarServicios(obj: CentroAtencionListarResponse): void {
    const dialogRef = this.dialog.open(ServsCentroAtencionComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.CENTRO_ATENCION.SERVICIOS_CENTRO_ATEN.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaCentroAtencion.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  displayFn(obj: ServicioListarResponse) {
    return obj ? obj.nombre : '';
  }

  seleccionado(evt) {
    console.log(evt);
  }

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
    this.formularioGrp.get('servicio').setValue('');
    this.formularioGrp.get('tipoCentro').setValue(this.listaTipoCentros[0]);
  }

  importarCentroAtencion(): void {
    const dialogRef = this.dialog.open(CargMasivaCentroComponent, {
      width: '1100px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.CENTRO_ATENCION.CARGA_MASIVA.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.buscar();
      }
    });
  }
}
