import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIVO_LISTA, CONSTANTES, MENSAJES_PANEL, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { LineaIntervencionEliminarRequest } from '../../../dto/request/linea-intervencion-eliminar.request';
import { LineaIntervencionListarRequest } from '../../../dto/request/linea-intervencion-listar.request';
import { FileResponse } from '../../../dto/response/file.response';
import { LineaIntervencionListarResponse } from '../../../dto/response/linea-intervencion-listar.response';
import { LineaIntervencionService } from '../../../services/linea-intervencion.service';
import { ReporteService } from '../../../services/reporte.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ModLineaIntervencionComponent } from './mod-linea-intervencion/mod-linea-intervencion.component';
import { RegLineaIntervencionComponent } from './reg-linea-intervencion/reg-linea-intervencion.component';

@Component({
  selector: 'app-bdj-linea-intervencion',
  templateUrl: './bdj-linea-intervencion.component.html',
  styleUrls: ['./bdj-linea-intervencion.component.scss']
})
export class BdjLineaIntervencionComponent implements OnInit {
  exportar = false;

  activoLista: any;
  listaLineaIntervencion: LineaIntervencionListarResponse[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<LineaIntervencionListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: LineaIntervencionListarResponse) => (m.codigo != null) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: LineaIntervencionListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'orden',
      header: 'Orden',
      cell: (m: LineaIntervencionListarResponse) => (m.orden != null) ? `${m.orden}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: LineaIntervencionListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(LineaIntervencionService) private lineaIntervencionService: LineaIntervencionService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.maxLength(250)]],
      flgActivo: ['', [Validators.required]]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.definirTabla();

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
    if (this.listaLineaIntervencion.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaLineaIntervencion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  buscar(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new LineaIntervencionListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;

    this.lineaIntervencionService.listarLineaIntervencion(req).subscribe(
      (data: OutResponse<LineaIntervencionListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaLineaIntervencion = data.objeto;
        } else {
          this.listaLineaIntervencion = [];
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

    let req = new LineaIntervencionListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;

    this.lineaIntervencionService.exportarListaLineaIntervencionXlsx(req).subscribe(
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

  regLineaIntervencion() {
    const dialogRef = this.dialog.open(RegLineaIntervencionComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.LINEA_INTERVENCION.REGISTRAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaLineaIntervencion.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editLineaIntervencion(obj: LineaIntervencionListarResponse) {
    let index = this.listaLineaIntervencion.indexOf(obj);
    const dialogRef = this.dialog.open(ModLineaIntervencionComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.LINEA_INTERVENCION.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaLineaIntervencion.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimLineaIntervencion(obj: LineaIntervencionListarResponse): void {
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
        let index = this.listaLineaIntervencion.indexOf(obj);

        let req = new LineaIntervencionEliminarRequest();
        req.idLineaInter = obj.idLineaInter;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.lineaIntervencionService.eliminarLineaIntervencion(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaLineaIntervencion.splice(index, 1);
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

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
  }
}
