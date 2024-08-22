import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import { KeycloakService } from '../services/keycloak/keycloak.service';
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(KeycloakService);
  const router = inject(Router);
  if (tokenService.keycloak.isTokenExpired()) {
    tokenService.logout();
    return false;
  }
  if (!tokenService.keycloak.authenticated) {
    tokenService.logout();
    return false;
  }
  return true;
};


