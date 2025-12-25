import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChargerService, Charger } from '../../../core/services/charger.service';
import { GeolocationService } from '../../../core/services/geolocation.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-charger-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './charger-list.component.html',
  styleUrl: './charger-list.component.css'
})
export class ChargerListComponent implements OnInit {
  chargers: Charger[] = [];
  loading = false;
  userLocation: { latitude: number; longitude: number } | null = null;
  searchQuery = '';

  constructor(
    private chargerService: ChargerService,
    private geolocationService: GeolocationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getUserLocation();
    this.loadChargers();
  }

  getUserLocation() {
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.userLocation = {
          latitude: position.latitude,
          longitude: position.longitude
        };
        this.loadNearbyChargers();
      },
      error: () => {
        this.notificationService.showInfo('Unable to get your location. Showing all chargers.');
        this.loadChargers();
      }
    });
  }

  loadChargers() {
    this.loading = true;
    this.chargerService.getAllChargers().subscribe({
      next: (chargers) => {
        this.chargers = chargers;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Failed to load chargers');
      }
    });
  }

  loadNearbyChargers() {
    if (this.userLocation) {
      this.loading = true;
      this.chargerService.getNearbyChargers(
        this.userLocation.latitude,
        this.userLocation.longitude,
        10
      ).subscribe({
        next: (chargers) => {
          this.chargers = chargers;
          this.loading = false;
        },
        error: () => {
          this.loadChargers(); // Fallback to all chargers
        }
      });
    }
  }

  onSearch() {
    // Implement search logic
    if (this.searchQuery.trim()) {
      this.chargers = this.chargers.filter(c => 
        c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadChargers();
    }
  }
}
