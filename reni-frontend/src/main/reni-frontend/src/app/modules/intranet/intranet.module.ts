import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { IntranetRoutingModule } from './intranet-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from '../material.module';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { IconModule } from '../icon.module';
import { SharedModule } from '../shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedIntranetService } from './services/shared-intranet.service';
import { BdjMaestraComponent } from './components/mantenimiento/bdj-maestra/bdj-maestra.component';
import { RegMaestraComponent } from './components/mantenimiento/bdj-maestra/reg-maestra/reg-maestra.component';
import { ModMaestraComponent } from './components/mantenimiento/bdj-maestra/mod-maestra/mod-maestra.component';
import { ConfirmComponent } from './components/shared/confirm/confirm.component';
import { BdjMaestraSubitemComponent } from './components/mantenimiento/bdj-maestra/bdj-maestra-subitem/bdj-maestra-subitem.component';
import { BdjEntidadComponent } from './components/mantenimiento/bdj-entidad/bdj-entidad.component';
import { BdjLineaIntervencionComponent } from './components/mantenimiento/bdj-linea-intervencion/bdj-linea-intervencion.component';
import { RegEntidadComponent } from './components/mantenimiento/bdj-entidad/reg-entidad/reg-entidad.component';
import { ModEntidadComponent } from './components/mantenimiento/bdj-entidad/mod-entidad/mod-entidad.component';
import { BuscAreaComponent } from './components/mantenimiento/bdj-entidad/busc-area/busc-area.component';
import { RegLineaIntervencionComponent } from './components/mantenimiento/bdj-linea-intervencion/reg-linea-intervencion/reg-linea-intervencion.component';
import { ModLineaIntervencionComponent } from './components/mantenimiento/bdj-linea-intervencion/mod-linea-intervencion/mod-linea-intervencion.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/core/interceptor/token.interceptor';
import { BdjServicioComponent } from './components/mantenimiento/bdj-servicio/bdj-servicio.component';
import { RegServicioComponent } from './components/mantenimiento/bdj-servicio/reg-servicio/reg-servicio.component';
import { ModServicioComponent } from './components/mantenimiento/bdj-servicio/mod-servicio/mod-servicio.component';
import { BuscEntidadComponent } from './components/mantenimiento/bdj-servicio/busc-entidad/busc-entidad.component';
import { BuscLineaInterComponent } from './components/mantenimiento/bdj-servicio/busc-linea-inter/busc-linea-inter.component';
import { BdjCentroAtencionComponent } from './components/mantenimiento/bdj-centro-atencion/bdj-centro-atencion.component';
import { RegCentroAtencionComponent } from './components/mantenimiento/bdj-centro-atencion/reg-centro-atencion/reg-centro-atencion.component';
import { ModCentroAtencionComponent } from './components/mantenimiento/bdj-centro-atencion/mod-centro-atencion/mod-centro-atencion.component';
import { ServsCentroAtencionComponent } from './components/mantenimiento/bdj-centro-atencion/servs-centro-atencion/servs-centro-atencion.component';
import { BdjEstructuraComponent } from './components/mantenimiento/bdj-estructura/bdj-estructura.component';
import { RegEstructuraComponent } from './components/mantenimiento/bdj-estructura/reg-estructura/reg-estructura.component';
import { ModEstructuraComponent } from './components/mantenimiento/bdj-estructura/mod-estructura/mod-estructura.component';
import { BuscServicioComponent } from './components/mantenimiento/bdj-estructura/busc-servicio/busc-servicio.component';
import { BuscTablaBdComponent } from './components/mantenimiento/bdj-estructura/busc-tabla-bd/busc-tabla-bd.component';
import { BuscCampoTablaBdComponent } from './components/mantenimiento/bdj-estructura/busc-campo-tabla-bd/busc-campo-tabla-bd.component';
import { BuscEstructuraRplComponent } from './components/mantenimiento/bdj-estructura/busc-estructura-rpl/busc-estructura-rpl.component';
import { BuscTablaMaeComponent } from './components/mantenimiento/bdj-estructura/busc-tabla-mae/busc-tabla-mae.component';
import { RegCampoTablaBdComponent } from './components/mantenimiento/bdj-estructura/reg-campo-tabla-bd/reg-campo-tabla-bd.component';
import { BdjImportacionEdneComponent } from './components/proceso/bdj-importacion-edne/bdj-importacion-edne.component';
import { BdjUsuarioComponent } from './components/proceso/bdj-usuario/bdj-usuario.component';
import { RegImportacionEdneComponent } from './components/proceso/bdj-importacion-edne/reg-importacion-edne/reg-importacion-edne.component';
import { ModImportacionEdneComponent } from './components/proceso/bdj-importacion-edne/mod-importacion-edne/mod-importacion-edne.component';
import { BuscEstructuraComponent } from './components/proceso/bdj-importacion-edne/busc-estructura/busc-estructura.component';
import { VerErrorComponent } from './components/proceso/bdj-importacion-edne/ver-error/ver-error.component';
import { BdjPerfilComponent } from './components/acceso/bdj-perfil/bdj-perfil.component';
import { RegPerfilComponent } from './components/acceso/bdj-perfil/reg-perfil/reg-perfil.component';
import { ModPerfilComponent } from './components/acceso/bdj-perfil/mod-perfil/mod-perfil.component';
import { BdjCuentaSistemaComponent } from './components/acceso/bdj-cuenta-sistema/bdj-cuenta-sistema.component';
import { RegCuentaSistemaComponent } from './components/acceso/bdj-cuenta-sistema/reg-cuenta-sistema/reg-cuenta-sistema.component';
import { ModCuentaSistemaComponent } from './components/acceso/bdj-cuenta-sistema/mod-cuenta-sistema/mod-cuenta-sistema.component';
import { ModUsuarioComponent } from './components/proceso/bdj-usuario/mod-usuario/mod-usuario.component';
import { AsocUsuarioComponent } from './components/proceso/bdj-usuario/asoc-usuario/asoc-usuario.component';
import { CargMasivaEstructuraComponent } from './components/mantenimiento/bdj-estructura/carg-masiva-estructura/carg-masiva-estructura.component';
import { RegCampoTablaBdRapidoComponent } from './components/mantenimiento/bdj-estructura/reg-campo-tabla-bd-rapido/reg-campo-tabla-bd-rapido.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS_RENI } from 'src/app/common';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { CargMasivaCentroComponent } from './components/mantenimiento/bdj-centro-atencion/carg-masiva-centro/carg-masiva-centro.component';
import { CargMasivaMaestraComponent } from './components/mantenimiento/bdj-maestra/carg-masiva-maestra/carg-masiva-maestra.component';
import { BdjReporteIndividualComponent } from './components/reportes/bdj-reporte-individual/bdj-reporte-individual.component';
import { BdjReporteGeneralComponent } from './components/reportes/bdj-reporte-general/bdj-reporte-general.component';
import { BuscUsuarioComponent } from './components/reportes/bdj-reporte-individual/busc-usuario/busc-usuario.component';
import { BdjTipoCentroAtencionComponent } from './components/mantenimiento/bdj-tipo-centro-atencion/bdj-tipo-centro-atencion.component';
import { RegTipoCentroAtencionComponent } from './components/mantenimiento/bdj-tipo-centro-atencion/reg-tipo-centro-atencion/reg-tipo-centro-atencion.component';
import { ModTipoCentroAtencionComponent } from './components/mantenimiento/bdj-tipo-centro-atencion/mod-tipo-centro-atencion/mod-tipo-centro-atencion.component';
import { SubTipoCentroAtencionComponent } from './components/mantenimiento/bdj-tipo-centro-atencion/sub-tipo-centro-atencion/sub-tipo-centro-atencion.component';
registerLocaleData(localeEs, 'es');

