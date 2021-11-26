import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Moment } from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTES, MAESTRAS, MENSAJES, TABLAS_BD } from 'src/app/common';
import { DateService } from 'src/app/core/services/date.service';
import { FormService } from 'src/app/core/services/form.service';
import { EdneListarParamEstructuraRequest } from 'src/app/modules/intranet/dto/request/edne-listar-param-estructura.request';
import { EdneModificarListarUsuarioDetRequest } from 'src/app/modules/intranet/dto/request/edne-modificar-listar-usuario-det.request';
import { EdneModificarListarUsuarioRequest } from 'src/app/modules/intranet/dto/request/edne-modificar-listar-usuario.request';
import { EdneModificarRequest } from 'src/app/modules/intranet/dto/request/edne-modificar.request';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { EdneListarParamEstructuraResponse } from 'src/app/modules/intranet/dto/response/edne-listar-param-estructura.response';
import { EdneListarResponse } from 'src/app/modules/intranet/dto/response/edne-listar.response';
import { EntidadListarResponse } from 'src/app/modules/intranet/dto/response/entidad-listar.response';
import { EstructuraListarResponse } from 'src/app/modules/intranet/dto/response/estructura-listar.response';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { EdneService } from 'src/app/modules/intranet/services/edne.service';
import { EstructuraService } from 'src/app/modules/intranet/services/estructura.service';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-mod-importacion-edne',
  templateUrl: './mod-importacion-edne.component.html',
  styleUrls: ['./mod-importacion-edne.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ModImportacionEdneComponent implements OnInit {
  // length: number = 0;
  // pageIndex: number = 0;
  // pageSize: number = 5;
  // pageEvent: PageEvent;

  modif: boolean = false;

  query: string;

  eEstructura: EstructuraListarResponse;

  listaEstadosEdne: MaestraSubitemListarResponse[] = null;
  listaParametroEstructura: EdneListarParamEstructuraResponse[] = [];

  formularioGrp: FormGroup;
  formErrors: any;

  listaUsuarios: any[] = [];
  listaUsuariosMostrar: any[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = null;
  isLoading: boolean = false;
  columnsGrilla = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<ModImportacionEdneComponent>,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    @Inject(EstructuraService) private estructuraService: EstructuraService,
    @Inject(EdneService) private edneService: EdneService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(DateService) private dateService: DateService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<EdneListarResponse>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      estructura: ['', [Validators.required]],
      nomArchivo: ['', [Validators.required]],
      fecImportacion: ['', [Validators.required]],
      fecPeriodo: ['', [Validators.required]],
      estadoEdne: ['', [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.comboEstadoEdne();
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('estructura').setValue(this.dataDialog.objeto.nomEstructura);
      this.formularioGrp.get('nomArchivo').setValue(this.dataDialog.objeto.nomArchivo);
      this.formularioGrp.get('fecImportacion').setValue(this.dateService.parseGuionDDMMYYYY(this.dataDialog.objeto.fecImportacion));
      this.formularioGrp.get('fecPeriodo').setValue(moment(this.dateService.parseGuionDDMMYYYY(this.dataDialog.objeto.fecPeriodo)));
      this.buscarParamEstructura(this.dataDialog.objeto.idEstructura);
      this.isLoading = true;
    }
  }

  comboEstadoEdne(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.ESTADO_EDNE;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEstadosEdne = out.objeto;
          if (this.dataDialog.objeto && this.dataDialog.objeto.idtEstado) {
            this.formularioGrp.get('estadoEdne').setValue(this.listaEstadosEdne.filter(el => (el.codigo == this.dataDialog.objeto.idtEstado))[0]);
          }
        } else {
          console.log(out.rmensaje);
          this.listaEstadosEdne = [];
        }
      },
      error => {
        console.log(error);
        this.listaEstadosEdne = [];
      }
    );
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  public cargarDatosTabla(): void {
    if (this.listaUsuarios.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaUsuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  buscarParamEstructura(idEstructura: number): void {
    let req = new EdneListarParamEstructuraRequest();
    req.idEstructura = idEstructura;

    this.edneService.listarParamEstructura(req).subscribe(
      (out: OutResponse<EdneListarParamEstructuraResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaParametroEstructura = out.objeto;
          this.buildColumnsGrilla();
          this.buildQuery();
        } else {
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          this.listaParametroEstructura = [];
        }
      },
      error => {
        console.log(error);
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.listaParametroEstructura = [];
      }
    );
  }

  buildColumnsGrilla(): void {
    this.columnsGrilla = [];

    this.listaParametroEstructura.forEach(el => {
      let obj = {
        columnOrder: el.ordenCampoExcel,
        columnDef: el.nomCampoExcel,
        header: el.nomCampoExcel,
        cell: (m: any) => (m[el.nomCampoExcel]) ? `${m[el.nomCampoExcel]}` : '',
        cellShort: (m: any) => (m[el.nomCampoExcel]) ? this.evaluarYRecortar(m[el.nomCampoExcel]) : ''
      };
      this.columnsGrilla.push(obj);
    });

    this.definirTabla();
  }

  // buscar(event?: PageEvent): PageEvent {
  //   this.dataSource = null;
  //   this.isLoading = true;

  //   this.listaUsuariosMostrar = this.listaUsuarios.slice(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  //   this.cargarDatosTabla();
  //   this.isLoading = false;

  //   return event;
  // }

  evaluarYRecortar(variable: any): any {
    if (typeof variable == 'string') {
      if (variable.length > 20) {
        return variable.substr(0, 20) + '...';
      } else {
        return variable;
      }
    } else {
      if (variable instanceof Date) {
        return this.datePipe.transform(variable, 'dd/MM/yyyy');
      } else {
        return variable;
      }
    }
  }

  buildQuery(): void {
    this.query = "SELECT " +
      this.buildQueryFields(TABLAS_BD.CENTRO_ATENCION.NOMBRE, TABLAS_BD.CENTRO_ATENCION.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_DETALLE.NOMBRE, TABLAS_BD.USUARIO_DETALLE.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO.NOMBRE, TABLAS_BD.USUARIO.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_INGRESO.NOMBRE, TABLAS_BD.USUARIO_INGRESO.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.AGENTE_EXTERNO.NOMBRE, TABLAS_BD.AGENTE_EXTERNO.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_ACTIVIDAD.NOMBRE, TABLAS_BD.USUARIO_ACTIVIDAD.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_SITUACION.NOMBRE, TABLAS_BD.USUARIO_SITUACION.PREFIJO);

    this.query = this.query.substr(0, this.query.length - 1);

    this.query += " FROM USUARIO_DETALLE UD" +
      (this.verifyFields(TABLAS_BD.CENTRO_ATENCION.NOMBRE) ? " LEFT JOIN CENTRO_ATENCION CA ON CA.NID_CENTRO_ATEN=UD.NID_CENTRO_ATEN" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO.NOMBRE) ? " LEFT JOIN USUARIO U ON U.NID_USUARIO=UD.NID_USUARIO" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO_INGRESO.NOMBRE) ? " LEFT JOIN USUARIO_INGRESO UI ON UI.NID_USUARIO_DETALLE=UD.NID_USUARIO_DETALLE" : "") +
      (this.verifyFields(TABLAS_BD.AGENTE_EXTERNO.NOMBRE) ? " LEFT JOIN AGENTE_EXTERNO AE ON AE.NID_USUARIO_INGRESO=UI.NID_USUARIO_INGRESO" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO_ACTIVIDAD.NOMBRE) ? " LEFT JOIN USUARIO_ACTIVIDAD UA ON UA.NID_USUARIO_DETALLE=UD.NID_USUARIO_DETALLE" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO_SITUACION.NOMBRE) ? " LEFT JOIN USUARIO_SITUACION US ON US.NID_USUARIO_DETALLE=UD.NID_USUARIO_DETALLE" : "");

    let listaMapeo: EdneModificarListarUsuarioDetRequest[] = [];
    this.listaParametroEstructura.forEach(par => {
      let obj = new EdneModificarListarUsuarioDetRequest();
      obj.nomCampoExcel = par.nomCampoExcel;
      obj.tipoDato = par.tipoDato;
      obj.longitudDato = par.longitudDato;
      obj.precisionDato = par.precisionDato;
      obj.escalaDato = par.escalaDato;

      listaMapeo.push(obj);
    });

    let req = new EdneModificarListarUsuarioRequest();
    req.idEdne = this.dataDialog.objeto.idEdne;
    req.query = this.query;
    req.listaMapeo = listaMapeo;

    this.edneService.listarUsuariosEdne(req).subscribe(
      (out: OutResponse<any[]>) => {
        console.log(out.objeto);
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaUsuarios = out.objeto;
        } else {
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          this.listaUsuarios = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      },
      error => {
        console.log(error);
        this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.listaUsuarios = [];
        this.isLoading = false;
      }
    );
  }

  buildQueryFields(nomTabla: string, prefijo: string): string {
    let query = '';
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == nomTabla) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

      listaFilt.forEach(el => {
        query += prefijo + "." + el.nomCampoBd + " AS " + el.nomCampoExcel + ",";
      });
    }
    return query;
  }

  verifyFields(nomTabla: string): boolean {
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == nomTabla) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  modEdne(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new EdneModificarRequest();
      req.idEdne = this.dataDialog.objeto.idEdne;
      req.fecImportacion = this.formularioGrp.get('fecImportacion').value;
      req.fecPeriodo = this.formularioGrp.get('fecPeriodo').value;
      req.idtEstado = this.formularioGrp.get('estadoEdne').value.codigo;
      req.idUsuarioModif = this.user.getIdUsuario;

      console.log(req);
      this.edneService.modificarEdne(req).subscribe(
        (out: OutResponse<any>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = this.dataDialog.objeto;
            res.fecImportacion = req.fecImportacion;
            res.fecPeriodo = req.fecPeriodo;
            res.idtEstado = req.idtEstado;
            res.nomEstado = this.formularioGrp.get('estadoEdne').value.nombre;
            res.flgActivo = CONSTANTES.FLG_ACTIVO;

            this.dialogRef.close(res);
            this._snackBar.open(MENSAJES.EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
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

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.formularioGrp.get('fecPeriodo').value;
    ctrlValue.year(normalizedYear.year());
    this.formularioGrp.get('fecPeriodo').setValue(ctrlValue);
  }

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.formularioGrp.get('fecPeriodo').value;
    ctrlValue.month(normlizedMonth.month());
    this.formularioGrp.get('fecPeriodo').setValue(ctrlValue);
    datepicker.close();
  }
}
