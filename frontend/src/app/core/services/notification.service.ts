import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultDuration = 3000;

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = this.defaultDuration) {
    this.show(message, NotificationType.SUCCESS, duration);
  }

  showError(message: string, duration: number = this.defaultDuration) {
    this.show(message, NotificationType.ERROR, duration);
  }

  showWarning(message: string, duration: number = this.defaultDuration) {
    this.show(message, NotificationType.WARNING, duration);
  }

  showInfo(message: string, duration: number = this.defaultDuration) {
    this.show(message, NotificationType.INFO, duration);
  }

  private show(message: string, type: NotificationType, duration: number) {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`notification-${type}`]
    };

    this.snackBar.open(message, 'Close', config);
  }
}

