import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id?: number;
  userId?: number;
  userName?: string;
  chargerId: number;
  chargerTitle?: string;
  startTime: string;
  endTime: string;
  totalAmount?: number;
  status?: string;
  razorpayOrderId?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, booking);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/my-bookings`);
  }

  getChargerBookings(chargerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/charger/${chargerId}`);
  }

  updateBookingStatus(id: number, status: string): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${id}/status`, null, {
      params: { status }
    });
  }
}

