import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features = [
    {
      icon: 'ev_station',
      title: 'Find Chargers',
      description: 'Discover EV charging stations near you'
    },
    {
      icon: 'schedule',
      title: 'Book Instantly',
      description: 'Reserve your charging slot in advance'
    },
    {
      icon: 'payments',
      title: 'Easy Payments',
      description: 'Pay securely via UPI, cards, or wallets'
    },
    {
      icon: 'star',
      title: 'Rate & Review',
      description: 'Share your experience and help others'
    }
  ];
}

