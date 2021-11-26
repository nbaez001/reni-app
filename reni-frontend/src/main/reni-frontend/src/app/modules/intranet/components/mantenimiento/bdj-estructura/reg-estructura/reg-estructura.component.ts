import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTES, MENSAJES_PANEL, MAESTRAS, MENSAJES, TABLAS_BD, CAMPOS_EXCEL, CAMPO_EXCEL_FIJOS } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { EstructuraParametroListarRequest } from 'src/app/modules/intranet/dto/request/estructura-parametro-listar.request';
import { EstructuraRegistrarParametroRequest } from 'src/app/modules/intranet/dto/request/estructura-registrar-parametro.request';
import { EstructuraRegistrarRequest } from 'src/app/modules/intranet/dto/request/estructura-registrar.request';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { BDCampoTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-campo-tabla-listar.response';
import { BDTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-tabla-listar.response';
import { EstructuraListarResponse } from 'src/app/modules/intranet/dto/response/estructura-listar.response';
import { EstructuraParametroListarResponse } from 'src/app/modules/intranet/dto/response/estructura-parametro-listar.response';
import { EstructuraRegistrarResponse } from 'src/app/modules/intranet/dto/response/estructura-registrar.response';
import { MaestraListarResponse } from 'src/app/modules/intranet/dto/response/maestra-listar.response';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { ServicioListarResponse } from 'src/app/modules/intranet/dto/response/servicio-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { EstructuraService } from 'src/app/modules/intranet/services/estructura.service';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { BuscCampoTablaBdComponent } from '../busc-campo-tabla-bd/busc-campo-tabla-bd.component';
import { BuscEstructuraRplComponent } from '../busc-estructura-rpl/busc-estructura-rpl.component';
import { BuscServicioComponent } from '../busc-servicio/busc-servicio.component';
import { BuscTablaBdComponent } from '../busc-tabla-bd/busc-tabla-bd.component';
import { BuscTablaMaeComponent } from '../busc-tabla-mae/busc-tabla-mae.component';
import { CargMasivaEstructuraComponent } from '../carg-masiva-estructura/carg-masiva-estructura.component';

@Component({
  selector: 'app-reg-estructura',
  templateUrl: './reg-estructura.component.html',
  styleUrls: ['./reg-estructura.component.scss']
})
export class RegEstructuraComponent implements OnInit {
  guardar: boolean = false;
  agregar: boolean = false;

  servicio: ServicioListarResponse;
  estructura: EstructuraListarResponse;

  listaTipoUsuario: MaestraSubitemListarResponse[] = null;
  listaParametro: EstructuraRegistrarParametroRequest[] = [];

  formularioGrp: FormGroup;
  formErrors: any;
  formularioDetGrp: FormGroup;
  formDetErrors: any;

  displayedColumns: string[];
  dataSource: MatTableDataSource<EstructuraRegistrarParametroRequest> = null;
  isLoading: boolean = false;

  columnsGrilla = [
    {
      columnDef: 'nomCampoExcel',
      header: 'Nombre campo excel',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.nomCampoExcel) ? `${m.nomCampoExcel}` : ''
    }, {
      columnDef: 'ordenCampoExcel',
      header: 'Orden campo excel',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.ordenCampoExcel) ? `${m.ordenCampoExcel}` : ''
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
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (m: EstructuraRegistrarParametroRequest) => (m.descripcion) ? `${m.descripcion}` : ''
    }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('nomCampoExcel') nomCampoExcel: ElementRef;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegEstructuraComponent>,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    @Inject(EstructuraService) private estructuraService: EstructuraService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      tipoUsuario: ['', [Validators.required]],
      servicio: ['', [Validators.required]],
      estructuraRepl: ['', []],
    });

    this.formularioDetGrp = this.fb.group({
      nomCampoExcel: ['', [Validators.required, Validators.maxLength(70), CustomValidators.onlyAlfanumericoYSubguion, CustomValidators.notCaracterNumeral, CustomValidators.notCaracterOR]],
      ordenCampoExcel: [1, [Validators.required]],
      nomTablaBd: ['', [Validators.required, Validators.maxLength(70), CustomValidators.notCaracterNumeral, CustomValidators.notCaracterOR]],
      nomCampoBd: ['', [Validators.required, Validators.maxLength(70), CustomValidators.notCaracterNumeral, CustomValidators.notCaracterOR]],
      campoEsFk: [false, [Validators.required]],
      campoIdmaestra: ['', [Validators.maxLength(50), CustomValidators.notCaracterNumeral, CustomValidators.notCaracterOR]],
      descripcion: ['', [Validators.maxLength(500), CustomValidators.notCaracterNumeral, CustomValidators.notCaracterOR]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.formDetErrors = this.formService.buildFormErrors(this.formularioDetGrp, this.formDetErrors);
    this.formularioDetGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioDetGrp, this.formDetErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.comboTipoUsuario();

    this.definirTabla();
  }

  comboTipoUsuario(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_USUARIO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoUsuario = out.objeto;
        } else {
          console.log(out.rmensaje);
          this.listaTipoUsuario = [];
        }
      },
      error => {
        console.log(error);
        this.listaTipoUsuario = [];
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

  regEstructura(): void {
    if (this.formularioGrp.valid) {
      if (this.servicio) {
        if (this.listaParametro.length > 0) {
          let filCamp: string[] = [CAMPOS_EXCEL.COD_USU, CAMPOS_EXCEL.TIP_DOC_USU, CAMPOS_EXCEL.NRO_DOC_USU, CAMPOS_EXCEL.COD_CEN];
          let filList: string[] = [];
          this.listaParametro.filter(el => (filCamp.includes(el.nomCampoExcel))).forEach(obj => {
            filList.push(obj.nomCampoExcel);
          });

          if (filList.length == 4) {
            let filCampNoPer: string[] = JSON.parse(JSON.stringify(CAMPO_EXCEL_FIJOS));
            let filListNoPer: string[] = [];
            this.listaParametro.filter(el => (filCampNoPer.includes(el.nomCampoExcel))).forEach(obj => {
              filListNoPer.push(obj.nomCampoExcel);
            });

            if (filListNoPer.length == 0) {
              this.guardar = true;

              let req = new EstructuraRegistrarRequest();
              req.nombre = this.formularioGrp.get('nombre').value;
              req.descripcion = this.formularioGrp.get('descripcion').value;
              req.idtTipoUsuario = this.formularioGrp.get('tipoUsuario').value.codigo;
              req.idServicio = this.servicio.idServicio;
              if (this.estructura) {
                req.idEstructuraRepl = this.estructura.idEstructura;
              }
              req.idUsuarioCrea = this.user.getIdUsuario;
              req.listaParametro = this.listaParametro;

              console.log(req);
              this.estructuraService.registrarEstructura(req).subscribe(
                (out: OutResponse<EstructuraRegistrarResponse>) => {
                  if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
                    let res = new EstructuraListarResponse();
                    res.idEstructura = out.objeto.idEstructura;
                    res.nombre = req.nombre;
                    res.idServicio = req.idServicio;
                    res.nomServicio = this.servicio.nombre;
                    res.idEntidad = this.servicio.idEntidad;
                    res.nomEntidad = this.servicio.nomEntidad;
                    res.idLineaIntervencion = this.servicio.idLineaIntervencion;
                    res.nomLineaIntervencion = this.servicio.nomLineaIntervencion;
                    res.flgActivo = CONSTANTES.FLG_ACTIVO;

                    this.dialogRef.close(res);
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
              let strNoPer = '';
              filListNoPer.forEach(obj => {
                strNoPer += '"' + obj + '" ';
              });
              this._snackBar.open('LOS CAMPOS: ' + strNoPer + ' NO SON PERMITIDOS, DEBIDO A QUE SON COLUMNAS FIJAS EN EL REPORTE', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
            }
          } else {
            let str = '';
            filCamp.filter(el => (!filList.includes(el))).forEach(obj => {
              str += '"' + obj + '" ';
            });
            this._snackBar.open('LOS CAMPOS: ' + str + ' SON OBLIGATORIOS, POR FAVOR AGREGAR EN EL MAPEO', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
        } else {
          this._snackBar.open('AGREGUE EL DETALLE DEL MAPEO DE CAMPOS DE LA EDNE', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      } else {
        this._snackBar.open('SELECCIONE UN SERVICIO AL QUE PERTECE LA ESTRUCTURA EDNE', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  buscarServicios(): void {
    const dialogRef = this.dialog.open(BuscServicioComponent, {
      width: '800px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.BUSCAR_SERVICIO.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: ServicioListarResponse) => {
      if (result) {
        this.formularioGrp.get('servicio').setValue(result.nombre);
        this.servicio = result;
      }
    });
  }

  buscarEstructuras(): void {
    const dialogRef = this.dialog.open(BuscEstructuraRplComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.BUSCAR_ESTRUCTURA_RPL.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: EstructuraListarResponse) => {
      if (result) {
        this.spinner.show();
        this.formularioGrp.get('estructuraRepl').setValue(result.nombre);
        this.estructura = result;

        let req = new EstructuraParametroListarRequest();
        req.idEstructura = result.idEstructura;

        this.estructuraService.listarParametroEstructura(req).subscribe(
          (out: OutResponse<EstructuraParametroListarResponse[]>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaParametro = [];
              out.objeto.forEach(el => {
                let obj = new EstructuraRegistrarParametroRequest();
                obj.nomCampoExcel = el.nomCampoExcel;
                obj.ordenCampoExcel = el.ordenCampoExcel;
                obj.nomTablaBd = el.nomTablaBd;
                obj.nomCampoBd = el.nomCampoBd;
                obj.campoEsFk = el.campoEsFk;
                obj.campoIdmaestra = el.campoIdMaestra;
                obj.descripcion = el.descripcion;
                this.listaParametro.push(obj);
              });
              this.cargarDatosTabla();
              this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else {
              this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
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

  buscarTablasBD(): void {
    const dialogRef = this.dialog.open(BuscTablaBdComponent, {
      width: '400px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.BUSCAR_TABLA_BD.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: BDTablaListarResponse) => {
      if (result) {
        this.formularioDetGrp.get('nomTablaBd').setValue(result.nomTabla);
        this.formularioDetGrp.get('nomCampoBd').setValue('');
      }
    });
  }

  buscarCamposBD(): void {
    let nomTabla = this.formularioDetGrp.get('nomTablaBd').value;
    if (nomTabla) {
      const dialogRef = this.dialog.open(BuscCampoTablaBdComponent, {
        width: '600px',
        disableClose: false,
        data: {
          titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.BUSCAR_CAMPO_BD.TITLE(nomTabla),
          objeto: nomTabla
        }
      });

      dialogRef.afterClosed().subscribe((result: BDCampoTablaListarResponse) => {
        if (result) {
          this.formularioDetGrp.get('nomCampoBd').setValue(result.nomColumna);
        }
      });
    } else {
      this._snackBar.open('Por favor complete el nombre de la TABLA, antes de la busqueda de campos', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
    }
  }

  buscarTablasMaestra(): void {
    const dialogRef = this.dialog.open(BuscTablaMaeComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.BUSCAR_TABLA_MAE.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: MaestraListarResponse) => {
      if (result) {
        this.formularioDetGrp.get('campoIdmaestra').setValue(result.idTabla);
      }
    });
  }

  agregarParametro(): void {
    if (this.formularioDetGrp.valid) {
      this.agregar = true;

      let req = new EstructuraRegistrarParametroRequest();
      req.nomCampoExcel = this.formularioDetGrp.get('nomCampoExcel').value;
      req.ordenCampoExcel = this.formularioDetGrp.get('ordenCampoExcel').value;
      req.nomTablaBd = this.formularioDetGrp.get('nomTablaBd').value;
      req.nomCampoBd = this.formularioDetGrp.get('nomCampoBd').value;
      req.campoEsFk = this.formularioDetGrp.get('campoEsFk').value ? 1 : 0;
      req.campoIdmaestra = this.formularioDetGrp.get('campoIdmaestra').value;
      req.descripcion = this.formularioDetGrp.get('descripcion').value;

      let filtroOrdenCampo = this.listaParametro.filter(el => (el.ordenCampoExcel == req.ordenCampoExcel));
      if (filtroOrdenCampo.length == 0) {
        let filtroCampoExcel = this.listaParametro.filter(el => (el.nomCampoExcel == req.nomCampoExcel));
        if (filtroCampoExcel.length == 0) {
          let filtroCampoBd = this.listaParametro.filter(el => (el.nomCampoBd == req.nomCampoBd && el.nomTablaBd == req.nomTablaBd));
          if (filtroCampoBd.length == 0) {
            this.listaParametro.unshift(req);
            this.cargarDatosTabla();
            this.formService.setAsUntoched(this.formularioDetGrp, this.formDetErrors, ['campoEsFk']);
            this.formularioDetGrp.get('campoEsFk').setValue(false);
            this.verActivacionIdMaestra();
            this.formularioDetGrp.get('ordenCampoExcel').setValue(this.getNextOrderInList(this.listaParametro));
            this.focusControlNomCampoExcel();
          } else {
            this._snackBar.open('El campo de la BD: ' + req.nomCampoBd + ' ya existe', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
        } else {
          this._snackBar.open('El campo del archivo excel: ' + req.nomCampoExcel + ' ya existe', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
        }
      } else {
        this._snackBar.open('El mapeo de orden: ' + req.ordenCampoExcel + ' ya existe', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.formService.getValidationErrors(this.formularioDetGrp, this.formDetErrors, true);
    }
    this.agregar = false;
  }

  validarCampoExcelRepetido(listaEstructura: EstructuraRegistrarParametroRequest[], obj: EstructuraRegistrarParametroRequest): void {
    listaEstructura.filter(el => (el.nomCampoExcel == obj.nomCampoExcel))
  }

  elimParametro(obj: EstructuraRegistrarParametroRequest): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        titulo: MENSAJES.MSG_CONFIRMACION_DELETE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == CONSTANTES.COD_CONFIRMADO) {
        let index = this.listaParametro.indexOf(obj);
        this.listaParametro.splice(index, 1);
        this.cargarDatosTabla();
      }
    });
  }

  verActivacionIdMaestra(): void {
    let check = this.formularioDetGrp.get('campoEsFk').value;
    console.log(check);
    if (check) {
      this.formularioDetGrp.get('campoIdmaestra').setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
      this.formularioDetGrp.get('campoIdmaestra').updateValueAndValidity();
      this.formDetErrors = this.formService.buildFormErrors(this.formularioDetGrp, this.formDetErrors);
      console.log('Marcado');
    } else {
      this.formularioDetGrp.get('campoIdmaestra').setValidators(Validators.compose([Validators.maxLength(50)]));
      this.formularioDetGrp.get('campoIdmaestra').updateValueAndValidity();
      this.formularioDetGrp.get('campoIdmaestra').setValue('');
      this.formDetErrors = this.formService.buildFormErrors(this.formularioDetGrp, this.formDetErrors);
      console.log('desmarcado');
    }
  }

  focusControlNomCampoExcel() {
    this.nomCampoExcel.nativeElement.focus();
  }

  getNextOrderInList(listaParametro: EstructuraRegistrarParametroRequest[]) {
    return (Math.max.apply(Math, listaParametro.map(function (o) { return o.ordenCampoExcel }))) + 1;
  }

  cargarMasivaParametro(): void {
    const dialogRef = this.dialog.open(CargMasivaEstructuraComponent, {
      width: '1100px',
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.CARGA_MASIVA_PARAM.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: EstructuraRegistrarParametroRequest[]) => {
      if (result && result.length > 0) {
        this.listaParametro = result;
        this.cargarDatosTabla();
      }
    });
  }
}
