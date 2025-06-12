import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly baseUrl = 'http://localhost:8082/api';

  constructor() { }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getAuthUrl(): string {
    return `${this.baseUrl}/auth`;
  }

  getUsersUrl(): string {
    return `${this.baseUrl}/users`;
  }

  getProjetsUrl(): string {
    return `${this.baseUrl}/projets`;
  }

  getTachesUrl(): string {
    return `${this.baseUrl}/taches`;
  }

  getAffectationsUrl(): string {
    return `${this.baseUrl}/affectations`;
  }

  getCommentairesUrl(): string {
    return `${this.baseUrl}/commentaires`;
  }

  getNotificationsUrl(): string {
    return `${this.baseUrl}/notifications`;
  }

  getErreursUrl(): string {
    return `${this.baseUrl}/erreurs`;
  }

  getHistoriquesUrl(): string {
    return `${this.baseUrl}/historiques`;
  }

  getLogsUrl(): string {
    return `${this.baseUrl}/logs`;
  }
} 