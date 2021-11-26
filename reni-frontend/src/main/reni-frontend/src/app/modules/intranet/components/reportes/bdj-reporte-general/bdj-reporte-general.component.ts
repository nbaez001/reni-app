import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { CAMPOS_EXCEL, CAMPOS_EXCLUIR_DISOCIACION, CAMPOS_INCLUIR_DISOCIACION, CAMPO_EXCEL_FIJOS, CONSTANTES, MENSAJES, TABLAS_BD } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ReporteParametroEstrucListarRequest } from '../../../dto/request/reporte-parametro-estruc-listar.request';
import { ReporteIntervencionListarEstructuraPermitidoRequest } from '../../../dto/request/reporte-intervencion-listar-estructura-permitido.request';
import { CentroAtencionListarResponse } from '../../../dto/response/centro-atencion-listar.response';
import { EntidadListarResponse } from '../../../dto/response/entidad-listar.response';
import { EstructuraListarResponse } from '../../../dto/response/estructura-listar.response';
import { FileResponse } from '../../../dto/response/file.response';
import { LineaIntervencionListarResponse } from '../../../dto/response/linea-intervencion-listar.response';
import { ReporteParametroEstrucListarResponse } from '../../../dto/response/reporte-parametro-estruc-listar.response';
import { ServicioListarResponse } from '../../../dto/response/servicio-listar.response';
import { CuentaSistemaService } from '../../../services/cuenta-sistema.service';
import { EntidadService } from '../../../services/entidad.service';
import { EstructuraService } from '../../../services/estructura.service';
import { LineaIntervencionService } from '../../../services/linea-intervencion.service';
import { ReporteService } from '../../../services/reporte.service';
import { ServicioService } from '../../../services/servicio.service';
import { ReporteIntervencionListarEstructuraPermitidoResponse } from '../../../dto/response/reporte-intervencion-listar-estructura-permitido.response';
import { ReporteIntervencionListarServicioPermitidoRequest } from '../../../dto/request/reporte-intervencion-listar-servicio-permitido.request';
import { ReporteIntervencionListarEntidadPermitidoRequest } from '../../../dto/request/reporte-intervencion-listar-entidad-permitido.request';
import { ReporteIntervencionListarLineaInterPermitidoRequest } from '../../../dto/request/reporte-intervencion-listar-linea-inter-permitido.request';
import { ReporteIntervencionListarDetRequest } from '../../../dto/request/reporte-intervencion-listar-det.request';
import { ReporteIntervencionListarRequest } from '../../../dto/request/reporte-intervencion-listar.request';
import { ReporteIntervencionListarXlsxDetRequest } from '../../../dto/request/reporte-intervencion-listar-xlsx-det.request';
import { ReporteIntervencionListarXlsxRequest } from '../../../dto/request/reporte-intervencion-listar-xlsx.request';
import { CuentaSistemaUsuarioSeguridadBuscarServiciosResponse } from '../../../dto/response/cuenta-sistema-usuario-seguridad-buscar-servicio.response';
import { CuentaSistemaUsuarioSeguridadBuscarRequest } from '../../../dto/request/cuenta-sistema-usuario-seguridad-buscar.request';
import { CuentaSistemaUsuarioSeguridadBuscarResponse } from '../../../dto/response/cuenta-sistema-usuario-seguridad-buscar.response';

@Component({
  selector: 'app-bdj-reporte-general',
  templateUrl: './bdj-reporte-general.component.html',
  styleUrls: ['./bdj-reporte-general.component.scss']
})
export class BdjReporteGeneralComponent implements OnInit {
  exportar = false;
  CONSTANTES = CONSTANTES;

  eEntidad: EntidadListarResponse;
  eServicio: ServicioListarResponse;

  queryFields: string = '';
  queryTables: string = '';

