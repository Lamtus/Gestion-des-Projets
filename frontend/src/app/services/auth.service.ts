import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { User, Role } from '../shared/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiConfig.getAuthUrl()}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  register(user: User): Observable<any> {
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
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserDetailsFromToken(): User | null {
    const token = this.getToken();
    if (token) {
      try {
        // Decode JWT token to get user details including roles
        // You would typically use a library like 'jwt-decode' for this
        // For demonstration, let's assume a simple structure or mock
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Basic decode (not for production with untrusted tokens)
        
        // IMPORTANT: Adjust this based on your actual JWT payload structure
        // Example assuming roles are in decodedToken.roles as an array of strings
        const user: User = {
          id: decodedToken.userId || 0, // Adjust field name
          email: decodedToken.sub || '', // Subject is usually email
          role: decodedToken.role as Role, // Assuming a single role directly in the token, cast to Role enum
          // Add other user properties as needed from the token
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
    // Optionally redirect to login page
  }
} 