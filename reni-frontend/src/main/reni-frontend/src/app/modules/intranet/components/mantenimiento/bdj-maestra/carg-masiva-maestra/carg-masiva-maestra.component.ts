import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTES, FILE, MENSAJES, MENSAJES_PANEL, PLANTILLAS } from 'src/app/common';
import readXlsxFile from 'read-excel-file';
import { FormService } from 'src/app/core/services/form.service';
import { MaestraCargaMasivaDetalleRequest } from 'src/app/modules/intranet/dto/request/maestra-carga-masiva-detalle.request';
import { MaestraListarResponse } from 'src/app/modules/intranet/dto/response/maestra-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { MaestraCargaMasivaListarMaeRequest } from 'src/app/modules/intranet/dto/request/maestra-carga-masiva-listar-mae.request';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { MaestraCargaMasivaListarMaeResponse } from 'src/app/modules/intranet/dto/response/maestra-carga-masiva-listar-mae.response';
import { MaestraCargaMasivaRequest } from 'src/app/modules/intranet/dto/request/maestra-carga-masiva.request';
import { HttpErrorResponse } from '@angular/common/http';
import { VerErrorComponent } from '../../../proceso/bdj-importacion-edne/ver-error/ver-error.component';
import { ReporteService } from 'src/app/modules/intranet/services/reporte.service';
import { ReportePlantillaRequest } from 'src/app/modules/intranet/dto/request/reporte-plantilla.request';
import { FileResponse } from 'src/app/modules/intranet/dto/response/file.response';

@Component({
  selector: 'app-carg-masiva-maestra',
  templateUrl: './carg-masiva-maestra.component.html',
  styleUrls: ['./carg-masiva-maestra.component.scss']
})
export class CargMasivaMaestraComponent implements OnInit {
  isLinear: boolean = false;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

  flagSuccessMsg: boolean = false;
  flagErrorMsg: boolean = false;
  errorMsg: string = '';

  descargar: boolean = false;

  filasError: string = '';

  listaMae: string[] = [];

  cantValidNecesario: number = 0;
  cantValidNecesarioAct: number = 0;

  paso2Completado: boolean = true;

  fileupload: any;

  formularioGrp: FormGroup;
  formErrors: any;

  listaMaestrasValid: MaestraCargaMasivaListarMaeResponse[] = [];

