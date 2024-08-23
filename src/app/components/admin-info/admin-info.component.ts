import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-admin-info',
  templateUrl: './admin-info.component.html',
  styleUrls: ['./admin-info.component.scss']
})
export class AdminInfoComponent implements OnInit {
  adminInfo: any;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    this.adminInfo = this.keycloakService.profile;
  }
}
