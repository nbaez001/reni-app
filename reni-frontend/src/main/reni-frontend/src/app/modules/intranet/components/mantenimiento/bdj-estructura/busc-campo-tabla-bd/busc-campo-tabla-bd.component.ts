import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES, MENSAJES_PANEL, TIPOS_DATO_BD } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { BDCampoTablaListarRequest } from 'src/app/modules/intranet/dto/request/bd-campo-tabla-listar.request';
import { BDCampoTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-campo-tabla-listar.response';
import { BDTablaListarResponse } from 'src/app/modules/intranet/dto/response/bd-tabla-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { AdministracionBdService } from 'src/app/modules/intranet/services/administracion-bd.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';
import { RegCampoTablaBdComponent } from '../reg-campo-tabla-bd/reg-campo-tabla-bd.component';

@Component({
  selector: 'app-busc-campo-tabla-bd',
  templateUrl: './busc-campo-tabla-bd.component.html',
  styleUrls: ['./busc-campo-tabla-bd.component.scss']
})
export class BuscCampoTablaBdComponent implements OnInit {
  TIPOS_DATO_BD = TIPOS_DATO_BD;
  listaColumnas: BDCampoTablaListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<BDCampoTablaListarResponse> = null;
  isLoading: boolean = false;

  columnsGrilla = [
    {
      columnDef: 'nomColumna',
      header: 'Nombre columna',
      cell: (m: BDCampoTablaListarResponse) => m.nomColumna ? `${m.nomColumna}` : ''
    }, {
      columnDef: 'tipoDato',
      header: 'Tipo de dato',
      cell: (m: BDCampoTablaListarResponse) => m.tipoDato ? `${m.tipoDato}` : ''
    }, {
      columnDef: 'longitudDato',
      header: 'Longitud',
      cell: (m: BDCampoTablaListarResponse) => (TIPOS_DATO_BD.filter(el => (el.tipo == m.tipoDato))[0].longitud == 1) ? `${m.longitudDato}` : `${m.precisionDato}`
    }, {
      columnDef: 'escalaDato',
      header: 'Escala',
      cell: (m: BDCampoTablaListarResponse) => (TIPOS_DATO_BD.filter(el => (el.tipo == m.tipoDato))[0].escala == 1) ? `${m.escalaDato}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscCampoTablaBdComponent>,
    private _snackBar: MatSnackBar,
    @Inject(AdministracionBdService) private administracionBdService: AdministracionBdService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<string>
  ) { }

  ngOnInit() {
    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.definirTabla();
    this.listarCamposBD();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarCamposBD(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new BDCampoTablaListarRequest();
    req.nomTabla = this.dataDialog.objeto;

    this.administracionBdService.listarCamposBD(req).subscribe(
      (out: OutResponse<BDCampoTablaListarResponse[]>) => {
        console.log(out);
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaColumnas = out.objeto;
        } else {
          this.listaColumnas = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaColumnas.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaColumnas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: BDCampoTablaListarResponse): void {
    this.dialogRef.close(el);
  }

  agregarCampoBD(): void {
    const dialogRef = this.dialog.open(RegCampoTablaBdComponent, {
      width: '600px',
      disableClose: false,
      data: {
        titulo: MENSAJES_PANEL.INTRANET.MANTENIMIENTO.ESTRUCTURA.REGISTRAR_CAMPO_BD.TITLE(this.dataDialog.objeto),
        objeto: this.dataDialog.objeto
      }
    });

    dialogRef.afterClosed().subscribe((result: BDCampoTablaListarResponse) => {
      if (result) {
        this.listaColumnas.unshift(result);
        this.cargarDatosTabla();
      }
    });
  }
}
