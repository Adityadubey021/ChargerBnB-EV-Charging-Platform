import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Charger {
  id?: number;
  hostId?: number;
  hostName?: string;
  title: string;
  description?: string;
  powerRating: number;
  plugType: string;
  pricePerHour: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  isAvailable?: boolean;
  isApproved?: boolean;
  availableSlots?: number;
  averageRating?: number;
  totalReviews?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChargerService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllChargers(): Observable<Charger[]> {
    return this.http.get<Charger[]>(`${this.apiUrl}/chargers/public`);
  }

  getNearbyChargers(latitude: number, longitude: number, radiusKm: number = 10): Observable<Charger[]> {
    return this.http.get<Charger[]>(`${this.apiUrl}/chargers/public/nearby`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radiusKm: radiusKm.toString()
      }
    });
  }

  getChargerById(id: number): Observable<Charger> {
    return this.http.get<Charger>(`${this.apiUrl}/chargers/public/${id}`);
  }

  createCharger(charger: Charger): Observable<Charger> {
    return this.http.post<Charger>(`${this.apiUrl}/chargers`, charger);
  }

  getMyChargers(): Observable<Charger[]> {
    return this.http.get<Charger[]>(`${this.apiUrl}/chargers/my-chargers`);
  }

  updateCharger(id: number, charger: Charger): Observable<Charger> {
    return this.http.put<Charger>(`${this.apiUrl}/chargers/${id}`, charger);
  }
}

