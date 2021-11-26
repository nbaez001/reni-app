import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ACTIVO_LISTA, CONSTANTES, LISTA_CONFIRMACION, MAESTRAS, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { CentroAtencionRegistrarRequest } from 'src/app/modules/intranet/dto/request/centro-atencion-registrar.request';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { SubtipoCentroListarRequest } from 'src/app/modules/intranet/dto/request/subtipo-centro-listar.request';
import { UbigeoDistritoListarRequest } from 'src/app/modules/intranet/dto/request/ubigeo-distrito-listar.request';
import { UbigeoProvinciaListarRequest } from 'src/app/modules/intranet/dto/request/ubigeo-provincia-listar.request';
import { CentroAtencionListarResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-listar.response';
import { CentroAtencionRegistrarResponse } from 'src/app/modules/intranet/dto/response/centro-atencion-registrar.response';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { RecursosSeguridadListarTipoDocumResponse } from 'src/app/modules/intranet/dto/response/recursos-seguridad-listar-tipo-docum.response';
import { SubtipoCentroListarResponse } from 'src/app/modules/intranet/dto/response/subtipo-centro-listar.response';
import { UbigeoDepartamentoListarResponse } from 'src/app/modules/intranet/dto/response/ubigeo-departamento-listar.response';
import { UbigeoDistritoListarResponse } from 'src/app/modules/intranet/dto/response/ubigeo-distrito-listar.response';
import { UbigeoProvinciaListarResponse } from 'src/app/modules/intranet/dto/response/ubigeo-provincia-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { CentroAtencionService } from 'src/app/modules/intranet/services/centro-atencion.service';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { RecursosSeguridadService } from 'src/app/modules/intranet/services/recursos-seguridad.service';
import { TipoCentroService } from 'src/app/modules/intranet/services/tipo-centro.service';
import { UbigeoService } from 'src/app/modules/intranet/services/ubigeo.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-reg-centro-atencion',
  templateUrl: './reg-centro-atencion.component.html',
  styleUrls: ['./reg-centro-atencion.component.scss']
})
export class RegCentroAtencionComponent implements OnInit {
  guardar: boolean = false;

  listaTipoCentros: MaestraSubitemListarResponse[] = null;
  listaDepartamentos: UbigeoDepartamentoListarResponse[] = null;
  listaProvincias: UbigeoProvinciaListarResponse[] = null;
  listaDistritos: UbigeoDistritoListarResponse[] = null;
  listaConfirmacion: any[] = null;
  listaTipoDocumento: RecursosSeguridadListarTipoDocumResponse[] = null;
  listaSubtipoCentro: SubtipoCentroListarResponse[] = null;

  activoLista: any[] = [];

