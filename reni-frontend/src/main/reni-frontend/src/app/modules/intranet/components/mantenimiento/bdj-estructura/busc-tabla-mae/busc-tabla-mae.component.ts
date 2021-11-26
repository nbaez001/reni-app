import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { MaestraListarRequest } from 'src/app/modules/intranet/dto/request/maestra-listar.request';
import { MaestraListarResponse } from 'src/app/modules/intranet/dto/response/maestra-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-tabla-mae',
  templateUrl: './busc-tabla-mae.component.html',
  styleUrls: ['./busc-tabla-mae.component.scss']
})
export class BuscTablaMaeComponent implements OnInit {
  buscar: boolean = false;

  listaMaestra: MaestraListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<MaestraListarResponse> = null;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: MaestraListarResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (m: MaestraListarResponse) => (m.descripcion != null) ? `${m.descripcion}` : ''
    }, {
      columnDef: 'idTabla',
      header: 'ID Tabla',
      cell: (m: MaestraListarResponse) => (m.idTabla != null) ? `${m.idTabla}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscTablaMaeComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MaestraService) private maestraService: MaestraService,
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
    this.listarMaestra();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarMaestra(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new MaestraListarRequest();
    req.flgActivo = CONSTANTES.FLG_ACTIVO;
    req.nombre = this.formularioGrp.get('nombre').value;

    this.maestraService.listarMaestra(req).subscribe(
      (out: OutResponse<MaestraListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaMaestra = out.objeto;
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
  }

  seleccionar(el: MaestraListarResponse): void {
    this.dialogRef.close(el);
  }
}
