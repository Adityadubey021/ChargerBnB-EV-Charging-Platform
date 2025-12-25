import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../core/services/auth.service';
import { BookingService, Booking } from '../../core/services/booking.service';
import { ChargerService, Charger } from '../../core/services/charger.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: any;
  bookings: Booking[] = [];
  chargers: Charger[] = [];

  constructor(
    public authService: AuthService,
    private bookingService: BookingService,
    private chargerService: ChargerService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadBookings();
      if (this.authService.isHost()) {
        this.loadChargers();
      }
    }
  }

  loadBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      }
    });
  }

  loadChargers() {
    this.chargerService.getMyChargers().subscribe({
      next: (chargers) => {
        this.chargers = chargers;
      }
    });
  }
}

