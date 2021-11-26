import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIVO_LISTA, CONSTANTES, MENSAJES_PANEL, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { MaestraEliminarRequest } from '../../../dto/request/maestra-eliminar.request';
import { MaestraListarRequest } from '../../../dto/request/maestra-listar.request';
import { FileResponse } from '../../../dto/response/file.response';
import { MaestraListarResponse } from '../../../dto/response/maestra-listar.response';
import { MaestraService } from '../../../services/maestra.service';
import { ReporteService } from '../../../services/reporte.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { BdjMaestraSubitemComponent } from './bdj-maestra-subitem/bdj-maestra-subitem.component';
import { CargMasivaMaestraComponent } from './carg-masiva-maestra/carg-masiva-maestra.component';
import { ModMaestraComponent } from './mod-maestra/mod-maestra.component';
import { RegMaestraComponent } from './reg-maestra/reg-maestra.component';

@Component({
  selector: 'app-bdj-maestra',
  templateUrl: './bdj-maestra.component.html',
  styleUrls: ['./bdj-maestra.component.scss']
})
export class BdjMaestraComponent implements OnInit {
  exportar = false;

  activoLista: any;
  listaMaestra: MaestraListarResponse[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<MaestraListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: MaestraListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (m: MaestraListarResponse) => (m.descripcion != null) ? `${m.descripcion}` : ''
    }, {
      columnDef: 'idTabla',
      header: 'ID Tabla',
      cell: (m: MaestraListarResponse) => (m.idTabla != null) ? `${m.idTabla}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: MaestraListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.maxLength(250)]],
      flgActivo: ['', [Validators.required]],
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
    if (this.listaMaestra.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaMaestra);
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

    let req = new MaestraListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;
    console.log(req);

    this.maestraService.listarMaestra(req).subscribe(
      (data: OutResponse<MaestraListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaMaestra = data.objeto;
        } else {
          this.listaMaestra = [];
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

  // buscar(event?: PageEvent): PageEvent {
  //   this.dataSource = null;
  //   this.isLoading = true;

  //   let req = new MaestraListarRequest();
  //   req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
  //   req.index = event ? event.pageIndex : 0;
  //   req.size = event ? event.pageSize : this.pageSize;
  //   console.log(req);

  //   this.maestraService.listarMaestra(req).subscribe(
  //     (data: OutResponse<MaestraListarResponse[]>) => {
  //       console.log(data);
  //       if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
  //         this.listaMaestra = data.objeto;
  //         this.length = data.length;
  //       } else {
  //         this.listaMaestra = [];
  //       }
  //       this.cargarDatosTabla();
  //       this.isLoading = false;
  //     },
  //     error => {
  //       console.log(error);
  //       this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
  //       this.isLoading = false;
  //     }
  //   );
  //   return event;
  // }

  exportarExcel() {
    this.exportar = true;

    let req = new MaestraListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.nombre = this.formularioGrp.get('nombre').value;

    this.maestraService.exportarListaMaestraXlsx(req).subscribe(
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

  regMaestra() {
    const dialogRef = this.dialog.open(RegMaestraComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.MAESTRA.REGISTRAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaMaestra.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editMaestra(obj: MaestraListarResponse) {
    let index = this.listaMaestra.indexOf(obj);
    const dialogRef = this.dialog.open(ModMaestraComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.MAESTRA.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaMaestra.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  regMaestraChild(obj: MaestraListarResponse) {
    const dialogRef = this.dialog.open(BdjMaestraSubitemComponent, {
      width: '900px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.MAESTRA.BDJ_SUBITEM.TITLE(obj.nombre),
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  elimMaestra(obj: MaestraListarResponse): void {
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
        let index = this.listaMaestra.indexOf(obj);

        let req = new MaestraEliminarRequest();
        req.idMaestra = obj.idMaestra;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.maestraService.eliminarMaestra(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaMaestra.splice(index, 1);
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

  // public getServerData(event?: PageEvent): PageEvent {
  //   console.log(event);
  //   this.buscar();
  //   return event;
  // }

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
  }

  importarMaestras(): void {
    const dialogRef = this.dialog.open(CargMasivaMaestraComponent, {
      width: '1100px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.MAESTRA.CARGA_MASIVA.TITLE,
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
