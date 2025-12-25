import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  selectedRole = 'USER';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      firstName: ['', Validators.required],
      lastName: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      role: ['USER', Validators.required],
      // Host-specific fields
      aadhaarNumber: [''],
      panNumber: [''],
      address: [''],
      city: [''],
      state: [''],
      pincode: ['']
    });

    this.signupForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole = role;
      this.updateValidators();
    });
  }

  updateValidators() {
    const hostFields = ['aadhaarNumber', 'panNumber', 'address', 'city', 'state', 'pincode'];
    hostFields.forEach(field => {
      const control = this.signupForm.get(field);
      if (this.selectedRole === 'HOST') {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true;
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Signup failed', 'Close', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }
}

