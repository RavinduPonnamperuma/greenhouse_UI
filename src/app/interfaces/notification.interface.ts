export interface AppNotification {
  type: 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}
