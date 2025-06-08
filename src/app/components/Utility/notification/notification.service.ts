import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<ToastNotification[]>([]);
  public notifications$: Observable<ToastNotification[]> = this.notificationsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addNotification(notification: ToastNotification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    if (notification.duration !== 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration || 5000);
    }
  }

  showSuccess(message: string, duration?: number): void {
    const notification: ToastNotification = {
      id: this.generateId(),
      type: 'success',
      message,
      duration
    };
    this.addNotification(notification);
  }

  showError(message: string, duration?: number): void {
    const notification: ToastNotification = {
      id: this.generateId(),
      type: 'error',
      message,
      duration
    };
    this.addNotification(notification);
  }

  showWarning(message: string, duration?: number): void {
    const notification: ToastNotification = {
      id: this.generateId(),
      type: 'warning',
      message,
      duration
    };
    this.addNotification(notification);
  }

  set(options: { type: 'success' | 'error' | 'warning', message: string, duration?: number }): void {
    const notification: ToastNotification = {
      id: this.generateId(),
      type: options.type,
      message: options.message,
      duration: options.duration
    };
    this.addNotification(notification);
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }
}
