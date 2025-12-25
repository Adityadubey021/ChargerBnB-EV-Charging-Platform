import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileUploadService, UploadProgress, UploadResponse } from '../../../core/services/file-upload.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {
  @Input() accept: string = 'image/*';
  @Input() maxSizeMB: number = 10;
  @Input() currentImageUrl?: string;
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;
  uploadProgress = 0;

  constructor(
    private fileUploadService: FileUploadService,
    private notificationService: NotificationService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file size
      if (file.size > this.maxSizeMB * 1024 * 1024) {
        this.notificationService.showError(`File size must be less than ${this.maxSizeMB}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.notificationService.showError('Please select an image file');
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    this.fileUploadService.uploadWithProgress(this.selectedFile, 'charger', true).subscribe({
      next: (result) => {
        if ('progress' in result) {
          this.uploadProgress = result.progress;
        } else {
          this.uploading = false;
          this.imageUploaded.emit(result.url);
          this.notificationService.showSuccess('Image uploaded successfully');
          this.selectedFile = null;
          this.previewUrl = null;
        }
      },
      error: (error) => {
        this.uploading = false;
        this.notificationService.showError('Failed to upload image');
      }
    });
  }

  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.currentImageUrl = undefined;
    this.imageRemoved.emit();
  }

  get displayImage(): string | null {
    return this.previewUrl || this.currentImageUrl || null;
  }
}

