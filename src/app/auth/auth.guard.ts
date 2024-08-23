import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from '../services/keycloak/keycloak.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const tokenService = inject(KeycloakService);
  const router = inject(Router);
  if (!tokenService.keycloak.authenticated || tokenService.keycloak.isTokenExpired()) {
    tokenService.login();
    return false;
  }
  const roles = tokenService.keycloak?.tokenParsed?.["resource_access"]?.["hps-back-end"]?.roles;
  const expectedRoles = route.data['roles'] as string[];

  if (!roles || !expectedRoles.some(role => roles.includes(role))) {
    router.navigate(['/forbidden']);
    setTimeout(() => {
      tokenService.logout();
    }, 3000);
    return false;
  }
  return true;
};