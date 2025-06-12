import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../config/api.config';
import { Notification } from '../shared/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) { }

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiConfig.getNotificationsUrl());
  }

  getNotificationById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiConfig.getNotificationsUrl()}/${id}`);
  }

  getNotificationsByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiConfig.getNotificationsUrl()}/user/${userId}`);
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.apiConfig.getNotificationsUrl(), notification);
  }

  updateNotification(id: number, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiConfig.getNotificationsUrl()}/${id}`, notification);
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getNotificationsUrl()}/${id}`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiConfig.getNotificationsUrl()}/${id}/read`, {});
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiConfig.getNotificationsUrl()}/user/${userId}/read-all`, {});
  }
} 