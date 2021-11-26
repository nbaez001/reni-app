import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CAMPOS_EXCEL, CAMPOS_EXCLUIR_DISOCIACION, CAMPOS_INCLUIR_DISOCIACION, CONSTANTES, MAESTRAS, MENSAJES, MENSAJES_PANEL, TABLAS_BD } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { CuentaSistemaUsuarioSeguridadBuscarRequest } from '../../../dto/request/cuenta-sistema-usuario-seguridad-buscar.request';
import { MaestraSubitemListarRequest } from '../../../dto/request/maestra-subitem-listar.request';
import { ReporteIntervencionXUsuarioListarDetRequest } from '../../../dto/request/reporte-intervencion-x-usuario-listar-det.request';
import { ReporteIntervencionXUsuarioListarXlsxDetRequest } from '../../../dto/request/reporte-intervencion-x-usuario-listar-xlsx-det.request';
import { ReporteIntervencionXUsuarioListarXlsxRequest } from '../../../dto/request/reporte-intervencion-x-usuario-listar-xlsx.request';
import { ReporteIntervencionXUsuarioListarRequest } from '../../../dto/request/reporte-intervencion-x-usuario-listar.request';
import { ReporteParametroEstrucXUsuListarRequest } from '../../../dto/request/reporte-parametro-estruc-x-usu-listar.request';
import { CuentaSistemaUsuarioSeguridadBuscarResponse } from '../../../dto/response/cuenta-sistema-usuario-seguridad-buscar.response';
import { FileResponse } from '../../../dto/response/file.response';
import { MaestraSubitemListarResponse } from '../../../dto/response/maestra-subitem-listar.response';
import { ReporteIntervencionListarUsuarioXDatosResponse } from '../../../dto/response/reporte-intervencion-listar-usuario-x-datos.response';
import { ReporteParametroEstrucListarResponse } from '../../../dto/response/reporte-parametro-estruc-listar.response';
import { CuentaSistemaService } from '../../../services/cuenta-sistema.service';
import { MaestraService } from '../../../services/maestra.service';
import { ReporteService } from '../../../services/reporte.service';
import { BuscUsuarioComponent } from './busc-usuario/busc-usuario.component';

@Component({
  selector: 'app-bdj-reporte-individual',
  templateUrl: './bdj-reporte-individual.component.html',
  styleUrls: ['./bdj-reporte-individual.component.scss']
})
export class BdjReporteIndividualComponent implements OnInit {
  exportar = false;
  buscando = false;
  // CONSTANTES = CONSTANTES;

  listaTipoDocumento: MaestraSubitemListarResponse[] = [];
  listaParametroEstructura: ReporteParametroEstrucListarResponse[] = [];



  queryFields: string = '';
  queryTables: string = '';

