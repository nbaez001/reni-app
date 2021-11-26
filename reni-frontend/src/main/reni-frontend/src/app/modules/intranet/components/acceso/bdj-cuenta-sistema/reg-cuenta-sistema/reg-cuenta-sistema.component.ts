import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES, MENSAJES_PANEL } from 'src/app/common';
import { DateService } from 'src/app/core/services/date.service';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { CuentaSistemaBuscarPersonaRequest } from 'src/app/modules/intranet/dto/request/cuenta-sistema-buscar-persona.request';
import { CuentaSistemaRegistrarRequest } from 'src/app/modules/intranet/dto/request/cuenta-sistema-registrar.request';
import { PerfilListarRequest } from 'src/app/modules/intranet/dto/request/perfil-listar.request';
import { ServicioListarRequest } from 'src/app/modules/intranet/dto/request/servicio-listar.request';
import { AreaListarResponse } from 'src/app/modules/intranet/dto/response/area-listar.response';
import { CuentaSistemaBuscarPersonaResponse } from 'src/app/modules/intranet/dto/response/cuenta-sistema-buscar-persona.response';
import { CuentaSistemaListarResponse } from 'src/app/modules/intranet/dto/response/cuenta-sistema-listar.response';
import { CuentaSistemaRegistrarResponse } from 'src/app/modules/intranet/dto/response/cuenta-sistema-registrar.response';
import { CuentaSistemaValidarUsuarioRequest } from 'src/app/modules/intranet/dto/response/cuenta-sistema-validar-usuario.request';
import { PerfilListarResponse } from 'src/app/modules/intranet/dto/response/perfil-listar.response';
import { RecursosSeguridadListarCargoResponse } from 'src/app/modules/intranet/dto/response/recursos-seguridad-listar-cargo.response';
import { RecursosSeguridadListarTipoDocumResponse } from 'src/app/modules/intranet/dto/response/recursos-seguridad-listar-tipo-docum.response';
import { ServicioListarResponse } from 'src/app/modules/intranet/dto/response/servicio-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { CuentaSistemaService } from 'src/app/modules/intranet/services/cuenta-sistema.service';
import { EntidadService } from 'src/app/modules/intranet/services/entidad.service';
import { PerfilService } from 'src/app/modules/intranet/services/perfil.service';
import { RecursosSeguridadService } from 'src/app/modules/intranet/services/recursos-seguridad.service';
import { ServicioService } from 'src/app/modules/intranet/services/servicio.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { environment } from 'src/environments/environment';
import { BuscAreaComponent } from '../../../mantenimiento/bdj-entidad/busc-area/busc-area.component';

@Component({
  selector: 'app-reg-cuenta-sistema',
  templateUrl: './reg-cuenta-sistema.component.html',
  styleUrls: ['./reg-cuenta-sistema.component.scss']
})
export class RegCuentaSistemaComponent implements OnInit {
  guardar: boolean = false;

  listaTipoDocumento: RecursosSeguridadListarTipoDocumResponse[];
  listaCargo: RecursosSeguridadListarCargoResponse[];
  listaServicios: ServicioListarResponse[] = [];
  listaPerfil: PerfilListarResponse[];
  listaSexo: any[] = [{ id: 'M', nombre: 'MASCULINO' }, { id: 'F', nombre: 'FEMENINO' }];

  eArea: AreaListarResponse;
  ePersona: CuentaSistemaBuscarPersonaResponse;

  formularioGrp: FormGroup;
  formErrors: any;
  formularioDetGrp: FormGroup;
  formDetErrors: any;
  formularioUsuGrp: FormGroup;
  formUsuErrors: any;

