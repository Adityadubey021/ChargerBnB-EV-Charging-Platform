import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardHeaderModule, MatCardTitleModule, MatCardSubtitleModule, MatCardContentModule, MatCardActionsModule } from '@angular/material/card';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ChargerService, Charger } from '../../../core/services/charger.service';
import { BookingService, Booking } from '../../../core/services/booking.service';
import { ReviewService, Review } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-charger-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatCardHeaderModule,
    MatCardTitleModule,
    MatCardSubtitleModule,
    MatCardContentModule,
    MatCardActionsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './charger-detail.component.html',
  styleUrl: './charger-detail.component.css'
})
export class ChargerDetailComponent implements OnInit {
  charger: Charger | null = null;
  reviews: Review[] = [];
  bookingForm: FormGroup;
  loading = false;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 15;
  startTime: string = '';
  endTime: string = '';

  constructor(
    private route: ActivatedRoute,
    private chargerService: ChargerService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCharger(+id);
      this.loadReviews(+id);
    }
  }

  loadCharger(id: number) {
    this.chargerService.getChargerById(id).subscribe({
      next: (charger) => {
        this.charger = charger;
        if (charger.latitude && charger.longitude) {
          this.center = { lat: charger.latitude, lng: charger.longitude };
        }
      }
    });
  }

  loadReviews(chargerId: number) {
    this.reviewService.getChargerReviews(chargerId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      }
    });
  }

  bookCharger() {
    if (this.bookingForm.valid && this.charger) {
      this.loading = true;
      const startTime = new Date(this.bookingForm.value.startTime);
      const endTime = new Date(this.bookingForm.value.endTime);
      const booking: Booking = {
        chargerId: this.charger.id!,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      this.bookingService.createBooking(booking).subscribe({
        next: () => {
          this.snackBar.open('Booking created successfully!', 'Close', { duration: 3000 });
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Booking failed', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}

