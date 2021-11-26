import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { ServicioListarRequest } from 'src/app/modules/intranet/dto/request/servicio-listar.request';
import { ServicioListarResponse } from 'src/app/modules/intranet/dto/response/servicio-listar.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { ServicioService } from 'src/app/modules/intranet/services/servicio.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-servicio',
  templateUrl: './busc-servicio.component.html',
  styleUrls: ['./busc-servicio.component.scss']
})
export class BuscServicioComponent implements OnInit {
  buscar: boolean = false;

  listaServicio: ServicioListarResponse[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<ServicioListarResponse> = null;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codigo',
      header: 'Codigo',
      cell: (m: ServicioListarResponse) => m.codigo ? `${m.codigo}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: ServicioListarResponse) => m.nombre ? `${m.nombre}` : ''
    }, {
      columnDef: 'nomTipCentro',
      header: 'Tipo centro',
      cell: (m: ServicioListarResponse) => m.nomTipCentro ? `${m.nomTipCentro}` : ''
    }, {
      columnDef: 'nomEntidad',
      header: 'Entidad',
      cell: (m: ServicioListarResponse) => m.nomEntidad ? `${m.nomEntidad}` : ''
    }, {
      columnDef: 'nomLineaIntervencion',
      header: 'Linea de Intervencion',
      cell: (m: ServicioListarResponse) => m.nomLineaIntervencion ? `${m.nomLineaIntervencion}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscServicioComponent>,
    private _snackBar: MatSnackBar,
    @Inject(ServicioService) private servicioService: ServicioService,
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
    this.listarServicio();
  }

  definirTabla(): void {
    this.displayedColumns = [];
    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarServicio(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new ServicioListarRequest();
    req.nomServicio = this.formularioGrp.get('nombre').value;
    req.flgActivo = CONSTANTES.FLG_ACTIVO;

    this.servicioService.listarServicio(req).subscribe(
      (out: OutResponse<ServicioListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaServicio = out.objeto;
        } else {
          this.listaServicio = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaServicio.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaServicio);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: ServicioListarResponse): void {
    this.dialogRef.close(el);
  }
}
