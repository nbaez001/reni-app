import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTES, MENSAJES, MENSAJES_PANEL } from 'src/app/common';
import { DateService } from 'src/app/core/services/date.service';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { CuentaSistemaModificarRequest } from 'src/app/modules/intranet/dto/request/cuenta-sistema-modificar.request';
import { CuentaSistemaUsuarioSeguridadBuscarRequest } from 'src/app/modules/intranet/dto/request/cuenta-sistema-usuario-seguridad-buscar.request';
import { PerfilListarRequest } from 'src/app/modules/intranet/dto/request/perfil-listar.request';
import { ServicioListarRequest } from 'src/app/modules/intranet/dto/request/servicio-listar.request';
import { AreaListarResponse } from 'src/app/modules/intranet/dto/response/area-listar.response';
import { CuentaSistemaListarResponse } from 'src/app/modules/intranet/dto/response/cuenta-sistema-listar.response';
import { CuentaSistemaUsuarioSeguridadBuscarServiciosResponse } from 'src/app/modules/intranet/dto/response/cuenta-sistema-usuario-seguridad-buscar-servicio.response';
import { CuentaSistemaUsuarioSeguridadBuscarResponse } from 'src/app/modules/intranet/dto/response/cuenta-sistema-usuario-seguridad-buscar.response';
import { PerfilListarResponse } from 'src/app/modules/intranet/dto/response/perfil-listar.response';
import { RecursosSeguridadListarCargoResponse } from 'src/app/modules/intranet/dto/response/recursos-seguridad-listar-cargo.response';
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
  selector: 'app-mod-cuenta-sistema',
  templateUrl: './mod-cuenta-sistema.component.html',
  styleUrls: ['./mod-cuenta-sistema.component.scss']
})
export class ModCuentaSistemaComponent implements OnInit {
  modif: boolean = false;

  listaCargo: RecursosSeguridadListarCargoResponse[];
  listaServicios: ServicioListarResponse[] = [];
  listaPerfil: PerfilListarResponse[];
  listaSexo: any[] = [{ id: 'M', nombre: 'MASCULINO' }, { id: 'F', nombre: 'FEMENINO' }];

  eArea: AreaListarResponse;

  formularioGrp: FormGroup;
  formErrors: any;
  formularioDetGrp: FormGroup;
  formDetErrors: any;
  formularioUsuGrp: FormGroup;
  formUsuErrors: any;

  @ViewChild('allSelected') private allSelected: MatOption;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModCuentaSistemaComponent>,
    private _snackBar: MatSnackBar,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(PerfilService) private perfilService: PerfilService,
    @Inject(CuentaSistemaService) private cuentaSistemaService: CuentaSistemaService,
    @Inject(RecursosSeguridadService) private recursosSeguridadService: RecursosSeguridadService,
    @Inject(ServicioService) private servicioService: ServicioService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(DateService) private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<CuentaSistemaListarResponse>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
      nroDocumento: ['', [Validators.required]]
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
      usuario: ['', [Validators.required, Validators.maxLength(50)], CustomValidators.validUsernameMod(this.cuentaSistemaService, this.dataDialog.objeto.usuario)],
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
    this.comboCargo();
    this.comboPerfil();
    this.comboServicio();
    if (this.dataDialog.objeto) {
      this.formularioGrp.get('tipoDocumento').setValue(this.dataDialog.objeto.nomTipoDocumento);
      this.formularioGrp.get('nroDocumento').setValue(this.dataDialog.objeto.nroDocumento);
      this.formularioDetGrp.get('nombres').setValue(this.dataDialog.objeto.nombre);
      this.formularioDetGrp.get('apePaterno').setValue(this.dataDialog.objeto.apePaterno);
      this.formularioDetGrp.get('apeMaterno').setValue(this.dataDialog.objeto.apeMaterno);
      this.formularioDetGrp.get('fecNacimiento').setValue(this.dateService.parseGuionDDMMYYYY(this.dataDialog.objeto.fecNacimiento));
      let seFil = this.listaSexo.filter(el => (el.id == this.dataDialog.objeto.sexo));
      if (seFil.length > 0) {
        this.formularioDetGrp.get('sexo').setValue(seFil[0]);
      }
      if (this.dataDialog.objeto.idArea && this.dataDialog.objeto.nomArea) {
        this.eArea = new AreaListarResponse();
        this.eArea.idArea = this.dataDialog.objeto.idArea;
        this.eArea.nombre = this.dataDialog.objeto.nomArea;
        this.formularioDetGrp.get('area').setValue(this.dataDialog.objeto.nomArea);
      }
      this.formularioUsuGrp.get('usuario').setValue(this.dataDialog.objeto.usuario);
    }
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

