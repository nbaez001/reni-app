import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { EstructuraListarRequest } from 'src/app/modules/intranet/dto/request/estructura-listar.request';
import { EstructuraListarResponse } from 'src/app/modules/intranet/dto/response/estructura-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { EstructuraService } from 'src/app/modules/intranet/services/estructura.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-estructura',
  templateUrl: './busc-estructura.component.html',
  styleUrls: ['./busc-estructura.component.scss']
})
export class BuscEstructuraComponent implements OnInit {
  buscar: boolean = false;

  listaEstructura: EstructuraListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<EstructuraListarResponse> = null;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: EstructuraListarResponse) => (m.nombre) ? `${m.nombre}` : ''
    }, {
      columnDef: 'nomEntidad',
      header: 'Entidad',
      cell: (m: EstructuraListarResponse) => (m.nomEntidad) ? `${m.nomEntidad}` : ''
    }, {
      columnDef: 'nomLineaIntervencion',
      header: 'Linea intervencion',
      cell: (m: EstructuraListarResponse) => (m.nomLineaIntervencion) ? `${m.nomLineaIntervencion}` : ''
    }, {
      columnDef: 'nomServicio',
      header: 'Servicio',
      cell: (m: EstructuraListarResponse) => (m.nomServicio) ? `${m.nomServicio}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscEstructuraComponent>,
    private _snackBar: MatSnackBar,
    @Inject(EstructuraService) private servicioService: EstructuraService,
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
    this.listarEstructura();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarEstructura(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new EstructuraListarRequest();
    req.nombre = this.formularioGrp.get('nombre').value;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.servicioService.listarEstructura(req).subscribe(
      (out: OutResponse<EstructuraListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaEstructura = out.objeto;
        } else {
          this.listaEstructura = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaEstructura.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaEstructura);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: EstructuraListarResponse): void {
    this.dialogRef.close(el);
  }
}
