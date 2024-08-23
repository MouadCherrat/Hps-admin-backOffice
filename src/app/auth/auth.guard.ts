import {ActivatedRoute, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import { KeycloakService } from '../services/keycloak/keycloak.service';
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(KeycloakService);
  const router = inject(Router);

  if (tokenService.keycloak.isTokenExpired() || !tokenService.keycloak.authenticated) {
    // Redirect to login page instead of logout to avoid loop
    tokenService.login(); 
    return false;
  }

  const roles = tokenService.keycloak?.tokenParsed?.["resource_access"]?.["hps-back-end"]?.roles;
  const expectedRoles = route.data['roles'] as string[];

  if (!roles || !expectedRoles.some(role => roles.includes(role))) {
    // Navigate to a forbidden page if roles do not match
    tokenService.logout();
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};



