import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8091/api/v1/users'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
}
