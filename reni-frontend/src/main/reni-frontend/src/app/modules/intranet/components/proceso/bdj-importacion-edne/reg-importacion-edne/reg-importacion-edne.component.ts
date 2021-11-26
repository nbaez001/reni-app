import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import readXlsxFile from 'read-excel-file'
import { MAESTRAS, CONSTANTES, FILE, MENSAJES_PANEL, TIPOS_DATO, CAMPOS_EXCEL, TABLAS_BD, SQL_AUDITORIA, MENSAJES, ESTADO_EDNE } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CentroAtencionListarRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-listar.request';
import { EdneListarParamEstructuraRequest } from 'src/app/modules/intranet/dto/request/edne-listar-param-estructura.request';
import { EdneListarUsuarioXCodigoRequest } from 'src/app/modules/intranet/dto/request/edne-listar-usuario-x-codigo.request';
import { EdneListarUsuarioXDocumentoDetRequest } from 'src/app/modules/intranet/dto/request/edne-listar-usuario-x-documento-det.request';
import { EdneListarUsuarioXDocumentoRequest } from 'src/app/modules/intranet/dto/request/edne-listar-usuario-x-documento.request';
import { EdneRegistrarDetUsuarioRequest } from 'src/app/modules/intranet/dto/request/edne-registrar-det-usuario.request';
import { EdneRegistrarRequest } from 'src/app/modules/intranet/dto/request/edne-registrar.request';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { CentroAtencionListarResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-listar.response';
import { EdneListarParamEstructuraResponse } from 'src/app/modules/intranet/dto/response/edne-listar-param-estructura.response';
import { EdneListarUsuarioXCodigoResponse } from 'src/app/modules/intranet/dto/response/edne-listar-usuario-x-codigo.response';
import { EdneListarUsuarioXDocumentoResponse } from 'src/app/modules/intranet/dto/response/edne-listar-usuario-x-documento.response';
import { EdneListarResponse } from 'src/app/modules/intranet/dto/response/edne-listar.response';
import { EdneRegistrarResponse } from 'src/app/modules/intranet/dto/response/edne-registrar.response';
import { EstructuraListarResponse } from 'src/app/modules/intranet/dto/response/estructura-listar.response';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { CentroAtencionService } from 'src/app/modules/intranet/services/centro-atencion.service';
import { EdneService } from 'src/app/modules/intranet/services/edne.service';
import { EstructuraService } from 'src/app/modules/intranet/services/estructura.service';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { BuscEstructuraComponent } from '../busc-estructura/busc-estructura.component';
import { VerErrorComponent } from '../ver-error/ver-error.component';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { EdneDescargarPlantillaRequest } from 'src/app/modules/intranet/dto/request/edne-descargar-plantilla.request';
import { FileResponse } from 'src/app/modules/intranet/dto/response/file.response';
import { ReporteService } from 'src/app/modules/intranet/services/reporte.service';

// const moment = _rollupMoment || _moment;

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
  selector: 'app-reg-importacion-edne',
  templateUrl: './reg-importacion-edne.component.html',
  styleUrls: ['./reg-importacion-edne.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RegImportacionEdneComponent implements OnInit {
  length: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  pageEvent: PageEvent;

  descargar: boolean = false;

  filasError: string = '';

  TABLAS_BD = TABLAS_BD;
  ESTADO_EDNE = ESTADO_EDNE;

  eEdne: EdneListarResponse;

  totalValidNecesarias: number = 0;
  totalValidNecesariasCont: number = 0;
  contValidated: number = 0;

  isLinear: boolean = false;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  eEstructura: EstructuraListarResponse;

  listaEstadosEdne: MaestraSubitemListarResponse[] = null;
  listaParametroEstructura: EdneListarParamEstructuraResponse[] = [];
  listaCentroAtencion: CentroAtencionListarResponse[] = [];
  listaUsuarioXCodigo: EdneListarUsuarioXCodigoResponse[] = [];
  listaUsuarioXDocumento: EdneListarUsuarioXDocumentoResponse[] = [];

  flagSuccessMsg: boolean = false;
  flagErrorMsg: boolean = false;
  errorMsg: string = '';

  paso2Completado: boolean = false;

  fileupload: any;

  queryUsuario: string = null;
  queryUsuarioDetalle: string = null;
  queryUsuarioIngreso: string = null;
  queryAgenteExterno: string = null;
  queryUsuarioActividad: string = null;
  queryUsuarioSituacion: string = null;
  dataUsuario: string = null;
  dataUsuarioDetalle: string = null;
  dataUsuarioIngreso: string = null;
  dataAgenteExterno: string = null;
  dataUsuarioActividad: string = null;
  dataUsuarioSituacion: string = null;

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
    public dialogRef: MatDialogRef<RegImportacionEdneComponent>,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    @Inject(EstructuraService) private estructuraService: EstructuraService,
    @Inject(CentroAtencionService) private centroAtencionService: CentroAtencionService,
    @Inject(EdneService) private edneService: EdneService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(ReporteService) private reporteService: ReporteService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      estructura: ['', [Validators.required]],
      nomArchivo: ['', [Validators.required]],
      fecImportacion: [new Date(), [Validators.required]],
      fecPeriodo: [moment(), [Validators.required]],
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
  }

  comboEstadoEdne(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.ESTADO_EDNE;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEstadosEdne = out.objeto;
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
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    if (this.listaUsuariosMostrar.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaUsuariosMostrar);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
    }
  }

  buscarEstructuras(): void {
    const dialogRef = this.dialog.open(BuscEstructuraComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.EDNE.BUSCAR_ESTRUCTURA.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: EstructuraListarResponse) => {
      if (result) {
        this.spinner.show();
        this.formularioGrp.get('estructura').setValue(result.nombre);
        this.eEstructura = result;

        let req = new EdneListarParamEstructuraRequest();
        req.idEstructura = result.idEstructura;

        this.edneService.listarParamEstructura(req).subscribe(
          (out: OutResponse<EdneListarParamEstructuraResponse[]>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaParametroEstructura = out.objeto;
              this.buildColumnsGrilla();
              this.actNumValidaciones();
            } else {
              this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
              this.listaParametroEstructura = [];
            }
            this.spinner.hide();
          },
          error => {
            console.log(error);
            this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
            this.listaParametroEstructura = [];
            this.spinner.hide();
          }
        );
      }
    });
  }

  public openInput(evt): void {
    document.getElementById('archivoEdne').click();
  }

  public cargarArchivoEdne(event) {
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('nomArchivo').setValue(null);
    } else {
      if (this.fileupload.size > FILE.FILE_UPLOAD_MAX_SIZE) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
          width: '300px',
          data: {
            titulo: FILE.FILE_UPLOAD_MAX_SIZE_MSG(this.fileupload.size),
            objeto: null
          }
        });

        this.fileupload = null;
      } else {
        let nombreArchivo = this.fileupload.name;
        this.formularioGrp.get('nomArchivo').setValue(nombreArchivo);
      }
    }
  }

  validarArchivoEdne(): void {
    if (this.formularioGrp.valid) {
      this.listaUsuarios = [];
      this.totalValidNecesariasCont = 0;
      this.contValidated = 0;
      this.stepper.next();
      this.spinner.show();

      readXlsxFile(this.fileupload).then((rows: any[]) => {
        rows.forEach((el, i) => {
          if (i >= 4) {
            let obj: any = {};
            this.listaParametroEstructura.forEach(par => {
              obj[par.nomCampoExcel] = el[par.ordenCampoExcel - 1];
            });
            obj.listaErrores = [];
            this.listaUsuarios.push(obj);
          }
        });
        // console.log('TOTAL LISTA');
        // console.log(this.listaUsuarios.length);
        // console.log('TOTAL VALIDACIONES NECESARIAS');
        // console.log(this.totalValidNecesarias);
        this.validarListaProducto();
        this.length = this.listaUsuarios.length;
      });
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  validarListaProducto(): void {
    this.listaParametroEstructura.forEach(par => {
      //VALIDACION DE VARIABLE IDENTIFICATIVOS
      if (par.nomCampoExcel == CAMPOS_EXCEL.COD_CEN) {//CENTRO DE ATENCION
        this.validarCodigosCentrosAtencion(par);
      }

      if (par.nomCampoExcel == CAMPOS_EXCEL.COD_USU) {//CODIGO USUARIO
        this.validarCodUsuario(par);
      }

      if (par.nomCampoExcel == CAMPOS_EXCEL.NRO_DOC_USU) {//CODIGO USUARIO
        let fil = this.listaParametroEstructura.filter(el => (el.nomCampoExcel == CAMPOS_EXCEL.TIP_DOC_USU));
        if (fil.length > 0) {
          this.validarCodUsuarioXNumeroDocumento(par, fil[0]);
        } else {
          this._snackBar.open('El campo TIP_DOC_USU no existe en las columnas mapeadas, por lo que no es posible validar usuarios', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          this.totalValidNecesariasCont++;
        }
      }

      this.listaUsuarios.forEach((el, i) => {
        if (par.tipoDato == TIPOS_DATO.NUMBER.tipo) {
          let pattern = new RegExp(`^\\d+(\\.\\d{0,${par.escalaDato}})?$`);
          if (typeof el[par.nomCampoExcel] != 'number') {
            if (el[par.nomCampoExcel] != null) {
              if (typeof el[par.nomCampoExcel] == 'string') {
                if (!pattern.test(el[par.nomCampoExcel])) {
                  el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': tipo de dato incorrecto, el tipo debe ser ' + TIPOS_DATO.NUMBER.nombre });
                }
              } else {
                el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': tipo de dato incorrecto, el tipo debe ser ' + TIPOS_DATO.NUMBER.nombre });
              }
            }
          } else {
            let numString = el[par.nomCampoExcel].toString();
            if (!pattern.test(numString)) {
              el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': el numero debe tener ' + par.escalaDato + ' decimales' });
            }
          }
        }

        if (par.tipoDato == TIPOS_DATO.DATE.tipo) {
          if (!(el[par.nomCampoExcel] instanceof Date)) {
            if (el[par.nomCampoExcel] != null) {
              let pattern = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
              if (typeof el[par.nomCampoExcel] == 'string') {
                if (!pattern.test(el[par.nomCampoExcel])) {
                  el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': tipo de dato incorrecto, el tipo debe ser ' + TIPOS_DATO.DATE.nombre });
                }
              } else {
                el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': tipo de dato incorrecto, el tipo debe ser ' + TIPOS_DATO.DATE.nombre });
              }
            }
          }
        }

        if (par.tipoDato == TIPOS_DATO.VARCHAR2.tipo) {
          let pattern = new RegExp(`^[^']*$`);
          if (typeof el[par.nomCampoExcel] != 'string') {
            if (el[par.nomCampoExcel] != null) {
              let valString = el[par.nomCampoExcel].toString();
              if (!pattern.test(valString)) {
                el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ": el texto contiene el caracter no permitido ( ' )" });
              } else {
                pattern = new RegExp(`^.{0,${par.longitudDato}}$`);
                if (!pattern.test(el[par.nomCampoExcel])) {
                  el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': el texto debe tener como maximo ' + par.longitudDato + ' caracteres (actual: ' + valString.length + ')' });
                }
              }
            }
          } else {
            if (!pattern.test(el[par.nomCampoExcel])) {
              el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ": el texto contiene el caracter no permitido ( ' )" });
            } else {
              pattern = new RegExp(`^.{0,${par.longitudDato}}$`);
              if (!pattern.test(el[par.nomCampoExcel])) {
                el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': el texto debe tener como maximo ' + par.longitudDato + ' caracteres (actual: ' + el[par.nomCampoExcel].length + ')' });
              }
            }
          }
        }
      });

      if (par.campoEsFk == 1) {
        let req = new MaestraSubitemListarRequest();
        req.idTabla = par.campoIdMaestra;

        this.maestraService.listarMaestraSubitem(req).subscribe(
          (out: OutResponse<MaestraSubitemListarResponse[]>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.validateCodigosMaestra(out.objeto, par);
            } else {
              console.log(out.rmensaje);
              this.validateCodigosMaestra([], par);
              this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
            }
          },
          error => {
            console.log(error);
            this.validateCodigosMaestra([], par);
            this._snackBar.open('Ocurrio un error al cargar las llaves foraneas de validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
        );
      } else {
        this.contValidated++;
      }
    });
  }

  validarCodigosCentrosAtencion(par: EdneListarParamEstructuraResponse): void {
    let req = new CentroAtencionListarRequest();
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.centroAtencionService.listarCentroAtencionLigero(req).subscribe(
      (data: OutResponse<CentroAtencionListarResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaCentroAtencion = data.objeto;

          //FILTRADO DE CENTROS POR USUARIO
          this.listaUsuarios.forEach(el => {
            let obj = el[CAMPOS_EXCEL.COD_CEN];
            if (obj) {
              let fl = this.listaCentroAtencion.filter(el => (el.codigo == obj));
              if (fl.length > 0) {
                el[TABLAS_BD.CENTRO_ATENCION.CAMPOS.NID_CENTRO_ATEN] = fl[0].idCentroAtencion;
              } else {
                el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': el codigo de Centro ' + obj + ' no existe, dirijase al menu de Centros de Atencion para registrarla' });
              }
            } else {
              el.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': el codigo de Centro no puede ser vacia' });
            }
          });

          this.totalValidNecesariasCont++;
          this.resumirYCargarTabla();
          //FIN FILTRADO DE CENTROS POR USUARIO
        } else {
          this._snackBar.open('No se pudo obtener la lista de centros de atencion para la validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          this.listaCentroAtencion = [];

          this.totalValidNecesariasCont++;
          this.resumirYCargarTabla();
        }
      },
      error => {
        console.log(error);
        this._snackBar.open('No se pudo obtener la lista de centros de atencion para la validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.listaCentroAtencion = [];

        this.totalValidNecesariasCont++;
        this.resumirYCargarTabla();
      }
    );
  }

  validarCodUsuario(par: EdneListarParamEstructuraResponse): void {
    let req = new EdneListarUsuarioXCodigoRequest();

    let listaCodigo: string[] = [];
    this.listaUsuarios.forEach((el, i) => {
      if (el[par.nomCampoExcel]) {
        listaCodigo.push(el[par.nomCampoExcel]);
      }
    });
    req.listaCodigos = listaCodigo;
    req.nomCampo = par.nomCampoBd;

    this.edneService.listarUsuarioXCodigo(req).subscribe(
      (data: OutResponse<EdneListarUsuarioXCodigoResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaUsuarioXCodigo = data.objeto;

          //FILTRADO DE CODIGOS POR USUARIO
          this.listaUsuarios.forEach(el => {
            let obj = el[CAMPOS_EXCEL.COD_USU];
            if (obj) {
              let fl = this.listaUsuarioXCodigo.filter(el => (el.codUsuario == obj));
              if (fl.length > 0) {
                el[TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO] = fl[0].idUsuario;
              }
            }
          });

          this.totalValidNecesariasCont++;
          this.resumirYCargarTabla();
          //FIN FILTRADO DE CODIGOS POR USUARIO
        } else {
          this._snackBar.open('No se pudo obtener la lista de usuarios para la validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          this.listaUsuarioXCodigo = [];

          this.totalValidNecesariasCont++;
          this.resumirYCargarTabla();
        }
      },
      error => {
        console.log(error);
        this._snackBar.open('No se pudo obtener la lista de usuarios para la validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.listaUsuarioXCodigo = [];

        this.totalValidNecesariasCont++;
        this.resumirYCargarTabla();
      }
    );
  }

  validarCodUsuarioXNumeroDocumento(par: EdneListarParamEstructuraResponse, par2: EdneListarParamEstructuraResponse): void {
    let req = new EdneListarUsuarioXDocumentoRequest();

    let listaDocumento: EdneListarUsuarioXDocumentoDetRequest[] = [];
    this.listaUsuarios.forEach((el, i) => {
      if (el[par.nomCampoExcel] && el[CAMPOS_EXCEL.TIP_DOC_USU]) {
        let obj = new EdneListarUsuarioXDocumentoDetRequest();
        obj.nroDocumento = el[par.nomCampoExcel];
        obj.tipDocumento = el[CAMPOS_EXCEL.TIP_DOC_USU];
        listaDocumento.push(obj);
      }
    });

    req.listaUsuarioDocumento = listaDocumento;
    req.campNroDoc = par.nomCampoBd;
    req.campTipDoc = par2.nomCampoBd;

    this.edneService.listarUsuarioXDocumento(req).subscribe(
      (data: OutResponse<EdneListarUsuarioXDocumentoResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaUsuarioXDocumento = data.objeto;

          //FILTRADO DE CODIGOS POR USUARIO
          this.listaUsuarios.forEach(el => {
            let obj = el[CAMPOS_EXCEL.NRO_DOC_USU];
            if (obj && el[CAMPOS_EXCEL.TIP_DOC_USU]) {
              let eNroDocumento = (typeof obj != 'string') ? obj.toString() : obj;
              let eTipDocumento = (typeof el[CAMPOS_EXCEL.TIP_DOC_USU] != 'string') ? el[CAMPOS_EXCEL.TIP_DOC_USU].toString() : el[CAMPOS_EXCEL.TIP_DOC_USU];

              let fl = this.listaUsuarioXDocumento.filter(el => (el.nroDocumento == eNroDocumento && el.tipDocumento == eTipDocumento));
              if (fl.length > 0) {
                el[TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO] = fl[0].idUsuario;
              }
            }
          });

          this.totalValidNecesariasCont++;
          this.resumirYCargarTabla();
          //FIN FILTRADO DE CODIGOS POR USUARIO
        } else {
          this._snackBar.open('No se pudo obtener la lista de usuarios para la validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          this.listaUsuarioXDocumento = [];

          this.totalValidNecesariasCont++;
          this.resumirYCargarTabla();
        }
      },
      error => {
        console.log(error);
        this._snackBar.open('No se pudo obtener la lista de usuarios para la validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        this.listaUsuarioXDocumento = [];

        this.totalValidNecesariasCont++;
        this.resumirYCargarTabla();
      }
    );
  }

  validateCodigosMaestra(lista: MaestraSubitemListarResponse[], par: EdneListarParamEstructuraResponse): void {
    if (lista.length > 0) {
      let codigos = '';
      lista.forEach(el => {
        codigos += ' ' + el.codigo + ',';
      });
      codigos = codigos.substr(0, codigos.length - 1);

      this.listaUsuarios.forEach((us, i) => {
        if (typeof us[par.nomCampoExcel] == 'string') {
          if (us[par.nomCampoExcel] != null) {
            let filt = lista.filter(el => (el.codigo == us[par.nomCampoExcel]));
            if (filt.length == 0) {
              us.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': el campo es de tipo llave foranea y solo puede tener los siguiente valores: ' + codigos + ' (actual: ' + us[par.nomCampoExcel] + ' )' });
            }
          }
        } else {
          if (us[par.nomCampoExcel] != null) {
            let valString = us[par.nomCampoExcel].toString();
            let filt = lista.filter(el => (el.codigo == valString));
            if (filt.length == 0) {
              us.listaErrores.push({ columna: par.ordenCampoExcel, descripcion: 'Columna ' + par.ordenCampoExcel + ': ' + par.nomCampoExcel + ': el campo es de tipo llave foranea y solo puede tener los siguiente valores: ' + codigos + ' (actual: ' + valString + ' )' });
            }
          }
        }
      });
    }
    this.totalValidNecesariasCont++;

    this.contValidated++;
    this.resumirYCargarTabla();
  }

  resumirYCargarTabla(): void {
    if (this.contValidated == this.listaParametroEstructura.length) {
      let posicionesError: number[] = [];
      this.listaUsuarios.forEach((el, i) => {
        if (el.listaErrores.length > 0) {
          posicionesError.push(i + 1);
        }
      });

      if (posicionesError.length > 0) {
        this.paso2Completado = false;

        this.filasError = '';
        posicionesError.forEach((po, i) => {
          if ((i + 1) < 10) {
            this.filasError += posicionesError[i] + ' ';
          } else if ((i + 1) == 10) {
            this.filasError += posicionesError[i] + ' ...';
          }
        });
      } else {
        this.paso2Completado = true;
      }
      this.listaUsuariosMostrar = this.listaUsuarios.slice(0, this.pageSize);
      this.cargarDatosTabla();

      if (this.totalValidNecesarias == this.totalValidNecesariasCont) {
        this.spinner.hide();
      }
    }
  }

  registrarArchivoEdne(): void {
    if (ESTADO_EDNE.APROBADO == this.formularioGrp.get('estadoEdne').value.codigo) {
      if (this.listaUsuarios.length > 0) {
        this.stepper.next();
        this.spinner.show();

        let req = new EdneRegistrarRequest();
        req.idEstructura = this.eEstructura.idEstructura;
        req.nomArchivo = this.formularioGrp.get('nomArchivo').value;
        req.fecImportacion = this.formularioGrp.get('fecImportacion').value;
        req.fecPeriodo = this.formularioGrp.get('fecPeriodo').value;
        req.idtEstado = this.formularioGrp.get('estadoEdne').value.codigo;
        req.listaParametro = this.listaParametroEstructura;
        req.listaUsuario = this.buildData();
        // let lUsuarioIdentificado: EdneRegistrarDetUsuarioRequest[] = [];
        // let lUsuarioNoIdentificado: EdneRegistrarDetUsuarioRequest[] = [];

        // this.buildQueryUsuario();
        // this.buildQueryUsuarioDetalle();
        // this.buildQueryUsuarioIngreso();
        // this.buildQueryAgenteExterno();
        // this.buildQueryUsuarioActividad();
        // this.buildQueryUsuarioSituacion();

        // let lUsuarios = [];
        // this.listaUsuarios.forEach((el, i) => {
        //   let reqDet: any = {};
        // if (el[TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO]) {
        //   // FALTA SETEAR ID EN CASO DE IDENTIFICADO //
        //   reqDet.datUsuarioDetalle = this.buildDataUsuarioDetalle(el);
        //   reqDet.datUsuarioIngreso = this.buildDataUsuarioIngreso(el);
        //   reqDet.datUsuarioAgenteExter = this.buildDataAgenteExterno(el);
        //   reqDet.datUsuarioSituacion = this.buildDataUsuarioSituacion(el);
        //   reqDet.datUsuarioActividad = this.buildDataUsuarioActividad(el);

        //   lUsuarioIdentificado.push(reqDet);
        // } else {
        //   reqDet.datUsuario = this.buildDataUsuario(el);
        //   reqDet.datUsuarioDetalle = this.buildDataUsuarioDetalle(el);
        //   reqDet.datUsuarioIngreso = this.buildDataUsuarioIngreso(el);
        //   reqDet.datUsuarioAgenteExter = this.buildDataAgenteExterno(el);
        //   reqDet.datUsuarioSituacion = this.buildDataUsuarioSituacion(el);
        //   reqDet.datUsuarioActividad = this.buildDataUsuarioActividad(el);

        //   lUsuarioNoIdentificado.push(reqDet);
        // }
        // });

        // req.queryUsuario = this.queryUsuario;
        // req.queryUsuarioDetalle = this.queryUsuarioDetalle;
        // req.queryUsuarioIngreso = this.queryUsuarioIngreso;
        // req.queryAgenteExterno = this.queryAgenteExterno;
        // req.queryUsuarioActividad = this.queryUsuarioActividad;
        // req.queryUsuarioSituacion = this.queryUsuarioSituacion;
        req.idUsuarioCrea = this.user.idUsuario;
        // req.listaUsuarioIdentificado = lUsuarioIdentificado;
        // req.listaUsuarioNoIdentificado = lUsuarioNoIdentificado;

        // console.log(req);
        this.edneService.registrarEdne(req).subscribe(
          (data: OutResponse<EdneRegistrarResponse>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.flagSuccessMsg = true;
              this.eEdne = new EdneListarResponse();
              this.eEdne.idEdne = data.objeto.idEdne;
              this.eEdne.nomArchivo = req.nomArchivo;
              this.eEdne.fecImportacion = req.fecImportacion;
              this.eEdne.fecPeriodo = req.fecPeriodo;
              this.eEdne.idEstructura = req.idEstructura;
              this.eEdne.nomEstructura = this.eEstructura.nombre;
              this.eEdne.idServicio = this.eEstructura.idServicio;
              this.eEdne.nomServicio = this.eEstructura.nomServicio;
              this.eEdne.idEntidad = this.eEstructura.idEntidad;
              this.eEdne.nomEntidad = this.eEstructura.nomEntidad;
              this.eEdne.idLineaInter = this.eEstructura.idLineaIntervencion;
              this.eEdne.nomLineaInter = this.eEstructura.nomLineaIntervencion;
              this.eEdne.idtEstado = req.idtEstado;
              this.eEdne.nomEstado = this.formularioGrp.get('estadoEdne').value.nombre;
              this.eEdne.flgActivo = CONSTANTES.FLG_ACTIVO;
              this._snackBar.open(MENSAJES.EXITO_OPERACION, null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else {
              this.flagErrorMsg = true;
              this.errorMsg = data.rmensaje;
              this._snackBar.open(data.rmensaje, null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
            }
            this.spinner.hide();
          },
          (error: HttpErrorResponse) => {
            this.flagErrorMsg = true;
            this.errorMsg = error.error.error;
            this.spinner.hide();
            this._snackBar.open(error.error.error, null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
        );
      } else {
        this._snackBar.open('La lista de usuarios ingresada se encuentra vacia', null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
      }
    } else {
      this._snackBar.open('No es posible continuar, debido a que el estado seleccionado es PENDIENTE que indica que la carga es solamente de validacion', null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['info-snackbar'] });
    }
  }

  buildData(): any[] {
    let lUsuarios: any[] = [];
    this.listaParametroEstructura.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

    // console.log('TAMAÑO DE LISTA DE USUARIOS');
    // console.log(this.listaUsuarios.length);
    this.listaUsuarios.forEach((usuario, i) => {
      let usu: any = {};

      this.listaParametroEstructura.forEach(el => {
        if (usuario[el.nomCampoExcel]) {
          if (el.tipoDato == TIPOS_DATO.NUMBER.tipo) {
            usu[el.nomCampoExcel] = parseFloat(usuario[el.nomCampoExcel] + '');
          } else {
            if (el.tipoDato == TIPOS_DATO.DATE.tipo) {
              usu[el.nomCampoExcel] = (typeof usuario[el.nomCampoExcel] != 'string') ? this.datePipe.transform(usuario[el.nomCampoExcel], 'dd/MM/yyyy') : usuario[el.nomCampoExcel];
            } else {
              usu[el.nomCampoExcel] = usuario[el.nomCampoExcel] + '';
            }
          }
        } else {
          usu[el.nomCampoExcel] = null;
        }
      });

      usu[TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO] = usuario[TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO];
      usu[TABLAS_BD.CENTRO_ATENCION.CAMPOS.NID_CENTRO_ATEN] = usuario[TABLAS_BD.CENTRO_ATENCION.CAMPOS.NID_CENTRO_ATEN];
      usu[CAMPOS_EXCEL.COD_USU] = '{COD_USU}';
      lUsuarios.push(usu);
    });
    return lUsuarios;
  }

  buildDataUsuarioActividad(usuario: any): string {
    let data = this.dataUsuarioActividad;
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_ACTIVIDAD.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);
      listaFilt.forEach(el => {
        if (usuario[el.nomCampoExcel]) {
          if (el.tipoDato == TIPOS_DATO.NUMBER.tipo) {
            data = data.replace(`{${el.nomCampoBd}}`, `TO_NUMBER(${usuario[el.nomCampoExcel]},'${"9".repeat(el.precisionDato)}${el.escalaDato != 0 ? "." : ""}${"9".repeat(el.escalaDato)}')`);
          } else {
            if (el.tipoDato == TIPOS_DATO.DATE.tipo) {
              data = data.replace(`{${el.nomCampoBd}}`, `TO_DATE('${(usuario[el.nomCampoExcel] instanceof Date) ? this.datePipe.transform(usuario[el.nomCampoExcel], 'dd/MM/yyyy') : usuario[el.nomCampoExcel]}','DD/MM/YYYY')`);
            } else {
              data = data.replace(`{${el.nomCampoBd}}`, `'${usuario[el.nomCampoExcel]}'`);
            }
          }
        } else {
          data = data.replace(`{${el.nomCampoBd}}`, `NULL`);
        }
      });
      data = this.replaceAuditoria(data);
      return data;
    } else {
      return null;
    }
  }

  buildDataUsuarioSituacion(usuario: any): string {
    let data = this.dataUsuarioSituacion;
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_SITUACION.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);
      listaFilt.forEach(el => {
        if (usuario[el.nomCampoExcel]) {
          if (el.tipoDato == TIPOS_DATO.NUMBER.tipo) {
            data = data.replace(`{${el.nomCampoBd}}`, `TO_NUMBER(${usuario[el.nomCampoExcel]},'${"9".repeat(el.precisionDato)}${el.escalaDato != 0 ? "." : ""}${"9".repeat(el.escalaDato)}')`);
          } else {
            if (el.tipoDato == TIPOS_DATO.DATE.tipo) {
              data = data.replace(`{${el.nomCampoBd}}`, `TO_DATE('${(usuario[el.nomCampoExcel] instanceof Date) ? this.datePipe.transform(usuario[el.nomCampoExcel], 'dd/MM/yyyy') : usuario[el.nomCampoExcel]}','DD/MM/YYYY')`);
            } else {
              data = data.replace(`{${el.nomCampoBd}}`, `'${usuario[el.nomCampoExcel]}'`);
            }
          }
        } else {
          data = data.replace(`{${el.nomCampoBd}}`, `NULL`);
        }
      });
      data = this.replaceAuditoria(data);
      return data;
    } else {
      return null;
    }
  }

  buildDataAgenteExterno(usuario: any): string {
    let data = this.dataAgenteExterno;
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.AGENTE_EXTERNO.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);
      listaFilt.forEach(el => {
        if (usuario[el.nomCampoExcel]) {
          if (el.tipoDato == TIPOS_DATO.NUMBER.tipo) {
            data = data.replace(`{${el.nomCampoBd}}`, `TO_NUMBER(${usuario[el.nomCampoExcel]},'${"9".repeat(el.precisionDato)}${el.escalaDato != 0 ? "." : ""}${"9".repeat(el.escalaDato)}')`);
          } else {
            if (el.tipoDato == TIPOS_DATO.DATE.tipo) {
              data = data.replace(`{${el.nomCampoBd}}`, `TO_DATE('${(usuario[el.nomCampoExcel] instanceof Date) ? this.datePipe.transform(usuario[el.nomCampoExcel], 'dd/MM/yyyy') : usuario[el.nomCampoExcel]}','DD/MM/YYYY')`);
            } else {
              data = data.replace(`{${el.nomCampoBd}}`, `'${usuario[el.nomCampoExcel]}'`);
            }
          }
        } else {
          data = data.replace(`{${el.nomCampoBd}}`, `NULL`);
        }
      });
      data = this.replaceAuditoria(data);
      return data;
    } else {
      return null;
    }
  }

  buildDataUsuarioIngreso(usuario: any): string {
    let data = this.dataUsuarioIngreso;
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_INGRESO.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);
      listaFilt.forEach(el => {
        if (usuario[el.nomCampoExcel]) {
          if (el.tipoDato == TIPOS_DATO.NUMBER.tipo) {
            data = data.replace(`{${el.nomCampoBd}}`, `TO_NUMBER(${usuario[el.nomCampoExcel]},'${"9".repeat(el.precisionDato)}${el.escalaDato != 0 ? "." : ""}${"9".repeat(el.escalaDato)}')`);
          } else {
            if (el.tipoDato == TIPOS_DATO.DATE.tipo) {
              data = data.replace(`{${el.nomCampoBd}}`, `TO_DATE('${(usuario[el.nomCampoExcel] instanceof Date) ? this.datePipe.transform(usuario[el.nomCampoExcel], 'dd/MM/yyyy') : usuario[el.nomCampoExcel]}','DD/MM/YYYY')`);
            } else {
              data = data.replace(`{${el.nomCampoBd}}`, `'${usuario[el.nomCampoExcel]}'`);
            }
          }
        } else {
          data = data.replace(`{${el.nomCampoBd}}`, `NULL`);
        }
      });
      data = this.replaceAuditoria(data);
      return data;
    } else {
      return null;
    }
  }

  buildDataUsuarioDetalle(usuario: any): string {
    let data = this.dataUsuarioDetalle;
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_DETALLE.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);
      listaFilt.forEach(el => {
        if (usuario[el.nomCampoExcel]) {
          if (el.tipoDato == TIPOS_DATO.NUMBER.tipo) {
            data = data.replace(`{${el.nomCampoBd}}`, `TO_NUMBER(${usuario[el.nomCampoExcel]},'${"9".repeat(el.precisionDato)}${el.escalaDato != 0 ? "." : ""}${"9".repeat(el.escalaDato)}')`);
          } else {
            if (el.tipoDato == TIPOS_DATO.DATE.tipo) {
              data = data.replace(`{${el.nomCampoBd}}`, `TO_DATE('${(usuario[el.nomCampoExcel] instanceof Date) ? this.datePipe.transform(usuario[el.nomCampoExcel], 'dd/MM/yyyy') : usuario[el.nomCampoExcel]}','DD/MM/YYYY')`);
            } else {
              data = data.replace(`{${el.nomCampoBd}}`, `'${usuario[el.nomCampoExcel]}'`);
            }
          }
        } else {
          data = data.replace(`{${el.nomCampoBd}}`, `NULL`);
        }
      });
      data = data.replace('{NID_CENTRO_ATEN}', usuario[TABLAS_BD.CENTRO_ATENCION.CAMPOS.NID_CENTRO_ATEN]);
      if (usuario[TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO]) {
        data = data.replace('{NID_USUARIO}', usuario[TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO]);
      }
      data = this.replaceAuditoria(data);
      return data;
    } else {
      return null;
    }
  }

  buildDataUsuario(usuario: any): string {
    let data = this.dataUsuario;
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);
      listaFilt.forEach(el => {
        if (usuario[el.nomCampoExcel]) {
          if (el.tipoDato == TIPOS_DATO.NUMBER.tipo) {
            data = data.replace(`{${el.nomCampoBd}}`, `TO_NUMBER(${usuario[el.nomCampoExcel]},'${"9".repeat(el.precisionDato)}${el.escalaDato != 0 ? "." : ""}${"9".repeat(el.escalaDato)}')`);
          } else {
            if (el.tipoDato == TIPOS_DATO.DATE.tipo) {
              data = data.replace(`{${el.nomCampoBd}}`, `TO_DATE('${(usuario[el.nomCampoExcel] instanceof Date) ? this.datePipe.transform(usuario[el.nomCampoExcel], 'dd/MM/yyyy') : usuario[el.nomCampoExcel]}','DD/MM/YYYY')`);
            } else {
              data = data.replace(`{${el.nomCampoBd}}`, `'${usuario[el.nomCampoExcel]}'`);
            }
          }
        } else {
          data = data.replace(`{${el.nomCampoBd}}`, `NULL`);
        }
      });
      data = this.replaceAuditoria(data);
      return data;
    } else {
      return null;
    }
  }

  replaceAuditoria(data: string): string {
    data = data.replace('{FLG_ACTIVO}', CONSTANTES.FLG_ACTIVO.toString());
    data = data.replace('{NID_USUARIO_CREACION}', this.user.idUsuario.toString());
    data = data.replace('{FEC_CREACION}', 'SYSTIMESTAMP');
    return data;
  }

  // QUERY
  buildQueryUsuarioActividad(): void {
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_ACTIVIDAD.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

      this.queryUsuarioActividad = "INSERT INTO " + TABLAS_BD.USUARIO_ACTIVIDAD.NOMBRE + "(" + TABLAS_BD.USUARIO_ACTIVIDAD.CAMPOS.NID_USUARIO_ACTIVIDAD + "," + TABLAS_BD.USUARIO_ACTIVIDAD.CAMPOS.NID_USUARIO_DETALLE;
      this.dataUsuarioActividad = "VALUES({" + TABLAS_BD.USUARIO_ACTIVIDAD.CAMPOS.NID_USUARIO_ACTIVIDAD + "},{" + TABLAS_BD.USUARIO_ACTIVIDAD.CAMPOS.NID_USUARIO_DETALLE + "}";
      listaFilt.forEach(el => {
        this.queryUsuarioActividad += "," + el.nomCampoBd;
        this.dataUsuarioActividad += ",{" + el.nomCampoBd + "}";
      });
      this.queryUsuarioActividad += SQL_AUDITORIA.QUERY;
      this.dataUsuarioActividad += SQL_AUDITORIA.DATA;
    }
  }

  buildQueryUsuarioSituacion(): void {
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_SITUACION.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

      this.queryUsuarioSituacion = "INSERT INTO " + TABLAS_BD.USUARIO_SITUACION.NOMBRE + "(" + TABLAS_BD.USUARIO_SITUACION.CAMPOS.NID_USUARIO_SITUACION + "," + TABLAS_BD.USUARIO_SITUACION.CAMPOS.NID_USUARIO_DETALLE;
      this.dataUsuarioSituacion = "VALUES({" + TABLAS_BD.USUARIO_SITUACION.CAMPOS.NID_USUARIO_SITUACION + "},{" + TABLAS_BD.USUARIO_SITUACION.CAMPOS.NID_USUARIO_DETALLE + "}";
      listaFilt.forEach(el => {
        this.queryUsuarioSituacion += "," + el.nomCampoBd;
        this.dataUsuarioSituacion += ",{" + el.nomCampoBd + "}";
      });
      this.queryUsuarioSituacion += SQL_AUDITORIA.QUERY;
      this.dataUsuarioSituacion += SQL_AUDITORIA.DATA;
    }
  }

  buildQueryAgenteExterno(): void {
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.AGENTE_EXTERNO.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

      this.queryAgenteExterno = "INSERT INTO " + TABLAS_BD.AGENTE_EXTERNO.NOMBRE + "(" + TABLAS_BD.AGENTE_EXTERNO.CAMPOS.NID_AGENTE_EXTERNO + "," + TABLAS_BD.AGENTE_EXTERNO.CAMPOS.NID_USUARIO_INGRESO;
      this.dataAgenteExterno = "VALUES({" + TABLAS_BD.AGENTE_EXTERNO.CAMPOS.NID_AGENTE_EXTERNO + "},{" + TABLAS_BD.AGENTE_EXTERNO.CAMPOS.NID_USUARIO_INGRESO + "}";
      listaFilt.forEach(el => {
        this.queryAgenteExterno += "," + el.nomCampoBd;
        this.dataAgenteExterno += ",{" + el.nomCampoBd + "}";
      });
      this.queryAgenteExterno += SQL_AUDITORIA.QUERY;
      this.dataAgenteExterno += SQL_AUDITORIA.DATA;
    }
  }

  buildQueryUsuarioIngreso(): void {
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_INGRESO.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

      this.queryUsuarioIngreso = "INSERT INTO " + TABLAS_BD.USUARIO_INGRESO.NOMBRE + "(" + TABLAS_BD.USUARIO_INGRESO.CAMPOS.NID_USUARIO_INGRESO + "," + TABLAS_BD.USUARIO_INGRESO.CAMPOS.NID_USUARIO_DETALLE;
      this.dataUsuarioIngreso = "VALUES({" + TABLAS_BD.USUARIO_INGRESO.CAMPOS.NID_USUARIO_INGRESO + "},{" + TABLAS_BD.USUARIO_INGRESO.CAMPOS.NID_USUARIO_DETALLE + "}";
      listaFilt.forEach(el => {
        this.queryUsuarioIngreso += "," + el.nomCampoBd;
        this.dataUsuarioIngreso += ",{" + el.nomCampoBd + "}";
      });
      this.queryUsuarioIngreso += SQL_AUDITORIA.QUERY;
      this.dataUsuarioIngreso += SQL_AUDITORIA.DATA;
    }
  }

  buildQueryUsuarioDetalle(): void {
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO_DETALLE.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

      this.queryUsuarioDetalle = "INSERT INTO " + TABLAS_BD.USUARIO_DETALLE.NOMBRE + "(" + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_USUARIO_DETALLE + "," + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_USUARIO + "," + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_EDNE + "," + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_CENTRO_ATEN;
      this.dataUsuarioDetalle = "VALUES({" + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_USUARIO_DETALLE + "},{" + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_USUARIO + "},{" + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_EDNE + "},{" + TABLAS_BD.USUARIO_DETALLE.CAMPOS.NID_CENTRO_ATEN + "}";
      listaFilt.forEach(el => {
        this.queryUsuarioDetalle += "," + el.nomCampoBd;
        this.dataUsuarioDetalle += ",{" + el.nomCampoBd + "}";
      });
      this.queryUsuarioDetalle += SQL_AUDITORIA.QUERY;
      this.dataUsuarioDetalle += SQL_AUDITORIA.DATA;
    }
  }

  buildQueryUsuario(): void {
    let listaFilt: EdneListarParamEstructuraResponse[] = [];
    this.listaParametroEstructura.forEach(par => {
      if (par.nomTablaBd == TABLAS_BD.USUARIO.NOMBRE) {
        listaFilt.push(par);
      }
    });

    if (listaFilt.length > 0) {
      listaFilt.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1);

      this.queryUsuario = "INSERT INTO " + TABLAS_BD.USUARIO.NOMBRE + "(" + TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO;
      this.dataUsuario = "VALUES({" + TABLAS_BD.USUARIO.CAMPOS.NID_USUARIO + "}";
      listaFilt.forEach(el => {
        if (el.nomCampoExcel == CAMPOS_EXCEL.COD_USU) {
          this.queryUsuario += "," + el.nomCampoBd;
          this.dataUsuario += ",{COD_USU}";
        } else {
          this.queryUsuario += "," + el.nomCampoBd;
          this.dataUsuario += ",{" + el.nomCampoBd + "}";
        }
      });
      this.queryUsuario += SQL_AUDITORIA.QUERY;
      this.dataUsuario += SQL_AUDITORIA.DATA;
    }
  }

  anterior(): void {
    this.stepper.previous();
  }

  finalizar(): void {
    this.dialogRef.close(this.eEdne);
  }

  mostrarErrores(obj: any): void {
    console.log(obj);
    const dialogRef = this.dialog.open(VerErrorComponent, {
      width: '400px',
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.EDNE.ERRORES.TITLE,
        objeto: obj.listaErrores
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  buildColumnsGrilla(): void {
    this.columnsGrilla = [];

    this.listaParametroEstructura.forEach(el => {
      let obj = {
        columnOrder: el.ordenCampoExcel,
        columnDef: el.nomCampoExcel,
        header: el.nomCampoExcel,
        cell: (m: any) => (m[el.nomCampoExcel] != null && typeof m[el.nomCampoExcel] != 'undefined') ? `${m[el.nomCampoExcel]}` : '',
        cellShort: (m: any) => (m[el.nomCampoExcel] != null && typeof m[el.nomCampoExcel] != 'undefined') ? this.evaluarYRecortar(m[el.nomCampoExcel]) : ''
      };
      this.columnsGrilla.push(obj);
    });

    this.definirTabla();
  }

  actNumValidaciones(): void {
    this.totalValidNecesarias = 3;
    this.listaParametroEstructura.forEach(par => {
      if (par.campoEsFk == 1) {
        this.totalValidNecesarias++;
      }
    });
  }

  buscar(event?: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.length = event.length;

    this.listaUsuariosMostrar = this.listaUsuarios.slice(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
    this.cargarDatosTabla();

    this.pageEvent = event;
  }

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

  descargarPlantilla(): void {
    if (this.eEstructura) {
      this.descargar = true;

      let req = new EdneDescargarPlantillaRequest();
      req.idEstructura = this.eEstructura.idEstructura;
      req.nomEstructura = this.eEstructura.nombre;

      this.edneService.descargarPlantillaRENEXlsx(req).subscribe(
        (data: OutResponse<FileResponse>) => {
          if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
            let blob = this.reporteService.convertToBlobFromByte(data.objeto);
            this.reporteService.DownloadBlobFile(blob);
            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(data.rmensaje, null, { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          }
          this.descargar = false;
        },
        error => {
          console.log(error);
          this._snackBar.open(error.statusText, null, { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          this.descargar = false;
        }
      );
    }
  }
}
