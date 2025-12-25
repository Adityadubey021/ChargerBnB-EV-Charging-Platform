import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UploadResponse {
  url: string;
  message: string;
}

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, type: string = 'general'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/image`, formData);
  }

  uploadDocument(file: File, type: string = 'general'): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/document`, formData);
  }

  uploadWithProgress(file: File, type: string, isImage: boolean = true): Observable<UploadProgress | UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const endpoint = isImage ? `${this.apiUrl}/upload/image` : `${this.apiUrl}/upload/document`;

    return this.http.post<UploadResponse>(endpoint, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event as HttpProgressEvent;
          return {
            progress: Math.round((progress.loaded / (progress.total || 1)) * 100),
            loaded: progress.loaded,
            total: progress.total || 0
          } as UploadProgress;
        } else if (event.type === HttpEventType.Response) {
          return event.body as UploadResponse;
        }
        return {} as UploadProgress;
      })
    );
  }
}