  listaMaestra: MaestraCargaMasivaDetalleRequest[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<MaestraCargaMasivaDetalleRequest> = null;
  isLoading: boolean = false;
  columnsGrilla = [
    {
      columnDef: 'idTabla',
      header: 'Id tabla',
      cell: (m: MaestraCargaMasivaDetalleRequest) => (m.idTabla) ? `${m.idTabla}` : ''
    }, {
      columnDef: 'numOrden',
      header: 'Numero Orden',
      cell: (m: MaestraCargaMasivaDetalleRequest) => (m.numOrden != null) ? `${m.numOrden}` : ''
    }, {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: MaestraCargaMasivaDetalleRequest) => (m.codigo) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: MaestraCargaMasivaDetalleRequest) => (m.nombre) ? `${m.nombre}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (m: MaestraCargaMasivaDetalleRequest) => (m.descripcion) ? `${m.descripcion}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CargMasivaMaestraComponent>,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(ReporteService) private reporteService: ReporteService,
    @Inject(UsuarioService) private user: UsuarioService,
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
      this.listaMaestra = [];
      this.listaMae = [];
      this.stepper.next();
      this.spinner.show();

      readXlsxFile(this.fileupload).then((rows: any[]) => {
        rows.forEach((el, i) => {
          if (i > 1) {
            let obj = new MaestraCargaMasivaDetalleRequest();
            // CELDA 1 => SERVICIOS
            obj.idTabla = (el[0]) ? (el[0] + '') : el[0];
            obj.numOrden = (el[1]) ? (parseInt(el[1] + '')) : el[1];
            obj.codigo = (el[2]) ? (el[2] + '') : el[2];
            obj.nombre = (el[3]) ? (el[3] + '') : el[3];
            obj.descripcion = (el[4]) ? (el[4] + '') : el[4];
            obj.error = [];
            this.listaMaestra.push(obj);
          }
        });
        // console.log(this.listaMaestra);
        this.validarListaProducto(this.listaMaestra);
      });
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  validarListaProducto(lista: MaestraCargaMasivaDetalleRequest[]): void {
    // VALIDACION DE TIPO
    this.cantValidNecesario = 1;
    this.cantValidNecesarioAct = 0;
    this.paso2Completado = false;

    this.validarIdTabla();
    this.validarNumOrden();
    this.validarCodigo();
    this.validarNombre();
    this.validarDescripcion();
  }

  validarIdTabla(): void {
    let pattern = /^(\w)*$/;

    this.listaMae = [];
    this.listaMaestra.forEach((el, i) => {
      this.listaMae.push(el.idTabla);
      if (!pattern.test(el.idTabla.toUpperCase())) {
        el.error.push({ columna: 1, descripcion: "Columna 1: El campo Id Tabla solo puede contener caracteres alfanumericos y subguion, actual: " + el.idTabla });
      }
    });

    this.listaMae = [...new Set(this.listaMae)];

    let req = new MaestraCargaMasivaListarMaeRequest();
    req.listaMaestra = this.listaMae;
    this.maestraService.listarMaestraCargaMasiva(req).subscribe(
      (out: OutResponse<MaestraCargaMasivaListarMaeResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaMaestrasValid = out.objeto;
          this.validateMaestras(this.listaMaestrasValid);
        } else {
          this.listaMaestrasValid = [];
          this.validateMaestras(this.listaMaestrasValid);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      }, error => {
        this.validateMaestras([]);
        this._snackBar.open('Ocurrio un error al cargar los servicios', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validateMaestras(listaMaestra: MaestraCargaMasivaListarMaeResponse[]): void {
    this.listaMaestra.forEach((el, i) => {
      let filServ = listaMaestra.filter(ma => (ma.idTabla == el.idTabla));
      if (filServ.length > 0) {
        el.error.push({ columna: 1, descripcion: "Columna 1: El campo Id Tabla ya existe" });
      }
    });
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  validarNumOrden(): void {
    this.listaMae.forEach(m => {
      let listaMaestraFil = this.listaMaestra.filter(el => (el.idTabla == m));

      let contPrincipal = 0;
      listaMaestraFil.forEach(mae => {
        if (mae.numOrden == 0) {
          contPrincipal++;
        }
      });
      if (contPrincipal != 1) {
        listaMaestraFil.forEach(mae => {
          mae.error.push({ columna: 2, descripcion: "Columna 2: Se encontro " + contPrincipal + " registros para la maestra principal (la maestra principal debe tener el Numero de Orden '0')" });
        });
      }

      let listaMaestraFilDupl: MaestraCargaMasivaDetalleRequest[] = JSON.parse(JSON.stringify(listaMaestraFil));
      listaMaestraFil.forEach(mae => {
        let filRep = listaMaestraFilDupl.filter(mae2 => (mae.numOrden == mae2.numOrden));
        if (filRep.length > 1) {
          mae.error.push({ columna: 2, descripcion: "Columna 2: El campo Orden esta repetido para la maestra: " + mae.idTabla });
        }
      });
    });
    this.resumirYCargarTabla();
  }

  validarCodigo(): void {
    this.listaMae.forEach(m => {
      let listaMaestraFil = this.listaMaestra.filter(el => (el.idTabla == m));

      let listaMaestraFilDupl: MaestraCargaMasivaDetalleRequest[] = JSON.parse(JSON.stringify(listaMaestraFil));
      listaMaestraFil.forEach(mae => {
        let filRep = listaMaestraFilDupl.filter(mae2 => (mae.codigo == mae2.codigo));
        if (filRep.length > 1) {
          mae.error.push({ columna: 3, descripcion: "Columna 3: El campo Codigo esta repetido para la maestra: " + mae.idTabla });
        }
      });
    });
    this.resumirYCargarTabla();
  }

  validarNombre(): void {
    this.listaMaestra.forEach((el, i) => {
      let pattern = /^((?!').)*$/;
      if (el.nombre) {
        if (el.nombre.length > 250) {
          el.error.push({ columna: 4, descripcion: 'Columna 4: El Nombre de la maestra debe tener 250 caracteres como maximo' });
        }
        if (!pattern.test(el.nombre.toUpperCase())) {
          el.error.push({ columna: 4, descripcion: "Columna 4: El Nombre de la maestra no debe tener el caracter ( ' )" });
        }

        var nombreTrans = el.nombre.match(/[^\r\n]+/g);
        if (nombreTrans.length > 1) {
          el.error.push({ columna: 4, descripcion: 'Columna 4: El Nombre de la maestra no puede contener saltos de linea' });
        }
      } else {
        el.error.push({ columna: 4, descripcion: 'Columna 4: El Nombre de la maestra no puede ser vacio' });
      }
    });
    this.resumirYCargarTabla();
  }

  validarDescripcion(): void {
    this.listaMaestra.forEach((el, i) => {
      let pattern = /^((?!').)*$/;
      if (el.descripcion) {
        if (el.descripcion.length > 500) {
          el.error.push({ columna: 5, descripcion: 'Columna 5: La descripcion  de la maestra debe tener 500 caracteres como maximo' });
        }
        if (!pattern.test(el.descripcion.toUpperCase())) {
          el.error.push({ columna: 5, descripcion: "Columna 5: La descripcion de la maestra no debe tener el caracter ( ' )" });
        }

        var descripcionTrans = el.descripcion.match(/[^\r\n]+/g);
        if (descripcionTrans.length > 1) {
          el.error.push({ columna: 5, descripcion: 'Columna 5: El Nombre de la maestra no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  resumirYCargarTabla(): void {
    let cont = 0;

    let posicionesError: number[] = [];
    this.listaMaestra.forEach((el, i) => {
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
    if (this.listaMaestra.length > 0) {
      this.stepper.next();
      this.spinner.show();

      let req = new MaestraCargaMasivaRequest();
      req.listaMaestra = this.listaMaestra;
      req.listaMaestraIds = this.listaMae;
      req.idUsuarioCrea = this.user.idUsuario;

      this.maestraService.cargaMasivaMaestras(req).subscribe(
        (data: OutResponse<any>) => {
          if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.flagSuccessMsg = true;
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
      this._snackBar.open('La lista de Maestras ingresada se encuentra vacia', null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
    }
  }

  anterior(): void {
    this.stepper.previous();
  }

  finalizar(): void {
    this.dialogRef.close(1);
  }

  verErrores(obj: MaestraCargaMasivaDetalleRequest): void {
    console.log(obj);
    const dialogRef = this.dialog.open(VerErrorComponent, {
      width: '400px',
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.CENTRO_ATENCION.CARGA_MASIVA_PARAM_ERRORES.TITLE,
        objeto: obj.error
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  descargarPlantilla(): void {
    this.descargar = true;

    let req = new ReportePlantillaRequest();
    req.idPlantilla = PLANTILLAS.EXCEL.MAESTRA;

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
