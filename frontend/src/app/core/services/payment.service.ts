import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  bookingId: number;
  amount: number;
  paymentMethod: string;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createPaymentOrder(request: PaymentRequest): Observable<PaymentOrder> {
    return this.http.post<PaymentOrder>(`${this.apiUrl}/payments/create-order`, request);
  }

  verifyPayment(razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/payments/verify`, null, {
      params: {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      }
    });
  }
}

