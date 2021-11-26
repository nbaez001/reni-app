import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import readXlsxFile from 'read-excel-file'
import { CONSTANTES, FILE, MENSAJES, MENSAJES_PANEL, PLANTILLAS } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { BDCampoTablaListarRequest } from 'src/app/modules/intranet/dto/request/bd-campo-tabla-listar.request';
import { EstructuraRegistrarParametroRequest } from 'src/app/modules/intranet/dto/request/estructura-registrar-parametro.request';
import { MaestraListarRequest } from 'src/app/modules/intranet/dto/request/maestra-listar.request';
import { ReportePlantillaRequest } from 'src/app/modules/intranet/dto/request/reporte-plantilla.request';
import { BDCampoTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-campo-tabla-listar.response';
import { BDTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-tabla-listar.response';
import { FileResponse } from 'src/app/modules/intranet/dto/response/file.response';
import { MaestraListarResponse } from 'src/app/modules/intranet/dto/response/maestra-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { AdministracionBdService } from 'src/app/modules/intranet/services/administracion-bd.service';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { ReporteService } from 'src/app/modules/intranet/services/reporte.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { VerErrorComponent } from '../../../proceso/bdj-importacion-edne/ver-error/ver-error.component';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { RegCampoTablaBdRapidoComponent } from '../reg-campo-tabla-bd-rapido/reg-campo-tabla-bd-rapido.component';

@Component({
  selector: 'app-carg-masiva-estructura',
  templateUrl: './carg-masiva-estructura.component.html',
  styleUrls: ['./carg-masiva-estructura.component.scss']
})
export class CargMasivaEstructuraComponent implements OnInit {
  isLinear: boolean = false;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  flagSuccessMsg: boolean = false;
  flagErrorMsg: boolean = false;
  errorMsg: string = '';

  descargar: boolean = false;

  filasError: string = '';

  cantValidNecesario: number = 0;
  cantValidNecesarioAct: number = 0;

  paso2Completado: boolean = true;

  fileupload: any;

  formularioGrp: FormGroup;
  formErrors: any;

  listaTablas: BDTablaListarResponse[] = [];

  listaParametro: EstructuraRegistrarParametroRequest[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<EstructuraRegistrarParametroRequest> = null;
  isLoading: boolean = false;
  columnsGrilla = [
    {
      columnDef: 'ordenCampoExcel',
      header: 'Orden campo excel',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.ordenCampoExcel) ? `${m.ordenCampoExcel}` : ''
    }, {
      columnDef: 'nomCampoExcel',
      header: 'Nombre campo excel',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.nomCampoExcel) ? `${m.nomCampoExcel}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.descripcion) ? `${m.descripcion.substr(0, 50)}` : ''
    }, {
      columnDef: 'nomTablaBd',
      header: 'Tabla BD',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.nomTablaBd) ? `${m.nomTablaBd}` : ''
    }, {
      columnDef: 'nomCampoBd',
      header: 'Campo BD',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.nomCampoBd) ? `${m.nomCampoBd}` : ''
    }, {
      columnDef: 'campoEsFk',
      header: 'Campo es llave foranea',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.campoEsFk == 1) ? 'SI' : 'NO'
    }, {
      columnDef: 'campoIdmaestra',
      header: 'ID Tabla maestra',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.campoIdmaestra) ? `${m.campoIdmaestra}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CargMasivaEstructuraComponent>,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(ReporteService) private reporteService: ReporteService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(AdministracionBdService) private administracionBdService: AdministracionBdService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombreArchivo: ['', [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.definirTabla();
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
    if (this.listaParametro.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaParametro);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public openInput(evt): void {
    document.getElementById('archivo').click();
  }

  public cargarArchivo(event) {
    this.fileupload = event.target.files[0];
    if (typeof event === 'undefined' || typeof this.fileupload === 'undefined' || typeof this.fileupload.name === 'undefined') {
      this.formularioGrp.get('nombreArchivo').setValue(null);
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
        this.formularioGrp.get('nombreArchivo').setValue(nombreArchivo);
      }
    }
  }

  validarArchivo(): void {
    if (this.formularioGrp.valid) {
      this.listaParametro = [];
      this.stepper.next();
      this.spinner.show();

      readXlsxFile(this.fileupload).then((rows: any[]) => {
        rows.forEach((el, i) => {
          if (i > 1) {
            let obj = new EstructuraRegistrarParametroRequest();
            obj.ordenCampoExcel = (el[0]) ? (parseInt(el[0] + '')) : el[0];
            obj.nomCampoExcel = (el[1]) ? (el[1] + '') : el[1];
            obj.descripcion = (el[2]) ? (el[2] + '') : el[2];
            obj.nomTablaBd = (el[3]) ? (el[3] + '') : el[3];
            obj.nomCampoBd = (el[4]) ? (el[4] + '') : el[4];
            obj.campoEsFk = (el[5]) ? (parseInt(el[5] + '')) : el[5];
            obj.campoIdmaestra = (el[6]) ? (el[6] + '') : el[6];

            this.listaParametro.push(obj);
          }
        });
        this.validarListaProducto(this.listaParametro);
      });
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  validarListaProducto(lista: EstructuraRegistrarParametroRequest[]): void {
    // VALIDACION DE TIPO
    this.cantValidNecesario = lista.length + 2;
    this.cantValidNecesarioAct = 0;
    this.paso2Completado = false;

    this.validarOrden();
    this.validarNombreCampoExcel();
    this.validarTextoDescripcion();
    this.validarTablaBD();
    this.validarCampoBD();
    this.validarForeignKey();
  }

  validarOrden(): void {
    let listaDupl: EstructuraRegistrarParametroRequest[] = JSON.parse(JSON.stringify(this.listaParametro));
    this.listaParametro.forEach((el, i) => {
      let filt = listaDupl.filter(el2 => (el2.ordenCampoExcel == el.ordenCampoExcel));
      if (filt.length > 1) {
        el.error.push({ columna: 1, descripcion: 'Columna 1: El orden del parametro esta duplicado' });
      }
    });
    this.resumirYCargarTabla();
  }

  validarNombreCampoExcel(): void {
    let listaDupl: EstructuraRegistrarParametroRequest[] = JSON.parse(JSON.stringify(this.listaParametro));
    this.listaParametro.forEach((el, i) => {
      let filt = listaDupl.filter(el2 => (el2.nomCampoExcel == el.nomCampoExcel));
      if (filt.length > 1) {
        el.error.push({ columna: 2, descripcion: 'Columna 2: El Nombre de campo Excel esta duplicado' });
      }
    });

    this.listaParametro.forEach((el, i) => {
      let pattern = /^(\w)*$/;
      let valString = el.nomCampoExcel + '';
      if (!pattern.test(valString.toUpperCase())) {
        el.error.push({ columna: 2, descripcion: 'Columna 2: El Nombre de campo Excel solo puede contener caracteres alfanumericos y subguion' });
      }
    });
    this.resumirYCargarTabla();
  }

  validarTextoDescripcion(): void {
    this.listaParametro.forEach((el, i) => {
      var nombre = el.descripcion.match(/[^\r\n]+/g);
      if (nombre.length > 1) {
        el.error.push({ columna: 3, descripcion: 'Columna 3: El texto descripcion no puede contener saltos de linea' });
      }

      if (el.descripcion.length > 500) {
        el.error.push({ columna: 3, descripcion: 'Columna 3: El texto descripcion debe tener maximo 500 caracteres' });
      }
    });
    this.resumirYCargarTabla();
  }

  validarTablaBD(): void {
    this.administracionBdService.listarTablasBD().subscribe(
      (out: OutResponse<BDTablaListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTablas = out.objeto;
          this.validateTablas(out.objeto);
        } else {
          this.listaTablas = [];
          this.validateTablas([]);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      }, error => {
        this.validateTablas([]);
        this._snackBar.open('Ocurrio un error al cargar las llaves foraneas de validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validateTablas(lista: BDTablaListarResponse[]): void {
    if (lista.length > 0) {
      this.listaParametro.forEach((us, i) => {
        let filt = lista.filter(el => (el.nomTabla == us.nomTablaBd));
        if (filt.length == 0) {
          us.errorTablaBDExiste = true;
          us.error.push({ columna: 4, descripcion: 'Columna 4: La Tabla BD ingresada no corresponde a las tablas de Mapeo' });
        }
      });
    } else {
      this.listaParametro.forEach((us, i) => {
        us.errorTablaBDExiste = true;
        us.error.push({ columna: 4, descripcion: 'Columna 4: No fue posible validar el nombre de las Tablas BD' });
      });
    }
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  validarCampoBD(): void {
    let listaDupl: EstructuraRegistrarParametroRequest[] = JSON.parse(JSON.stringify(this.listaParametro));
    this.listaParametro.forEach((el, i) => {
      let filt = listaDupl.filter(el2 => (el2.nomCampoBd == el.nomCampoBd));
      if (filt.length > 1) {
        el.error.push({ columna: 5, descripcion: 'Columna 5: El Nombre del Campo BD esta duplicado' });
      }
    });

    this.listaParametro.forEach((us, i) => {
      let req = new BDCampoTablaListarRequest();
      req.nomTabla = us.nomTablaBd;

      this.administracionBdService.listarCamposBD(req).subscribe(
        (out: OutResponse<BDCampoTablaListarResponse[]>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let filt2 = out.objeto.filter(el => (el.nomColumna == us.nomCampoBd));
            if (filt2.length == 0) {
              us.errorCampoBDExiste = true;
              us.error.push({ columna: 5, descripcion: 'Columna 5: El Campo BD ' + us.nomCampoBd + ' no existe en la tabla ' + us.nomTablaBd });
            }
          } else {
            us.errorCampoBDExiste = true;
            us.error.push({ columna: 5, descripcion: 'Columna 5: No fue posible validar el Campo BD, por favor intentelo nuevamente' });
          }

          this.cantValidNecesarioAct++;
          this.resumirYCargarTabla();
        }, error => {
          us.errorCampoBDExiste = true;
          us.error.push({ columna: 5, descripcion: 'Columna 5: No fue posible validar el Campo BD, por favor intentelo nuevamente' });

          this.cantValidNecesarioAct++;
          this.resumirYCargarTabla();
        }
      );
    });
  }

  validarForeignKey(): void {
    this.listaParametro.forEach((el, i) => {
      if (el.campoEsFk == 0) {
        if (el.campoIdmaestra && el.campoIdmaestra.length > 0) {
          el.error.push({ columna: 6, descripcion: 'Columna 6: El campo ID TABLA MAESTRA existe, sin embargo se marcó la bandera ES FOREIGN KEY como INACTIVO' });
        }
      }

      if (el.campoEsFk == 1) {
        if (!el.campoIdmaestra) {
          el.error.push({ columna: 6, descripcion: 'Columna 6: Se marcó la bandera ES FOREIGN KEY como ACTIVO, sin embargo el campo ID TABLA MAESTRA esta vacia' });
        }
      }
    });


    let req = new MaestraListarRequest();
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.maestraService.listarMaestra(req).subscribe(
      (out: OutResponse<MaestraListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.validateIdMaestra(out.objeto);
        } else {
          console.log(out.rmensaje);
          this.validateIdMaestra([]);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      },
      error => {
        console.log(error);
        this.validateIdMaestra([]);
        this._snackBar.open('Ocurrio un error al cargar las maestras de validacion', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validateIdMaestra(lista: MaestraListarResponse[]): void {
    if (lista.length > 0) {
      this.listaParametro.forEach((us, i) => {
        if (us.campoEsFk == 1) {
          let filt = lista.filter(el => (el.idTabla == us.campoIdmaestra));
          if (filt.length == 0) {
            us.error.push({ columna: 7, descripcion: 'Columna 7: El ID MAESTRA que ingreso no existe, por favor dirijase al menu Maestras y registrala' });
          }
        }
      });
    } else {
      this.listaParametro.forEach((us, i) => {
        us.error.push({ columna: 7, descripcion: 'Columna 7: No fue posible validar las ID MAESTRA, por favor intentelo mas tarde' });
      });
    }
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  resumirYCargarTabla(): void {
    let cont = 0;

    let posicionesError: number[] = [];
    this.listaParametro.forEach((el, i) => {
      if (el.error.length > 0) {
        cont++;
        posicionesError.push(i + 1);
      }
    });

    if (cont > 0) {
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
    this.cargarDatosTabla();

    if (this.cantValidNecesarioAct == this.cantValidNecesario) {
      this.spinner.hide();
    }
  }

  registrarArchivo(): void {
    if (this.listaParametro.length > 0) {
      this.stepper.next();
      this.flagSuccessMsg = true;
    } else {
      this._snackBar.open('La lista de parametros ingresada se encuentra vacia', null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
    }
  }

  anterior(): void {
    this.stepper.previous();
  }

  finalizar(): void {
    this.dialogRef.close(this.listaParametro);
  }

  verErrores(obj: EstructuraRegistrarParametroRequest): void {
    console.log(obj);
    const dialogRef = this.dialog.open(VerErrorComponent, {
      width: '400px',
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.CARGA_MASIVA_PARAM_ERRORES.TITLE,
        objeto: obj.error
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  agregarCampoBD(obj: EstructuraRegistrarParametroRequest): void {
    const dialogRef = this.dialog.open(RegCampoTablaBdRapidoComponent, {
      width: '600px',
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.REGISTRAR_CAMPO_BD_RAPIDO.TITLE(obj.nomTablaBd),
        objeto: obj
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  descargarPlantilla(): void {
    this.descargar = true;

    let req = new ReportePlantillaRequest();
    req.idPlantilla = PLANTILLAS.EXCEL.PARAMETRO_ESTRUCTURA;

    this.reporteService.descargarPlantilla(req).subscribe(
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
