import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataDialog } from 'src/app/modules/intranet/model/data-dialog.model';

@Component({
  selector: 'app-ver-error',
  templateUrl: './ver-error.component.html',
  styleUrls: ['./ver-error.component.scss']
})
export class VerErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public dataDialog: DataDialog<any[]>) { }

  ngOnInit(): void {
    this.dataDialog.objeto.sort((a, b) => (a.columna > b.columna) ? 1 : -1);
  }

}
