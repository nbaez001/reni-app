import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { EntidadListarRequest } from 'src/app/modules/intranet/dto/request/entidad-listar.request';
import { EntidadListarResponse } from 'src/app/modules/intranet/dto/response/entidad-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { EntidadService } from 'src/app/modules/intranet/services/entidad.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-entidad',
  templateUrl: './busc-entidad.component.html',
  styleUrls: ['./busc-entidad.component.scss']
})
export class BuscEntidadComponent implements OnInit {
  buscar: boolean = false;

  listaEntidad: EntidadListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<EntidadListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: EntidadListarResponse) => (m.codigo != null) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: EntidadListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'siglas',
      header: 'Siglas',
      cell: (m: EntidadListarResponse) => (m.siglas != null) ? `${m.siglas}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscEntidadComponent>,
    private _snackBar: MatSnackBar,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(250)]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.definirTabla();
    this.listarEntidad();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarEntidad(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new EntidadListarRequest();
    req.nombre = this.formularioGrp.get('nombre').value;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.entidadService.listarEntidad(req).subscribe(
      (out: OutResponse<EntidadListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEntidad = out.objeto;
        } else {
          this.listaEntidad = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaEntidad.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaEntidad);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: EntidadListarResponse): void {
    this.dialogRef.close(el);
  }
}
