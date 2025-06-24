import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { User, Role } from '../shared/user.model';
import { tap, map } from 'rxjs/operators';
import { RegisterRequest } from '../shared/register-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {
    // Try to load user from token on service initialization
    this.currentUser = this.getUserDetailsFromToken();
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    return this.http.post<{ token: string }>(`${this.apiConfig.getAuthUrl()}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.currentUser = this.getUserDetailsFromToken();
        }
      }),
      map(response => ({
        token: response.token,
        user: this.getUserDetailsFromToken()!
      }))
    );
  }

  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiConfig.getAuthUrl()}/register`, user);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiConfig.getAuthUrl()}/change-password`, {
      oldPassword,
      newPassword
    });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    if (!this.currentUser && this.isLoggedIn()) {
      this.currentUser = this.getUserDetailsFromToken();
    }
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === Role.ADMIN;
  }

  getRedirectUrl(): string {
    const user = this.getCurrentUser();
    if (user?.role === Role.ADMIN) {
      return '/equipe';
    }
    return '/dashboard';
  }

  getUserDetailsFromToken(): User | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        
        const user: User = {
          id: decodedToken.userId || 0,
          email: decodedToken.sub || '',
          role: decodedToken.role as Role,
          nom: decodedToken.nom || '',
          prenom: decodedToken.prenom || '',
          telephone: decodedToken.telephone || '',
          poste: decodedToken.poste || '',
          departement: decodedToken.departement || '',
          firstLogin: decodedToken.firstLogin || false,
        };
        return user;
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }

  logout(): void {
    this.removeToken();
  }
} 