  listaUsuarios: any[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any> = null;
  isLoading: boolean = false;
  columnsGrilla = [];

  listaParametroEstructura: ReporteParametroEstrucListarResponse[] = [];

  listaCentroAtencion: CentroAtencionListarResponse[] = null;
  listaLineaIntervencion: LineaIntervencionListarResponse[] = null;
  listaServicios: Observable<ServicioListarResponse[]>;
  listaEntidades: Observable<EntidadListarResponse[]>;
  listaEstructura: EstructuraListarResponse[] = null;

  listaServiciosUsuario: CuentaSistemaUsuarioSeguridadBuscarServiciosResponse[] = [];
  flgReporteDisociado: number = 0;

  formularioGrp: FormGroup;
  formErrors: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(LineaIntervencionService) private lineaIntervencionService: LineaIntervencionService,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(ReporteService) private reporteService: ReporteService,
    @Inject(CuentaSistemaService) private cuentaSistemaService: CuentaSistemaService,
    @Inject(EstructuraService) private estructuraService: EstructuraService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      entidad: ['', [Validators.maxLength(250)]],
      lineaIntervencion: ['', [Validators.required]],
      servicio: ['', [Validators.maxLength(250)]],
      estructura: ['', [Validators.required]],
      fecInicio: ['', []],
      fecFin: ['', []],
      flgResumen: [false, [Validators.required]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    //FOR AUTOCOMPLETES
    this.formularioGrp.get('entidad').valueChanges.subscribe(
      data => {
        this.eEntidad = null;
        const filterValue = (typeof data == 'string') ? data.toUpperCase() : null;
        this._buscarEntidadPermitido(filterValue);
        if (!filterValue) {
          this.seleccionadoEntidad();
        }
      }
    );

    this.formularioGrp.get('servicio').valueChanges.subscribe(
      data => {
        this.eServicio = null;
        const filterValue = (typeof data == 'string') ? data.toUpperCase() : null;
        // if (this.user.nomPerfil == CONSTANTES.PERFIL_OMEP) {
        this._buscarServicioPermitido(filterValue);
        if (!filterValue) {
          this.seleccionadoServicio();
        }
        // }
      }
    );
    //PARA AUTOCOMPLETES

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    if (this.user.nomPerfil != CONSTANTES.PERFIL_OMEP) {
      this.listarServiciosAccesible();
    } else {
      this._buscarEntidadPermitido('');
      this.comboLineaIntervencionPermitido();
      this._buscarServicioPermitido('');
      this.comboEstructurasPermitido();
    }

    this.definirTabla();
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

  listarServiciosAccesible() {
    let req = new CuentaSistemaUsuarioSeguridadBuscarRequest();
    req.idUsuario = this.user.idUsuario;
    this.cuentaSistemaService.buscarUsuarioSeguridad(req).subscribe(
      (out2: OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse>) => {
        if (out2.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.flgReporteDisociado = out2.objeto.flgReporteDisociado;
          this.listaServiciosUsuario = out2.objeto.listaServicios;
        } else {
          console.log(out2.rmensaje);
        }
        this._buscarEntidadPermitido('');
        this.comboLineaIntervencionPermitido();
        this._buscarServicioPermitido('');
        this.comboEstructurasPermitido();
      },
      error => {
        console.log(error);
      }
    );
  }

  // listarServiciosPermitido() {
  //   let rq = new ReporteIntervencionListarServicioPermitidoRequest();
  //   rq.idEntidad = this.eEntidad ? this.eEntidad.idEntidad : null;
  //   rq.idLineaIntervencion = this.formularioGrp.get('lineaIntervencion').value ? this.formularioGrp.get('lineaIntervencion').value.idLineaInter : null;
  //   rq.listaServicioPermitido = [];

  //   this.listaServiciosUsuario.forEach(el => {
  //     rq.listaServicioPermitido.push(el.idServicio);
  //   });

  //   this.reporteService.listarServicioPermitido(rq).subscribe(
  //     (out: OutResponse<ServicioListarResponse[]>) => {
  //       if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
  //         this.listaServicios = JSON.parse(JSON.stringify(out.objeto));

  //         // let req = new CuentaSistemaListarServiciosUsuarioRequest();
  //         // req.idUsuario = this.user.idUsuario;
  //         // this.cuentaSistemaService.listarServiciosUsuario(req).subscribe(
  //         //   (out2: OutResponse<CuentaSistemaListarServiciosUsuarioResponse[]>) => {
  //         //     if (out2.rcodigo == CONSTANTES.R_COD_EXITO) {
  //         //       let listaServicios: ServicioListarResponse[] = [];
  //         //       out2.objeto.forEach(el => {
  //         //         let obj = listaServiciosTotal.filter(s => (s.idServicio == el.idServicio));
  //         //         if (obj.length > 0) {
  //         //           listaServicios.unshift(obj[0]);
  //         //         }
  //         //       });
  //         //       this.listaServicios = JSON.parse(JSON.stringify(listaServicios));
  //         //       this.listaServiciosTemp = JSON.parse(JSON.stringify(listaServicios));
  //         //     } else {
  //         //       console.log(out.rmensaje);
  //         //       this.listaServicios = of([]);
  //         //       this.listaServiciosTemp = [];
  //         //     }
  //         //     this.comboEstructurasPermitido(this.listaServiciosTemp);
  //         //   },
  //         //   error => {
  //         //     console.log(error);
  //         //     this.listaServicios = of([]);
  //         //     this.listaServiciosTemp = [];
  //         //   }
  //         // );
  //       } else {
  //         console.log(out.rmensaje);
  //         this.listaServicios = of([]);
  //       }
  //     },
  //     error => {
  //       console.log(error);
  //       this.listaServicios = of([]);
  //     }
  //   );
  // }

  comboLineaIntervencionPermitido(): void {
    let req = new ReporteIntervencionListarLineaInterPermitidoRequest();
    req.listaServicioPermitido = [];

    this.listaServiciosUsuario.forEach(el => {
      req.listaServicioPermitido.push(el.idServicio);
    });

    this.reporteService.listarLineaInterPermitido(req).subscribe(
      (out: OutResponse<LineaIntervencionListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaLineaIntervencion = out.objeto;
          this.listaLineaIntervencion.unshift(JSON.parse(JSON.stringify({ nombre: 'TODOS' })));
          this.formularioGrp.get('lineaIntervencion').setValue(this.listaLineaIntervencion[0]);
        } else {
          console.log(out.rmensaje);
          this.listaLineaIntervencion = [];
        }
      },
      error => {
        console.log(error);
        this.listaLineaIntervencion = [];
      }
    );
  }

  private _buscarServicioPermitido(value: any): void {
    let req = new ReporteIntervencionListarServicioPermitidoRequest();
    req.idEntidad = this.eEntidad ? this.eEntidad.idEntidad : null;
    req.idLineaIntervencion = this.formularioGrp.get('lineaIntervencion').value ? this.formularioGrp.get('lineaIntervencion').value.idLineaInter : null;
    req.nomServicio = value;
    req.listaServicioPermitido = [];

    this.listaServiciosUsuario.forEach(el => {
      req.listaServicioPermitido.push(el.idServicio);
    });

    this.reporteService.listarServicioPermitido(req).subscribe(
      (data: OutResponse<ServicioListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicios = JSON.parse(JSON.stringify(data.objeto));
        } else {
          console.log(data.rmensaje);
          this.listaServicios = of([]);
        }
      }, error => {
        console.log(error);
        this.listaServicios = of([]);
      }
    )
  }

