import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BdjCuentaSistemaComponent } from './components/acceso/bdj-cuenta-sistema/bdj-cuenta-sistema.component';
import { BdjPerfilComponent } from './components/acceso/bdj-perfil/bdj-perfil.component';
import { HomeComponent } from './components/home/home.component';
import { BdjCentroAtencionComponent } from './components/mantenimiento/bdj-centro-atencion/bdj-centro-atencion.component';
import { BdjEntidadComponent } from './components/mantenimiento/bdj-entidad/bdj-entidad.component';
import { BdjEstructuraComponent } from './components/mantenimiento/bdj-estructura/bdj-estructura.component';
import { BdjLineaIntervencionComponent } from './components/mantenimiento/bdj-linea-intervencion/bdj-linea-intervencion.component';
import { BdjMaestraComponent } from './components/mantenimiento/bdj-maestra/bdj-maestra.component';
import { BdjServicioComponent } from './components/mantenimiento/bdj-servicio/bdj-servicio.component';
import { BdjTipoCentroAtencionComponent } from './components/mantenimiento/bdj-tipo-centro-atencion/bdj-tipo-centro-atencion.component';
import { BdjImportacionEdneComponent } from './components/proceso/bdj-importacion-edne/bdj-importacion-edne.component';
import { BdjUsuarioComponent } from './components/proceso/bdj-usuario/bdj-usuario.component';
import { BdjReporteGeneralComponent } from './components/reportes/bdj-reporte-general/bdj-reporte-general.component';
import { BdjReporteIndividualComponent } from './components/reportes/bdj-reporte-individual/bdj-reporte-individual.component';


const intranetRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }, {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home' }
      }, {
        path: 'mantenimiento/maestras',
        component: BdjMaestraComponent,
        data: { title: 'Maestras' }
      }, {
        path: 'mantenimiento/entidades',
        component: BdjEntidadComponent,
        data: { title: 'Entidades' }
      }, {
        path: 'mantenimiento/lineas-intervencion',
        component: BdjLineaIntervencionComponent,
        data: { title: 'Lineas intervencion' }
      }, {
        path: 'mantenimiento/servicios',
        component: BdjServicioComponent,
        data: { title: 'Servicios' }
      }, {
        path: 'mantenimiento/tipo-centro-atencion',
        component: BdjTipoCentroAtencionComponent,
        data: { title: 'Tipos centro de atencion' }
      }, {
        path: 'mantenimiento/centros-atencion',
        component: BdjCentroAtencionComponent,
        data: { title: 'Centros de atencion' }
      }, {
        path: 'mantenimiento/estructuras',
        component: BdjEstructuraComponent,
        data: { title: 'Estructuras' }
      }, {
        path: 'procesos/importacion-rene',
        component: BdjImportacionEdneComponent,
        data: { title: 'Importacion RENE' }
      }, {
        path: 'procesos/usuarios',
        component: BdjUsuarioComponent,
        data: { title: 'Usuarios' }
      }, {
        path: 'accesos/perfiles',
        component: BdjPerfilComponent,
        data: { title: 'Perfiles' }
      }, {
        path: 'accesos/cuentas-sistema',
        component: BdjCuentaSistemaComponent,
        data: { title: 'Cuentas de sistema' }
      }, {
        path: 'reportes/reporte-general',
        component: BdjReporteGeneralComponent,
        data: { title: 'Reporte general' }
      }, {
        path: 'reportes/reporte-individual',
        component: BdjReporteIndividualComponent,
        data: { title: 'Reporte Individual' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(intranetRoutes)],
  exports: [RouterModule]
})
export class IntranetRoutingModule { }
