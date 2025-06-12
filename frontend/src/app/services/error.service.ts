import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Error } from '../shared/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllErrors(): Observable<Error[]> {
    return this.http.get<Error[]>(this.apiConfig.getErreursUrl());
  }

  getErrorById(id: number): Observable<Error> {
    return this.http.get<Error>(`${this.apiConfig.getErreursUrl()}/${id}`);
  }

  getErrorsByProjet(projetId: number): Observable<Error[]> {
    return this.http.get<Error[]>(`${this.apiConfig.getErreursUrl()}/projet/${projetId}`);
  }

  createError(error: Error): Observable<Error> {
    return this.http.post<Error>(this.apiConfig.getErreursUrl(), error);
  }

  updateError(id: number, error: Error): Observable<Error> {
    return this.http.put<Error>(`${this.apiConfig.getErreursUrl()}/${id}`, error);
  }

  deleteError(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getErreursUrl()}/${id}`);
  }

  updateStatus(id: number, status: string): Observable<Error> {
    return this.http.put<Error>(`${this.apiConfig.getErreursUrl()}/${id}/status`, { status });
  }

  assignError(id: number, userId: number): Observable<Error> {
    return this.http.put<Error>(`${this.apiConfig.getErreursUrl()}/${id}/assign`, { userId });
  }
} 