import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES, MENSAJES, MENSAJES_PANEL, TABLAS_BD, TIPOS_DATO_BD } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { BDCampoTablaListarRequest } from 'src/app/modules/intranet/dto/request/bd-campo-tabla-listar.request';
import { BDCampoTablaRegistrarRequest } from 'src/app/modules/intranet/dto/request/bd-campo-tabla-registrar.request';
import { EstructuraRegistrarParametroRequest } from 'src/app/modules/intranet/dto/request/estructura-registrar-parametro.request';
import { BDCampoTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-campo-tabla-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { AdministracionBdService } from 'src/app/modules/intranet/services/administracion-bd.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { RegCampoTablaBdComponent } from '../reg-campo-tabla-bd/reg-campo-tabla-bd.component';

@Component({
  selector: 'app-reg-campo-tabla-bd-rapido',
  templateUrl: './reg-campo-tabla-bd-rapido.component.html',
  styleUrls: ['./reg-campo-tabla-bd-rapido.component.scss']
})
export class RegCampoTablaBdRapidoComponent implements OnInit {
  TIPOS_DATO_BD = TIPOS_DATO_BD;
  listaColumnas: BDCampoTablaListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<BDCampoTablaListarResponse> = null;
  isLoading: boolean = false;

  guardar: boolean = false;
  longitud: boolean = false;
  escala: boolean = false;

  listaTipoDato = TIPOS_DATO_BD;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nomColumna',
      header: 'Nombre columna',
      cell: (m: BDCampoTablaListarResponse) => m.nomColumna ? `${m.nomColumna}` : ''
    }, {
      columnDef: 'tipoDato',
      header: 'Tipo de dato',
      cell: (m: BDCampoTablaListarResponse) => m.tipoDato ? `${m.tipoDato}` : ''
    }, {
      columnDef: 'longitudDato',
      header: 'Longitud',
      cell: (m: BDCampoTablaListarResponse) => (TIPOS_DATO_BD.filter(el => (el.tipo == m.tipoDato))[0].longitud == 1) ? `${m.longitudDato}` : `${m.precisionDato}`
    }, {
      columnDef: 'escalaDato',
      header: 'Escala',
      cell: (m: BDCampoTablaListarResponse) => (TIPOS_DATO_BD.filter(el => (el.tipo == m.tipoDato))[0].escala == 1) ? `${m.escalaDato}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegCampoTablaBdRapidoComponent>,
    private _snackBar: MatSnackBar,
    @Inject(AdministracionBdService) private administracionBdService: AdministracionBdService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<EstructuraRegistrarParametroRequest>
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(70), CustomValidators.onlyAlfanumericoYSubguion]],
      tipoCampo: ['', [Validators.required]],
      longitud: ['', []],
      escala: ['', []],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.formularioGrp.get('nombre').setValue(this.dataDialog.objeto.nomCampoBd);
    this.definirTabla();
    this.listarCamposBD();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  regCampoBD(): void {
    if (this.formularioGrp.valid) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '300px',
        data: {
          titulo: MENSAJES.MSG_CONFIRMACION_AGREGAR_CAMPO_BD,
          detalle: MENSAJES.MSG_CONFIRMACION_AGREGAR_CAMPO_BD_DETALLE,
          objeto: null
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == CONSTANTES.COD_CONFIRMADO) {
          if (TABLAS_BD.CENTRO_ATENCION.NOMBRE != this.dataDialog.objeto.nomTablaBd) {
            this.guardar = true;

            let req = new BDCampoTablaRegistrarRequest();
            req.nomTabla = this.dataDialog.objeto.nomTablaBd;
            req.nomColumna = this.formularioGrp.get('nombre').value;
            req.tipoDato = this.formularioGrp.get('tipoCampo').value.tipo;
            req.longitud = this.formularioGrp.get('longitud').value;
            req.escala = this.formularioGrp.get('escala').value;

            this.administracionBdService.registrarCampoBD(req).subscribe(
              (out: OutResponse<any>) => {
                if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
                  let res = new BDCampoTablaListarResponse();
                  res.nomColumna = req.nomColumna;
                  res.tipoDato = req.tipoDato;
                  res.longitudDato = req.longitud;
                  res.precisionDato = req.longitud;
                  res.escalaDato = req.escala;

                  this.listaColumnas.unshift(res);
                  this.cargarDatosTabla();
                  this.formService.setAsUntoched(this.formularioGrp, this.formErrors, ['nombre'])
                  this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
                } else {
                  this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
                }
                this.guardar = false;
              },
              error => {
                console.log(error);
                this.guardar = false;
                this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
              }
            );
          } else {
            this._snackBar.open('No puede agregar campos a la tabla ' + TABLAS_BD.CENTRO_ATENCION.NOMBRE + ', debido a que esta tabla no es dinamica', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
        }
      });
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  actualizarLongitud(): void {
    let tipoDato = this.formularioGrp.get('tipoCampo').value;
    if (tipoDato) {
      if (tipoDato.longitud == 1 || tipoDato.presicion == 1) {
        this.longitud = true;
        this.formularioGrp.get('longitud').setValidators(Validators.compose([Validators.required, Validators.min(1)]));
        this.formularioGrp.get('longitud').updateValueAndValidity();
      } else {
        this.longitud = false;
        this.formularioGrp.get('longitud').setValidators(Validators.compose([]));
        this.formularioGrp.get('longitud').updateValueAndValidity();
      }

      if (tipoDato.escala == 1) {
        this.escala = true;
        this.formularioGrp.get('escala').setValidators(Validators.compose([Validators.required, Validators.min(0)]));
        this.formularioGrp.get('escala').updateValueAndValidity();
      } else {
        this.escala = false;
        this.formularioGrp.get('escala').setValidators(Validators.compose([]));
        this.formularioGrp.get('escala').updateValueAndValidity();
      }
      this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    } else {
      this.longitud = false;
      this.escala = false;

      this.formularioGrp.get('longitud').setValidators(Validators.compose([]));
      this.formularioGrp.get('longitud').updateValueAndValidity();
      this.formularioGrp.get('escala').setValidators(Validators.compose([]));
      this.formularioGrp.get('escala').updateValueAndValidity();
      this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    }
  }

  listarCamposBD(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new BDCampoTablaListarRequest();
    req.nomTabla = this.dataDialog.objeto.nomTablaBd;

    this.administracionBdService.listarCamposBD(req).subscribe(
      (out: OutResponse<BDCampoTablaListarResponse[]>) => {
        console.log(out);
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaColumnas = out.objeto;
        } else {
          this.listaColumnas = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaColumnas.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaColumnas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: BDCampoTablaListarResponse): void {
    this.dialogRef.close(el);
  }
}