  listaUsuarios: any[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any> = null;
  isLoading: boolean = false;
  columnsGrilla = [];

  flgReporteDisociado: number = 0;

  formularioGrp: FormGroup;
  formErrors: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(FormService) private formService: FormService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(ReporteService) private reporteService: ReporteService,
    @Inject(CuentaSistemaService) private cuentaSistemaService: CuentaSistemaService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required]],
      codigoUsuario: ['', []],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.comboTipoDocumento();
    this.listarServiciosAccesible();
    this.definirTabla();
  }

  comboTipoDocumento(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_DOCUMENTO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoDocumento = out.objeto;
        } else {
          console.log(out.rmensaje);
          this.listaTipoDocumento = [];
        }
      },
      error => {
        console.log(error);
        this.listaTipoDocumento = [];
      }
    );
  }

  listarServiciosAccesible() {
    let req = new CuentaSistemaUsuarioSeguridadBuscarRequest();
    req.idUsuario = this.user.idUsuario;
    this.cuentaSistemaService.buscarUsuarioSeguridad(req).subscribe(
      (out2: OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse>) => {
        if (out2.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.flgReporteDisociado = out2.objeto.flgReporteDisociado ? out2.objeto.flgReporteDisociado : 0;
        } else {
          console.log(out2.rmensaje);
        }
      },
      error => {
        console.log(error);
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

  actValidacionTipDocumento(): void {
    let tipDocumento = this.formularioGrp.get('tipoDocumento').value;
    console.log(tipDocumento);
    if (tipDocumento) {
      this.formularioGrp.get('tipoDocumento').setValidators([Validators.required]);
      this.formularioGrp.get('tipoDocumento').updateValueAndValidity();
      this.formularioGrp.get('nroDocumento').setValidators([Validators.required]);
      this.formularioGrp.get('nroDocumento').updateValueAndValidity();

      // LIMPIAMOS EL OTRO CONTROL
      this.formularioGrp.get('codigoUsuario').setValue('');
      this.formularioGrp.get('codigoUsuario').setValidators([]);
      this.formularioGrp.get('codigoUsuario').updateValueAndValidity();
    }
  }

  actValidacionNroDocumento(): void {
    let nroDocumento = this.formularioGrp.get('nroDocumento').value;
    console.log(nroDocumento);
    if (nroDocumento) {
      this.formularioGrp.get('tipoDocumento').setValidators([Validators.required]);
      this.formularioGrp.get('tipoDocumento').updateValueAndValidity();
      this.formularioGrp.get('nroDocumento').setValidators([Validators.required]);
      this.formularioGrp.get('nroDocumento').updateValueAndValidity();

      // LIMPIAMOS EL OTRO CONTROL
      this.formularioGrp.get('codigoUsuario').setValue('');
      this.formularioGrp.get('codigoUsuario').setValidators([]);
      this.formularioGrp.get('codigoUsuario').updateValueAndValidity();
    }
  }

  actValidacionCodUsuario(): void {
    let codUsuario = this.formularioGrp.get('codigoUsuario').value;
    console.log(codUsuario);
    if (codUsuario) {
      this.formularioGrp.get('codigoUsuario').setValidators([Validators.required]);
      this.formularioGrp.get('codigoUsuario').updateValueAndValidity();

      // LIMPIAMOS EL OTRO CONTROL
      this.formularioGrp.get('tipoDocumento').setValue('');
      this.formularioGrp.get('tipoDocumento').setValidators([]);
      this.formularioGrp.get('tipoDocumento').updateValueAndValidity();
      this.formularioGrp.get('nroDocumento').setValue('');
      this.formularioGrp.get('nroDocumento').setValidators([]);
      this.formularioGrp.get('nroDocumento').updateValueAndValidity();
    }
  }

  buscarUsuario(): void {
    const dialogRef = this.dialog.open(BuscUsuarioComponent, {
      width: '900px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.REPORTES.INDIVIDUAL.BUSCAR_USUARIO.TITLE,
        objeto: this.flgReporteDisociado
      }
    });

    dialogRef.afterClosed().subscribe((result: ReporteIntervencionListarUsuarioXDatosResponse) => {
      if (result) {
        if (this.flgReporteDisociado != 1) {
          this.formularioGrp.get('codigoUsuario').setValue(result.codUsuario);
          this.actValidacionCodUsuario();
        } else {
          this.formularioGrp.get('codigoUsuario').setValue(result.codDisociacion);
          this.actValidacionCodUsuario();
        }
      }
    });
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

    // NUEVA LLAMADA PARA BUSCAR DATA DE USUARIO
    this.buscarRegistros();

    this.cargarDatosTabla();
    this.definirTabla();
  }

  filtrarRepetidosYAgregarFijos() {
    this.agregarMapeoFijos();
    this.quitarMapeoAnonimo(); // RIESGO BAJO: PUEDE SUCEDER QUE EXISTA 2 CAMPOS CON EL MISMO NOMBRE Y SOLO SE VA FILTRAR 1

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

    if (this.formularioGrp.get('tipoDocumento').value) {
      queryFilters += " AND U.TXT_B_003='" + this.formularioGrp.get('tipoDocumento').value.codigo + "'";
    }

    if (this.formularioGrp.get('nroDocumento').value) {
      queryFilters += " AND U.TXT_B_004='" + this.formularioGrp.get('nroDocumento').value + "'";
    }

    if (this.formularioGrp.get('codigoUsuario').value) {
      queryFilters += " AND (U.TXT_B_001='" + this.formularioGrp.get('codigoUsuario').value + "' OR U.TXT_COD_DISOC='" + this.formularioGrp.get('codigoUsuario').value + "')";
    }
    // let queryFiltersEstAct = " WHERE 1=1";


    // if (this.formularioGrp.get('fecInicio').value && this.formularioGrp.get('fecFin').value) {
    //   queryFilters += " AND TRUNC(ED.FEC_PERIODO)>=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecInicio").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";
    //   queryFilters += " AND TRUNC(ED.FEC_PERIODO)<=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecFin").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";

    //   queryFiltersEstAct += " AND TRUNC(ED2.FEC_PERIODO)>=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecInicio").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";
    //   queryFiltersEstAct += " AND TRUNC(ED2.FEC_PERIODO)<=TO_DATE('" + this.datePipe.transform(this.formularioGrp.get("fecFin").value, "dd/MM/yyyy") + "','DD/MM/YYYY')";
    // }

    this.queryTables += queryFilters + " ORDER BY ED.FEC_PERIODO DESC";
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
      this.buscando = true;
      this.isLoading = true;

      let req = new ReporteParametroEstrucXUsuListarRequest();
      req.tipDocUsu = (this.formularioGrp.get('tipoDocumento').value) ? this.formularioGrp.get('tipoDocumento').value.codigo : null;
      req.nroDocUsu = this.formularioGrp.get('nroDocumento').value;
      req.codUsu = this.formularioGrp.get('codigoUsuario').value;

      this.reporteService.listarParametroEstructuraXUsu(req).subscribe(
        (out: OutResponse<ReporteParametroEstrucListarResponse[]>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO && out.objeto.length > 0) {
            // console.log(out.objeto);
            this.listaParametroEstructura = JSON.parse(JSON.stringify(out.objeto));
            this.buildColumnsGrilla();
          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
            this.listaParametroEstructura = [];
            this.listaUsuarios = [];
            this.definirTabla();
            this.cargarDatosTabla();

            this.buscando = false;
            this.isLoading = false;
          }
        },
        error => {
          console.log(error);
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          this.listaParametroEstructura = [];
          this.listaUsuarios = [];
          this.definirTabla();
          this.cargarDatosTabla();

          this.buscando = false;
          this.isLoading = false;
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  buscarRegistros(): void {
    console.log('BUSCAR');
    if (this.formularioGrp.valid) {
      console.log('VALID');
      this.dataSource = null;
      this.buildQuery();

      let listaMapeo: ReporteIntervencionXUsuarioListarDetRequest[] = [];
      this.listaParametroEstructura.forEach(par => {
        let obj = new ReporteIntervencionXUsuarioListarDetRequest();
        obj.nomCampoExcel = par.nomCampoExcel;
        obj.campoEsFk = par.campoEsFk;
        obj.campoIdMaestra = par.campoIdMaestra;
        obj.tipoDato = par.tipoDato;
        obj.longitudDato = par.longitudDato;
        obj.precisionDato = par.precisionDato;
        obj.escalaDato = par.escalaDato;

        listaMapeo.push(obj);
      });

      let req = new ReporteIntervencionXUsuarioListarRequest();
      req.sqlFields = this.queryFields;
      req.sqlTables = this.queryTables;
      req.listaMapeo = listaMapeo;
      req.tipDocUsu = (this.formularioGrp.get('tipoDocumento').value) ? this.formularioGrp.get('tipoDocumento').value.codigo : null;
      req.nroDocUsu = this.formularioGrp.get('nroDocumento').value;
      req.codUsu = this.formularioGrp.get('codigoUsuario').value;

      this.reporteService.listarReporteIntervencionXUsuario(req).subscribe(
        (out: OutResponse<any[]>) => {
          // console.log(out.objeto);
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.listaUsuarios = out.objeto;
          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
            this.listaUsuarios = [];
          }
          this.isLoading = false;
          this.buscando = false;

          this.cargarDatosTabla();
        },
        error => {
          console.log(error);
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
          this.isLoading = false;
          this.buscando = false;

          this.listaUsuarios = [];
          this.cargarDatosTabla();
        }
      );
    } else {
      console.log('NO VALID');
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);

      this.isLoading = false;
      this.buscando = false;

      this.listaUsuarios = [];
      this.cargarDatosTabla();
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

  exportarExcel() {
    this.exportar = true;
    if (this.formularioGrp.valid) {
      this.buildQuery();

      let listaMapeo: ReporteIntervencionXUsuarioListarXlsxDetRequest[] = [];
      this.listaParametroEstructura.forEach(par => {
        let obj = new ReporteIntervencionXUsuarioListarXlsxDetRequest();
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

      let req = new ReporteIntervencionXUsuarioListarXlsxRequest();
      req.sqlFields = this.queryFields;
      req.sqlTables = this.queryTables;
      req.listaMapeo = listaMapeo;
      req.tipDocUsu = (this.formularioGrp.get('tipoDocumento').value) ? this.formularioGrp.get('tipoDocumento').value.codigo : null;
      req.nroDocUsu = this.formularioGrp.get('nroDocumento').value;
      req.codUsu = this.formularioGrp.get('codigoUsuario').value;

      this.reporteService.listarReporteIntervencionXUsuarioXlsx(req).subscribe(
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
    this.formularioGrp.get('tipoDocumento').setValue('');
    this.formularioGrp.get('nroDocumento').setValue('');
    this.formularioGrp.get('codigoUsuario').setValue('');
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
  }
}
