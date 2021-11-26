import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIVO_LISTA, CONSTANTES, MENSAJES, MENSAJES_PANEL } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { TipoCentroEliminarRequest } from '../../../dto/request/tipo-centro-eliminar.request';
import { TipoCentroListarRequest } from '../../../dto/request/tipo-centro-listar.request';
import { FileResponse } from '../../../dto/response/file.response';
import { TipoCentroListarResponse } from '../../../dto/response/tipo-centro-listar.response';
import { ReporteService } from '../../../services/reporte.service';
import { TipoCentroService } from '../../../services/tipo-centro.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ModTipoCentroAtencionComponent } from './mod-tipo-centro-atencion/mod-tipo-centro-atencion.component';
import { RegTipoCentroAtencionComponent } from './reg-tipo-centro-atencion/reg-tipo-centro-atencion.component';
import { SubTipoCentroAtencionComponent } from './sub-tipo-centro-atencion/sub-tipo-centro-atencion.component';

@Component({
  selector: 'app-bdj-tipo-centro-atencion',
  templateUrl: './bdj-tipo-centro-atencion.component.html',
  styleUrls: ['./bdj-tipo-centro-atencion.component.scss']
})
export class BdjTipoCentroAtencionComponent implements OnInit {
  exportar = false;
  CONSTANTES = CONSTANTES;

  activoLista: any;
  listaTipoCentro: TipoCentroListarResponse[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<TipoCentroListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: TipoCentroListarResponse) => (m.codigo != null) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: TipoCentroListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'abreviatura',
      header: 'Abreviatura',
      cell: (m: TipoCentroListarResponse) => (m.abreviatura != null) ? `${m.abreviatura}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descripción',
      cell: (m: TipoCentroListarResponse) => (m.descripcion != null) ? `${m.descripcion}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: TipoCentroListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(TipoCentroService) private tipoCentroService: TipoCentroService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,) { }

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
    if (this.listaTipoCentro.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaTipoCentro);
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

    let req = new TipoCentroListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;

    this.tipoCentroService.listarTipoCentro(req).subscribe(
      (data: OutResponse<TipoCentroListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoCentro = data.objeto;
        } else {
          this.listaTipoCentro = [];
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

    let req = new TipoCentroListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;

    this.tipoCentroService.exportarListaTipoCentroXlsx(req).subscribe(
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

  regTipoCentro() {
    const dialogRef = this.dialog.open(RegTipoCentroAtencionComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.TIPO_CENTRO.REGISTRAR.TITLE,
        objeto: this.listaTipoCentro.length + 1
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaTipoCentro.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editTipoCentro(obj: TipoCentroListarResponse) {
    let index = this.listaTipoCentro.indexOf(obj);
    const dialogRef = this.dialog.open(ModTipoCentroAtencionComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.TIPO_CENTRO.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaTipoCentro.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimTipoCentro(obj: TipoCentroListarResponse): void {
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
        let index = this.listaTipoCentro.indexOf(obj);

        let req = new TipoCentroEliminarRequest();
        req.idTipoCentro = obj.idTipoCentro;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.tipoCentroService.eliminarTipoCentro(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaTipoCentro.splice(index, 1);
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

  agregarSubtipoCentro(obj: TipoCentroListarResponse) {
    let index = this.listaTipoCentro.indexOf(obj);
    const dialogRef = this.dialog.open(SubTipoCentroAtencionComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.TIPO_CENTRO.SUB_TIPO_CENTRO.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
  }

}
