import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTES, FILE, MAESTRAS, MENSAJES, MENSAJES_PANEL, PLANTILLAS } from 'src/app/common';
import readXlsxFile from 'read-excel-file';
import { FormService } from 'src/app/core/services/form.service';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { CentroAtencionCargaMasivaServicioRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-carga-masiva-servicio.request';
import { CentroAtencionService } from 'src/app/modules/intranet/services/centro-atencion.service';
import { CentroAtencionCargaMasivaServListarRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-carga-masiva-serv-listar.request';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { CentroAtencionCargaMasivaServListarResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-carga-masiva-serv-listar.response';
import { CentroAtencionCargaMasivaCentroListarRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-carga-masiva-centro-listar.request';
import { CentroAtencionCargaMasivaCentroListarResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-carga-masiva-centro-listar.response';
import { MaestraListarRequest } from 'src/app/modules/intranet/dto/request/maestra-listar.request';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { DateService } from 'src/app/core/services/date.service';
import { VerErrorComponent } from '../../../proceso/bdj-importacion-edne/ver-error/ver-error.component';
import { RecursosSeguridadService } from 'src/app/modules/intranet/services/recursos-seguridad.service';
import { RecursosSeguridadListarTipoDocumResponse } from 'src/app/modules/intranet/dto/response/recursos-seguridad-listar-tipo-docum.response';
import { CentroAtencionCargaMasivaDetalleRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-carga-masiva-detalle.request';
import { CentroAtencionCargaMasivaRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-carga-masiva.request';
import { HttpErrorResponse } from '@angular/common/http';
import { FileResponse } from 'src/app/modules/intranet/dto/response/file.response';
import { ReporteService } from 'src/app/modules/intranet/services/reporte.service';
import { ReportePlantillaRequest } from 'src/app/modules/intranet/dto/request/reporte-plantilla.request';

@Component({
  selector: 'app-carg-masiva-centro',
  templateUrl: './carg-masiva-centro.component.html',
  styleUrls: ['./carg-masiva-centro.component.scss']
})
export class CargMasivaCentroComponent implements OnInit {
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

  listaServicio: CentroAtencionCargaMasivaServListarResponse[] = [];
  listaCentroValid: CentroAtencionCargaMasivaCentroListarResponse[] = [];
  listaTipoCentro: MaestraSubitemListarResponse[] = [];
  listaSubtipoCentro: MaestraSubitemListarResponse[] = [];
  listaTipoDocumento: RecursosSeguridadListarTipoDocumResponse[] = [];

  listaCentro: CentroAtencionCargaMasivaDetalleRequest[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<CentroAtencionCargaMasivaDetalleRequest> = null;
  isLoading: boolean = false;
  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.codigo) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.nombre) ? `${m.nombre}` : ''
    }, {
      columnDef: 'idtTipoCentro',
      header: 'Cod. tipo centro',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.idtTipoCentro) ? `${m.idtTipoCentro}` : ''
    }, {
      columnDef: 'nomTipoCentro',
      header: 'Nom. tipo centro',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.nomTipoCentro) ? `${m.nomTipoCentro}` : ''
    }, {
      columnDef: 'idtSubtipoCentro',
      header: 'Cod. subtipo centro',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.idtSubtipoCentro) ? `${m.idtSubtipoCentro}` : ''
    }, {
      columnDef: 'nomSubtipoCentro',
      header: 'Nom. subtipo centro',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.nomSubtipoCentro) ? `${m.nomSubtipoCentro}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado centro',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.flgActivo) ? `${m.flgActivo}` : ''
    }, {
      columnDef: 'fechaCreacion',
      header: 'Fecha creacion',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.fechaCreacion) ? `${this.datePipe.transform(m.fechaCreacion, 'dd/MM/yyyy')}` : ''
    }, {
      columnDef: 'ubigeo',
      header: 'Ubigeo',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.ubigeo) ? `${m.ubigeo}` : ''
    }, {
      columnDef: 'departamento',
      header: 'Departamento',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.departamento) ? `${m.departamento}` : ''
    }, {
      columnDef: 'provincia',
      header: 'Provincia',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.provincia) ? `${m.provincia}` : ''
    }, {
      columnDef: 'distrito',
      header: 'Distrito',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.distrito) ? `${m.distrito}` : ''
    }, {
      columnDef: 'direccion',
      header: 'Direccion',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.direccion) ? `${(m.direccion.length > 106) ? m.direccion.substr(0, 106) + '...' : m.direccion}` : ''
    }, {
      columnDef: 'refDireccion',
      header: 'Ref. Direccion',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.refDireccion) ? `${(m.refDireccion.length > 106) ? m.refDireccion.substr(0, 106) + '...' : m.refDireccion}` : ''
    }, {
      columnDef: 'areaResid',
      header: 'Area residencia',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.areaResid) ? `${(m.areaResid.length > 106) ? m.areaResid.substr(0, 106) + '...' : m.areaResid}` : ''
    }, {
      columnDef: 'flgTieneTelef',
      header: '¿Tiene telefono?',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.flgTieneTelef) ? `${m.flgTieneTelef}` : ''
    }, {
      columnDef: 'flgTieneLuz',
      header: '¿Tiene luz?',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.flgTieneLuz) ? `${m.flgTieneLuz}` : ''
    }, {
      columnDef: 'flgTieneAgua',
      header: '¿Tiene agua?',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.flgTieneAgua) ? `${m.flgTieneAgua}` : ''
    }, {
      columnDef: 'flgTieneDesague',
      header: '¿Tiene desague?',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.flgTieneDesague) ? `${m.flgTieneDesague}` : ''
    }, {
      columnDef: 'capacidadMaxima',
      header: 'Capacidad maxima',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.capacidadMaxima) ? `${m.capacidadMaxima}` : ''
    }, {
      columnDef: 'idTipDocRepres',
      header: 'Tipo documento representante',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.idTipDocRepres) ? `${m.idTipDocRepres}` : ''
    }, {
      columnDef: 'nroDocRepres',
      header: 'Nro documento representante',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.nroDocRepres) ? `${m.nroDocRepres}` : ''
    }, {
      columnDef: 'nombreRepres',
      header: 'Nombre representante',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.nombreRepres) ? `${m.nombreRepres}` : ''
    }, {
      columnDef: 'apePaternoRepres',
      header: 'Apellido paterno representante',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.apePaternoRepres) ? `${m.apePaternoRepres}` : ''
    }, {
      columnDef: 'apeMaternoRepres',
      header: 'Apellido materno representante',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.apeMaternoRepres) ? `${m.apeMaternoRepres}` : ''
    }, {
      columnDef: 'nroTelefono',
      header: 'Nro telefono',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.nroTelefono) ? `${m.nroTelefono}` : ''
    }, {
      columnDef: 'tipoCoordenada',
      header: 'Tipo coordenada',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.tipoCoordenada) ? `${m.tipoCoordenada}` : ''
    }, {
      columnDef: 'coordenadaX',
      header: 'Coordenada X',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.coordenadaX) ? `${m.coordenadaX}` : ''
    }, {
      columnDef: 'coordenadaY',
      header: 'Coordenada Y',
      cell: (m: CentroAtencionCargaMasivaDetalleRequest) => (m.coordenadaY) ? `${m.coordenadaY}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CargMasivaCentroComponent>,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private dateService: DateService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(CentroAtencionService) private centroAtencionService: CentroAtencionService,
    @Inject(RecursosSeguridadService) private recursosSeguridadService: RecursosSeguridadService,
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
    this.displayedColumns.unshift('servicios');
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  public cargarDatosTabla(): void {
    if (this.listaCentro.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaCentro);
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
      this.listaCentro = [];
      this.stepper.next();
      this.spinner.show();

      readXlsxFile(this.fileupload).then((rows: any[]) => {
        rows.forEach((el, i) => {
          if (i > 1) {
            let obj = new CentroAtencionCargaMasivaDetalleRequest();
            // CELDA 1 => SERVICIOS
            let servicios = (el[0]) ? ((el[0] + '').split(',')) : [];
            obj.listaServicio = [];
            if (servicios.length > 0) {
              servicios.forEach((el: string) => {
                let ser = new CentroAtencionCargaMasivaServicioRequest();
                ser.codServicio = el.trim();

                obj.listaServicio.push(ser);
              });
            }
            // FIN CELDA 1 => SERVICIOS

            obj.codigo = (el[1]) ? (el[1] + '') : el[1];
            obj.nombre = (el[2]) ? (el[2] + '') : el[2];
            obj.idtTipoCentro = (el[3]) ? (el[3] + '') : el[3];
            obj.nomTipoCentro = (el[4]) ? (el[4] + '') : el[4];
            obj.idtSubtipoCentro = (el[5]) ? (el[5] + '') : el[5];
            obj.nomSubtipoCentro = (el[6]) ? (el[6] + '') : el[6];
            obj.flgActivo = (el[7]) ? (parseInt(el[7] + '')) : el[7];
            obj.fechaCreacion = el[8];
            obj.ubigeo = (el[9]) ? (el[9] + '') : el[9];
            obj.departamento = (el[10]) ? (el[10] + '') : el[10];
            obj.provincia = (el[11]) ? (el[11] + '') : el[11];
            obj.distrito = (el[12]) ? (el[12] + '') : el[12];
            obj.direccion = (el[13]) ? (el[13] + '') : el[13];
            obj.refDireccion = (el[14]) ? (el[14] + '') : el[14];
            obj.areaResid = (el[15]) ? (el[15] + '') : el[15];
            obj.flgTieneTelef = (el[16]) ? (parseInt(el[16] + '')) : el[16];
            obj.flgTieneLuz = (el[17]) ? (parseInt(el[17] + '')) : el[17];
            obj.flgTieneAgua = (el[18]) ? (parseInt(el[18] + '')) : el[18];
            obj.flgTieneDesague = (el[19]) ? (parseInt(el[19] + '')) : el[19];
            obj.capacidadMaxima = (el[20]) ? (parseInt(el[20] + '')) : el[20];
            obj.idTipDocRepres = (el[21]) ? (parseInt(el[21] + '')) : el[21];
            obj.nroDocRepres = (el[22]) ? (el[22] + '') : el[22];
            obj.nombreRepres = (el[23]) ? (el[23] + '') : el[23];
            obj.apePaternoRepres = (el[24]) ? (el[24] + '') : el[24];
            obj.apeMaternoRepres = (el[25]) ? (el[25] + '') : el[25];
            obj.nroTelefono = (el[26]) ? (el[26] + '') : el[26];
            obj.tipoCoordenada = (el[27]) ? (el[27] + '') : el[27];
            obj.coordenadaX = (el[28]) ? (el[28] + '') : el[28];
            obj.coordenadaY = (el[29]) ? (el[29] + '') : el[29];
            obj.error = [];
            this.listaCentro.push(obj);
          }
        });
        this.validarListaProducto(this.listaCentro);
      });
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  validarListaProducto(lista: CentroAtencionCargaMasivaDetalleRequest[]): void {
    // VALIDACION DE TIPO
    this.cantValidNecesario = 5;
    this.cantValidNecesarioAct = 0;
    this.paso2Completado = false;

    this.validarServicios();
    this.validarCodigo();
    this.validarNombre();
    this.validarCodTipoCentro();
    this.validarCodSubtipoCentro();
    this.validarEstadoCentro();
    this.validarFechaCreacionCentro();
    this.validarUbigeo();
    this.validarDireccion();
    this.validarRefDireccion();
    this.validarAreaResidencia();
    this.validarFlgTelefono();
    this.validarFlgLuz();
    this.validarFlgAgua();
    this.validarFlgDesague();
    this.validarCapacidadMax();
    this.validarTipDocRepresentante();
    this.validarNroDocRepresentante();
    this.validarNomRepresentante();
    this.validarApePatRepresentante();
    this.validarApeMatRepresentante();
    this.validarNroTelefono();
    this.validarTipoCoordenada();
    this.validarCoordenadaX();
    this.validarCoordenadaY();
  }

  validarServicios(): void {
    let pattern = /^(\w)*$/;

    let listaServ: string[] = [];
    this.listaCentro.forEach((el, i) => {
      el.listaServicio.forEach(s => {
        listaServ.push(s.codServicio);
        if (!pattern.test(s.codServicio.toUpperCase())) {
          el.error.push({ columna: 1, descripcion: "Columna 1: El codigo del servicio solo puede contener caracteres alfanumericos y subguion, actual: " + s.codServicio });
        }
      });
    });

    let req = new CentroAtencionCargaMasivaServListarRequest();
    req.listaServicio = [...new Set(listaServ)];
    this.centroAtencionService.listarServicio(req).subscribe(
      (out: OutResponse<CentroAtencionCargaMasivaServListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicio = out.objeto;
          this.validateServicios(this.listaServicio);
        } else {
          this.listaServicio = [];
          this.validateServicios(this.listaServicio);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      }, error => {
        this.validateServicios([]);
        this._snackBar.open('Ocurrio un error al cargar los servicios', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validateServicios(listaServicio: CentroAtencionCargaMasivaServListarResponse[]): void {
    this.listaCentro.forEach((el, i) => {
      el.listaServicio.forEach(s => {
        let filServ = listaServicio.filter(ser => (ser.codServicio == s.codServicio));
        if (filServ.length > 0) {
          s.idServicio = filServ[0].idServicio;
        } else {
          el.error.push({ columna: 1, descripcion: "Columna 1: El codigo de servicio: " + s.codServicio + " no esta registrado" });
        }
      });
    });
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  validarCodigo(): void {
    let pattern = /^(\w)*$/;

    let listaCentr: string[] = [];
    let listaCentroDupl: CentroAtencionCargaMasivaDetalleRequest[] = JSON.parse(JSON.stringify(this.listaCentro));
    this.listaCentro.forEach((el, i) => {
      if (el.codigo) {
        listaCentr.push(el.codigo);
        if (!pattern.test(el.codigo.toUpperCase())) {
          el.error.push({ columna: 2, descripcion: "Columna 2: El codigo del centro solo puede contener caracteres alfanumericos y subguion, actual: " + el.codigo });
        }
      } else {
        el.error.push({ columna: 2, descripcion: "Columna 2: El codigo del centro no puede ser vacio" });
      }

      let filt = listaCentroDupl.filter(el2 => (el2.codigo == el.codigo));
      if (filt.length > 1) {
        el.error.push({ columna: 2, descripcion: 'Columna 2: El codigo del centro esta duplicado' });
      }
    });

    let req = new CentroAtencionCargaMasivaCentroListarRequest();
    req.listaCentro = [...new Set(listaCentr)];
    this.centroAtencionService.listarCentro(req).subscribe(
      (out: OutResponse<CentroAtencionCargaMasivaCentroListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaCentroValid = out.objeto;
          this.validateCentros(this.listaCentroValid);
        } else {
          this.listaCentroValid = [];
          this.validateCentros(this.listaCentroValid);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      }, error => {
        this.validateCentros([]);
        this._snackBar.open('Ocurrio un error al cargar los centros para validar', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validateCentros(listaServicio: CentroAtencionCargaMasivaCentroListarResponse[]): void {
    this.listaCentro.forEach((el, i) => {
      let filCent = listaServicio.filter(ce => (ce.codCentroAtencion == el.codigo));
      if (filCent.length > 0) {
        el.error.push({ columna: 2, descripcion: "Columna 2: El centro con el codigo: " + el.codigo + ", ya existe" });
      }
    });
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  validarNombre(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.nombre) {
        if (el.nombre.length > 250) {
          el.error.push({ columna: 3, descripcion: 'Columna 3: El nombre del Centro debe tener 250 caracteres como maximo' });
        }
        if (!pattern.test(el.nombre.toUpperCase())) {
          el.error.push({ columna: 3, descripcion: "Columna 3: El nombre del Centro no debe tener el caracter ( ' )" });
        }

        let salto = el.nombre.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 3, descripcion: 'Columna 3: El nombre del Centro no puede contener saltos de linea' });
        }
      } else {
        el.error.push({ columna: 3, descripcion: 'Columna 3: El nombre del Centro no puede ser vacio' });
      }
    });
    this.resumirYCargarTabla();
  }

  validarCodTipoCentro(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_CENTRO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoCentro = out.objeto;
          this.validateTipoCentro(this.listaTipoCentro);
        } else {
          this.listaTipoCentro = [];
          this.validateTipoCentro(this.listaTipoCentro);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      }, error => {
        this.validateTipoCentro([]);
        this._snackBar.open('Ocurrio un error al cargar los tipos de centro para validar', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validateTipoCentro(listaTipoCentro: MaestraSubitemListarResponse[]): void {
    this.listaCentro.forEach((el, i) => {
      if (el.idtTipoCentro) {
        let filTipCent = listaTipoCentro.filter(tc => (tc.codigo == el.idtTipoCentro));
        if (filTipCent.length == 0) {
          el.error.push({ columna: 4, descripcion: "Columna 4: El Tipo de centro con el codigo: " + el.idtTipoCentro + ", no existe" });
        }
      } else {
        el.error.push({ columna: 4, descripcion: "Columna 4: El Tipo de centro no puede ser vacio" });
      }
    });
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  validarCodSubtipoCentro(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.SUBTIPO_CENTRO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaSubtipoCentro = out.objeto;
          this.validatesubtipoCentro(this.listaSubtipoCentro);
        } else {
          this.listaSubtipoCentro = [];
          this.validatesubtipoCentro(this.listaSubtipoCentro);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      }, error => {
        this.validatesubtipoCentro([]);
        this._snackBar.open('Ocurrio un error al cargar los subtipos de centro para validar', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validatesubtipoCentro(listaSubtipoCentro: MaestraSubitemListarResponse[]): void {
    this.listaCentro.forEach((el, i) => {
      if (el.idtTipoCentro) {
        if (el.idtSubtipoCentro) {
          let filTipCent = listaSubtipoCentro.filter(tc => (tc.codigo == el.idtSubtipoCentro));
          if (filTipCent.length == 0) {
            el.error.push({ columna: 6, descripcion: "Columna 6: El Subtipo de Centro con el codigo: " + el.idtSubtipoCentro + ", no existe" });
          } else {
            let codSubTipoCentro = filTipCent[0].codigo.substr(0, el.idtTipoCentro.length);
            if (codSubTipoCentro != el.idtTipoCentro) {
              el.error.push({ columna: 6, descripcion: "Columna 6: El Codigo del Subtipo de Centro '" + el.idtSubtipoCentro + "', no guarda relacion con el codigo del Tipo de Centro '" + el.idtTipoCentro + "'" });
            }
          }
        }
      } else {
        if (el.idtSubtipoCentro) {
          el.error.push({ columna: 6, descripcion: "Columna 6: No se puede validar un Subtipo de Centro, sin haber ingresado el Tipo de Centro" });
        }
      }
    });
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  validarEstadoCentro(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.flgActivo) {
        if (!(el.flgActivo == 0 || el.flgActivo == 1)) {
          el.error.push({ columna: 6, descripcion: "Columna 6: El estado del Centro de atencion solo pueden ser 1 o 0" });
        }
      } else {
        el.error.push({ columna: 6, descripcion: "Columna 6: El estado del Centro de atencion no puede ser vacio" });
      }
    });
    this.resumirYCargarTabla();
  }

  validarFechaCreacionCentro(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.fechaCreacion) {
        if (!(el.fechaCreacion instanceof Date)) {
          if (typeof el.fechaCreacion == 'string') {
            let pattern = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
            if (!pattern.test(el.fechaCreacion)) {
              el.error.push({ columna: 7, descripcion: 'Columna 7: El formato de fecha es incorrecto ' });
            } else {
              el.fechaCreacion = this.dateService.parseSlashDDMMYYYY(el.fechaCreacion);
            }
          } else {
            el.error.push({ columna: 7, descripcion: "Columna 7: El formato de fecha es incorrecto" });
          }
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarUbigeo(): void {
    let pattern = /^[0-9]{2,6}$/;
    this.listaCentro.forEach((el, i) => {
      if (el.ubigeo) {
        if (!pattern.test(el.ubigeo.toUpperCase())) {
          el.error.push({ columna: 8, descripcion: "Columna 8: El formato del ubigeo es incorrecto, actual: " + el.ubigeo });
        }
      }
    });
  }

  validarDireccion(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.direccion) {
        if (el.direccion.length > 250) {
          el.error.push({ columna: 12, descripcion: 'Columna 12: La direccion debe tener 250 caracteres como maximo' });
        }
        if (!pattern.test(el.direccion.toUpperCase())) {
          el.error.push({ columna: 12, descripcion: "Columna 12: La direccion no debe contener el caracter ( ' )" });
        }

        let salto = el.direccion.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 12, descripcion: 'Columna 12: La direccion no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarRefDireccion(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.refDireccion) {
        if (el.refDireccion.length > 250) {
          el.error.push({ columna: 13, descripcion: 'Columna 13: La referencia de direccion debe tener 250 caracteres como maximo' });
        }
        if (!pattern.test(el.refDireccion.toUpperCase())) {
          el.error.push({ columna: 13, descripcion: "Columna 13: La referencia de direccion no debe contener el caracter ( ' )" });
        }

        let salto = el.refDireccion.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 13, descripcion: 'Columna 13: La referencia de direccion no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarAreaResidencia(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.areaResid) {
        if (el.areaResid.length > 250) {
          el.error.push({ columna: 14, descripcion: 'Columna 14: El area de residencia debe tener 250 caracteres como maximo' });
        }
        if (!pattern.test(el.areaResid.toUpperCase())) {
          el.error.push({ columna: 14, descripcion: "Columna 14: El area de residencia no debe contener el caracter ( ' )" });
        }

        let salto = el.areaResid.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 14, descripcion: 'Columna 13: El area de residencia no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarFlgTelefono(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.flgTieneTelef) {
        if (!(el.flgTieneTelef == 0 || el.flgTieneTelef == 1)) {
          el.error.push({ columna: 15, descripcion: "Columna 15: La bandera tiene telefono, solo pueden ser 1 o 0" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarFlgLuz(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.flgTieneLuz) {
        if (!(el.flgTieneLuz == 0 || el.flgTieneLuz == 1)) {
          el.error.push({ columna: 16, descripcion: "Columna 16: La bandera tiene luz, solo pueden ser 1 o 0" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarFlgAgua(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.flgTieneAgua) {
        if (!(el.flgTieneAgua == 0 || el.flgTieneAgua == 1)) {
          el.error.push({ columna: 17, descripcion: "Columna 17: La bandera tiene agua, solo pueden ser 1 o 0" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarFlgDesague(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.flgTieneDesague) {
        if (!(el.flgTieneDesague == 0 || el.flgTieneDesague == 1)) {
          el.error.push({ columna: 18, descripcion: "Columna 18: La bandera tiene desague, solo pueden ser 1 o 0" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarCapacidadMax(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.capacidadMaxima) {
        if (typeof el.capacidadMaxima != 'number') {
          el.error.push({ columna: 19, descripcion: "Columna 19: EL formato del campo Capacidad Maxima debe ser numerico" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarTipDocRepresentante(): void {
    this.recursosSeguridadService.listarTipoDocumento().subscribe(
      (out: OutResponse<RecursosSeguridadListarTipoDocumResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoDocumento = out.objeto;
          this.validateTipoDocumento(this.listaTipoDocumento);
        } else {
          this.listaTipoDocumento = [];
          this.validateTipoDocumento(this.listaTipoDocumento);
          this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      }, error => {
        this.validateTipoDocumento([]);
        this._snackBar.open('Ocurrio un error al cargar los tipos de centro para validar', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    );
  }

  validateTipoDocumento(listaTipoDocumento: RecursosSeguridadListarTipoDocumResponse[]): void {
    this.listaCentro.forEach((el, i) => {
      if (el.idTipDocRepres) {
        let filTipCent = listaTipoDocumento.filter(td => (td.idTipoDocumento == el.idTipDocRepres));
        if (filTipCent.length == 0) {
          el.error.push({ columna: 20, descripcion: "Columna 20: El Tipo de documento ingresado, no existe" });
        }
      }
    });
    this.cantValidNecesarioAct++;
    this.resumirYCargarTabla();
  }

  validarNroDocRepresentante(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.nroDocRepres) {
        let pattern = /^[0-9]*$/;
        if (!pattern.test(el.nroDocRepres.toUpperCase())) {
          el.error.push({ columna: 21, descripcion: "Columna 21: El numero de documento solo puede tener numeros" });
        }
      }
    });
    this.resumirYCargarTabla();
  }


  validarNomRepresentante(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.nombreRepres) {
        if (el.nombreRepres.length > 100) {
          el.error.push({ columna: 22, descripcion: 'Columna 22: El Nombre de representante debe tener 100 caracteres como maximo' });
        }
        if (!pattern.test(el.nombreRepres.toUpperCase())) {
          el.error.push({ columna: 22, descripcion: "Columna 22: El Nombre de representante no debe contener el caracter ( ' )" });
        }

        let salto = el.nombreRepres.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 22, descripcion: 'Columna 22: El Nombre de representante no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarApePatRepresentante(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.apePaternoRepres) {
        if (el.apePaternoRepres.length > 100) {
          el.error.push({ columna: 23, descripcion: 'Columna 23: El Apellido paterno de representante debe tener 100 caracteres como maximo' });
        }
        if (!pattern.test(el.apePaternoRepres.toUpperCase())) {
          el.error.push({ columna: 23, descripcion: "Columna 23: El Apellido paterno no debe contener el caracter ( ' )" });
        }

        let salto = el.apePaternoRepres.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 23, descripcion: 'Columna 23: El Apellido paterno no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarApeMatRepresentante(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.apeMaternoRepres) {
        if (el.apeMaternoRepres.length > 100) {
          el.error.push({ columna: 24, descripcion: 'Columna 24: El Apellido materno debe tener 100 caracteres como maximo' });
        }
        if (!pattern.test(el.apeMaternoRepres.toUpperCase())) {
          el.error.push({ columna: 24, descripcion: "Columna 24: El Apellido materno no debe contener el caracter ( ' )" });
        }

        let salto = el.apeMaternoRepres.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 24, descripcion: 'Columna 24: El Apellido materno no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarNroTelefono(): void {
    this.listaCentro.forEach((el, i) => {
      if (el.nroTelefono) {
        let pattern = /^[0-9]*$/;
        if (!pattern.test(el.nroTelefono.toUpperCase())) {
          el.error.push({ columna: 25, descripcion: "Columna 25: El numero de telefono solo puede tener numeros" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarTipoCoordenada(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[^']*$/;
      if (el.tipoCoordenada) {
        if (el.tipoCoordenada.length > 100) {
          el.error.push({ columna: 26, descripcion: 'Columna 26: El Tipo coordenada debe tener 50 caracteres como maximo' });
        }
        if (!pattern.test(el.tipoCoordenada.toUpperCase())) {
          el.error.push({ columna: 26, descripcion: "Columna 26: El Tipo coordenada no debe contener el caracter ( ' )" });
        }

        let salto = el.tipoCoordenada.match(/[^\r\n]+/g);
        if (salto.length > 1) {
          el.error.push({ columna: 26, descripcion: 'Columna 26: El Tipo coordenada no puede contener saltos de linea' });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarCoordenadaX(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[+-]{0,1}[0-9]*[.]*[0-9]*$/;
      if (el.coordenadaX) {
        if (!pattern.test(el.coordenadaX.toUpperCase())) {
          el.error.push({ columna: 27, descripcion: "Columna 27: El formato del campo Coordenada X es incorrecta" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  validarCoordenadaY(): void {
    this.listaCentro.forEach((el, i) => {
      let pattern = /^[+-]{0,1}[0-9]*[.]*[0-9]*$/;
      if (el.coordenadaY) {
        if (!pattern.test(el.coordenadaY.toUpperCase())) {
          el.error.push({ columna: 28, descripcion: "Columna 28: El formato del campo Coordenada Y es incorrecta" });
        }
      }
    });
    this.resumirYCargarTabla();
  }

  resumirYCargarTabla(): void {
    let cont = 0;

    let posicionesError: number[] = [];
    this.listaCentro.forEach((el, i) => {
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
    if (this.listaCentro.length > 0) {
      this.stepper.next();
      this.spinner.show();

      let req = new CentroAtencionCargaMasivaRequest();
      req.listaCentro = this.listaCentro;
      req.idUsuarioCrea = this.user.idUsuario;

      this.centroAtencionService.cargaMasivaCentro(req).subscribe(
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
      this._snackBar.open('La lista de Centros de Atencion ingresada se encuentra vacia', null, { duration: 8000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
    }
  }

  anterior(): void {
    this.stepper.previous();
  }

  finalizar(): void {
    this.dialogRef.close(1);
  }

  verErrores(obj: CentroAtencionCargaMasivaDetalleRequest): void {
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
    req.idPlantilla = PLANTILLAS.EXCEL.CENTRO_ATENCION;

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
