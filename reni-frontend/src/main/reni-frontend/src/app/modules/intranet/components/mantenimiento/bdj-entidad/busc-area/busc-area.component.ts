import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ACTIVO_LISTA, CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { AreaListarRequest } from 'src/app/modules/intranet/dto/request/area-listar.request';
import { AreaListarResponse } from 'src/app/modules/intranet/dto/response/area-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { EntidadService } from 'src/app/modules/intranet/services/entidad.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-area',
  templateUrl: './busc-area.component.html',
  styleUrls: ['./busc-area.component.scss']
})
export class BuscAreaComponent implements OnInit {
  buscar: boolean = false;

  activoLista: any;

  listaArea: AreaListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<AreaListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: AreaListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'sigla',
      header: 'Siglas',
      cell: (m: AreaListarResponse) => (m.sigla != null) ? `${m.sigla}` : ''
    }, {
      columnDef: 'flgActivo',
      header: 'Estado',
      cell: (m: AreaListarResponse) => this.activoLista.filter(el => (el.id == m.flgActivo))[0].nombre
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscAreaComponent>,
    private _snackBar: MatSnackBar,
    @Inject(EntidadService) private entidadService: EntidadService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(256)]],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.definirTabla();
    this.activoLista = JSON.parse(JSON.stringify(ACTIVO_LISTA));
    this.listarArea();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarArea(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new AreaListarRequest();
    req.nombre = this.formularioGrp.get('nombre').value;

    this.entidadService.listarArea(req).subscribe(
      (out: OutResponse<AreaListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaArea = out.objeto;
        } else {
          this.listaArea = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaArea.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaArea);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: AreaListarResponse): void {
    this.dialogRef.close(el);
  }
}
