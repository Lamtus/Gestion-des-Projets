import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Tache } from '../shared/tache.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService,
    private authService: AuthService
  ) { }

  getAllTaches(): Observable<Tache[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tache[]>(this.apiConfig.getTachesUrl(), { headers });
  }

  getTacheById(id: number): Observable<Tache> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tache>(`${this.apiConfig.getTachesUrl()}/${id}`, { headers });
  }

  getTachesByProjet(projetId: number): Observable<Tache[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tache[]>(`${this.apiConfig.getProjetsUrl()}/${projetId}/taches`, { headers });
  }

  createTache(tache: Tache): Observable<Tache> {
    const headers = this.getAuthHeaders();
    return this.http.post<Tache>(this.apiConfig.getTachesUrl(), tache, { headers });
  }

  updateTache(id: number, tache: Tache): Observable<Tache> {
    const headers = this.getAuthHeaders();
    return this.http.put<Tache>(`${this.apiConfig.getTachesUrl()}/${id}`, tache, { headers });
  }

  deleteTache(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiConfig.getTachesUrl()}/${id}`, { headers });
  }

  assignTache(id: number, userId: number): Observable<Tache> {
    const headers = this.getAuthHeaders();
    return this.http.put<Tache>(`${this.apiConfig.getTachesUrl()}/${id}/assign`, { userId }, { headers });
  }

  updateStatus(id: number, status: string): Observable<Tache> {
    const headers = this.getAuthHeaders();
    return this.http.put<Tache>(`${this.apiConfig.getTachesUrl()}/${id}/status`, { status }, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
} 