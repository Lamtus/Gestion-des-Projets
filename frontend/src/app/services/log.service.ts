import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Log } from '../shared/log.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiConfig.getLogsUrl());
  }

  getLogById(id: number): Observable<Log> {
    return this.http.get<Log>(`${this.apiConfig.getLogsUrl()}/${id}`);
  }

  getLogsByProjet(projetId: number): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiConfig.getLogsUrl()}/projet/${projetId}`);
  }

  getLogsByTache(tacheId: number): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.apiConfig.getLogsUrl()}/tache/${tacheId}`);
  }

  createLog(log: Log): Observable<Log> {
    return this.http.post<Log>(this.apiConfig.getLogsUrl(), log);
  }

  updateLog(id: number, log: Log): Observable<Log> {
    return this.http.put<Log>(`${this.apiConfig.getLogsUrl()}/${id}`, log);
  }

  deleteLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getLogsUrl()}/${id}`);
  }
} 