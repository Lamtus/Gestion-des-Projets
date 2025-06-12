import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Commentaire } from '../shared/commentaire.model';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllCommentaires(): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(this.apiConfig.getCommentairesUrl());
  }

  getCommentaireById(id: number): Observable<Commentaire> {
    return this.http.get<Commentaire>(`${this.apiConfig.getCommentairesUrl()}/${id}`);
  }

  getCommentairesByTache(tacheId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiConfig.getCommentairesUrl()}/tache/${tacheId}`);
  }

  createCommentaire(commentaire: Commentaire): Observable<Commentaire> {
    return this.http.post<Commentaire>(this.apiConfig.getCommentairesUrl(), commentaire);
  }

  updateCommentaire(id: number, commentaire: Commentaire): Observable<Commentaire> {
    return this.http.put<Commentaire>(`${this.apiConfig.getCommentairesUrl()}/${id}`, commentaire);
  }

  deleteCommentaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getCommentairesUrl()}/${id}`);
  }
} 