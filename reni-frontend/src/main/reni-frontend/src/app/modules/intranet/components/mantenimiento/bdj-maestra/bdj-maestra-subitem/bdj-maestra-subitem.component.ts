import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONSTANTES, MENSAJES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { MaestraSubitemEliminarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-eliminar.request';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { MaestraSubitemModificarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-modificar.request';
import { MaestraSubitemRegistrarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-registrar.request';
import { MaestraListarResponse } from 'src/app/modules/intranet/dto/response/maestra-listar.response';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { MaestraSubitemRegistrarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-registrar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-bdj-maestra-subitem',
  templateUrl: './bdj-maestra-subitem.component.html',
  styleUrls: ['./bdj-maestra-subitem.component.scss']
})
export class BdjMaestraSubitemComponent implements OnInit {
  guardar: boolean = false;
  modif: boolean = false;

  index: number = null;

  listaMaestra: MaestraSubitemListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<MaestraSubitemListarResponse>;
  isLoading: boolean = false;

  eMaestra: MaestraSubitemListarResponse = null;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: MaestraSubitemListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: MaestraSubitemListarResponse) => (m.codigo != null) ? `${m.codigo}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descrpcion',
      cell: (m: MaestraSubitemListarResponse) => (m.descripcion != null) ? `${m.descripcion}` : ''
    }, {
      columnDef: 'orden',
      header: 'Orden',
      cell: (m: MaestraSubitemListarResponse) => (m.orden != null) ? `${m.orden}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('nombre') nombre: ElementRef;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BdjMaestraSubitemComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<MaestraListarResponse>,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      orden: ['', [Validators.required]],
      descripcion: ['', [Validators.maxLength(500)]]
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.definirTabla();
    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.listarMaestra();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
    this.displayedColumns.push('opt');
  }

  listarMaestra(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new MaestraSubitemListarRequest();
    req.idTabla = this.dataDialog.objeto.idTabla;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (data: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaMaestra = data.objeto;
        } else {
          this.listaMaestra = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaMaestra.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaMaestra);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.formularioGrp.get('orden').setValue(this.listaMaestra.length + 1);
  }

  regMaestraSubitem(): void {
    if (this.formularioGrp.valid) {
      this.guardar = true;

      let req = new MaestraSubitemRegistrarRequest();
      req.idTabla = this.dataDialog.objeto.idTabla;
      req.idMaestraPadre = this.dataDialog.objeto.idMaestra;
      req.codigo = this.formularioGrp.get('codigo').value;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.descripcion = this.formularioGrp.get('descripcion').value;
      req.orden = this.formularioGrp.get('orden').value;
      req.idUsuarioCrea = this.user.getIdUsuario;

      this.maestraService.registrarMaestraSubitem(req).subscribe(
        (out: OutResponse<MaestraSubitemRegistrarResponse>) => {
          if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
            this.limpiar();

            let res = new MaestraSubitemListarResponse();
            res.idMaestra = out.objeto.idMaestra;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.descripcion = req.descripcion;
            res.flgActivo = CONSTANTES.FLG_ACTIVO;
            res.orden = req.orden;

            this.listaMaestra.unshift(res);
            this.cargarDatosTabla();
            this.focusControlNombre()
            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(out.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
          }
          this.guardar = false;
        },
        error => {
          console.error(error);
          this.guardar = false;
          this._snackBar.open(error.statusText, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['error-snackbar'] });
        }
      );
    } else {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  mostrarMaestraSubitem(obj: MaestraSubitemListarResponse): void {
    this.index = this.listaMaestra.indexOf(obj);

    this.formularioGrp.get('nombre').setValue(obj.nombre);
    this.formularioGrp.get('codigo').setValue(obj.codigo);
    this.formularioGrp.get('orden').setValue(obj.orden);
    this.formularioGrp.get('descripcion').setValue(obj.descripcion);

    this.eMaestra = JSON.parse(JSON.stringify(obj));
  }

  modMaestraSubitem(): void {
    if (this.formularioGrp.valid) {
      this.modif = true;

      let req = new MaestraSubitemModificarRequest();
      req.idMaestra = this.eMaestra.idMaestra;
      req.idTabla = this.dataDialog.objeto.idTabla;
      req.codigo = this.formularioGrp.get('codigo').value;
      req.nombre = this.formularioGrp.get('nombre').value;
      req.orden = this.formularioGrp.get('orden').value;
      req.descripcion = this.formularioGrp.get('descripcion').value;
      req.idUsuarioModif = this.user.getIdUsuario;

      this.maestraService.modificarMaestraSubitem(req).subscribe(
        (data: OutResponse<any>) => {
          if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
            let res = new MaestraSubitemListarResponse();
            res.idMaestra = req.idMaestra;
            res.codigo = req.codigo;
            res.nombre = req.nombre;
            res.descripcion = req.descripcion;
            res.flgActivo = CONSTANTES.FLG_ACTIVO;
            res.orden = req.orden;
            this.listaMaestra.splice(this.index, 1, res);

            this.limpiar();
            this.cargarDatosTabla();
            this.focusControlNombre();
            this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
          } else {
            this._snackBar.open(data.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
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
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, true);
    }
  }

  limpiar(): void {
    this.eMaestra = null;
    this.index = null;
    this.formService.setAsUntoched(this.formularioGrp, this.formErrors);
  }

  eliminarMaestraSubitem(obj: MaestraSubitemListarResponse): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        titulo: MENSAJES.MSG_CONFIRMACION_DELETE,
        objeto: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == CONSTANTES.COD_CONFIRMADO) {
        this.spinner.show();
        let index = this.listaMaestra.indexOf(obj);
        let req = new MaestraSubitemEliminarRequest();
        req.idMaestra = obj.idMaestra;
        req.idUsuarioModif = this.user.getIdUsuario;

        this.maestraService.eliminarMaestraSubitem(req).subscribe(
          (data: OutResponse<any>) => {
            if (data.rcodigo == CONSTANTES.R_COD_EXITO) {
              this.listaMaestra.splice(index, 1);
              this.cargarDatosTabla();

              this._snackBar.open(MENSAJES.MSG_EXITO_OPERACION, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['success-snackbar'] });
            } else {
              this._snackBar.open(data.rmensaje, '✖', { duration: 9000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: ['warning-snackbar'] });
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

  focusControlNombre() {
    this.nombre.nativeElement.focus();
  }

  regModMaestraSubItem(): void {
    if (this.eMaestra) {
      this.modMaestraSubitem();
    } else {
      this.regMaestraSubitem();
    }
  }
}
