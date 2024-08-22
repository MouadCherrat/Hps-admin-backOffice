import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import { KeycloakService } from '../services/keycloak/keycloak.service';
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(KeycloakService);
  const router = inject(Router);
  const activatedRoute = inject(ActivatedRoute);
  if (tokenService.keycloak.isTokenExpired()) {
    tokenService.logout();
    return false;
  }
  if (!tokenService.keycloak.authenticated) {
    tokenService.logout();
    return false;
  }
  const roles = tokenService.keycloak?.tokenParsed?.["resource_access"]?.["hps-back-end"]?.roles;
  const expectedRoles= route.data['roles'];
  if (!roles?.includes(expectedRoles[0])){
    tokenService.logout();
    router.navigate(['/forbidden'],{relativeTo:activatedRoute}); 
    
       
     return false;
    
  }
  return true;

};


