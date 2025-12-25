import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ChargerService } from '../../../core/services/charger.service';

@Component({
  selector: 'app-add-charger',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './add-charger.component.html',
  styleUrl: './add-charger.component.css'
})
export class AddChargerComponent {
  chargerForm: FormGroup;
  loading = false;
  plugTypes = ['TYPE_2', 'CCS', 'CHAdeMO', 'AC_SLOW', 'AC_FAST', 'DC_FAST'];

  constructor(
    private fb: FormBuilder,
    private chargerService: ChargerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.chargerForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      powerRating: ['', [Validators.required, Validators.min(1)]],
      plugType: ['', Validators.required],
      pricePerHour: ['', [Validators.required, Validators.min(1)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      imageUrl: [''],
      availableSlots: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.chargerForm.valid) {
      this.loading = true;
      this.chargerService.createCharger(this.chargerForm.value).subscribe({
        next: () => {
          this.snackBar.open('Charger listed successfully! Waiting for approval.', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to create charger listing', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}

