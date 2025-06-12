import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Historique } from '../shared/historique.model';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllHistoriques(): Observable<Historique[]> {
    return this.http.get<Historique[]>(this.apiConfig.getHistoriquesUrl());
  }

  getHistoriqueById(id: number): Observable<Historique> {
    return this.http.get<Historique>(`${this.apiConfig.getHistoriquesUrl()}/${id}`);
  }

  getHistoriquesByProjet(projetId: number): Observable<Historique[]> {
    return this.http.get<Historique[]>(`${this.apiConfig.getHistoriquesUrl()}/projet/${projetId}`);
  }

  getHistoriquesByTache(tacheId: number): Observable<Historique[]> {
    return this.http.get<Historique[]>(`${this.apiConfig.getHistoriquesUrl()}/tache/${tacheId}`);
  }

  createHistorique(historique: Historique): Observable<Historique> {
    return this.http.post<Historique>(this.apiConfig.getHistoriquesUrl(), historique);
  }

  updateHistorique(id: number, historique: Historique): Observable<Historique> {
    return this.http.put<Historique>(`${this.apiConfig.getHistoriquesUrl()}/${id}`, historique);
  }

  deleteHistorique(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getHistoriquesUrl()}/${id}`);
  }
} 