import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { BDTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-tabla-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { AdministracionBdService } from 'src/app/modules/intranet/services/administracion-bd.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-tabla-bd',
  templateUrl: './busc-tabla-bd.component.html',
  styleUrls: ['./busc-tabla-bd.component.scss']
})
export class BuscTablaBdComponent implements OnInit {
  buscar: boolean = false;

  listaTablas: BDTablaListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<BDTablaListarResponse> = null;
  isLoading: boolean = false;

  columnsGrilla = [
    {
      columnDef: 'nomTabla',
      header: 'Nombre Tabla',
      cell: (m: BDTablaListarResponse) => m.nomTabla ? `${m.nomTabla}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscTablaBdComponent>,
    private _snackBar: MatSnackBar,
    @Inject(AdministracionBdService) private administracionBdService: AdministracionBdService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any>
  ) { }

  ngOnInit() {
    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.definirTabla();
    this.listarTablasBD();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarTablasBD(): void {
    this.dataSource = null;
    this.isLoading = true;

    this.administracionBdService.listarTablasBD().subscribe(
      (out: OutResponse<BDTablaListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTablas = out.objeto;
        } else {
          this.listaTablas = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaTablas.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaTablas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: BDTablaListarResponse): void {
    this.dialogRef.close(el);
  }

}
