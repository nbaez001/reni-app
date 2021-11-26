import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ACTIVO_LISTA, CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { SubtipoCentroEliminarRequest } from 'src/app/modules/intranet/dto/request/subtipo-centro-eliminar.request';
import { SubtipoCentroListarRequest } from 'src/app/modules/intranet/dto/request/subtipo-centro-listar.request';
import { SubtipoCentroModificarRequest } from 'src/app/modules/intranet/dto/request/subtipo-centro-modificar-request';
import { SubtipoCentroRegistrarRequest } from 'src/app/modules/intranet/dto/request/subtipo-centro-registrar.request';
import { SubtipoCentroListarResponse } from 'src/app/modules/intranet/dto/response/subtipo-centro-listar.response';
import { SubtipoCentroRegistrarResponse } from 'src/app/modules/intranet/dto/response/subtipo-centro-registrar.response';
import { TipoCentroListarResponse } from 'src/app/modules/intranet/dto/response/tipo-centro-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { TipoCentroService } from 'src/app/modules/intranet/services/tipo-centro.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-sub-tipo-centro-atencion',
  templateUrl: './sub-tipo-centro-atencion.component.html',
  styleUrls: ['./sub-tipo-centro-atencion.component.scss']
})
export class SubTipoCentroAtencionComponent implements OnInit {
  guardar: boolean = false;
  modif: boolean = false;

  index: number = null;

  listaSubtipoCentro: SubtipoCentroListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<SubtipoCentroListarResponse>;
  isLoading: boolean = false;

  eSubtipoCentro: SubtipoCentroListarResponse = null;

  formularioGrp: FormGroup;
  formErrors: any;

  activoLista: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: SubtipoCentroListarResponse) => (m.codigo != null) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: SubtipoCentroListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'abreviatura',
      header: 'Abreviatura',
      cell: (m: SubtipoCentroListarResponse) => (m.abreviatura != null) ? `${m.abreviatura}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descripción',
      cell: (m: SubtipoCentroListarResponse) => (m.descripcion != null) ? `${m.descripcion}` : ''
    }, {
      columnDef: 'orden',
      header: 'Orden',
      cell: (m: SubtipoCentroListarResponse) => (m.orden != null) ? `${m.orden}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: SubtipoCentroListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('nombre') nombre: ElementRef;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SubTipoCentroAtencionComponent>,
    private _snackBar: MatSnackBar,
    @Inject(TipoCentroService) private tipoCentroService: TipoCentroService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<TipoCentroListarResponse>,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      codigo: ['', [Validators.required, Validators.maxLength(25), CustomValidators.patronYAlfanumerico(this.dataDialog.objeto.codigo)]],
      abreviatura: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      orden: ['', [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.activoLista = JSON.parse(JSON.stringify(ACTIVO_LISTA));

    this.listarMaestra();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  listarMaestra(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new SubtipoCentroListarRequest();
    req.idTipoCentroPadre = this.dataDialog.objeto.idTipoCentro;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.tipoCentroService.listarSubtipoCentro(req).subscribe(
      (data: OutResponse<SubtipoCentroListarResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaSubtipoCentro = data.objeto;
        } else {
          this.listaSubtipoCentro = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaSubtipoCentro.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaSubtipoCentro);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.formularioGrp.get('orden').setValue(this.listaSubtipoCentro.length + 1);
  }

  regSubtipoCentro(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new SubtipoCentroRegistrarRequest();
      req.idTipoCentroPadre = this.dataDialog.objeto.idTipoCentro;
      req.codigo = this.formularioGrp.get('codigo').value;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.abreviatura = this.formularioGrp.get('abreviatura').value;
      req.descripcion = this.formularioGrp.get('descripcion').value;
      req.orden = this.formularioGrp.get('orden').value;
      req.idUsuarioCrea = this.user.getIdUsuario;

      this.tipoCentroService.registrarSubtipoCentro(req).subscribe(
        (out: OutResponse<SubtipoCentroRegistrarResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.limpiar();

            let res = new SubtipoCentroListarResponse();
            res.idSubtipoCentro = out.objeto.idSubtipoCentro;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.abreviatura = req.abreviatura;
            res.descripcion = req.descripcion;
            res.flgActivo = CONSTANTES.FLG_ACTIVO;
            res.orden = req.orden;

            this.listaSubtipoCentro.unshift(res);
            this.cargarDatosTabla();
            this.focusControlNombre()
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

  mostrarSubtipoCentro(obj: SubtipoCentroListarResponse): void {
    this.index = this.listaSubtipoCentro.indexOf(obj);

    this.formularioGrp.get('nombre').setValue(obj.nombre);
    this.formularioGrp.get('codigo').setValue(obj.codigo);
    this.formularioGrp.get('abreviatura').setValue(obj.abreviatura);
    this.formularioGrp.get('orden').setValue(obj.orden);
    this.formularioGrp.get('descripcion').setValue(obj.descripcion);

    this.eSubtipoCentro = JSON.parse(JSON.stringify(obj));
  }

  modSubtipoCentro(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new SubtipoCentroModificarRequest();
      req.idSubtipoCentro = this.eSubtipoCentro.idSubtipoCentro;
      req.codigo = this.formularioGrp.get('codigo').value;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.abreviatura = this.formularioGrp.get('abreviatura').value;
      req.orden = this.formularioGrp.get('orden').value;
      req.descripcion = this.formularioGrp.get('descripcion').value;
      req.idUsuarioModif = this.user.getIdUsuario;

      this.tipoCentroService.modificarSubtipoCentro(req).subscribe(
        (data: OutResponse<any>) => {
          if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new SubtipoCentroListarResponse();
            res.idSubtipoCentro = req.idSubtipoCentro;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.abreviatura = req.abreviatura;
            res.descripcion = req.descripcion;
            res.flgActivo = CONSTANTES.FLG_ACTIVO;
            res.orden = req.orden;
            this.listaSubtipoCentro.splice(this.index, 1, res);

            this.limpiar();
            this.cargarDatosTabla();
            this.focusControlNombre();
            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(data.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
          this.modif = false;
        },
        error => {
          console.log(error);
          this.modif = false;
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  limpiar(): void {
    this.eSubtipoCentro = null;
    this.index = null;
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
  }

  eliminarSubtipoCentro(obj: SubtipoCentroListarResponse): void {
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
        let index = this.listaSubtipoCentro.indexOf(obj);
        let req = new SubtipoCentroEliminarRequest();
        req.idSubtipoCentro = obj.idSubtipoCentro;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.tipoCentroService.eliminarSubtipoCentro(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaSubtipoCentro.splice(index, 1);
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

  focusControlNombre() {
    this.nombre.nativeElement.focus();
  }

  regModSubtipoCentro(): void {
    if (this.eSubtipoCentro) {
      this.modSubtipoCentro();
    } else {
      this.regSubtipoCentro();
    }
  }
}
