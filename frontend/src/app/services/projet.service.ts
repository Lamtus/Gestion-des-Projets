import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Projet } from '../shared/projet.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService,
    private authService: AuthService
  ) { }

  getAllProjets(): Observable<Projet[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Projet[]>(this.apiConfig.getProjetsUrl(), { headers });
  }

  getProjetById(id: number): Observable<Projet> {
    const headers = this.getAuthHeaders();
    return this.http.get<Projet>(`${this.apiConfig.getProjetsUrl()}/${id}`, { headers });
  }

  getProjetsByDirecteur(): Observable<Projet[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Projet[]>(`${this.apiConfig.getProjetsUrl()}/directeur`, { headers });
  }

  createProjet(projet: Projet): Observable<Projet> {
    const headers = this.getAuthHeaders();
    return this.http.post<Projet>(`${this.apiConfig.getProjetsUrl()}/add`, projet, { headers });
  }

  updateProjet(id: number, projet: Projet): Observable<Projet> {
    const headers = this.getAuthHeaders();
    return this.http.put<Projet>(`${this.apiConfig.getProjetsUrl()}/${id}`, projet, { headers });
  }

  deleteProjet(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiConfig.getProjetsUrl()}/${id}`, { headers });
  }

  changeChefProjet(id: number, chefId: number): Observable<Projet> {
    const headers = this.getAuthHeaders();
    return this.http.put<Projet>(`${this.apiConfig.getProjetsUrl()}/${id}/chef`, { chefId }, { headers });
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