  @ViewChild('allSelected') private allSelected: MatOption;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegCuentaSistemaComponent>,
    private _snackBar: MatSnackBar,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(PerfilService) private perfilService: PerfilService,
    @Inject(CuentaSistemaService) private cuentaSistemaService: CuentaSistemaService,
    @Inject(RecursosSeguridadService) private recursosSeguridadService: RecursosSeguridadService,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(DateService) private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required, Validators.maxLength(20), CustomValidators.onlyNumbers]]
    });

    this.formularioDetGrp = this.fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      apePaterno: ['', [Validators.required, Validators.maxLength(50)]],
      apeMaterno: ['', [Validators.required, Validators.maxLength(50)]],
      fecNacimiento: ['', []],
      sexo: ['', []],
      area: ['', []],
      cargo: ['', []]
    });

    this.formularioUsuGrp = this.fb.group({
      usuario: ['', [Validators.required, Validators.maxLength(50)], CustomValidators.validUsername(this.cuentaSistemaService)],
      contrasenia: ['', [Validators.required, Validators.maxLength(50)]],
      confContrasenia: ['', [Validators.required, Validators.maxLength(50), CustomValidators.confirmPassword]],
      perfil: ['', [Validators.required]],
      servicio: ['', [Validators.required]],
      flgReporteDisociado: ['', []],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.formDetErrors = this.formService.buildFormErrors(this.formularioDetGrp, this.formDetErrors);
    this.formularioDetGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioDetGrp, this.formDetErrors, false);
    });

    this.formUsuErrors = this.formService.buildFormErrors(this.formularioUsuGrp, this.formUsuErrors);
    this.formularioUsuGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioUsuGrp, this.formUsuErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.comboTipoDocumento();
    this.comboCargo();
    this.comboPerfil();
    this.comboServicio();
  }

  togglePerOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.formularioUsuGrp.get('servicio').value.length == this.listaServicios.length)
      this.allSelected.select();
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.formularioUsuGrp.get('servicio').patchValue([...this.listaServicios.map(item => item), 0]);
    } else {
      this.formularioUsuGrp.get('servicio').patchValue([]);
    }
  }

  buscarAreasSeguridad(): void {
    const dialogRef = this.dialog.open(BuscAreaComponent, {
      width: '900px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ENTIDAD.BUSCAR_AREA_SEG.TITLE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe((result: AreaListarResponse) => {
      if (result) {
        this.formularioDetGrp.get('area').setValue(result.nombre);
        this.eArea = result;
      }
    });
  }

  comboTipoDocumento(): void {
    this.recursosSeguridadService.listarTipoDocumento().subscribe(
      (out: OutResponse<RecursosSeguridadListarTipoDocumResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoDocumento = out.objeto;
        } else {
          this.listaTipoDocumento = [];
        }
      }, error => {
        console.log(error);
        this.listaTipoDocumento = [];
      }
    );
  }

  comboCargo(): void {
    this.recursosSeguridadService.listarCargo().subscribe(
      (out: OutResponse<RecursosSeguridadListarCargoResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaCargo = out.objeto;
        } else {
          this.listaCargo = [];
        }
      }, error => {
        console.log(error);
        this.listaCargo = [];
      }
    );
  }

  comboServicio(): void {
    let req = new ServicioListarRequest();
    req.flgActivo = 1;

    this.servicioService.listarServicio(req).subscribe(
      (out: OutResponse<ServicioListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicios = out.objeto;
        } else {
          this.listaServicios = [];
        }
      }, error => {
        console.log(error);
        this.listaServicios = [];
      }
    );
  }

  comboPerfil(): void {
    let req = new PerfilListarRequest();
    req.flgActivo = 1;
    req.idModulo = environment.IdModuloReni;

    this.perfilService.listarPerfil(req).subscribe(
      (out: OutResponse<PerfilListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaPerfil = out.objeto;
        } else {
          this.listaPerfil = [];
        }
      }, error => {
        console.log(error);
        this.listaPerfil = [];
      }
    );
  }

  regCuentaSistema(): void {
    if (this.formularioGrp.valid && this.formularioDetGrp.valid && this.formularioUsuGrp.valid) {
      let listaServicio = this.formularioUsuGrp.get('servicio').value;
      if (listaServicio && listaServicio.length > 0) {
        this.guardar = true;

        let req = new CuentaSistemaRegistrarRequest();
        if (this.ePersona) {
          req.idPersona = this.ePersona.idPersona;
        }
        req.tipoDocumento = this.formularioGrp.get('tipoDocumento').value.idTipoDocumento;
        req.nroDocumento = this.formularioGrp.get('nroDocumento').value;
        req.nombres = this.formularioDetGrp.get('nombres').value;
        req.apePaterno = this.formularioDetGrp.get('apePaterno').value;
        req.apeMaterno = this.formularioDetGrp.get('apeMaterno').value;
        req.fecNacimiento = this.formularioDetGrp.get('fecNacimiento').value;
        req.sexo = this.formularioDetGrp.get('sexo').value.id;
        if (this.eArea) {
          req.idArea = this.eArea.idArea;
        }
        req.idCargo = this.formularioDetGrp.get('cargo').value.idCargo;
        req.usuario = this.formularioUsuGrp.get('usuario').value;
        req.contrasenia = this.formularioUsuGrp.get('contrasenia').value;
        req.idPerfil = this.formularioUsuGrp.get('perfil').value.idPerfil;
        if (this.formularioUsuGrp.get('flgReporteDisociado').value) {
          req.flgReporteDisociado = this.formularioUsuGrp.get('flgReporteDisociado').value == true ? 1 : 0;
        } else {
          req.flgReporteDisociado = 0;
        }

        req.idUsuarioCrea = this.user.idUsuario;

        let listaServ: number[] = [];
        listaServicio.forEach(el => {
          if (el != 0) {
            listaServ.push(el.idServicio);
          }
        });
        req.listaServicios = listaServ;

        console.log(req);
        this.cuentaSistemaService.registrarCuentaSistema(req).subscribe(
          (out: OutResponse<CuentaSistemaRegistrarResponse>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              let res = new CuentaSistemaListarResponse();
              res.idUsuario = out.objeto.idUsuario;
              res.usuario = req.usuario;
              res.idPerfil = req.idPerfil;
              res.nomPerfil = this.formularioUsuGrp.get('perfil').value.nombre;
              res.nomTipoDocumento = this.formularioGrp.get('tipoDocumento').value.descripcion;
              res.idTipoDocumento = req.tipoDocumento;
              res.fecNacimiento = req.fecNacimiento;
              res.sexo = req.sexo;
              res.nroDocumento = req.nroDocumento;
              res.apePaterno = req.apePaterno;
              res.apeMaterno = req.apeMaterno;
              res.nombre = req.nombres;
              res.idArea = req.idArea;
              if (this.eArea) {
                res.nomArea = this.eArea.nombre;
              }
              res.idCargo = req.idCargo;
              res.nomCargo = this.formularioDetGrp.get('cargo').value.nombre;
              res.flgActivo = CONSTANTES.FLG_ACTIVO;

              this.dialogRef.close(res);
              this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else if (out.rcodigo == -100) {
              let res = new CuentaSistemaListarResponse();
              res.idUsuario = out.objeto.idUsuario;
              res.usuario = req.usuario;
              res.idPerfil = req.idPerfil;
              res.nomPerfil = this.formularioUsuGrp.get('perfil').value.nombre;
              res.idTipoDocumento = req.tipoDocumento;
              res.nroDocumento = req.nroDocumento;
              res.apePaterno = req.apePaterno;
              res.apeMaterno = req.apeMaterno;
              res.nombre = req.nombres;
              res.idArea = req.idArea;
              if (this.eArea) {
                res.nomArea = this.eArea.nombre;
              }
              res.idCargo = req.idCargo;
              res.nomCargo = this.formularioDetGrp.get('cargo').value.nombre;
              res.flgActivo = CONSTANTES.FLG_ACTIVO;

              this.dialogRef.close(res);
              this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['info-snackbar'] });
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
        this._snackBar.open('Seleccione un Servicio', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
      }
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
      this.formService.getValidationErrors(this.formularioDetGrp, this.formDetErrors, true);
      this.formService.getValidationErrors(this.formularioUsuGrp, this.formUsuErrors, true);
    }
  }

  validarPersona(): void {
    if (this.formularioGrp.valid) {
      let req = new CuentaSistemaBuscarPersonaRequest();
      req.tipoDocumento = this.formularioGrp.get('tipoDocumento').value.idTipoDocumento;
      req.nroDocumento = this.formularioGrp.get('nroDocumento').value;

      this.cuentaSistemaService.buscarCuentaPersona(req).subscribe(
        (out: OutResponse<CuentaSistemaBuscarPersonaResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.ePersona = out.objeto;
            this.formularioDetGrp.get('nombres').setValue(this.ePersona.nombres);
            this.formularioDetGrp.get('apePaterno').setValue(this.ePersona.apePaterno);
            this.formularioDetGrp.get('apeMaterno').setValue(this.ePersona.apeMaterno);
            this.formularioDetGrp.get('fecNacimiento').setValue(this.dateService.parseGuionDDMMYYYY(this.ePersona.fecNacimiento));
            let seFil = this.listaSexo.filter(el => (el.id == this.ePersona.sexo));
            if (seFil.length > 0) {
              this.formularioDetGrp.get('sexo').setValue(seFil[0]);
            }
            if (this.ePersona.idArea && this.ePersona.nomArea) {
              this.eArea = new AreaListarResponse();
              this.eArea.idArea = this.ePersona.idArea;
              this.eArea.nombre = this.ePersona.nomArea;
              this.formularioDetGrp.get('area').setValue(this.eArea.nombre);
            }
            let cargFil = this.listaCargo.filter(el => (el.idCargo == this.ePersona.idCargo));
            if (cargFil.length > 0) {
              this.formularioDetGrp.get('cargo').setValue(cargFil[0]);
            }
          } else {
            this._snackBar.open('No se ha encontrado datos de persona', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['info-snackbar'] });
            this.ePersona = null;
            this.formularioDetGrp.get('nombres').setValue('');
            this.formularioDetGrp.get('apePaterno').setValue('');
            this.formularioDetGrp.get('apeMaterno').setValue('');
            this.formularioDetGrp.get('fecNacimiento').setValue('');
            this.formularioDetGrp.get('sexo').setValue('');
            this.eArea = null
            this.formularioDetGrp.get('area').setValue('');
            this.formularioDetGrp.get('cargo').setValue('');
          }
        },
        error => {
          console.log(error);
          this.ePersona = null;
          this.formularioDetGrp.get('nombres').setValue('');
          this.formularioDetGrp.get('apePaterno').setValue('');
          this.formularioDetGrp.get('apeMaterno').setValue('');
          this.formularioDetGrp.get('fecNacimiento').setValue('');
          this.formularioDetGrp.get('sexo').setValue('');
          this.eArea = null
          this.formularioDetGrp.get('area').setValue('');
          this.formularioDetGrp.get('cargo').setValue('');
          this._snackBar.open('No se ha encontrado datos de persona', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['info-snackbar'] });
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  validarUsername(): void {
    let username = this.formularioUsuGrp.get('usuario').value;
    if (username && username.length > 0) {
      let req = new CuentaSistemaValidarUsuarioRequest();
      req.username = username;

      this.cuentaSistemaService.validarExisteUsuario(req).subscribe(
        (out: OutResponse<number>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {

          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
        },
        error => {
          console.log(error);
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this._snackBar.open('Ingrese un ID de usuario', '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['info-snackbar'] });
    }
  }
}
