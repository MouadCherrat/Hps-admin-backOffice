import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { AdminInfoComponent } from './components/admin-info/admin-info.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { HomeComponent } from './components/home/home.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent, 
    canActivate: [authGuard], 
    data: { roles: ['admin'] }, 
    children: [
      { path: '', component: AdminPageComponent },
      { path: 'admin-info', component: AdminInfoComponent }
    ]
  },
  { path: 'forbidden', component: ForbiddenComponent },  // Ensure this route is outside of any guarded paths
  { path: '**', redirectTo: '' }  // Redirect any unknown paths to the home page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
