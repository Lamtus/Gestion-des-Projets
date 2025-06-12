import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { User } from '../shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiConfig.getUsersUrl()}/with-project-count`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiConfig.getUsersUrl()}/${id}`);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiConfig.getUsersUrl()}/current`);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiConfig.getUsersUrl()}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getUsersUrl()}/${id}`);
  }
} 