  comboCargo(): void {
    this.recursosSeguridadService.listarCargo().subscribe(
      (out: OutResponse<RecursosSeguridadListarCargoResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaCargo = out.objeto;
          if (this.dataDialog.objeto && this.dataDialog.objeto.idCargo) {
            let filCarg = this.listaCargo.filter(el => (el.idCargo == this.dataDialog.objeto.idCargo));
            if (filCarg.length > 0) {
              this.formularioDetGrp.get('cargo').setValue(filCarg[0]);
            }
          }
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
          if (this.dataDialog.objeto) {
            this.listarServiciosUsuario();
          }
        } else {
          this.listaServicios = [];
        }
      }, error => {
        console.log(error);
        this.listaServicios = [];
      }
    );
  }


  listarServiciosUsuario(): void {
    let req = new CuentaSistemaUsuarioSeguridadBuscarRequest();
    req.idUsuario = this.dataDialog.objeto.idUsuario;

    this.cuentaSistemaService.buscarUsuarioSeguridad(req).subscribe(
      (out: OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {

          this.formularioUsuGrp.get('flgReporteDisociado').setValue(out.objeto.flgReporteDisociado);
          let listaServiciosUsuario: CuentaSistemaUsuarioSeguridadBuscarServiciosResponse[] = out.objeto.listaServicios;

          let listaSelected = [];
          this.listaServicios.forEach(el => {
            listaServiciosUsuario.forEach(el2 => {
              if (el.idServicio == el2.idServicio) {
                listaSelected.push(el);
              }
            });
          });

          if (this.listaServicios.length == listaSelected.length) {
            listaSelected.push(0);
          }
          this.formularioUsuGrp.get('servicio').setValue(listaSelected);
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
          if (this.dataDialog.objeto) {
            this.formularioUsuGrp.get('perfil').setValue(this.listaPerfil.filter(el => (el.idPerfil == this.dataDialog.objeto.idPerfil))[0]);
          }
        } else {
          this.listaPerfil = [];
        }
      }, error => {
        console.log(error);
        this.listaPerfil = [];
      }
    );
  }

  modCuentaSistema(): void {
    if (this.formularioGrp.valid && this.formularioDetGrp.valid && this.formularioUsuGrp.valid) {
      let listaServicio = this.formularioUsuGrp.get('servicio').value;
      if (listaServicio && listaServicio.length > 0) {
        this.modif = true;

        let req = new CuentaSistemaModificarRequest();
        req.idUsuario = this.dataDialog.objeto.idUsuario;
        req.nombres = this.formularioDetGrp.get('nombres').value;
        req.apePaterno = this.formularioDetGrp.get('apePaterno').value;
        req.apeMaterno = this.formularioDetGrp.get('apeMaterno').value;
        req.fecNacimiento = this.formularioDetGrp.get('fecNacimiento').value;
        if (this.formularioDetGrp.get('sexo').value) {
          req.sexo = this.formularioDetGrp.get('sexo').value.id;
        }
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
        req.idUsuarioModif = this.user.idUsuario;

        let listaServ: number[] = [];
        listaServicio.forEach(el => {
          if (el != 0) {
            listaServ.push(el.idServicio);
          }
        });
        req.listaServicios = listaServ;

        console.log(req);
        this.cuentaSistemaService.modificarCuentaSistema(req).subscribe(
          (out: OutResponse<any>) => {
            if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
              let res: CuentaSistemaListarResponse = JSON.parse(JSON.stringify(this.dataDialog.objeto));
              res.idUsuario = this.dataDialog.objeto.idUsuario;
              res.usuario = req.usuario;
              res.idPerfil = req.idPerfil;
              res.nomPerfil = this.formularioUsuGrp.get('perfil').value.nombre;
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
              let res: CuentaSistemaListarResponse = JSON.parse(JSON.stringify(this.dataDialog.objeto));
              res.idUsuario = out.objeto.idUsuario;
              res.usuario = req.usuario;
              res.idPerfil = req.idPerfil;
              res.nomPerfil = this.formularioUsuGrp.get('perfil').value.nombre;
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
            this.modif = false;
          },
          error => {
            console.log(error);
            this.modif = false;
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
}
