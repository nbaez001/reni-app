import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIVO_LISTA, CONSTANTES, MENSAJES_PANEL, MENSAJES, TIENE_DOC_IDE, MAESTRAS } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { MaestraSubitemListarRequest } from '../../../dto/request/maestra-subitem-listar.request';
import { UsuarioEliminarRequest } from '../../../dto/request/usuario-eliminar.request';
import { UsuarioListarRequest } from '../../../dto/request/usuario-listar.request';
import { FileResponse } from '../../../dto/response/file.response';
import { MaestraSubitemListarResponse } from '../../../dto/response/maestra-subitem-listar.response';
import { UsuarioListarResponse } from '../../../dto/response/usuario-listar.response';
import { MaestraService } from '../../../services/maestra.service';
import { ReporteService } from '../../../services/reporte.service';
import { UsuarioReniService } from '../../../services/usuario-reni.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { AsocUsuarioComponent } from './asoc-usuario/asoc-usuario.component';
import { ModUsuarioComponent } from './mod-usuario/mod-usuario.component';

@Component({
  selector: 'app-bdj-usuario',
  templateUrl: './bdj-usuario.component.html',
  styleUrls: ['./bdj-usuario.component.scss']
})
export class BdjUsuarioComponent implements OnInit {
  exportar = false;

  TIENE_DOC_IDE = TIENE_DOC_IDE;
  activoLista: any;
  listaTieneDocumento: MaestraSubitemListarResponse[] = [];

  listaUsuario: UsuarioListarResponse[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<UsuarioListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codUsuario',
      header: 'Código usuario',
      cell: (m: UsuarioListarResponse) => (m.codUsuario) ? `${m.codUsuario}` : ''
    }, {
      columnDef: 'codDisociacion',
      header: 'Código disociación',
      cell: (m: UsuarioListarResponse) => (m.codDisociacion) ? `${m.codDisociacion}` : ''
    }, {
      columnDef: 'tieneDocIdent',
      header: 'Tiene documento',
      cell: (m: UsuarioListarResponse) => (m.tieneDocIdent) ? `${m.tieneDocIdent}` : ''
    }, {
      columnDef: 'tipDocumento',
      header: 'Tipo documento',
      cell: (m: UsuarioListarResponse) => (m.tipDocumento) ? `${m.tipDocumento}` : ''
    }, {
      columnDef: 'nroDocumento',
      header: 'Nro documento',
      cell: (m: UsuarioListarResponse) => (m.nroDocumento) ? `${m.nroDocumento}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: UsuarioListarResponse) => (m.nombre) ? `${m.nombre}` : ''
    }, {
      columnDef: 'apePaterno',
      header: 'Apellido paterno',
      cell: (m: UsuarioListarResponse) => (m.apePaterno) ? `${m.apePaterno}` : ''
    }, {
      columnDef: 'apeMaterno',
      header: 'Apellido materno',
      cell: (m: UsuarioListarResponse) => (m.apeMaterno) ? `${m.apeMaterno}` : ''
    }, {
      columnDef: 'sexo',
      header: 'Sexo',
      cell: (m: UsuarioListarResponse) => (m.sexo) ? `${m.sexo}` : ''
    }, {
      columnDef: 'fecNacimiento',
      header: 'Fecha nacimiento',
      cell: (m: UsuarioListarResponse) => (m.fecNacimiento) ? `${this.datePipe.transform(m.fecNacimiento, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: UsuarioListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(UsuarioReniService) private usuarioReniService: UsuarioReniService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(ReporteService) private reporteService: ReporteService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tieneDocumento: ['', [Validators.required]],
      fecInicio: ['', []],
      fecFin: ['', []],
      flgActivo: ['', [Validators.required]]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.comboTieneDocumento();
    this.definirTabla();

    this.activoLista = JSON.parse(JSON.stringify(ACTIVO_LISTA));
    this.activoLista.unshift({ id: null, nombre: 'TODOS' });
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
    this.buscar();
  }

  comboTieneDocumento(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIENE_DOC_IDE;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTieneDocumento = out.objeto;
          this.listaTieneDocumento.unshift(JSON.parse(JSON.stringify({ nombre: 'TODOS' })));
          this.formularioGrp.get('tieneDocumento').setValue(this.listaTieneDocumento[0]);
        } else {
          console.log(out.rmensaje);
          this.listaTieneDocumento = [];
        }
      },
      error => {
        console.log(error);
        this.listaTieneDocumento = [];
      }
    );
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
    if (this.listaUsuario.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaUsuario);
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

    let req = new UsuarioListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.fecInicio = this.formularioGrp.get('fecInicio').value;
    req.fecFin = this.formularioGrp.get('fecFin').value;
    req.idtTieneDoc = this.formularioGrp.get('tieneDocumento').value.codigo;

    this.usuarioReniService.listarUsuario(req).subscribe(
      (data: OutResponse<UsuarioListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaUsuario = data.objeto;
        } else {
          this.listaUsuario = [];
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

    let req = new UsuarioListarRequest();
    req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
    req.fecInicio = this.formularioGrp.get('fecInicio').value;
    req.fecFin = this.formularioGrp.get('fecFin').value;
    req.idtTieneDoc = this.formularioGrp.get('tieneDocumento').value.codigo;

    this.usuarioReniService.exportarListaUsuarioXlsx(req).subscribe(
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

  editUsuario(obj: UsuarioListarResponse) {
    let index = this.listaUsuario.indexOf(obj);
    const dialogRef = this.dialog.open(ModUsuarioComponent, {
      width: '800px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.PROCESO.USAURIO.MODIFICAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaUsuario.splice(index, 1, result);
        this.cargarDatosTabla();
      }
    });
  }

  asocUsuario(obj: UsuarioListarResponse) {
    let index = this.listaUsuario.indexOf(obj);
    const dialogRef = this.dialog.open(AsocUsuarioComponent, {
      width: '800px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.PROCESO.USAURIO.ASOCIAR.TITLE,
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaUsuario.splice(index, 1);
        this.cargarDatosTabla();
      }
    });
  }

  elimUsuario(obj: UsuarioListarResponse): void {
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
        let index = this.listaUsuario.indexOf(obj);

        let req = new UsuarioEliminarRequest();
        req.idUsuario = obj.idUsuario;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.usuarioReniService.eliminarUsuario(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaUsuario.splice(index, 1);
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
    this.formularioGrp.get('tieneDocumento').setValue(this.listaTieneDocumento[0]);
    this.formularioGrp.get('flgActivo').setValue(this.activoLista[1]);
  }
}
