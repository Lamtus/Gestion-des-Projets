import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Tache } from '../shared/tache.model';
import { AuthService } from './auth.service';
import { CreateTacheRequest } from '../shared/create-tache-request.model';

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
    return this.http.get<Tache[]>(`${this.apiConfig.getBaseUrl()}/projets/${projetId}/taches`, { headers });
  }

  createTache(projetId: number, tache: CreateTacheRequest): Observable<Tache> {
    const headers = this.getAuthHeaders();
    return this.http.post<Tache>(`${this.apiConfig.getBaseUrl()}/projets/${projetId}/taches`, tache, { headers });
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

  updateStatus(projectId: number, taskId: number, status: string): Observable<Tache> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Tache>(`${this.apiConfig.getBaseUrl()}/projets/${projectId}/taches/${taskId}/statut`, { statut: status }, { headers });
  }

  getTachesByAssignee(userId: number): Observable<Tache[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Tache[]>(`${this.apiConfig.getTachesUrl()}/assignee/${userId}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
} 