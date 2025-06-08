import {Component, EventEmitter, OnDestroy, Input, Output, OnInit} from '@angular/core';

import {AsyncPipe, NgClass, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {NotificationService} from "./notification.service";
import {BehaviorSubject, Observable, Subscription} from "rxjs";

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe
  ],

  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  notifications$: Observable<ToastNotification[]>;

  constructor(public notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  ngOnInit() {
    console.log('Notification component initialized'); // Debug log
  }

  trackByFn(index: number, notification: ToastNotification): string {
    return notification.id;
  }
}
