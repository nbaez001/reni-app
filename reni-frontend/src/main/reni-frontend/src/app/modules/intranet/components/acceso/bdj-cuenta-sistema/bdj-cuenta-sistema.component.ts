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
import { environment } from 'src/environments/environment';
import { CuentaSistemaEliminarRequest } from '../../../dto/request/cuenta-sistema-eliminar.request';
import { CuentaSistemaListarRequest } from '../../../dto/request/cuenta-sistema-listar.request';
import { CuentaSistemaListarResponse } from '../../../dto/response/cuenta-sistema-listar.response';
import { FileResponse } from '../../../dto/response/file.response';
import { CuentaSistemaService } from '../../../services/cuenta-sistema.service';
import { ReporteService } from '../../../services/reporte.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ModCuentaSistemaComponent } from './mod-cuenta-sistema/mod-cuenta-sistema.component';
import { RegCuentaSistemaComponent } from './reg-cuenta-sistema/reg-cuenta-sistema.component';

@Component({
  selector: 'app-bdj-cuenta-sistema',
  templateUrl: './bdj-cuenta-sistema.component.html',
  styleUrls: ['./bdj-cuenta-sistema.component.scss']
})
export class BdjCuentaSistemaComponent implements OnInit {
  exportar = false;

  activoLista: any;
  listaCuentaSistema: CuentaSistemaListarResponse[] = [];

  displayedColumns: string[];
  dataSource: MatTableDataSource<CuentaSistemaListarResponse> = null;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'usuario',
      header: 'Usuario',
      cell: (m: CuentaSistemaListarResponse) => (m.usuario) ? `${m.usuario}` : ''
    }, {
      columnDef: 'nomPerfil',
      header: 'Perfil',
      cell: (m: CuentaSistemaListarResponse) => (m.nomPerfil) ? `${m.nomPerfil}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre y apellidos',
      cell: (m: CuentaSistemaListarResponse) => (m.nombre) ? `${m.nombre} ${m.apePaterno} ${m.apeMaterno}` : ''
    }, {
      columnDef: 'nroDocumento',
      header: 'Nro documento',
      cell: (m: CuentaSistemaListarResponse) => (m.nroDocumento) ? `${m.nroDocumento}` : ''
    }, {
      columnDef: 'nomArea',
      header: 'Area',
      cell: (m: CuentaSistemaListarResponse) => (m.nomArea) ? `${m.nomArea}` : ''
    }, {
      columnDef: 'nomCargo',
      header: 'Cargo',
      cell: (m: CuentaSistemaListarResponse) => (m.nomCargo) ? `${m.nomCargo}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: CuentaSistemaListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(CuentaSistemaService) private cuentaSistemaService: CuentaSistemaService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nroDocumento: ['', [Validators.maxLength(20)]],
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
    if (this.listaCuentaSistema.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaCuentaSistema);
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

    let req = new CuentaSistemaListarRequest();
    req.nroDocumento = this.formularioGrp.get('nroDocumento').value;
    req.nombre = this.formularioGrp.get('nombre').value;
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.idModulo = environment.IdModuloReni;


    this.cuentaSistemaService.listarCuentaSistema(req).subscribe(
      (data: OutResponse<CuentaSistemaListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaCuentaSistema = data.objeto;
        } else {
          this.listaCuentaSistema = [];
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

    let req = new CuentaSistemaListarRequest();
    req.nroDocumento = this.formularioGrp.get('nroDocumento').value;
    req.nombre = this.formularioGrp.get('nombre').value;
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.idModulo = environment.IdModuloReni;


    this.cuentaSistemaService.exportarListaCuentaSistemaXlsx(req).subscribe(
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

  regCuentaSistema() {
    const dialogRef = this.dialog.open(RegCuentaSistemaComponent, {
      width: '800px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.ACCESOS.CUENTA_SISTEMA.REGISTRAR.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaCuentaSistema.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }

  editCuentaSistema(obj: CuentaSistemaListarResponse) {
    let index = this.listaCuentaSistema.indexOf(obj);
    const dialogRef = this.dialog.open(ModCuentaSistemaComponent, {
      width: '800px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.ACCESOS.CUENTA_SISTEMA.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaCuentaSistema.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  elimCuentaSistema(obj: CuentaSistemaListarResponse): void {
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
        let index = this.listaCuentaSistema.indexOf(obj);

        let req = new CuentaSistemaEliminarRequest();
        req.idUsuario = obj.idUsuario;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.cuentaSistemaService.eliminarCuentaSistema(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaCuentaSistema.splice(index, 1);
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
