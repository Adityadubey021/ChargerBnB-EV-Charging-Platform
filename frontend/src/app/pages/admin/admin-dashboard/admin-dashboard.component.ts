import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  hosts: any[] = [];
  pendingChargers: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>('http://localhost:8080/api/admin/users').subscribe({
      next: (users) => this.users = users
    });
    
    this.http.get<any[]>('http://localhost:8080/api/admin/hosts').subscribe({
      next: (hosts) => this.hosts = hosts
    });
    
    this.http.get<any[]>('http://localhost:8080/api/admin/chargers/pending').subscribe({
      next: (chargers) => this.pendingChargers = chargers
    });
  }

  approveCharger(id: number) {
    this.http.put(`http://localhost:8080/api/admin/chargers/${id}/approve`, {}).subscribe({
      next: () => {
        this.loadData();
      }
    });
  }

  verifyHost(id: number) {
    this.http.put(`http://localhost:8080/api/admin/hosts/${id}/verify`, {}).subscribe({
      next: () => {
        this.loadData();
      }
    });
  }
}

