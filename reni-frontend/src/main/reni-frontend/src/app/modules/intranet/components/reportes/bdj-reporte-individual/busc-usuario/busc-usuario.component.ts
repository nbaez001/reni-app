import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTES, MAESTRAS } from 'src/app/common';
import { FormService } from 'src/app/core/services/form.service';
import { CustomValidators } from 'src/app/core/validators/custom-validators';
import { MaestraSubitemListarRequest } from 'src/app/modules/intranet/dto/request/maestra-subitem-listar.request';
import { ReporteIntervencionListarUsuarioXDatosRequest } from 'src/app/modules/intranet/dto/request/reporte-intervencion-listar-usuario-x-datos.request';
import { MaestraSubitemListarResponse } from 'src/app/modules/intranet/dto/response/maestra-subitem-listar.response';
import { ReporteIntervencionListarUsuarioXDatosResponse } from 'src/app/modules/intranet/dto/response/reporte-intervencion-listar-usuario-x-datos.response';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';
import { MaestraService } from 'src/app/modules/intranet/services/maestra.service';
import { ReporteService } from 'src/app/modules/intranet/services/reporte.service';
import { OutResponse } from 'src/app/modules/sesion/dto/response/out.response';
import { UsuarioService } from 'src/app/modules/sesion/service/usuario.service';

@Component({
  selector: 'app-busc-usuario',
  templateUrl: './busc-usuario.component.html',
  styleUrls: ['./busc-usuario.component.scss']
})
export class BuscUsuarioComponent implements OnInit {
  buscar: boolean = false;

  listaTipoDocumento: MaestraSubitemListarResponse[] = [];
  listaSexo: MaestraSubitemListarResponse[] = [];

  listaUsuario: ReporteIntervencionListarUsuarioXDatosResponse[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<ReporteIntervencionListarUsuarioXDatosResponse>;
  isLoading: boolean = false;

  formularioGrp: FormGroup;
  formErrors: any;

  columnsGrilla = [
    {
      columnDef: 'codUsuario',
      header: 'Codigo',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.codUsuario != null) ? `${m.codUsuario}` : ''
    }, {
      columnDef: 'codDisociacion',
      header: 'Codigo Disociacion',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.codDisociacion != null) ? `${m.codDisociacion}` : ''
    }, {
      columnDef: 'tipDocumento',
      header: 'Tipo documento',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.tipDocumento != null) ? `${m.tipDocumento}` : ''
    }, {
      columnDef: 'nroDocumento',
      header: 'Nro Documento',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.nroDocumento != null) ? `${m.nroDocumento}` : ''
    }, {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.nombre != null) ? `${m.nombre}` : ''
    }, {
      columnDef: 'apePaterno',
      header: 'Apellido paterno',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.apePaterno != null) ? `${m.apePaterno}` : ''
    }, {
      columnDef: 'apeMaterno',
      header: 'Apellido materno',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.apeMaterno != null) ? `${m.apeMaterno}` : ''
    }, {
      columnDef: 'sexo',
      header: 'Sexo',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.sexo != null) ? `${m.sexo}` : ''
    }, {
      columnDef: 'fecNacimiento',
      header: 'Sexo',
      cell: (m: ReporteIntervencionListarUsuarioXDatosResponse) => (m.fecNacimiento != null) ? `${this.datePipe.transform(m.fecNacimiento, 'dd/MM/yyyy')}` : ''
    }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BuscUsuarioComponent>,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    @Inject(MaestraService) private maestraService: MaestraService,
    @Inject(ReporteService) private reporteService: ReporteService,
    @Inject(FormService) private formService: FormService,
    @Inject(UsuarioService) private user: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<number>
  ) { }

  ngOnInit() {
    this.formularioGrp = this.fb.group({
      tipoDocumento: ['', []],
      nroDocumento: ['', [CustomValidators.onlyNumbers]],
      nombre: ['', []],
      apePaterno: ['', []],
      apeMaterno: ['', []],
      sexo: ['', []],
    });

    this.formErrors = this.formService.buildFormErrors(this.formularioGrp, this.formErrors);
    this.formularioGrp.valueChanges.subscribe((val: any) => {
      this.formService.getValidationErrors(this.formularioGrp, this.formErrors, false);
    });

    this.inicializarVariables();
  }

  inicializarVariables(): void {
    this.comboTipoDocumento();
    this.comboSexo();

    this.definirTabla();
    this.cargarDatosTabla();
  }

  comboTipoDocumento(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.TIPO_DOCUMENTO;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaTipoDocumento = out.objeto;
        } else {
          console.log(out.rmensaje);
          this.listaTipoDocumento = [];
        }
      },
      error => {
        console.log(error);
        this.listaTipoDocumento = [];
      }
    );
  }

  comboSexo(): void {
    let req = new MaestraSubitemListarRequest();
    req.idTabla = MAESTRAS.SEXO_USU;

    this.maestraService.listarMaestraSubitem(req).subscribe(
      (out: OutResponse<MaestraSubitemListarResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaSexo = out.objeto;
        } else {
          console.log(out.rmensaje);
          this.listaSexo = [];
        }
      },
      error => {
        console.log(error);
        this.listaSexo = [];
      }
    );
  }

  definirTabla(): void {
    this.displayedColumns = [];

    // ELIMINA EL COD_USU o COD_DISOC
    if (this.dataDialog.objeto == 1) {//CODIGO DISOCIACION ACTIVO
      let lFiltrado = this.columnsGrilla.filter(el => (el.columnDef == 'codUsuario'));
      if (lFiltrado.length > 0) {
        this.columnsGrilla.splice(this.columnsGrilla.indexOf(lFiltrado[0]), 1);
      }
    } else {
      let lFiltrado = this.columnsGrilla.filter(el => (el.columnDef == 'codDisociacion'));
      if (lFiltrado.length > 0) {
        this.columnsGrilla.splice(this.columnsGrilla.indexOf(lFiltrado[0]), 1);
      }
    }

    this.columnsGrilla.forEach(c => {
      this.displayedColumns.push(c.columnDef);
    });
    this.displayedColumns.unshift('id');
  }

  listarUsuario(): void {
    this.dataSource = null;
    this.isLoading = true;

    let req = new ReporteIntervencionListarUsuarioXDatosRequest();
    req.tipDocumento = (this.formularioGrp.get('tipoDocumento').value) ? this.formularioGrp.get('tipoDocumento').value.codigo : null;
    req.nroDocumento = this.formularioGrp.get('nroDocumento').value;
    req.nombre = this.formularioGrp.get('nombre').value;
    req.apePaterno = this.formularioGrp.get('apePaterno').value;
    req.apeMaterno = this.formularioGrp.get('apeMaterno').value;
    req.tipSexo = (this.formularioGrp.get('sexo').value) ? this.formularioGrp.get('sexo').value.codigo : null;

    this.reporteService.listarUsuarioXDatos(req).subscribe(
      (out: OutResponse<ReporteIntervencionListarUsuarioXDatosResponse[]>) => {
        if (out.rcodigo == CONSTANTES.R_COD_EXITO) {
          this.listaUsuario = out.objeto;
        } else {
          this.listaUsuario = [];
        }
        this.cargarDatosTabla();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      }
    );
  }

  cargarDatosTabla(): void {
    if (this.listaUsuario.length > 0) {
      this.dataSource = new MatTableDataSource(this.listaUsuario);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  seleccionar(el: ReporteIntervencionListarUsuarioXDatosResponse): void {
    this.dialogRef.close(el);
  }

}
