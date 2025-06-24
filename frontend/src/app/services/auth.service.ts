import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { User, Role } from '../shared/user.model';
import { tap, map, catchError } from 'rxjs/operators';
import { RegisterRequest } from '../shared/register-request.model';
import { AuthResponse } from '../web/dto/auth-response';

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

  changePassword(email: string, newPassword: string): Observable<AuthResponse> {
    if (!email || !newPassword) {
      return throwError(() => new Error('Email et mot de passe sont requis'));
    }

    // Valider le format du mot de passe
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      return throwError(() => new Error('Le format du mot de passe est invalide'));
    }

    return this.http.post<AuthResponse>(`${this.apiConfig.getAuthUrl()}/change-password`, {
      email,
      newPassword
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors du changement de mot de passe:', error);
        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          return throwError(() => new Error('Erreur de connexion. Veuillez vérifier votre connexion internet.'));
        } else {
          // Erreur côté serveur
          const message = error.error?.message || 'Une erreur est survenue lors du changement de mot de passe.';
          return throwError(() => new Error(message));
        }
      })
    );
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