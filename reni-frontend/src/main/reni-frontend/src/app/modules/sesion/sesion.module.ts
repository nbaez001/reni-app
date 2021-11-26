import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SesionRoutingModule } from './sesion-routing.module';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared.module';
import { SharedSesionService } from './service/shared-sesion.service';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    SesionRoutingModule,
    SharedModule,
    MaterialModule,
  ],
  providers: [
    ...SharedSesionService,
  ]
})
export class SesionModule { }
