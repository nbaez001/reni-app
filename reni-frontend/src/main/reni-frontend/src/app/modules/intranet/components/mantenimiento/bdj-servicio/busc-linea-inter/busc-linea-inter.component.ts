import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { LineaIntervencionListarRequest } from 'src/app/modules/intranet/dto/request/linea-intervencion-listar.request';
import { LineaIntervencionListarResponse } from 'src/app/modules/intranet/dto/response/linea-intervencion-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { LineaIntervencionService } from 'src/app/modules/intranet/services/linea-intervencion.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-linea-inter',
  templateUrl: './busc-linea-inter.component.html',
  styleUrls: ['./busc-linea-inter.component.scss']
})
export class BuscLineaInterComponent implements OnInit {
  buscar: boolean = false;

  listaLineaIntervencion: LineaIntervencionListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<LineaIntervencionListarResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: LineaIntervencionListarResponse) => (m.codigo != null) ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: LineaIntervencionListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscLineaInterComponent>,
    private _snackBar: MatSnackBar,
    @Inject(LineaIntervencionService) private entidadService: LineaIntervencionService,
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
    this.listarLineaIntervencion();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarLineaIntervencion(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new LineaIntervencionListarRequest();
    req.nombre = this.formularioGrp.get('nombre').value;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.entidadService.listarLineaIntervencion(req).subscribe(
      (out: OutResponse<LineaIntervencionListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaLineaIntervencion = out.objeto;
        } else {
          this.listaLineaIntervencion = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaLineaIntervencion.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaLineaIntervencion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: LineaIntervencionListarResponse): void {
    this.dialogRef.close(el);
  }
}
