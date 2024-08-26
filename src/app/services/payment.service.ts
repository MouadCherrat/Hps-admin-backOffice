import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../interfaces/bill';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8091/api/v1/payments'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.apiUrl}/bills`);
  }
}