@NgModule({
  entryComponents: [
    RegMaestraComponent,
    ModMaestraComponent,
    ConfirmComponent,
    BdjMaestraSubitemComponent,
    RegEntidadComponent,
    ModEntidadComponent,
    BuscAreaComponent,
    RegLineaIntervencionComponent,
    ModLineaIntervencionComponent,
    RegServicioComponent,
    ModServicioComponent,
    RegCentroAtencionComponent,
    ModCentroAtencionComponent,
    ServsCentroAtencionComponent,
    RegEstructuraComponent,
    ModEstructuraComponent,
    BuscServicioComponent,
    BuscTablaBdComponent,
    BuscCampoTablaBdComponent,
    BuscEstructuraRplComponent,
    BuscTablaMaeComponent,
    RegImportacionEdneComponent,
    ModImportacionEdneComponent,
    BuscEstructuraComponent,
    VerErrorComponent,
    RegCampoTablaBdComponent,
    RegPerfilComponent,
    ModPerfilComponent,
    RegCuentaSistemaComponent,
    ModCuentaSistemaComponent,
    ModUsuarioComponent,
    AsocUsuarioComponent,
    CargMasivaEstructuraComponent,
    RegCampoTablaBdRapidoComponent,
    CargMasivaCentroComponent,
    RegTipoCentroAtencionComponent,
    ModTipoCentroAtencionComponent,
    SubTipoCentroAtencionComponent,
  ],
  declarations: [
    RegMaestraComponent,
    ModMaestraComponent,
    ConfirmComponent,
    BdjMaestraSubitemComponent,
    RegEntidadComponent,
    ModEntidadComponent,
    BuscAreaComponent,
    RegLineaIntervencionComponent,
    ModLineaIntervencionComponent,
    RegServicioComponent,
    ModServicioComponent,
    RegCentroAtencionComponent,
    ModCentroAtencionComponent,
    ServsCentroAtencionComponent,
    RegEstructuraComponent,
    ModEstructuraComponent,
    BuscServicioComponent,
    BuscTablaBdComponent,
    BuscCampoTablaBdComponent,
    BuscEstructuraRplComponent,
    BuscTablaMaeComponent,
    RegImportacionEdneComponent,
    ModImportacionEdneComponent,
    BuscEstructuraComponent,
    VerErrorComponent,
    RegCampoTablaBdComponent,
    RegPerfilComponent,
    ModPerfilComponent,
    RegCuentaSistemaComponent,
    ModCuentaSistemaComponent,
    ModUsuarioComponent,
    AsocUsuarioComponent,
    CargMasivaEstructuraComponent,
    RegCampoTablaBdRapidoComponent,
    CargMasivaCentroComponent,
    RegTipoCentroAtencionComponent,
    ModTipoCentroAtencionComponent,
    SubTipoCentroAtencionComponent,

    HomeComponent,
    NavbarComponent,
    BdjMaestraComponent,
    BdjEntidadComponent,
    BdjLineaIntervencionComponent,
    BdjServicioComponent,
    BuscEntidadComponent,
    BuscLineaInterComponent,
    BdjCentroAtencionComponent,
    BdjEstructuraComponent,
    BdjImportacionEdneComponent,
    BdjUsuarioComponent,
    BdjPerfilComponent,
    BdjCuentaSistemaComponent,
    CargMasivaMaestraComponent,
    BdjReporteIndividualComponent,
    BdjReporteGeneralComponent,
    BuscUsuarioComponent,
    BdjTipoCentroAtencionComponent,
  ],
  imports: [
    CommonModule,
    IntranetRoutingModule,
    SharedModule,
    MaterialModule,
    IconModule,
  ],
  providers: [
    ...SharedIntranetService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DatePipe,
    DecimalPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-GB' },//DATEPICKER MUESTRA LA FECHA EN FORMATO DD/MM/YYYY
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_RENI },
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class IntranetModule { }
