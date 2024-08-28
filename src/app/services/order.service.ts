import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderLineItemResponse } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8091/api/v1/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderLineItems(orderId: number): Observable<OrderLineItemResponse[]> {
    return this.http.get<OrderLineItemResponse[]>(`${this.apiUrl}/${orderId}/line-items`);
  }
}
