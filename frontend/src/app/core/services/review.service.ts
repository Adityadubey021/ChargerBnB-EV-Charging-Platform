import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id?: number;
  userId?: number;
  userName?: string;
  chargerId: number;
  bookingId?: number;
  rating: number;
  comment?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, review);
  }

  getChargerReviews(chargerId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/charger/${chargerId}`);
  }
}