  private _buscarEntidadPermitido(value: any): void {
    let req = new ReporteIntervencionListarEntidadPermitidoRequest();
    req.nombre = value;;
    req.listaServicioPermitido = [];

    this.listaServiciosUsuario.forEach(el => {
      req.listaServicioPermitido.push(el.idServicio);
    });

    this.reporteService.listarEntidadPermitido(req).subscribe(
      (data: OutResponse<EntidadListarResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEntidades = JSON.parse(JSON.stringify(data.objeto));
        } else {
          console.log(data.rmensaje);
          this.listaEntidades = of([]);
        }
      }, error => {
        console.log(error);
        this.listaEntidades = of([]);
      }
    )
  }

  private comboEstructurasPermitido(): void {
    let req = new ReporteIntervencionListarEstructuraPermitidoRequest();
    req.idEntidad = this.eEntidad ? this.eEntidad.idEntidad : null;
    req.idLineaIntervencion = this.formularioGrp.get('lineaIntervencion').value ? this.formularioGrp.get('lineaIntervencion').value.idLineaInter : null;
    req.idServicio = this.eServicio ? this.eServicio.idServicio : null;
    req.listaServicioPermitido = [];

    this.listaServiciosUsuario.forEach(el => {
      req.listaServicioPermitido.push(el.idServicio);
    });

    this.reporteService.listarEstructuraPermitido(req).subscribe(
      (data: OutResponse<ReporteIntervencionListarEstructuraPermitidoResponse[]>) => {
        console.log(data);
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEstructura = JSON.parse(JSON.stringify(data.objeto));
        } else {
          console.log(data.rmensaje);
          this.listaEstructura = [];
        }
      }, error => {
        console.log(error);
        this.listaEstructura = [];
      }
    )
  }

  buscarParamEstructura(): void {
    console.log('VARIABLE DOSICIACION');
    console.log(this.flgReporteDisociado);
    let obj = this.formularioGrp.get('estructura').value;
    if (obj && obj.length > 0) {
      this.spinner.show();

      let req = new ReporteParametroEstrucListarRequest();
      req.listaEstructura = [];
      obj.forEach((el: EstructuraListarResponse) => {
        req.listaEstructura.push(el.idEstructura);
      });

      this.reporteService.listarParametroEstructura(req).subscribe(
        (out: OutResponse<ReporteParametroEstrucListarResponse[]>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            // console.log(out.objeto);
            this.listaParametroEstructura = JSON.parse(JSON.stringify(out.objeto));
            this.buildColumnsGrilla();
          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
            this.listaParametroEstructura = [];
            this.buildColumnsGrilla();
          }
        },
        error => {
          console.log(error);
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          this.listaParametroEstructura = [];
          this.buildColumnsGrilla();
        }
      );
    }
  }

  buildColumnsGrilla(): void {
    this.filtrarRepetidosYAgregarFijos();

    this.columnsGrilla = [];
    this.listaUsuarios = [];

    this.listaParametroEstructura.forEach(el => {
      let obj = {
        columnOrder: el.ordenCampoExcel,
        columnDef: el.nomCampoExcel,
        header: el.nomCampoExcel,
        headerDescrip: (el.descCampoExcel) ? el.descCampoExcel : '',
        cell: (m: any) => (m[el.nomCampoExcel]) ? `${m[el.nomCampoExcel]}` : '',
        cellShort: (m: any) => (m[el.nomCampoExcel]) ? this.evaluarYRecortar(m[el.nomCampoExcel]) : ''
      };
      this.columnsGrilla.push(obj);
    });

    this.spinner.hide();
    this.cargarDatosTabla();
    this.definirTabla();
  }

  filtrarRepetidosYAgregarFijos() {
    this.agregarMapeoFijos();
    this.quitarMapeoAnonimo();

    // console.log('RESULTADO INICIAL SIN FILTRADO');
    // console.log(JSON.parse(JSON.stringify(this.listaParametroEstructura)));

    let listaReplica: string[] = [];
    this.listaParametroEstructura.forEach(el => {
      listaReplica.push(el.nomCampoExcel);
    });
    // console.log('TOTAL PARAMS');
    // console.log(listaReplica.length);

    listaReplica = listaReplica.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
    // console.log('TOTAL PARAMS FILTRADA');
    // console.log(listaReplica.length);
    // console.log(listaReplica);

    // console.log('TAMANÑO');
    // console.log(listaReplica.length);
    // listaReplica = listaReplica.filter((valor, indiceActual, arreglo) => arreglo.indexOf(valor) === indiceActual);
    // console.log(listaReplica.length);
    listaReplica.forEach(el => {
      let cont = 0;
      this.listaParametroEstructura.forEach(rep => {
        if (rep.nomCampoExcel == el) {
          cont++;

          if (cont > 1) {
            // console.log('CAMPO REPLICADO');
            // console.log(rep.nomCampoExcel);
            rep.nomCampoExcel = rep.nomCampoExcel + '_' + cont.toString();
            // console.log(rep.nomCampoExcel);
          }
        }
      });
    });

    this.listaParametroEstructura.sort((a, b) => (a.ordenCampoExcel > b.ordenCampoExcel) ? 1 : -1)
    // console.log('RESULTADO FINAL FILTRADO');
    // console.log(this.listaParametroEstructura);
  }

  agregarMapeoFijos(): void {
    let codCentro = this.listaParametroEstructura.filter(el => (el.nomCampoExcel == CAMPOS_EXCEL.COD_CEN));
    if (codCentro.length > 0) {
      let posicion = codCentro[0].ordenCampoExcel - 1;
      let obj = new ReporteParametroEstrucListarResponse();

      //ENTIDAD
      obj.nomCampoExcel = 'COD_ENT';
      obj.ordenCampoExcel = posicion;
      obj.nomTablaBd = 'ENTIDAD';
      obj.nomCampoBd = 'TXT_CODIGO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Codigo entidad';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_ENT';
      obj.ordenCampoExcel = posicion;
      obj.nomTablaBd = 'ENTIDAD';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre entidad';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      // LINEA INTERVENCION
      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'COD_LIN';
      obj.ordenCampoExcel = posicion;
      obj.nomTablaBd = 'LINEA_INTERVENCION';
      obj.nomCampoBd = 'TXT_CODIGO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Codigo linea intervencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_LIN_INT';
      obj.ordenCampoExcel = posicion;
      obj.nomTablaBd = 'LINEA_INTERVENCION';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre linea intervencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      // SERVICIO
      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'COD_SER';
      obj.ordenCampoExcel = posicion;
      obj.nomTablaBd = 'SERVICIO';
      obj.nomCampoBd = 'TXT_CODIGO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Codigo servicio';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_SER';
      obj.ordenCampoExcel = posicion;
      obj.nomTablaBd = 'SERVICIO';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre servicio';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      // CENTRO ATENCION
      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_CEN';
      obj.ordenCampoExcel = posicion + 1;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 100;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'SUB_TIP_CEN';
      obj.ordenCampoExcel = posicion + 1;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_IDT_SUBTIP_CENTRO';
      obj.campoEsFk = 1;
      obj.campoIdMaestra = 'SUB_TIPO_CENTRO';
      obj.descCampoExcel = 'Subtipo de centro atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'TIP_CEN';
      obj.ordenCampoExcel = posicion + 1;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_IDT_TIP_CENTRO';
      obj.campoEsFk = 1;
      obj.campoIdMaestra = 'TIPO_CENTRO';
      obj.descCampoExcel = 'Tipo centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'UBI_CEN';
      obj.ordenCampoExcel = posicion + 1;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_UBIGEO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Ubigeo de centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 10;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'DEP_CEN';
      obj.ordenCampoExcel = posicion + 1;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_DEPARTAMENTO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Departamento del centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'PRO_CEN';
      obj.ordenCampoExcel = posicion + 1;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_PROVINCIA';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Provincia del centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'DIS_CEN';
      obj.ordenCampoExcel = posicion + 1;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_DISTRITO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Distrito de centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'ANO_REP';
      obj.ordenCampoExcel = 500;
      obj.nomTablaBd = 'EDNE';
      obj.nomCampoBd = 'FEC_PERIODO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Año de reporte de informacion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.push(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'FEC_COR_REP';
      obj.ordenCampoExcel = 501;
      obj.nomTablaBd = 'EDNE';
      obj.nomCampoBd = 'FEC_IMPORTACION';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Fecha de corte de la informacion reportada';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.push(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'PER_INF';
      obj.ordenCampoExcel = 500;
      obj.nomTablaBd = 'EDNE';
      obj.nomCampoBd = 'FEC_PERIODO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Periodo de reporte de informacion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.push(obj);
    } else {
      let obj = new ReporteParametroEstrucListarResponse();
      // CENTRO ATENCION
      obj.nomCampoExcel = 'DIS_CEN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_DISTRITO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Distrito de centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'PRO_CEN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_PROVINCIA';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Provincia del centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'DEP_CEN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_DEPARTAMENTO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Departamento del centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'UBI_CEN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_UBIGEO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Ubigeo de centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 10;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'SUB_TIP_CEN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_IDT_SUBTIP_CENTRO';
      obj.campoEsFk = 1;
      obj.campoIdMaestra = 'SUB_TIPO_CENTRO';
      obj.descCampoExcel = 'Subtipo de centro atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'TIP_CEN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_IDT_TIP_CENTRO';
      obj.campoEsFk = 1;
      obj.campoIdMaestra = 'TIPO_CENTRO';
      obj.descCampoExcel = 'Tipo centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 100;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_CEN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'CENTRO_ATENCION';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre centro de atencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 100;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      // SERVICIO
      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'COD_SER';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'SERVICIO';
      obj.nomCampoBd = 'TXT_CODIGO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Codigo servicio';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_SER';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'SERVICIO';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre servicio';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      // LINEA INTERVENCION
      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'COD_LIN';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'LINEA_INTERVENCION';
      obj.nomCampoBd = 'TXT_CODIGO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Codigo linea intervencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_LIN_INT';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'LINEA_INTERVENCION';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre linea intervencion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      //ENTIDAD
      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'COD_ENT';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'ENTIDAD';
      obj.nomCampoBd = 'TXT_CODIGO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Codigo entidad';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 25;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'NOM_ENT';
      obj.ordenCampoExcel = 0;
      obj.nomTablaBd = 'ENTIDAD';
      obj.nomCampoBd = 'TXT_NOMBRE';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Nombre entidad';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.unshift(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'ANO_REP';
      obj.ordenCampoExcel = 500;
      obj.nomTablaBd = 'EDNE';
      obj.nomCampoBd = 'FEC_PERIODO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Año de reporte de informacion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.push(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'FEC_COR_REP';
      obj.ordenCampoExcel = 501;
      obj.nomTablaBd = 'EDNE';
      obj.nomCampoBd = 'FEC_IMPORTACION';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Fecha de corte de la informacion reportada';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.push(obj);

      obj = new ReporteParametroEstrucListarResponse();
      obj.nomCampoExcel = 'PER_INF';
      obj.ordenCampoExcel = 500;
      obj.nomTablaBd = 'EDNE';
      obj.nomCampoBd = 'FEC_PERIODO';
      obj.campoEsFk = 0;
      obj.campoIdMaestra = null;
      obj.descCampoExcel = 'Periodo de reporte de informacion';
      obj.tipoDato = 'VARCHAR2';
      obj.longitudDato = 250;
      obj.precisionDato = 0;
      obj.escalaDato = 0;
      this.listaParametroEstructura.push(obj);
    }
  }

  quitarMapeoAnonimo(): void {
    if (this.flgReporteDisociado == 1) {
      //REPORTE DISOCIADO
      CAMPOS_EXCLUIR_DISOCIACION.forEach(el => {
        let lFiltrado = this.listaParametroEstructura.filter(o => (o.nomCampoExcel == el.nomCampoExcel));
        if (lFiltrado.length > 0) {
          if (lFiltrado[0].nomCampoExcel == CAMPOS_EXCEL.COD_USU) { // CASO COD_USU, SE REEMPLAZA CON EL COD_DISOC
            let objRemplazo = JSON.parse(JSON.stringify(CAMPOS_INCLUIR_DISOCIACION[0]));
            objRemplazo.ordenCampoExcel = lFiltrado[0].ordenCampoExcel;

            let idx = this.listaParametroEstructura.indexOf(lFiltrado[0]);
            this.listaParametroEstructura.splice(idx, 1, objRemplazo);
          } else {
            let idx = this.listaParametroEstructura.indexOf(lFiltrado[0]);
            this.listaParametroEstructura.splice(idx, 1);
          }
        }
      });
    }
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

  buildQuery(): void {
    this.queryFields = "SELECT TO_CHAR(ED.FEC_PERIODO,'YYYY') AS ANO_REP,TO_CHAR(ED.FEC_IMPORTACION,'DD/MM/YYYY') AS FEC_COR_REP,TO_CHAR(ED.FEC_PERIODO,'MONTH') AS PER_INF," +
      this.buildQueryFields(TABLAS_BD.ENTIDAD.NOMBRE, TABLAS_BD.ENTIDAD.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.LINEA_INTERVENCION.NOMBRE, TABLAS_BD.LINEA_INTERVENCION.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.SERVICIO.NOMBRE, TABLAS_BD.SERVICIO.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.CENTRO_ATENCION.NOMBRE, TABLAS_BD.CENTRO_ATENCION.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_DETALLE.NOMBRE, TABLAS_BD.USUARIO_DETALLE.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO.NOMBRE, TABLAS_BD.USUARIO.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_INGRESO.NOMBRE, TABLAS_BD.USUARIO_INGRESO.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.AGENTE_EXTERNO.NOMBRE, TABLAS_BD.AGENTE_EXTERNO.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_ACTIVIDAD.NOMBRE, TABLAS_BD.USUARIO_ACTIVIDAD.PREFIJO) +
      this.buildQueryFields(TABLAS_BD.USUARIO_SITUACION.NOMBRE, TABLAS_BD.USUARIO_SITUACION.PREFIJO);

    this.queryFields = this.queryFields.substr(0, this.queryFields.length - 1);

    this.queryTables = " FROM USUARIO_DETALLE UD" +
      (this.verifyFields(TABLAS_BD.SERVICIO.NOMBRE) ? " LEFT JOIN EDNE ED ON ED.NID_EDNE=UD.NID_EDNE LEFT JOIN ESTRUCTURA EST ON EST.NID_ESTRUCTURA=ED.NID_ESTRUCTURA LEFT JOIN SERVICIO S ON S.NID_SERVICIO=EST.NID_SERVICIO" : "") +
      (this.verifyFields(TABLAS_BD.ENTIDAD.NOMBRE) ? " LEFT JOIN ENTIDAD E ON E.NID_ENTIDAD=S.NID_ENTIDAD" : "") +
      (this.verifyFields(TABLAS_BD.LINEA_INTERVENCION.NOMBRE) ? " LEFT JOIN LINEA_INTERVENCION LI ON LI.NID_LINEA_INTER=S.NID_LINEA_INTER" : "") +
      (this.verifyFields(TABLAS_BD.CENTRO_ATENCION.NOMBRE) ? " LEFT JOIN CENTRO_ATENCION CA ON CA.NID_CENTRO_ATEN=UD.NID_CENTRO_ATEN" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO.NOMBRE) ? " LEFT JOIN USUARIO U ON U.NID_USUARIO=UD.NID_USUARIO" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO_INGRESO.NOMBRE) ? " LEFT JOIN USUARIO_INGRESO UI ON UI.NID_USUARIO_DETALLE=UD.NID_USUARIO_DETALLE" : "") +
      (this.verifyFields(TABLAS_BD.AGENTE_EXTERNO.NOMBRE) ? " LEFT JOIN AGENTE_EXTERNO AE ON AE.NID_USUARIO_INGRESO=UI.NID_USUARIO_INGRESO" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO_ACTIVIDAD.NOMBRE) ? " LEFT JOIN USUARIO_ACTIVIDAD UA ON UA.NID_USUARIO_DETALLE=UD.NID_USUARIO_DETALLE" : "") +
      (this.verifyFields(TABLAS_BD.USUARIO_SITUACION.NOMBRE) ? " LEFT JOIN USUARIO_SITUACION US ON US.NID_USUARIO_DETALLE=UD.NID_USUARIO_DETALLE" : "");

    let queryFilters = " WHERE 1=1";
    let queryFiltersEstAct = " WHERE 1=1";
    if (this.eEntidad) {
      queryFilters += " AND E.NID_ENTIDAD=" + this.eEntidad.idEntidad;
      queryFiltersEstAct += " AND E2.NID_ENTIDAD=" + this.eEntidad.idEntidad;
    }

    if (this.formularioGrp.get('lineaIntervencion').value.idLineaInter) {
      queryFilters += " AND LI.NID_LINEA_INTER=" + this.formularioGrp.get('lineaIntervencion').value.idLineaInter;
      queryFiltersEstAct += " AND LI2.NID_LINEA_INTER=" + this.formularioGrp.get('lineaIntervencion').value.idLineaInter;
    }

    if (this.eServicio) {
      queryFilters += " AND S.NID_SERVICIO=" + this.eServicio.idServicio;
      queryFiltersEstAct += " AND S2.NID_SERVICIO=" + this.eServicio.idServicio;
    }
    // else {
    //   if (this.user.nomPerfil != CONSTANTES.PERFIL_OMEP) {
    //     if (this.listaServiciosTemp.length > 0) {
    //       queryFilters += " AND S.NID_SERVICIO IN (";
    //       queryFiltersEstAct += " AND S2.NID_SERVICIO IN (";
    //       this.listaServiciosTemp.forEach(se => {
    //         queryFilters += se.idServicio + ",";
    //         queryFiltersEstAct += se.idServicio + ",";
    //       });
    //       queryFilters = queryFilters.substr(0, queryFilters.length - 1);
    //       queryFilters += ")";

    //       queryFiltersEstAct = queryFiltersEstAct.substr(0, queryFiltersEstAct.length - 1);
    //       queryFiltersEstAct += ")";
    //     } else {
    //       queryFilters += " AND S.NID_SERVICIO = 9999999999";
    //       queryFiltersEstAct += " AND S2.NID_SERVICIO = 9999999999";
    //     }
    //   }
    // }

    if (this.formularioGrp.get('fecInicio').value && this.formularioGrp.get('fecFin').value) {
      queryFilters += " AND TRUNC(ED.FEC_PERIODO)>=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecInicio").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";
      queryFilters += " AND TRUNC(ED.FEC_PERIODO)<=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecFin").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";

      queryFiltersEstAct += " AND TRUNC(ED2.FEC_PERIODO)>=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecInicio").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";
      queryFiltersEstAct += " AND TRUNC(ED2.FEC_PERIODO)<=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecFin").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";
    }

    let est = this.formularioGrp.get('estructura').value;
    // console.log('ESTRUCTURAS SELECCIONADAS');
    // console.log(est);
    // console.log(est.length);
    if (est.length > 0) {
      queryFilters += " AND ED.NID_ESTRUCTURA IN (";
      queryFiltersEstAct += " AND ED2.NID_ESTRUCTURA IN (";
      est.forEach((el: EstructuraListarResponse) => {
        queryFilters += el.idEstructura + ",";
        queryFiltersEstAct += el.idEstructura + ",";
      });
      queryFilters = queryFilters.substr(0, queryFilters.length - 1);
      queryFilters += ")";

      queryFiltersEstAct = queryFiltersEstAct.substr(0, queryFiltersEstAct.length - 1);
      queryFiltersEstAct += ")";
    }

    this.queryTables += queryFilters + " ORDER BY U.NID_USUARIO ASC";

    // LISTA USUARIOS RESUMEN
    let flgResumen = this.formularioGrp.get('flgResumen').value;
    // console.log('BANDERA DE RESUMEN');
    // console.log(flgResumen);
    if (flgResumen == true) {
      this.queryFields += ' ,ED.FEC_PERIODO AS FEC_PERIODO' +
        ',(SELECT MAX(ED2.FEC_PERIODO) FROM USUARIO_DETALLE UD2' +
        ' LEFT JOIN EDNE ED2 ON ED2.NID_EDNE=UD2.NID_EDNE' +
        ' LEFT JOIN ESTRUCTURA EST2 ON EST2.NID_ESTRUCTURA=ED2.NID_ESTRUCTURA' +
        ' LEFT JOIN SERVICIO S2 ON S2.NID_SERVICIO=EST2.NID_SERVICIO' +
        ' LEFT JOIN ENTIDAD E2 ON E2.NID_ENTIDAD=S2.NID_ENTIDAD' +
        ' LEFT JOIN LINEA_INTERVENCION LI2 ON LI2.NID_LINEA_INTER=S2.NID_LINEA_INTER' +
        queryFiltersEstAct + ' AND UD2.NID_USUARIO=U.NID_USUARIO) AS MAX_FEC_PERIODO';

      // ADDING EST_ACT
      let estAct = this.listaParametroEstructura.filter(par => (par.nomCampoExcel == CAMPOS_EXCEL.EST_ACT));
      if (estAct.length > 0) {
        let queryEstAct = " ,(SELECT MIN(" + TABLAS_BD[estAct[0].nomTablaBd].PREFIJO + "2." + estAct[0].nomCampoBd + ") FROM USUARIO_DETALLE UD2 " +
          "LEFT JOIN EDNE ED2 ON ED2.NID_EDNE=UD2.NID_EDNE " +
          "LEFT JOIN ESTRUCTURA EST2 ON EST2.NID_ESTRUCTURA=ED2.NID_ESTRUCTURA " +
          "LEFT JOIN SERVICIO S2 ON S2.NID_SERVICIO=EST2.NID_SERVICIO " +
          "LEFT JOIN ENTIDAD E2 ON E2.NID_ENTIDAD=S2.NID_ENTIDAD " +
          "LEFT JOIN LINEA_INTERVENCION LI2 ON LI2.NID_LINEA_INTER=S2.NID_LINEA_INTER " +
          "LEFT JOIN USUARIO U2 ON U2.NID_USUARIO=UD2.NID_USUARIO " +
          "LEFT JOIN USUARIO_INGRESO UI2 ON UI2.NID_USUARIO_DETALLE=UD2.NID_USUARIO_DETALLE " +
          "LEFT JOIN USUARIO_ACTIVIDAD UA2 ON UA2.NID_USUARIO_DETALLE=UD2.NID_USUARIO_DETALLE " +
          "LEFT JOIN USUARIO_SITUACION US2 ON US2.NID_USUARIO_DETALLE=UD2.NID_USUARIO_DETALLE " +
          queryFiltersEstAct + " AND UD2.NID_USUARIO=U.NID_USUARIO) AS MIN_EST_ACT";
        this.queryFields += queryEstAct;

        // ADICION DE FILTRO POR GENERAL
        this.queryFields = 'SELECT * FROM(' + this.queryFields;
        this.queryTables += ') GEN WHERE GEN.FEC_PERIODO=GEN.MAX_FEC_PERIODO AND GEN.EST_ACT = GEN.MIN_EST_ACT';
      } else {
        // ADICION DE FILTRO POR GENERAL
        this.queryFields = 'SELECT * FROM(' + this.queryFields;
        this.queryTables += ') GEN WHERE GEN.FEC_PERIODO=GEN.MAX_FEC_PERIODO';
      }
      // FIN EST_ACT
      // FIN LISTA USUARIOS RESUMEN
    }
  }

  buildQueryFields(nomTabla: string, prefijo: string): string {
    let query = '';
    let listaFilt: ReporteParametroEstrucListarResponse[] = [];
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

  buscar(): void {
    if (this.formularioGrp.valid) {
      this.dataSource = null;
      this.isLoading = true;
      this.buildQuery();

      let listaMapeo: ReporteIntervencionListarDetRequest[] = [];
      this.listaParametroEstructura.forEach(par => {
        let obj = new ReporteIntervencionListarDetRequest();
        obj.nomCampoExcel = par.nomCampoExcel;
        obj.campoEsFk = par.campoEsFk;
        obj.campoIdMaestra = par.campoIdMaestra;
        obj.tipoDato = par.tipoDato;
        obj.longitudDato = par.longitudDato;
        obj.precisionDato = par.precisionDato;
        obj.escalaDato = par.escalaDato;

        listaMapeo.push(obj);
      });
      let listaEstructura = '';
      this.formularioGrp.get('estructura').value.forEach((el: EstructuraListarResponse) => {
        listaEstructura += el.idEstructura + '|';
      });
      listaEstructura = listaEstructura.substr(0, listaEstructura.length - 1);


      let req = new ReporteIntervencionListarRequest();
      req.sqlFields = this.queryFields;
      req.sqlTables = this.queryTables;
      req.listaMapeo = listaMapeo;
      req.listaEstructura = listaEstructura;

      this.reporteService.listarReporteIntervencion(req).subscribe(
        (out: OutResponse<any[]>) => {
          // console.log(out.objeto);
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
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  verifyFields(nomTabla: string): boolean {
    let listaFilt: ReporteParametroEstrucListarResponse[] = [];
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

  displayFn(obj: EntidadListarResponse) {
    return obj ? obj.nombre : '';
  }

  seleccionado(evt) {
    console.log(evt.option.value);
    this.eEntidad = evt.option.value;

    this.seleccionadoEntidad();
  }

  seleccionadoEntidad() {
    // REINICIAR FORMULARIOS
    this.listaLineaIntervencion = null;
    this.formularioGrp.get('lineaIntervencion').setValue('');

    this.listaServicios = null;
    this.eServicio = null;
    this.formularioGrp.get('servicio').setValue('');

    this.listaEstructura = null;
    this.formularioGrp.get('estructura').setValue('');

    this.comboLineaIntervencionPermitido();
    this._buscarServicioPermitido('');
    this.comboEstructurasPermitido();
  }

  displayFn2(obj: ServicioListarResponse) {
    return obj ? obj.nombre : '';
  }

  seleccionado2(evt) {
    console.log(evt.option.value);
    this.eServicio = evt.option.value;

    this.seleccionadoServicio();
  }

  seleccionadoServicio() {
    // REINICIAR FORMULARIOS
    this.listaEstructura = null;
    this.formularioGrp.get('estructura').setValue('');

    this.comboEstructurasPermitido();
  }

  seleccionadoLineaIntervencion(): void {
    // REINICIAR FORMULARIOS
    this.listaServicios = null;
    this.eServicio = null;
    this.formularioGrp.get('servicio').setValue('');

    this.listaEstructura = null;
    this.formularioGrp.get('estructura').setValue('');

    this._buscarServicioPermitido('');
    this.comboEstructurasPermitido();
  }

  displayFn3(obj: EstructuraListarResponse) {
    return obj ? obj.nombre : '';
  }

  seleccionado3(evt) {
    console.log(evt);
  }

  exportarExcel() {
    this.exportar = true;
    if (this.formularioGrp.valid) {
      this.buildQuery();

      let listaMapeo: ReporteIntervencionListarXlsxDetRequest[] = [];
      this.listaParametroEstructura.forEach(par => {
        let obj = new ReporteIntervencionListarXlsxDetRequest();
        obj.nomCampoExcel = par.nomCampoExcel;
        obj.descCampoExcel = par.descCampoExcel;
        obj.campoEsFk = par.campoEsFk;
        obj.campoIdMaestra = par.campoIdMaestra;
        obj.tipoDato = par.tipoDato;
        obj.longitudDato = par.longitudDato;
        obj.precisionDato = par.precisionDato;
        obj.escalaDato = par.escalaDato;

        listaMapeo.push(obj);
      });

      let listaEstructura = '';
      this.formularioGrp.get('estructura').value.forEach((el: EstructuraListarResponse) => {
        listaEstructura += el.idEstructura + '|';
      });
      listaEstructura = listaEstructura.substr(0, listaEstructura.length - 1);

      let req = new ReporteIntervencionListarXlsxRequest();
      req.sqlFields = this.queryFields;
      req.sqlTables = this.queryTables;
      req.listaMapeo = listaMapeo;
      req.listaEstructura = listaEstructura;

      this.reporteService.listarReporteIntervencionXlsx(req).subscribe(
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
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  limpiar(): void {
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
    this.formularioGrp.get('flgResumen').setValue(false);

    // REINICIAR FORMULARIOS
    this.listaEntidades = null;
    this.eEntidad = null;
    this.formularioGrp.get('entidad').setValue('');

    this.listaLineaIntervencion = null;
    this.formularioGrp.get('lineaIntervencion').setValue('');

    this.listaServicios = null;
    this.eServicio = null;
    this.formularioGrp.get('servicio').setValue('');

    this.listaEstructura = null;
    this.formularioGrp.get('estructura').setValue('');

    this._buscarEntidadPermitido('');
    this.comboLineaIntervencionPermitido();
    this._buscarServicioPermitido('');
    this.comboEstructurasPermitido();
  }

}