  formularioGrp: FormGroup;
  formErrors: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegCentroAtencionComponent>,
    private _snackBar: MatSnackBar,
    @Inject(CentroAtencionService) private centroAtencionService: CentroAtencionService,
    @Inject(RecursosSeguridadService) private recursosSeguridadService: RecursosSeguridadService,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(TipoCentroService) private tipoCentroService: TipoCentroService,
    @Inject(UbigeoService) private ubigeoService: UbigeoService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(FormService) private formService: FormService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      codigo: ['', [Validators.required, Validators.maxLength(25)]],
      tipoCentro: ['', [Validators.required]],
      subtipoCentro: ['', []],
      flgActivo: ['', [Validators.required]],
      fechaCreacion: ['', []],
      departamento: ['', []],
      provincia: ['', []],
      distrito: ['', []],
      ubigeo: ['', [Validators.maxLength(10)]],
      direccion: ['', [Validators.maxLength(250)]],
      refDireccion: ['', [Validators.maxLength(250)]],
      areaResid: ['', [Validators.maxLength(250)]],
      flgTieneTelef: ['', []],
      flgTieneLuz: ['', []],
      flgTieneAgua: ['', []],
      flgTieneDesague: ['', []],
      capacidadMaxima: ['', []],
      tipoDocRepres: ['', []],
      nroDocRepres: ['', [Validators.maxLength(15), CustomValidators.onlyNumbers]],
      nombreRepres: ['', [Validators.maxLength(100)]],
      apePaternoRepres: ['', [Validators.maxLength(100)]],
      apeMaternoRepres: ['', [Validators.maxLength(100)]],
      nroTelefono: ['', [Validators.maxLength(20), CustomValidators.onlyNumbers]],
      tipoCoordenada: ['', [Validators.maxLength(50)]],
      coordenadaX: ['', [Validators.maxLength(50), CustomValidators.onlyNumberPuntoSigno]],
      coordenadaY: ['', [Validators.maxLength(50), CustomValidators.onlyNumberPuntoSigno]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  public inicializarVariables(): void {
    this.comboTipoCentro();
    this.comboTipoDocumento();
    this.comboDepartamento();

    this.activoLista = JSON.parse(JSON.stringify(ACTIVO_LISTA));
    this.listaConfirmacion = JSON.parse(JSON.stringify(LISTA_CONFIRMACION));
  }

  comboTipoCentro(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_CENTRO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoCentros = out.objeto;
        } else {
          console.log(out.rmensaje);
          this.listaTipoCentros = [];
        }
        this.comboSubtipoCentro();
      },
      error => {
        console.log(error);
        this.listaTipoCentros = [];
        this.comboSubtipoCentro();
      }
    );
  }

  comboSubtipoCentro(): void {
    let tipoCentro = this.formularioGrp.get('tipoCentro').value;

    if (tipoCentro) {
      let req = new SubtipoCentroListarRequest();
      req.idTipoCentroPadre = tipoCentro.idMaestra;
      req.flgActivo = CONSTANTES.FLG_ACTIVO;

      this.tipoCentroService.listarSubtipoCentro(req).subscribe(
        (out: OutResponse<SubtipoCentroListarResponse[]>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.listaSubtipoCentro = out.objeto;
          } else {
            console.log(out.rmensaje);
            this.listaSubtipoCentro = [];
          }
        },
        error => {
          console.log(error);
          this.listaSubtipoCentro = [];
        }
      );
    }
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

  // comboTipoDocumento(): void {
  //   let req = new MaestraSubitemListarRequest();
  //   req.idTabla = MAESTRAS.TIPO_DOCUMENTO;

  //   this.maestraService.listarMaestraSubitem(req).subscribe(
  //     (out: OutResponse<MaestraSubitemListarResponse[]>) => {
  //       if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
  //         this.listaTipoDocumento = out.objeto;
  //       } else {
  //         console.log(out.rmensaje);
  //         this.listaTipoDocumento = [];
  //       }
  //     },
  //     error => {
  //       console.log(error);
  //       this.listaTipoDocumento = [];
  //     }
  //   );
  // }

  comboDepartamento(): void {
    this.ubigeoService.listarDepartamento().subscribe(
      (out: OutResponse<UbigeoDepartamentoListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaDepartamentos = out.objeto;
          this.comboProvincia();
        } else {
          console.log(out.rmensaje);
          this.listaDepartamentos = [];
        }
      }, error => {
        console.log(error);
        this.listaDepartamentos = [];
      }
    )
  }

  comboProvincia(): void {
    let req = new UbigeoProvinciaListarRequest();
    req.idDepartamento = this.formularioGrp.get('departamento').value.idDepartamento;

    this.ubigeoService.listarProvincia(req).subscribe(
      (out: OutResponse<UbigeoProvinciaListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaProvincias = out.objeto;
          this.comboDistrito();
        } else {
          console.log(out.rmensaje);
          this.listaProvincias = [];
        }
      }, error => {
        console.log(error);
        this.listaProvincias = [];
      }
    )
  }

  comboDistrito(): void {
    let req = new UbigeoDistritoListarRequest();
    req.idProvincia = this.formularioGrp.get('provincia').value.idProvincia;

    this.ubigeoService.listarDistrito(req).subscribe(
      (out: OutResponse<UbigeoDistritoListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaDistritos = out.objeto;
        } else {
          console.log(out.rmensaje);
          this.listaDistritos = []
        }
      }, error => {
        console.log(error);
        this.listaDistritos = []
      }
    )
  }

  regCentroAtencion(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new CentroAtencionRegistrarRequest();
      req.nombre = this.formularioGrp.get('nombre').value;
      req.codigo = this.formularioGrp.get('codigo').value;
      req.idtTipoCentro = this.formularioGrp.get('tipoCentro').value.codigo;
      req.idtSubtipoCentro = this.formularioGrp.get('subtipoCentro').value.codigo;
      req.flgActivo = this.formularioGrp.get('flgActivo').value.id;
      req.fechaCreacion = this.formularioGrp.get('fechaCreacion').value;
      req.ubigeo = this.formularioGrp.get('ubigeo').value;
      if (this.formularioGrp.get('departamento').value) {
        req.departamento = this.formularioGrp.get('departamento').value.descripcion;
      }
      if (this.formularioGrp.get('provincia').value) {
        req.provincia = this.formularioGrp.get('provincia').value.descripcion;
      }
      if (this.formularioGrp.get('distrito').value) {
        req.distrito = this.formularioGrp.get('distrito').value.descripcion;
      }
      req.direccion = this.formularioGrp.get('direccion').value;
      req.refDireccion = this.formularioGrp.get('refDireccion').value;
      req.areaResid = this.formularioGrp.get('areaResid').value;
      req.flgTieneTelef = this.formularioGrp.get('flgTieneTelef').value.id;
      req.flgTieneLuz = this.formularioGrp.get('flgTieneLuz').value.id;
      req.flgTieneAgua = this.formularioGrp.get('flgTieneAgua').value.id;
      req.flgTieneDesague = this.formularioGrp.get('flgTieneDesague').value.id;
      req.capacidadMaxima = this.formularioGrp.get('capacidadMaxima').value;
      req.idTipDocRepres = this.formularioGrp.get('tipoDocRepres').value.idTipoDocumento;
      req.nroDocRepres = this.formularioGrp.get('nroDocRepres').value;
      req.nombreRepres = this.formularioGrp.get('nombreRepres').value;
      req.apePaternoRepres = this.formularioGrp.get('apePaternoRepres').value;
      req.apeMaternoRepres = this.formularioGrp.get('apeMaternoRepres').value;
      req.nroTelefono = this.formularioGrp.get('nroTelefono').value;
      req.tipoCoordenada = this.formularioGrp.get('tipoCoordenada').value;
      req.coordenadaX = this.formularioGrp.get('coordenadaX').value;
      req.coordenadaY = this.formularioGrp.get('coordenadaY').value;
      req.idUsuarioCrea = this.user.getIdUsuario;

      console.log(req);
      this.centroAtencionService.registrarCentroAtencion(req).subscribe(
        (out: OutResponse<CentroAtencionRegistrarResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new CentroAtencionListarResponse();
            res.idCentroAtencion = out.objeto.idCentroAtencion;
            res.idtTipoCentro = req.idtTipoCentro;
            res.nomTipoCentro = this.formularioGrp.get('tipoCentro').value.nombre;
            res.idtSubtipoCentro = req.idtSubtipoCentro;
            res.nomSubtipoCentro = this.formularioGrp.get('subtipoCentro').value.nombre;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.fechaCreacion = req.fechaCreacion;
            res.ubigeo = req.ubigeo;
            res.nomDepartamento = this.formularioGrp.get('departamento').value.descripcion;
            res.nomProvincia = this.formularioGrp.get('provincia').value.descripcion;
            res.nomDistrito = this.formularioGrp.get('distrito').value.descripcion;
            res.direccion = req.direccion;
            res.refDireccion = req.refDireccion;
            res.areaResid = req.areaResid;
            res.flgTieneTelef = req.flgTieneTelef;
            res.flgTieneLuz = req.flgTieneLuz;
            res.flgTieneAgua = req.flgTieneAgua;
            res.flgTieneDesague = req.flgTieneDesague;
            res.capacidadMaxima = req.capacidadMaxima;
            res.idTipDocRepres = req.idTipDocRepres;
            res.nomTipDocRepres = this.formularioGrp.get('tipoDocRepres').value.descripcion;
            res.nroDocRepres = req.nroDocRepres;
            res.nombreRepres = req.nombreRepres;
            res.apePaternoRepres = req.apePaternoRepres;
            res.apeMaternoRepres = req.apeMaternoRepres;
            res.nroTelefono = req.nroTelefono;
            res.tipoCoordenada = req.tipoCoordenada;
            res.coordenadaX = req.coordenadaX;
            res.coordenadaY = req.coordenadaY;
            res.flgActivo = req.flgActivo;

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
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  actualizarUbigeo(): void {
    let ubigeo = '';
    if (this.formularioGrp.get('distrito').value && this.formularioGrp.get('distrito').value.idDistrito) {
      ubigeo = this.formularioGrp.get('distrito').value.ubigeoInei;
    } else {
      if (this.formularioGrp.get('provincia').value && this.formularioGrp.get('provincia').value.idProvincia) {
        ubigeo = this.formularioGrp.get('provincia').value.ubigeoInei;
      } else {
        if (this.formularioGrp.get('departamento').value && this.formularioGrp.get('departamento').value.idDepartamento) {
          ubigeo = this.formularioGrp.get('departamento').value.ubigeoInei;
        }
      }
    }
    this.formularioGrp.get('ubigeo').setValue(ubigeo);
  }
}
