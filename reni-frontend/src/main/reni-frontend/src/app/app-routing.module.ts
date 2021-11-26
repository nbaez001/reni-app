import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const rootRoutes: Routes = [
  {
    path: '',
    redirectTo: 'sesion',
    pathMatch: 'full'
  },
  {
    path: 'sesion',
    loadChildren: () => import('./modules/sesion/sesion.module').then(m => m.SesionModule),
  },
  {
    path: 'intranet',
    loadChildren: () => import('./modules/intranet/intranet.module').then(m => m.IntranetModule),
  },
  {
    path: '**',
    redirectTo: 'sesion/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(rootRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
