import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AdminInfoComponent } from './components/admin-info/admin-info.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { HomeComponent } from './components/home/home.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

const routes: Routes = [

  // {
  //   path: '',
  //   loadChildren: () => import('./routes/APP_ROUTES').then((m) => m.APP_ROUTES), canActivate: [authGuard]
  // },
  {
    path: '', component: HomeComponent, canActivate: [authGuard], data: { roles: ['admin'] }, children: [
      {
        path: '', component: AdminPageComponent,
      },
      {
        path: 'admin-info', component: AdminInfoComponent,
      },
      { path: 'forbidden', component: ForbiddenComponent }



    ]

  },
  { path: 'forbidden', component: ForbiddenComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
